package main

import (
	"testing"
	"time"
)

func TestRateLimiterAllow(t *testing.T) {
	rl := newRateLimiter(2)
	ip := "1.2.3.4"
	if !rl.allow(ip) {
		t.Fatal("expected allow")
	}
	if !rl.allow(ip) {
		t.Fatal("expected allow second")
	}
	if rl.allow(ip) {
		t.Fatal("expected deny third")
	}
	// after window reset
	rl.items[ip].windowEnd = time.Now().Add(-time.Minute)
	if !rl.allow(ip) {
		t.Fatal("expected allow after reset")
	}
}
