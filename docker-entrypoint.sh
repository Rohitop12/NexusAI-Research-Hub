#!/bin/sh
set -e

# Only create SQLite database if explicitly using sqlite
if [ "${DB_CONNECTION}" = "sqlite" ]; then
    DB_PATH="/app/database/database.sqlite"

    if [ ! -f "$DB_PATH" ]; then
        echo "Creating SQLite database at $DB_PATH..."
        mkdir -p "$(dirname "$DB_PATH")"
        touch "$DB_PATH"
        chown www-data:www-data "$DB_PATH"
        chmod 664 "$DB_PATH"
    fi
fi

# Warn early if MongoDB is selected but URI is missing
if [ "${DB_CONNECTION}" = "mongodb" ]; then
    if [ -z "${MONGODB_URI}" ]; then
        echo "WARNING: DB_CONNECTION is set to mongodb but MONGODB_URI is not set!"
        echo "The container will attempt to boot anyway so you can inspect settings."
    else
        echo "MongoDB connection detected. MONGODB_URI is set."
    fi
fi

# Run migrations only for relational databases; MongoDB is schemaless
if [ "${DB_CONNECTION}" = "mongodb" ]; then
    echo "Skipping relational migrations — MongoDB is schemaless."
else
    echo "Running database migrations..."
    if php artisan migrate --force; then
        echo "Database migrations ran successfully!"
    else
        echo "WARNING: Database migrations failed! This usually happens if your DB_CONNECTION details are empty, invalid, or unable to connect."
        echo "The container will attempt to boot anyway so you can inspect settings."
    fi
fi

# Ensure APP_KEY is set or generate a fallback key
if [ -z "${APP_KEY}" ]; then
    echo "WARNING: APP_KEY is not defined in Render environment. Generating a dynamic fallback key..."
    php artisan key:generate --force
fi

# Clear any cached configurations or states
echo "Clearing old config, cache, routes, and views..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Create storage symlink
echo "Creating storage symlink..."
php artisan storage:link --force

# Cache configuration, routes, and views at boot (runtime)
# This ensures that actual Render environment variables are read and cached
echo "Caching Laravel config, routes, and views for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Read dynamic Render PORT and map to FrankenPHP SERVER_NAME
PORT="${PORT:-80}"
export SERVER_NAME=":${PORT}"

echo "Starting FrankenPHP server on port $PORT..."
exec frankenphp run --config /etc/caddy/Caddyfile