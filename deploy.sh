#!/usr/bin/env bash
set -e

REPO_DIR="/tmp/savos-repo"
SITE_DIR="/root/www"

# Ensure we have the repo
if [ ! -d "$REPO_DIR/.git" ]; then
    echo "Cloning repo..."
    git clone https://github.com/PatrickBolton69/Savos_RU.git "$REPO_DIR"
fi

# Checkout gh-pages and pull latest
cd "$REPO_DIR"
git checkout gh-pages
git pull origin gh-pages

# Sync site files (only the tracked ones)
cp "$SITE_DIR/index.html" "$SITE_DIR/style.css" "$SITE_DIR/script.js" ./
rm -rf img go
cp -r "$SITE_DIR/img" "$SITE_DIR/go" ./

# Commit and push
git add -A
if git diff --cached --quiet; then
    echo "No changes to deploy."
else
    git commit -m "Update site $(date '+%Y-%m-%d %H:%M')"
    git push origin gh-pages
    echo "Deployed to gh-pages."
fi

# Also update main with the same
git checkout main
git pull origin main
cp "$SITE_DIR/index.html" "$SITE_DIR/style.css" "$SITE_DIR/script.js" ./
rm -rf img go
cp -r "$SITE_DIR/img" "$SITE_DIR/go" ./
git add -A
if git diff --cached --quiet; then
    echo "No changes to main."
else
    git commit -m "Sync main with gh-pages $(date '+%Y-%m-%d %H:%M')"
    git push origin main
    echo "Merged to main."
fi

echo "Done."
