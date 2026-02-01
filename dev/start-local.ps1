# Dev helper: open new PowerShell windows to run services locally (Dev only)
# Usage: Right-click -> Run with PowerShell (or run in an elevated terminal)

# Auth (in-memory)
Start-Process powershell -ArgumentList "-NoExit","-Command","$env:DEV_MODE='true'; $env:AUTH_JWT_SECRET='changeme'; cd .\services\auth; go run ."

# Exec Engine
Start-Process powershell -ArgumentList "-NoExit","-Command","$env:AUTH_JWT_SECRET='changeme'; $env:BADGE_SERVICE_TOKEN='devtoken'; cd .\services\exec-engine; go run ."

# Webhook (no TLS)
Start-Process powershell -ArgumentList "-NoExit","-Command","$env:DEV_WEBHOOK_NO_TLS='true'; cd .\services\webhook; go run ."

# Frontend
Start-Process powershell -ArgumentList "-NoExit","-Command","cd .\web; npm run dev"

# Badge service (python venv)
Start-Process powershell -ArgumentList "-NoExit","-Command","python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r services\badge-service\requirements.txt; python services\badge-service\app.py"
