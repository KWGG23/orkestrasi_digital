#!/usr/bin/env bash
# Dijalankan otomatis tiap container start (RUN_SCRIPTS=1 di Dockerfile).
# Prefix "00-" penting -- base image nginx-php-fpm jalanin file di scripts/
# berurutan sesuai nama file.
set -e

echo "Running composer"
composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

# storage:link sengaja tidak dijalankan -- disk 'public' produksi pakai
# FILESYSTEM_PUBLIC_DRIVER=s3 (Supabase Storage), symlink lokal tidak relevan.
