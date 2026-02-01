#!/usr/bin/env bash
set -euo pipefail

# Basic runner: write files, run Python, capture output and exit code
WORKDIR=/workspace
mkdir -p "$WORKDIR"
cp -r /submission/* "$WORKDIR/" || true
cd "$WORKDIR"

# Time limit enforced by container runtime in production. Here we use timeout.
OUTPUT_FILE=/tmp/run_result.json
{
  echo "--- RUN START ---"
  if [ -f main.py ]; then
    timeout 5s python3 main.py
    ec=$?
  else
    echo "No main.py found"
    ec=127
  fi
  echo "--- RUN END ---"
} &> /tmp/run_stdout.log || true

# emit a simple JSON envelope
cat <<EOF
{
  "stdout": "$(sed 's/"/\\"/g' /tmp/run_stdout.log | sed ':a;N;$!ba;s/\n/\n/g')",
  "exitCode": $ec
}
EOF
