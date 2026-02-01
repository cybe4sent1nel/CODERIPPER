package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestAuthMiddleware(t *testing.T) {
	secret := "testsecret"
	h := authMiddleware(secret, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) }))

	// request without token -> 401
	req := httptest.NewRequest("GET", "/", nil)
	w := httptest.NewRecorder()
	h.ServeHTTP(w, req)
	if w.Result().StatusCode != 401 {
		t.Fatalf("expected 401 got %d", w.Result().StatusCode)
	}

	// request with valid token -> 200
	claims := jwt.RegisteredClaims{Subject: "user-1", ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute))}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	s, _ := tok.SignedString([]byte(secret))
	req2 := httptest.NewRequest("GET", "/", nil)
	req2.Header.Set("Authorization", "Bearer "+s)
	w2 := httptest.NewRecorder()
	h.ServeHTTP(w2, req2)
	if w2.Result().StatusCode != 200 {
		t.Fatalf("expected 200 got %d", w2.Result().StatusCode)
	}
}
