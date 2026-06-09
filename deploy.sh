#!/bin/bash
REPO=~/novaris-web
WEB=~/public_html

if [ -d "$REPO/.git" ]; then
  echo "→ git pull..."
  cd $REPO
  git pull origin main
else
  echo "→ git clone..."
  git clone https://github.com/slykan/novaris.git $REPO
  cd $REPO
fi

echo "→ npm install..."
npm install --legacy-peer-deps

echo "→ npm build..."
export NEXT_PUBLIC_BASE_PATH="/~novaris"
npm run build

echo "→ deploy..."
cp -rf $REPO/out/* $WEB/

echo "✓ Deployed!"
