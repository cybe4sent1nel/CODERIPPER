// exec-engine: Production-ready execution API (supports Docker for local dev and Kubernetes Jobs in-cluster).
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"os/exec"

	"github.com/golang-jwt/jwt/v5"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// RunRequest is the payload for a run request
type RunRequest struct {
	Language    string            `json:"language"`
	Files       map[string]string `json:"files"` // filename -> contents
	Stdin       string            `json:"stdin,omitempty"`
	TimeLimit   int               `json:"timeLimitSeconds,omitempty"`
	MemoryLimit int64             `json:"memoryLimitBytes,omitempty"`
}

// Simple in-memory rate limiter (per-IP) for demo purposes. Production should use Redis or API gateway rate limiting.
type clientInfo struct {
	count     int
	windowEnd time.Time
}

type RateLimiter struct {
	mu    sync.Mutex
	items map[string]*clientInfo
	max   int
}

func newRateLimiter(maxPerMinute int) *RateLimiter {
	return &RateLimiter{items: map[string]*clientInfo{}, max: maxPerMinute}
}

func (rl *RateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	ci, ok := rl.items[ip]
	now := time.Now()
	if !ok || now.After(ci.windowEnd) {
		rl.items[ip] = &clientInfo{count: 1, windowEnd: now.Add(time.Minute)}
		return true
	}
	if ci.count >= rl.max {
		return false
	}
	ci.count++
	return true
}

var (
	runsCounter  = prometheus.NewCounterVec(prometheus.CounterOpts{Namespace: "coderipper", Name: "runs_total", Help: "Number of run requests"}, []string{"mode", "status"})
	runsDuration = prometheus.NewHistogramVec(prometheus.HistogramOpts{Namespace: "coderipper", Name: "run_duration_seconds", Help: "Run duration seconds"}, []string{"mode"})
)

// authMiddleware enforces JWT authentication and injects user_id into request context
func authMiddleware(secret string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := r.Header.Get("Authorization")
		if h == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		var tokenString string
		fmt.Sscanf(h, "Bearer %s", &tokenString)
		if tokenString == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		claims := &jwt.RegisteredClaims{}
		tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) { return []byte(secret), nil })
		if err != nil || !tkn.Valid {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), "user_id", claims.Subject)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func init() {
	prometheus.MustRegister(runsCounter, runsDuration)
}

func runHandler(rl *RateLimiter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ip, _, _ := net.SplitHostPort(r.RemoteAddr)
		if ip == "" {
			ip = r.RemoteAddr
		}
		if !rl.allow(ip) {
			http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
			runsCounter.WithLabelValues(os.Getenv("RUNNER_MODE"), "rate_limited").Inc()
			return
		}

		var req RunRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			runsCounter.WithLabelValues(os.Getenv("RUNNER_MODE"), "bad_request").Inc()
			return
		}

		// defaults and safety caps
		if req.TimeLimit <= 0 {
			req.TimeLimit = 5
		}
		if req.TimeLimit > 60 {
			req.TimeLimit = 60
		}
		if req.MemoryLimit <= 0 {
			req.MemoryLimit = 128 * 1024 * 1024
		}

		mode := os.Getenv("RUNNER_MODE")
		// Default to native mode if not specified (best for local dev without Docker)
		if mode == "" {
			mode = "native"
		}
		start := time.Now()
		if mode == "k8s" {
			// Kubernetes path
			namespace := os.Getenv("K8S_NAMESPACE")
			if namespace == "" {
				namespace = "default"
			}
			image := "coderipper/runner-python:latest"
			if req.Language == "go" {
				image = "coderipper/runner-go:latest"
			}
			res, err := submitK8sJob(req, image, time.Duration(req.TimeLimit)*time.Second, namespace)
			if err != nil {
				http.Error(w, "job submit failed: "+err.Error(), http.StatusInternalServerError)
				runsCounter.WithLabelValues("k8s", "error").Inc()
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(res)
			runsCounter.WithLabelValues("k8s", mapStatus(res.Success)).Inc()
			runsDuration.WithLabelValues("k8s").Observe(time.Since(start).Seconds())
			userID, _ := r.Context().Value("user_id").(string)
			if userID != "" && res.Success {
				go triggerBadge(userID, "run_success")
			}
			return
		}

		// Native mode: execute code directly without Docker (for local dev)
		if mode == "native" {
			result := executeNative(req)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(result)
			runsCounter.WithLabelValues("native", mapStatus(result.Success)).Inc()
			runsDuration.WithLabelValues("native").Observe(time.Since(start).Seconds())
			return
		}

		// Docker mode: use Docker containers
		image := "coderipper/runner-python:latest"
		if req.Language == "go" {
			image = "coderipper/runner-go:latest"
		}

		// write files - use os.TempDir() for cross-platform compatibility
		tmpDir, err := os.MkdirTemp("", "submission-*")
		if err != nil {
			http.Error(w, "internal error", http.StatusInternalServerError)
			log.Println("temp dir error:", err)
			runsCounter.WithLabelValues("docker", "error").Inc()
			return
		}
		defer os.RemoveAll(tmpDir)

		for name, content := range req.Files {
			p := filepath.Join(tmpDir, name)
			if err := os.MkdirAll(filepath.Dir(p), 0755); err != nil {
				log.Println("mkdir error:", err)
			}
			if err := os.WriteFile(p, []byte(content), 0644); err != nil {
				log.Println("write file error:", err)
			}
		}

		// build docker run command
		mem := fmt.Sprintf("%dm", req.MemoryLimit/(1024*1024))
		ctx2, cancel := context.WithTimeout(context.Background(), time.Duration(req.TimeLimit)*time.Second)
		defer cancel()
		cmd := exec.CommandContext(ctx2, "docker", "run", "--rm", "--network", "none", "-v", tmpDir+":/submission:ro", "--memory", mem, "--cpus", "1", image, "./run.sh")
		out, err := cmd.CombinedOutput()
		if ctx2.Err() == context.DeadlineExceeded {
			w.Write([]byte("\n--- run timeout ---\n"))
			runsCounter.WithLabelValues("docker", "timeout").Inc()
			return
		}
		if err != nil {
			// capture exit code if possible
			if exitErr, ok := err.(*exec.ExitError); ok {
				log.Println("container exited with code:", exitErr.ExitCode())
			} else {
				log.Println("docker run error:", err)
			}
		}

		w.Header().Set("Content-Type", "text/plain")
		w.Write(out)

		// determine exit code from exec result
		exitCode := 0
		if err != nil {
			if exitErr, ok := err.(*exec.ExitError); ok {
				exitCode = exitErr.ExitCode()
			} else {
				exitCode = 1
			}
		}

		success := exitCode == 0
		runsCounter.WithLabelValues("docker", mapStatus(success)).Inc()
		runsDuration.WithLabelValues("docker").Observe(time.Since(start).Seconds())
		// badge trigger (best-effort)
		userID, _ := r.Context().Value("user_id").(string)
		if userID != "" && success {
			go triggerBadge(userID, "run_success")
		}
	}
}

