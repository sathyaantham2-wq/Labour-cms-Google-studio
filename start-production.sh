#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Labour CMS  –  Production Build & Start
#  Builds the frontend and serves everything from one server
#  Access the app at: http://localhost:4000
# ─────────────────────────────────────────────────────────────

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  Labour CMS  –  Production Mode"
echo "  ────────────────────────────────"

# Install dependencies
if [ ! -d "$ROOT/node_modules" ]; then
  echo "  Installing frontend dependencies…"
  cd "$ROOT" && npm install
fi

if [ ! -d "$ROOT/server/node_modules" ]; then
  echo "  Installing backend dependencies…"
  cd "$ROOT/server" && npm install
  echo "  Building native modules…"
  cd "$ROOT/server" && npm rebuild better-sqlite3
fi

# Copy .env if not present
if [ ! -f "$ROOT/server/.env" ]; then
  cp "$ROOT/server/.env.example" "$ROOT/server/.env"
  echo "  Created server/.env  ← IMPORTANT: edit JWT_SECRET before going live!"
fi

# Build frontend
echo ""
echo "  Building frontend…"
cd "$ROOT" && npm run build

# Start backend (which also serves the built frontend)
echo ""
echo "  Starting server  →  http://localhost:4000"
echo "  Press Ctrl+C to stop"
echo ""

cd "$ROOT/server" && NODE_ENV=production node index.js
