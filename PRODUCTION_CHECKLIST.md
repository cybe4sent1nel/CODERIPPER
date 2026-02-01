# Production Readiness Checklist — Coderipper

Use this as a guide before deploying to production:

- [ ] Harden execution environment
  - Use Kubernetes Jobs with restricted ServiceAccount and NetworkPolicy that denies egress
  - Consider gVisor or Kata containers for additional isolation. Create a RuntimeClass (e.g., `gvisor`) and set `RUNTIME_CLASS_NAME` for runner jobs.
  - Mount submissions via object storage (S3/MinIO) using init containers (large payloads will use S3 upload and init-container fetch)
- [ ] Secrets & configuration
  - Use HashiCorp Vault or Kubernetes Secrets sealed with SealedSecrets
  - Do not store API keys or secrets in repo or images
- [ ] Observability & Alerts
  - Prometheus metrics (runs, durations, failures)
  - Centralized logging (Loki/ELK), tracing (Jaeger/OpenTelemetry)
  - Alerting for anomalous activity or high error rates
- [ ] Security Scanning
  - Run Trivy on container images in CI
  - Run SAST / dependency scanning
- [ ] Rate limiting & abuse prevention
  - Use API gateway (e.g., Kong, Ambassador, GCP/Istio) with per-IP and per-user quotas
  - Implement captcha/verification flows for suspicious accounts
- [ ] Data & compliance
  - GDPR: data deletion/export endpoints
  - Data retention policy and backups for DB
- [ ] Tests & chaos
  - End-to-end tests that run sample jobs in a staging cluster
  - Chaos experiments for pod eviction and node failure
- [ ] CI/CD
  - Build and sign artifacts, push to trusted registry
  - Use ephemeral environments for PRs and smoke tests

Deploy plan:
1. Deploy to staging with limited capacity and RBAC
2. Run E2E test-suite for several languages
3. Gradually increase traffic with canary rules


