@echo off
REM =========================================
REM CodeRipper - Development Startup Script
REM =========================================
REM This script starts all CodeRipper services
REM Run from the root directory: start-dev.bat
REM =========================================

echo.
echo  ============================================
echo   CodeRipper - Enterprise Code Platform
echo  ============================================
echo.

REM Check if we're in the right directory
if not exist "web\package.json" (
    echo ERROR: Please run this script from the CodeRipper root directory
    exit /b 1
)

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org
    exit /b 1
)

REM Check for npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not found. Please reinstall Node.js
    exit /b 1
)

echo [1/5] Checking environment configuration...
if not exist "web\.env.local" (
    echo Creating .env.local from .env.example...
    copy "web\.env.example" "web\.env.local" >nul
    echo NOTE: Please edit web\.env.local with your API keys
)

echo [2/5] Installing web dependencies...
cd web
call npm install --silent 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Running npm install...
    call npm install
)
cd ..

echo [3/5] Checking for Docker (optional for code execution)...
where docker >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Docker found. Code execution service will be available.
    set DOCKER_AVAILABLE=1
) else (
    echo Docker not found. Code execution will use simulation mode.
    set DOCKER_AVAILABLE=0
)

echo [4/5] Starting services...
echo.

REM Start exec-engine if Docker is available and Go is installed
if "%DOCKER_AVAILABLE%"=="1" (
    where go >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Starting exec-engine in background...
        start /B cmd /c "cd services\exec-engine && go run main.go"
        timeout /t 2 /nobreak >nul
    )
)

echo [5/5] Starting web application...
echo.
echo  ============================================
echo   CodeRipper is starting...
echo  ============================================
echo.
echo   Web App:      http://localhost:3000
echo   API:          http://localhost:3000/api
if "%DOCKER_AVAILABLE%"=="1" (
    echo   Exec Engine:  http://localhost:8081
)
echo.
echo   Press Ctrl+C to stop all services
echo  ============================================
echo.

cd web
call npm run dev

REM Cleanup on exit
echo.
echo Shutting down services...
taskkill /F /IM "go.exe" >nul 2>&1
echo Done.