// triggerBadge notifies the badge service about an event (best-effort, non-blocking).
func triggerBadge(userID, event string) {
	badgeURL := os.Getenv("BADGE_SERVICE_URL")
	if badgeURL == "" {
		badgeURL = "http://localhost:8001/api/badges/trigger"
	}
	payload := map[string]interface{}{"user_id": userID, "event": event}
	b, _ := json.Marshal(payload)
	client := &http.Client{Timeout: 3 * time.Second}
	req, _ := http.NewRequest("POST", badgeURL, bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	if token := os.Getenv("BADGE_SERVICE_TOKEN"); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("badge trigger failed:", err)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		log.Println("badge trigger non-200:", resp.StatusCode)
	}
}

func mapStatus(ok bool) string {
	if ok {
		return "ok"
	}
	return "fail"
}

// NativeResult is the response from native execution
type NativeResult struct {
	Stdout   string `json:"stdout"`
	Stderr   string `json:"stderr"`
	ExitCode int    `json:"exitCode"`
	Success  bool   `json:"success"`
	Language string `json:"language"`
}

// executeNative runs code directly on the host machine (for local development)
func executeNative(req RunRequest) NativeResult {
	// Create temp directory for files
	tmpDir, err := os.MkdirTemp("", "coderipper-native-*")
	if err != nil {
		return NativeResult{Stderr: "Failed to create temp directory: " + err.Error(), ExitCode: 1, Success: false}
	}
	defer os.RemoveAll(tmpDir)

	// Write files to temp directory
	var mainFile string
	for name, content := range req.Files {
		p := filepath.Join(tmpDir, name)
		if err := os.MkdirAll(filepath.Dir(p), 0755); err != nil {
			return NativeResult{Stderr: "Failed to create directory: " + err.Error(), ExitCode: 1, Success: false}
		}
		if err := os.WriteFile(p, []byte(content), 0644); err != nil {
			return NativeResult{Stderr: "Failed to write file: " + err.Error(), ExitCode: 1, Success: false}
		}
		// Track the main file
		if mainFile == "" {
			mainFile = p
		}
	}

	// Determine command based on language
	var cmd *exec.Cmd
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(req.TimeLimit)*time.Second)
	defer cancel()

	switch req.Language {
	case "python", "python3":
		cmd = exec.CommandContext(ctx, "python", mainFile)
	case "javascript", "js", "node":
		cmd = exec.CommandContext(ctx, "node", mainFile)
	case "typescript", "ts":
		// For TypeScript, we need ts-node or compile first
		cmd = exec.CommandContext(ctx, "npx", "ts-node", mainFile)
	case "go", "golang":
		cmd = exec.CommandContext(ctx, "go", "run", mainFile)
	case "java":
		// Compile and run Java
		className := filepath.Base(mainFile)
		className = className[:len(className)-len(filepath.Ext(className))]
		compileCmd := exec.CommandContext(ctx, "javac", mainFile)
		compileCmd.Dir = tmpDir
		if out, err := compileCmd.CombinedOutput(); err != nil {
			return NativeResult{Stderr: "Compilation failed:\n" + string(out), ExitCode: 1, Success: false, Language: req.Language}
		}
		cmd = exec.CommandContext(ctx, "java", "-cp", tmpDir, className)
	case "c":
		outFile := filepath.Join(tmpDir, "a.out")
		compileCmd := exec.CommandContext(ctx, "gcc", mainFile, "-o", outFile)
		if out, err := compileCmd.CombinedOutput(); err != nil {
			return NativeResult{Stderr: "Compilation failed:\n" + string(out), ExitCode: 1, Success: false, Language: req.Language}
		}
		cmd = exec.CommandContext(ctx, outFile)
	case "cpp", "c++":
		outFile := filepath.Join(tmpDir, "a.out")
		compileCmd := exec.CommandContext(ctx, "g++", mainFile, "-o", outFile)
		if out, err := compileCmd.CombinedOutput(); err != nil {
			return NativeResult{Stderr: "Compilation failed:\n" + string(out), ExitCode: 1, Success: false, Language: req.Language}
		}
		cmd = exec.CommandContext(ctx, outFile)
	case "rust":
		outFile := filepath.Join(tmpDir, "main")
		compileCmd := exec.CommandContext(ctx, "rustc", mainFile, "-o", outFile)
		if out, err := compileCmd.CombinedOutput(); err != nil {
			return NativeResult{Stderr: "Compilation failed:\n" + string(out), ExitCode: 1, Success: false, Language: req.Language}
		}
		cmd = exec.CommandContext(ctx, outFile)
	case "ruby":
		cmd = exec.CommandContext(ctx, "ruby", mainFile)
	case "php":
		cmd = exec.CommandContext(ctx, "php", mainFile)
	case "bash", "sh", "shell":
		cmd = exec.CommandContext(ctx, "bash", mainFile)
	case "powershell", "ps1":
		cmd = exec.CommandContext(ctx, "powershell", "-ExecutionPolicy", "Bypass", "-File", mainFile)
	default:
		return NativeResult{
			Stderr:   fmt.Sprintf("Language '%s' is not supported for native execution. Supported: python, javascript, typescript, go, java, c, cpp, rust, ruby, php, bash, powershell", req.Language),
			ExitCode: 1,
			Success:  false,
			Language: req.Language,
		}
	}

	// Set up stdin if provided
	if req.Stdin != "" {
		cmd.Stdin = bytes.NewBufferString(req.Stdin)
	}

	// Capture stdout and stderr
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	cmd.Dir = tmpDir

	// Run the command
	err = cmd.Run()
	exitCode := 0
	if err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			return NativeResult{
				Stdout:   stdout.String(),
				Stderr:   "Execution timed out after " + fmt.Sprintf("%d", req.TimeLimit) + " seconds",
				ExitCode: 124,
				Success:  false,
				Language: req.Language,
			}
		}
		if exitErr, ok := err.(*exec.ExitError); ok {
			exitCode = exitErr.ExitCode()
		} else {
			// Command not found or other error
			return NativeResult{
				Stdout:   stdout.String(),
				Stderr:   stderr.String() + "\nError: " + err.Error(),
				ExitCode: 1,
				Success:  false,
				Language: req.Language,
			}
		}
	}

	return NativeResult{
		Stdout:   stdout.String(),
		Stderr:   stderr.String(),
		ExitCode: exitCode,
		Success:  exitCode == 0,
		Language: req.Language,
	}
}

func main() {
	rl := newRateLimiter(60) // 60 runs per minute per IP default
	http.Handle("/metrics", promhttp.Handler())
	// health checks
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK); w.Write([]byte("ok")) })
	http.HandleFunc("/readyz", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK); w.Write([]byte("ready")) })

	// wrap run endpoint with auth middleware
	authSecret := os.Getenv("AUTH_JWT_SECRET")
	if authSecret == "" {
		log.Println("Warning: AUTH_JWT_SECRET not set — /run will be unauthenticated")
		http.HandleFunc("/run", runHandler(rl))
	} else {
		http.Handle("/run", authMiddleware(authSecret, runHandler(rl)))
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	log.Printf("exec-engine listening on :%s (mode=%s)", port, os.Getenv("RUNNER_MODE"))
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
