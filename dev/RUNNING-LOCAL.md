# Running services locally (dev mode)

This file shows the minimal commands to start core services locally *without Docker* for development and testing. These commands are **for PowerShell** on Windows.

1) Auth (in-memory dev mode)

```powershell
# opens the auth service with an in-memory store (not for production)
$env:DEV_MODE='true'; $env:AUTH_JWT_SECRET='changeme'; cd .\services\auth; go run .
```

2) Exec Engine (local docker runner path - requires Docker availability for actual runs)

```powershell
$env:AUTH_JWT_SECRET='changeme'; $env:BADGE_SERVICE_TOKEN='devtoken'; cd .\services\exec-engine; go run .
```

3) Webhook (dev no-TLS)

```powershell
$env:DEV_WEBHOOK_NO_TLS='true'; cd .\services\webhook; go run .
```

4) Frontend (Next.js)

```powershell
cd .\web; npm run dev
```

5) Badge service (Python)

```powershell
# create venv and install deps
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r services\badge-service\requirements.txt
python services\badge-service\app.py
```

Notes:
- These are convenience commands for development and debugging only. Do not run them like this in production.
- For the full stack (Postgres, Redis, Mongo, runners) install Docker Desktop and run: `cd infra && docker compose up -d --build`.
- If Docker isn't running, the Exec Engine can still start but container-based runs will fail until Docker is available (or use a Kubernetes cluster for k8s mode).
