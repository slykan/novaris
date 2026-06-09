#!/bin/bash
set -e

PROJECT="$(dirname "$0")"
PLINK="/c/Program Files/PuTTY/plink.exe"

echo "=============================="
echo " NOVARIS DEPLOY"
echo "=============================="

cd "$PROJECT"

echo "[1/2] Git push..."
git push origin main

echo "[2/2] SSH deploy na VPS..."
"$PLINK" novaris@vps.on-click.hr "bash ~/server.sh"

echo ""
echo "Deploy zavrsen!"
