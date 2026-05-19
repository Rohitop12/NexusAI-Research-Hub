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
