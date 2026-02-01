/**
 * CodeRipper Setup Script
 * Run with: npm run setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const WEB_DIR = path.join(ROOT_DIR, 'web');

console.log('');
console.log('============================================');
console.log('  CodeRipper - Setup Script');
console.log('============================================');
console.log('');

// Step 1: Check for .env.local
console.log('[1/3] Checking environment configuration...');
const envExample = path.join(WEB_DIR, '.env.example');
const envLocal = path.join(WEB_DIR, '.env.local');

if (!fs.existsSync(envLocal)) {
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envLocal);
    console.log('  ✓ Created .env.local from .env.example');
    console.log('  ⚠ Please edit web/.env.local with your API keys');
  } else {
    console.log('  ⚠ No .env.example found');
  }
} else {
  console.log('  ✓ .env.local already exists');
}

// Step 2: Install web dependencies
console.log('');
console.log('[2/3] Installing web dependencies...');
try {
  process.chdir(WEB_DIR);
  execSync('npm install', { stdio: 'inherit' });
  console.log('  ✓ Web dependencies installed');
} catch (error) {
  console.error('  ✗ Failed to install web dependencies');
  process.exit(1);
}

// Step 3: Check optional services
console.log('');
console.log('[3/3] Checking optional services...');

// Check Docker
try {
  execSync('docker --version', { stdio: 'pipe' });
  console.log('  ✓ Docker is available');
} catch {
  console.log('  ⚠ Docker not found (code execution will use simulation mode)');
}

// Check Go
try {
  execSync('go version', { stdio: 'pipe' });
  console.log('  ✓ Go is available (exec-engine can run locally)');
} catch {
  console.log('  ⚠ Go not found (exec-engine requires Docker)');
}

console.log('');
console.log('============================================');
console.log('  Setup Complete!');
console.log('============================================');
console.log('');
console.log('  To start development:');
console.log('    npm run dev          - Start all services');
console.log('    npm run dev:web-only - Start web only');
console.log('');
console.log('  Other commands:');
console.log('    npm run docker:up    - Start with Docker');
console.log('    npm run build        - Build for production');
console.log('');
