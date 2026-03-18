#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Labour CMS  –  Full-Stack Startup Script
#  Starts the backend server AND the Vite dev server together
# ─────────────────────────────────────────────────────────────

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  Labour Case Management System"
echo "  ─────────────────────────────"

# Install dependencies if node_modules are missing
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
  echo "  Created server/.env from .env.example (edit it to set JWT_SECRET)"
fi

echo ""
echo "  Starting backend  →  http://localhost:4000"
echo "  Starting frontend →  http://localhost:3000"
echo ""

# Start backend in background
cd "$ROOT/server" && node index.js &
BACKEND_PID=$!

# Start frontend
cd "$ROOT" && npm run dev

# Kill backend when frontend exits
kill $BACKEND_PID 2>/dev/null || true
