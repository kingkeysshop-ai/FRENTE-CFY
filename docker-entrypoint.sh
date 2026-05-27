#!/bin/sh
set -e

echo "=== [entrypoint] Running database migrations ==="
node /app/node_modules/@medusajs/medusa-cli/cli.js migrations run

echo "=== [entrypoint] Starting Medusa server ==="
exec node --preserve-symlinks --trace-warnings /app/index.js
