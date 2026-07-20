<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application for file storage.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        // Driver-nya sengaja env-driven (bukan disk 's3' terpisah) supaya semua
        // kode yang sudah pakai Storage::disk('public') -- UmkmController,
        // LayerController, dst -- otomatis ikut pindah ke S3/Supabase Storage
        // cukup lewat env var, tanpa ubah kode sama sekali. Railway filesystem-nya
        // ephemeral (hilang tiap redeploy), jadi produksi WAJIB pakai driver 's3'
        // (lihat FILESYSTEM_PUBLIC_DRIVER di .env.example).
        'public' => [
            'driver' => env('FILESYSTEM_PUBLIC_DRIVER', 'local'),
            // 'root' cuma masuk akal buat driver 'local' (path filesystem asli).
            // Kalau dipaksa sama-sama dipakai untuk driver 's3', Laravel
            // memperlakukannya sebagai prefix folder DI DALAM bucket -- path
            // absolut container (/var/www/html/storage/app/public) bakal
            // ke-embed jadi bagian object key di Supabase, bikin file ke-upload
            // di key yang salah dan URL publiknya 400.
            'root' => env('FILESYSTEM_PUBLIC_DRIVER', 'local') === 's3' ? '' : storage_path('app/public'),
            'url' => env('AWS_URL', rtrim(env('APP_URL', 'http://localhost'), '/').'/storage'),
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
            // Kunci di bawah ini cuma dipakai kalau driver di atas = 's3'.
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', true),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
