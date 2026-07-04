<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->string('nama_usaha');
            $table->string('nama_pemilik');
            $table->enum('dusun', ['karangasem', 'tegalwungu']);
            $table->enum('kategori', ['kuliner', 'kerajinan', 'pertanian', 'jasa', 'perdagangan']);
            $table->text('deskripsi')->nullable();
            $table->json('produk_utama')->nullable();
            $table->string('kisaran_harga')->nullable();
            $table->string('no_wa', 20)->nullable();
            $table->string('instagram')->nullable();
            $table->string('jam_buka')->nullable();
            $table->string('hari_buka')->nullable();
            $table->json('metode_bayar')->nullable();
            $table->json('platform_online')->nullable();
            $table->boolean('punya_nib')->default(false);
            $table->boolean('aktif')->default(true);
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->string('foto_usaha')->nullable();
            $table->json('foto_produk')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkms');
    }
};
