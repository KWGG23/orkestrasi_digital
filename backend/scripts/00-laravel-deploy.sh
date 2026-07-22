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
# duplikat.
php artisan db:seed --class=AdminSeeder --force

# JenisSampahSeeder SENGAJA disertakan cuma untuk deploy ini -- one-time sync
# harga terbaru BSI (update Juli 2026) ke production, karena Shell tidak
# tersedia di plan gratis Render sebagai jalur "run once" yang lebih rapi.
# Baris ini WAJIB dicabut lagi di commit berikutnya setelah deploy ini
# berhasil: seeder sekarang aman dipanggil ulang (updateOrCreate per nama,
# bukan truncate lagi), TAPI kalau dibiarkan permanen di sini dia bakal
# nimpa balik harga yang diubah admin manual lewat panel tiap ada deploy
# baru untuk fitur lain -- menggagalkan tujuan fitur "Tambah Jenis Sampah".
php artisan db:seed --class=JenisSampahSeeder --force

# storage:link sengaja tidak dijalankan -- disk 'public' produksi pakai
# FILESYSTEM_PUBLIC_DRIVER=s3 (Supabase Storage), symlink lokal tidak relevan.
