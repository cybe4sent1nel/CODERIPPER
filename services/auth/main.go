package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var jwtSecret string
var refreshSecret string

// Dev-mode in-memory store (enabled by setting DEV_MODE=true)
var devMode bool
var _devUsers = map[string]struct{ Email, Name, Hash string }{}
var _devEmailToID = map[string]string{}
var _devCounter = 0

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

func main() {
	var err error
	devMode = os.Getenv("DEV_MODE") == "true"
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		dbUrl = "postgresql://coderip:coderip@localhost:5432/coderipper?sslmode=disable"
	}

	if !devMode {
		db, err = sql.Open("postgres", dbUrl)
		if err != nil {
			log.Fatal(err)
		}
		if err = db.Ping(); err != nil {
			log.Fatal(err)
		}
	} else {
		log.Println("DEV_MODE=true: running auth with in-memory store (not for production)")
	}

	jwtSecret = os.Getenv("AUTH_JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("AUTH_JWT_SECRET must be set")
	}
	refreshSecret = os.Getenv("AUTH_REFRESH_SECRET")
	if refreshSecret == "" {
		refreshSecret = jwtSecret // fallback
	}

	r := chi.NewRouter()
	r.Post("/signup", signupHandler)
	r.Post("/login", loginHandler)
	r.Post("/refresh", refreshHandler)
	r.Get("/me", authRequired(meHandler))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	log.Printf("auth service listening on :%s", port)
	http.ListenAndServe(":"+port, r)
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	if payload.Email == "" || payload.Password == "" {
		http.Error(w, "email and password required", http.StatusBadRequest)
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "internal", http.StatusInternalServerError)
		return
	}

	if devMode {
		_devCounter++
		id := fmt.Sprintf("dev-%d", _devCounter)
		_devUsers[id] = struct{ Email, Name, Hash string }{Email: payload.Email, Name: payload.Name, Hash: string(hash)}
		_devEmailToID[payload.Email] = id
		user := User{ID: id, Email: payload.Email, Name: payload.Name}
		access, refresh, err := makeTokens(id)
		if err != nil {
			http.Error(w, "token error", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"access_token": access, "refresh_token": refresh, "user": user})
		return
	}

	var id string
	err = db.QueryRow("INSERT INTO users (email, name, hashed_password) VALUES ($1,$2,$3) RETURNING id", payload.Email, payload.Name, string(hash)).Scan(&id)
	if err != nil {
		http.Error(w, "could not create user", http.StatusInternalServerError)
		return
	}
	user := User{ID: id, Email: payload.Email, Name: payload.Name}
	access, refresh, err := makeTokens(id)
	if err != nil {
		http.Error(w, "token error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{"access_token": access, "refresh_token": refresh, "user": user})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var payload struct{ Email, Password string }
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	if devMode {
		id, ok := _devEmailToID[payload.Email]
		if !ok {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		entry := _devUsers[id]
		if bcrypt.CompareHashAndPassword([]byte(entry.Hash), []byte(payload.Password)) != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		access, refresh, err := makeTokens(id)
		if err != nil {
			http.Error(w, "token error", http.StatusInternalServerError)
			return
		}
		user := User{ID: id, Email: payload.Email, Name: entry.Name}
		json.NewEncoder(w).Encode(map[string]interface{}{"access_token": access, "refresh_token": refresh, "user": user})
		return
	}

	var id, hash, name string
	err := db.QueryRow("SELECT id, hashed_password, name FROM users WHERE email = $1", payload.Email).Scan(&id, &hash, &name)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(hash), []byte(payload.Password)) != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	access, refresh, err := makeTokens(id)
	if err != nil {
		http.Error(w, "token error", http.StatusInternalServerError)
		return
	}
	user := User{ID: id, Email: payload.Email, Name: name}
	json.NewEncoder(w).Encode(map[string]interface{}{"access_token": access, "refresh_token": refresh, "user": user})
}

func refreshHandler(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	claims := &jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(payload.RefreshToken, claims, func(token *jwt.Token) (any, error) {
		return []byte(refreshSecret), nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "invalid refresh", http.StatusUnauthorized)
		return
	}
	uid := claims.Subject
	access, refresh, err := makeTokens(uid)
	if err != nil {
		http.Error(w, "token error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{"access_token": access, "refresh_token": refresh})
}

func meHandler(w http.ResponseWriter, r *http.Request) {
	uid := r.Context().Value("user_id").(string)
	if devMode {
		entry, ok := _devUsers[uid]
		if !ok {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(User{ID: uid, Email: entry.Email, Name: entry.Name})
		return
	}
	var email, name string
	if err := db.QueryRow("SELECT email,name FROM users WHERE id=$1", uid).Scan(&email, &name); err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(User{ID: uid, Email: email, Name: name})
}

func makeTokens(userID string) (string, string, error) {
	accessExp := time.Now().Add(15 * time.Minute)
	access := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{Subject: userID, ExpiresAt: jwt.NewNumericDate(accessExp)})
	acc, err := access.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", "", err
	}
	refreshExp := time.Now().Add(7 * 24 * time.Hour)
	refresh := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{Subject: userID, ExpiresAt: jwt.NewNumericDate(refreshExp)})
	rf, err := refresh.SignedString([]byte(refreshSecret))
	if err != nil {
		return "", "", err
	}
	return acc, rf, nil
}

// middleware
func authRequired(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		h := r.Header.Get("Authorization")
		if h == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		var tokenString string
		fmt.Sscanf(h, "Bearer %s", &tokenString)
		claims := &jwt.RegisteredClaims{}
		tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) { return []byte(jwtSecret), nil })
		if err != nil || !tkn.Valid {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), "user_id", claims.Subject)
		next(w, r.WithContext(ctx))
	}
}
