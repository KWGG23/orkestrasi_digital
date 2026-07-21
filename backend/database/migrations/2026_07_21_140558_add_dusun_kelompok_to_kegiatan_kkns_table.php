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
        // Sebelumnya satu baris = satu tahun (mencakup dua dusun sekaligus).
        // Diubah jadi satu baris = satu (tahun, dusun) -- tiap dusun punya
        // kelompok KKN sendiri-sendiri jadi dokumentasinya perlu terpisah.
        // dusun/nama_kelompok nullable di level kolom (bukan required) supaya
        // migrasi aman dijalankan di DB dev yang sudah ada baris seed lama;
        // "wajib diisi" ditegakkan di FormRequest, bukan di sini.
        Schema::table('kegiatan_kkns', function (Blueprint $table) {
            $table->dropUnique('kegiatan_kkns_tahun_unique');
            $table->string('dusun')->nullable()->after('tahun');
            $table->string('nama_kelompok')->nullable()->after('dusun');
        });

        Schema::table('kegiatan_kkns', function (Blueprint $table) {
            $table->unique(['tahun', 'dusun']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kegiatan_kkns', function (Blueprint $table) {
            $table->dropUnique(['tahun', 'dusun']);
            $table->dropColumn(['dusun', 'nama_kelompok']);
        });

        Schema::table('kegiatan_kkns', function (Blueprint $table) {
            $table->unique('tahun');
        });
    }
};
