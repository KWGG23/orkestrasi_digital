# Render butuh Docker untuk deploy PHP (beda dari Railway yang pakai Nixpacks
# lewat Procfile) -- base image ini sudah include nginx + php-fpm + extension
# yang kita butuh (gd, pdo_pgsql, zip), jadi tidak perlu instalasi manual.
# Root Directory di Render HARUS di-set ke "backend" (monorepo).
FROM richarvey/nginx-php-fpm:3.1.6

# Base image ini TIDAK include ext-mbstring meski laravel/framework
# mensyaratkannya secara hard requirement (composer install akan gagal total
# tanpa ini). Build tool (gcc dkk) sudah dihapus di base image demi ukuran,
# jadi diinstall ulang sementara lewat $PHPIZE_DEPS (env var standar dari
# image php: resmi) lalu dihapus lagi setelah kompilasi selesai.
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && docker-php-ext-install mbstring \
    && apk del .build-deps

COPY . .

# Image config
ENV SKIP_COMPOSER=1
ENV WEBROOT=/var/www/html/public
ENV PHP_ERRORS_STDERR=1
ENV RUN_SCRIPTS=1
ENV REAL_IP_HEADER=1

# Laravel config -- APP_ENV/APP_DEBUG di sini cuma default, override lewat
# environment variable asli di Render dashboard kalau perlu beda.
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# Izinkan Composer jalan sebagai root (container ini jalan sebagai root)
ENV COMPOSER_ALLOW_SUPERUSER=1

CMD ["/start.sh"]
