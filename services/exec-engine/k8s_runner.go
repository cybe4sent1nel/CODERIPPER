package main

import (
	"archive/tar"
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	resource "k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"

	minio "github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// K8sRunResult contains logs and status from a Kubernetes-run job
type K8sRunResult struct {
	Stdout   string `json:"stdout"`
	ExitCode int    `json:"exitCode"`
	Success  bool   `json:"success"`
}

// submitK8sJob creates a Job that mounts a ConfigMap with the submission files and runs the runner image.
// NOTE (production): For larger submissions or binaries use object storage (S3/MinIO) and an init container to pull them instead of ConfigMaps.
func submitK8sJob(req RunRequest, image string, timeout time.Duration, namespace string) (*K8sRunResult, error) {
	// create k8s client
	cfg, err := rest.InClusterConfig()
	if err != nil {
		// fallback to kubeconfig from the user's home (local dev)
		kubeconfig := filepath.Join(homeDir(), ".kube", "config")
		cfg, err = clientcmd.BuildConfigFromFlags("", kubeconfig)
		if err != nil {
			return nil, fmt.Errorf("failed to create k8s config: %w", err)
		}
	}
	clientset, err := kubernetes.NewForConfig(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create k8s client: %w", err)
	}

	// decide whether to use ConfigMap or S3 based on total payload size
	const maxConfigMapSize = 256 * 1024 // 256 KiB
	total := 0
	for _, v := range req.Files {
		total += len(v)
	}

	useS3 := total > maxConfigMapSize && os.Getenv("S3_ENDPOINT") != ""

	var cmName string
	var volumes []corev1.Volume
	var initContainers []corev1.Container

	if useS3 {
		// pack files into a tar and upload to S3/MinIO
		endpoint := os.Getenv("S3_ENDPOINT")
		access := os.Getenv("S3_ACCESS_KEY")
		secret := os.Getenv("S3_SECRET_KEY")
		bucket := os.Getenv("S3_BUCKET")
		if bucket == "" {
			bucket = "coderipper-submissions"
		}
		useSSL := os.Getenv("S3_USE_SSL") != "false"

		minioClient, err := minio.New(endpoint, &minio.Options{Creds: credentials.NewStaticV4(access, secret, ""), Secure: useSSL})
		if err != nil {
			return nil, fmt.Errorf("minio client: %w", err)
		}

		// ensure bucket exists (best-effort)
		_ = minioClient.MakeBucket(context.Background(), bucket, minio.MakeBucketOptions{})

		objKey := fmt.Sprintf("submission-%d.tar", time.Now().UnixNano())

		// create tar in memory
		var buf bytes.Buffer
		tarw := tar.NewWriter(&buf)
		for name, content := range req.Files {
			h := &tar.Header{Name: name, Mode: 0644, Size: int64(len(content))}
			if err := tarw.WriteHeader(h); err != nil {
				return nil, fmt.Errorf("tar header: %w", err)
			}
			if _, err := tarw.Write([]byte(content)); err != nil {
				return nil, fmt.Errorf("tar write: %w", err)
			}
		}
		_ = tarw.Close()

		// upload
		_, err = minioClient.PutObject(context.Background(), bucket, objKey, bytes.NewReader(buf.Bytes()), int64(buf.Len()), minio.PutObjectOptions{ContentType: "application/x-tar"})
		if err != nil {
			return nil, fmt.Errorf("s3 upload: %w", err)
		}

		// create a presigned URL for the init container
		presigned, err := minioClient.PresignedGetObject(context.Background(), bucket, objKey, time.Minute*15, nil)
		if err != nil {
			return nil, fmt.Errorf("presign: %w", err)
		}

		// init container will fetch and extract the tar into /submission
		initContainers = []corev1.Container{{
			Name:         "fetch-submission",
			Image:        "alpine:3.18",
			Command:      []string{"sh", "-c", fmt.Sprintf("apk add --no-cache curl tar >/dev/null 2>&1 && curl -fsS '%s' -o /tmp/sub.tar && mkdir -p /submission && tar -xf /tmp/sub.tar -C /submission", presigned.String())},
			VolumeMounts: []corev1.VolumeMount{{Name: "submission", MountPath: "/submission"}},
		}}

		volumes = []corev1.Volume{{Name: "submission", VolumeSource: corev1.VolumeSource{EmptyDir: &corev1.EmptyDirVolumeSource{}}}}
	} else {
		// Create ConfigMap for small submissions
		cmName = fmt.Sprintf("submission-%d", time.Now().UnixNano())
		cm := &corev1.ConfigMap{
			ObjectMeta: metav1.ObjectMeta{Name: cmName, Namespace: namespace},
			Data:       map[string]string{},
		}
		for name, contents := range req.Files {
			cm.Data[name] = contents
		}
		_, err = clientset.CoreV1().ConfigMaps(namespace).Create(context.Background(), cm, metav1.CreateOptions{})
		if err != nil {
			return nil, fmt.Errorf("create configmap: %w", err)
		}
		defer func() {
			_ = clientset.CoreV1().ConfigMaps(namespace).Delete(context.Background(), cmName, metav1.DeleteOptions{})
		}()
		volumes = []corev1.Volume{{Name: "submission", VolumeSource: corev1.VolumeSource{ConfigMap: &corev1.ConfigMapVolumeSource{LocalObjectReference: corev1.LocalObjectReference{Name: cmName}}}}}
	}

	jobName := fmt.Sprintf("runner-job-%d", time.Now().UnixNano())
	backoffLimit := int32(0)
	ttl := int32(60) // cleanup finished job after 60s

	// Build pod template
	podSpec := corev1.PodTemplateSpec{
		ObjectMeta: metav1.ObjectMeta{Labels: map[string]string{"app": "coderipper-runner"}},
		Spec: corev1.PodSpec{
			ServiceAccountName:           "coderipper-runner-sa",
			RestartPolicy:                corev1.RestartPolicyNever,
			HostNetwork:                  false,
			AutomountServiceAccountToken: boolPtr(false),
			Containers: []corev1.Container{
				{
					Name:         "runner",
					Image:        image,
					Args:         []string{"./run.sh"},
					VolumeMounts: []corev1.VolumeMount{{Name: "submission", MountPath: "/submission", ReadOnly: true}},
					Resources: corev1.ResourceRequirements{
						Limits: corev1.ResourceList{
							"cpu":    resourceMustParse("500m"),
							"memory": resourceMustParse("512Mi"),
						},
						Requests: corev1.ResourceList{
							"cpu":    resourceMustParse("100m"),
							"memory": resourceMustParse("128Mi"),
						},
					},
					SecurityContext: &corev1.SecurityContext{
						AllowPrivilegeEscalation: boolPtr(false),
						ReadOnlyRootFilesystem:   boolPtr(true),
						RunAsNonRoot:             boolPtr(true),
						SeccompProfile:           &corev1.SeccompProfile{Type: corev1.SeccompProfileTypeRuntimeDefault},
					},
				},
			},
			Volumes:        volumes,
			InitContainers: initContainers,
		},
	}

	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{Name: jobName, Namespace: namespace},
		Spec: batchv1.JobSpec{
			Template:                podSpec,
			BackoffLimit:            &backoffLimit,
			TTLSecondsAfterFinished: &ttl,
		},
	}

	jobs := clientset.BatchV1().Jobs(namespace)
	created, err := jobs.Create(context.Background(), job, metav1.CreateOptions{})
	if err != nil {
		return nil, fmt.Errorf("create job: %w", err)
	}
	log.Printf("Created job %s", created.Name)

	// Wait for job completion with timeout
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	// Poll job status periodically
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

forLoop:
	for {
		select {
		case <-ctx.Done():
			_ = clientset.BatchV1().Jobs(namespace).Delete(context.Background(), jobName, metav1.DeleteOptions{})
			return &K8sRunResult{Stdout: "timeout", ExitCode: 137, Success: false}, fmt.Errorf("job timeout")
		case <-ticker.C:
			j, err := jobs.Get(context.Background(), jobName, metav1.GetOptions{})
			if err != nil {
				return nil, fmt.Errorf("get job: %w", err)
			}
			for _, c := range j.Status.Conditions {
				if c.Type == batchv1.JobComplete && c.Status == corev1.ConditionTrue {
					break forLoop
				}
				if c.Type == batchv1.JobFailed && c.Status == corev1.ConditionTrue {
					break forLoop
				}
			}
		}
	}

	// Find pod
	pods, err := clientset.CoreV1().Pods(namespace).List(context.Background(), metav1.ListOptions{LabelSelector: "app=coderipper-runner"})
	if err != nil || len(pods.Items) == 0 {
		return &K8sRunResult{Stdout: "no pod logs", ExitCode: 1, Success: false}, nil
	}
	pod := pods.Items[0]
	logsReq := clientset.CoreV1().Pods(namespace).GetLogs(pod.Name, &corev1.PodLogOptions{Container: "runner"})
	logsStream, err := logsReq.Stream(context.Background())
	if err != nil {
		return nil, fmt.Errorf("pod logs: %w", err)
	}
	defer logsStream.Close()
	buf := new(strings.Builder)
	_, _ = io.Copy(buf, logsStream)

	// Inspect container status for exit code
	exit := 0
	for _, cs := range pod.Status.ContainerStatuses {
		if cs.Name == "runner" {
			if cs.State.Terminated != nil {
				exit = int(cs.State.Terminated.ExitCode)
			}
		}
	}

	return &K8sRunResult{Stdout: buf.String(), ExitCode: exit, Success: exit == 0}, nil
}

// small helpers

func boolPtr(b bool) *bool { return &b }

// resourceMustParse wraps the resource parsing (keeps imports limited in snippet)
func resourceMustParse(s string) resource.Quantity {
	q, err := resource.ParseQuantity(s)
	if err != nil {
		log.Fatalf("invalid resource quantity: %v", err)
	}
	return q
}

func homeDir() string {
	if h := os.Getenv("HOME"); h != "" {
		return h
	}
	if h := os.Getenv("USERPROFILE"); h != "" { // windows
		return h
	}
	return "/"
}
