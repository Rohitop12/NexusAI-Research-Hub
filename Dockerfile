# Stage 1: Build static assets using Node.js
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production PHP environment
FROM dunglas/frankenphp:1.1-php8.2 AS php-runtime

# Install required PHP extensions for Laravel and MongoDB
RUN install-php-extensions \
    pcntl \
    mongodb \
    zip \
    opcache \
    intl

# Copy composer from the official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production \
    APP_ENV=production \
    APP_DEBUG=false \
    COMPOSER_MEMORY_LIMIT=-1

# Copy composer package descriptors for dependency caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy the rest of the application files
COPY . .

# Copy Vite-compiled frontend assets from Stage 1
COPY --from=node-builder /app/public/build ./public/build

# Optimize composer autoloader
RUN composer dump-autoload --optimize --no-dev

# Set ownership and permissions for Laravel directories
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copy entrypoint script and ensure it has correct permissions and line endings
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    && sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
