#!/bin/sh
echo "Starting server..."

# Wait for database
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 2
done

# Run migrations and generate client
echo "Database ready, applying migrations..."
cd /app/packages/database
/app/packages/database/node_modules/.bin/prisma migrate deploy
/app/packages/database/node_modules/.bin/prisma generate

# Start server
echo "Migrations completed, starting server..."
cd /app
exec node apps/server/dist/index.js