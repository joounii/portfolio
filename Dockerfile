FROM node:20-alpine AS build-assets
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    icu-dev

RUN docker-php-ext-configure intl
RUN docker-php-ext-install pdo_mysql bcmath gd zip intl

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .
RUN mkdir -p /var/www/public/build
COPY --from=build-assets /app/public/build ./public/build

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/storage
RUN chown -R www-data:www-data /var/www/public
RUN chown -R www-data:www-data /var/www/public/build
RUN chown -R www-data:www-data /var/www/bootstrap/cache

RUN php artisan config:clear && php artisan view:clear

EXPOSE 9000
CMD ["php-fpm"]
