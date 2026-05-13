#!/bin/bash

set -e

REPO="https://github.com/slykan/novaris.git"
APP_DIR="$HOME/novaris-app"
PUBLIC_HTML="$HOME/public_html"

# Postavi /~novaris za temp URL, ostavi prazno za pravu domenu
BASE_PATH="${BASE_PATH:-/~novaris}"

echo "=============================="
echo " NOVARIS DEPLOY"
echo "=============================="

# 1. Clone ili pull
if [ -d "$APP_DIR/.git" ]; then
  echo "[1/4] Git pull..."
  cd "$APP_DIR"
  git pull
else
  echo "[1/4] Git clone..."
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# 2. Install dependencies
echo "[2/4] npm install..."
npm install

# 3. Build
echo "[3/4] npm build... (BASE_PATH=$BASE_PATH)"
BASE_PATH="$BASE_PATH" npm run build

# 4. Deploy u public_html
echo "[4/4] Kopiranje u public_html..."
rm -rf "$PUBLIC_HTML"/*
cp -r "$APP_DIR/out/." "$PUBLIC_HTML/"

echo ""
echo "✓ Deploy završen! Stranica je live."
