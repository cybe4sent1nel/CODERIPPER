# =========================================
# CodeRipper - Development Startup Script
# =========================================
# This script starts all CodeRipper services
# Run from the root directory: .\Start-Dev.ps1
# =========================================

$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) { Write-Output $args }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CodeRipper - Enterprise Code Platform" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "web\package.json")) {
    Write-Host "ERROR: Please run this script from the CodeRipper root directory" -ForegroundColor Red
    exit 1
}

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check for npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: npm is not found. Please reinstall Node.js" -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Checking environment configuration..." -ForegroundColor Green
if (-not (Test-Path "web\.env.local")) {
    Write-Host "Creating .env.local from .env.example..."
    Copy-Item "web\.env.example" "web\.env.local"
    Write-Host "NOTE: Please edit web\.env.local with your API keys" -ForegroundColor Yellow
}

Write-Host "[2/5] Installing web dependencies..." -ForegroundColor Green
Push-Location web
try {
    npm install --silent 2>$null
} catch {
    npm install
}
Pop-Location

Write-Host "[3/5] Checking for Docker (optional for code execution)..." -ForegroundColor Green
$DockerAvailable = $false
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "Docker found. Code execution service will be available."
    $DockerAvailable = $true
} else {
    Write-Host "Docker not found. Code execution will use simulation mode." -ForegroundColor Yellow
}

Write-Host "[4/5] Starting services..." -ForegroundColor Green
Write-Host ""

$ExecJob = $null

# Start exec-engine if Docker is available and Go is installed
if ($DockerAvailable -and (Get-Command go -ErrorAction SilentlyContinue)) {
    Write-Host "Starting exec-engine in background..."
    $ExecJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD\services\exec-engine
        go run main.go
    }
    Start-Sleep -Seconds 2
}

Write-Host "[5/5] Starting web application..." -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CodeRipper is starting..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Web App:      http://localhost:3000"
Write-Host "  API:          http://localhost:3000/api"
if ($DockerAvailable) {
    Write-Host "  Exec Engine:  http://localhost:8081"
}
Write-Host ""
Write-Host "  Press Ctrl+C to stop all services"
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

try {
    Push-Location web
    npm run dev
} finally {
    Pop-Location
    
    Write-Host ""
    Write-Host "Shutting down services..."
    
    if ($ExecJob) {
        Stop-Job $ExecJob -ErrorAction SilentlyContinue
        Remove-Job $ExecJob -ErrorAction SilentlyContinue
    }
    
    Write-Host "Done."
}
