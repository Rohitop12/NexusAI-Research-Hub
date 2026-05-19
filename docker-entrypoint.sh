#!/bin/sh
set -e

# Ensure we have a .env file so Laravel boots and commands run correctly
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo ".env file not found. Creating it from .env.example..."
        cp .env.example .env
    else
        echo ".env file not found and .env.example not found. Creating empty .env file..."
        touch .env
    fi
fi

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
    if php artisan key:generate --force; then
        echo "Dynamic fallback key generated successfully!"
    else
        echo "WARNING: Failed to generate a fallback key! Laravel may fail to boot if APP_KEY is empty."
    fi
fi

# Clear any cached configurations or states
echo "Clearing old config, cache, routes, and views..."
php artisan config:clear || echo "WARNING: php artisan config:clear failed!"
php artisan cache:clear || echo "WARNING: php artisan cache:clear failed!"
php artisan route:clear || echo "WARNING: php artisan route:clear failed!"
php artisan view:clear || echo "WARNING: php artisan view:clear failed!"

# Create storage symlink
echo "Creating storage symlink..."
php artisan storage:link --force || echo "WARNING: php artisan storage:link failed!"

# Cache configuration, routes, and views at boot (runtime)
# This ensures that actual Render environment variables are read and cached
echo "Caching Laravel config, routes, and views for production..."
php artisan config:cache || echo "WARNING: php artisan config:cache failed!"
php artisan route:cache || echo "WARNING: php artisan route:cache failed!"
php artisan view:cache || echo "WARNING: php artisan view:cache failed!"

# Read dynamic Render PORT and map to FrankenPHP SERVER_NAME
PORT="${PORT:-80}"
export SERVER_NAME="http://:${PORT}"

echo "Starting FrankenPHP server on port $PORT..."
exec frankenphp run --config /etc/caddy/Caddyfile