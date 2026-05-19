#!/bin/sh
set -e

# Ensure SQLite database exists if DB_CONNECTION is sqlite
if [ "${DB_CONNECTION}" = "sqlite" ] || [ -z "${DB_CONNECTION}" ]; then
    # Default SQLite path in Laravel 11/12 is database/database.sqlite
    DB_PATH="/app/database/database.sqlite"
    
    if [ ! -f "$DB_PATH" ]; then
        echo "Creating SQLite database at $DB_PATH..."
        mkdir -p "$(dirname "$DB_PATH")"
        touch "$DB_PATH"
        chown www-data:www-data "$DB_PATH"
        chmod 664 "$DB_PATH"
    fi
fi

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

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
