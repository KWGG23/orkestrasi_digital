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

echo "Seeding admin user..."
# updateOrCreate berdasar email -- aman dijalankan tiap deploy, tidak bikin
# duplikat. JenisSampahSeeder sengaja TIDAK di sini -- meski sekarang aman
# dipanggil ulang (updateOrCreate per nama, bukan truncate), kalau ikut
# auto-run tiap deploy dia bakal nimpa balik harga yang diubah admin manual
# lewat panel "Tambah Jenis Sampah". Update daftar harga BSI berikutnya
# dijalankan lewat cara yang sama seperti update Juli 2026 ini: sertakan
# baris ini sementara khusus untuk satu deploy, lalu cabut lagi.
php artisan db:seed --class=AdminSeeder --force

# storage:link sengaja tidak dijalankan -- disk 'public' produksi pakai
# FILESYSTEM_PUBLIC_DRIVER=s3 (Supabase Storage), symlink lokal tidak relevan.
