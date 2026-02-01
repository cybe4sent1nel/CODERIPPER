# Development Setup

Quickstart for local development.

Prereqs: Docker, Docker Compose, Node 20, Go 1.20, Python 3.11

1. Build runner image and services:
   - docker compose -f infra/docker-compose.yml build
2. Start services:
   - docker compose -f infra/docker-compose.yml up
3. Frontend:
   - cd web
   - npm ci && npm run dev
4. Access:
   - Frontend: http://localhost:3000 (Next.js default)
   - Exec engine: http://localhost:8081/run
   - AI service: http://localhost:8000/api/ai/explain-error

Kubernetes mode (recommended for production testing):
- Create the namespace and RBAC objects: `kubectl apply -f infra/k8s/namespace.yaml && kubectl apply -f infra/k8s/serviceaccount.yaml && kubectl apply -f infra/k8s/role.yaml && kubectl apply -f infra/k8s/rolebinding.yaml && kubectl apply -f infra/k8s/networkpolicy-deny-egress.yaml`
- Deploy the exec-engine with RUNNER_MODE=k8s in the Pod (Helm chart sets this by default).
- Ensure a runner image `coderipper/runner-python:latest` is available in your cluster image registry (push to your registry or use `kind load docker-image`).
- Set `AUTH_JWT_SECRET` in the environment before running `auth` service and `exec-engine` in production or locally for auth enforcement.
- For production use object storage (S3/MinIO) to pass submissions and prefer a sandbox runtime (gVisor/Kata). To enable S3 uploads, set `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, and optionally `S3_BUCKET` and `S3_USE_SSL` in the exec-engine Pod. To use gVisor/Kata, create a `RuntimeClass` and set `RUNTIME_CLASS_NAME` to the RuntimeClass name.


Notes:
- The exec-engine mounts submission files into the runner container at /submission for local testing.
- This is a starter scaffold: for production, deploy on Kubernetes using the provided Helm templates.
