#!/bin/bash
REPO=~/novaris-web
WEB=~/public_html

cd $REPO
echo "→ git pull..."
git pull origin main

echo "→ npm install..."
npm install --legacy-peer-deps

echo "→ npm build..."
export NEXT_PUBLIC_BASE_PATH="/~novaris"
npm run build

echo "→ deploy..."
cp -rf $REPO/out/* $WEB/

echo "✓ Deployed!"
