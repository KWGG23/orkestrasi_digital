<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BankSampah\JenisSampahController;
use App\Http\Controllers\BankSampah\LaporanController;
use App\Http\Controllers\BankSampah\NasabahController;
use App\Http\Controllers\BankSampah\SetoranController;
use App\Http\Controllers\BankSampah\TabunganController;
use App\Http\Controllers\Portal\KegiatanKknController;
use App\Http\Controllers\Portal\LayerController;
use App\Http\Controllers\Portal\PengumumanController;
use App\Http\Controllers\Portal\ProfilDusunController;
use App\Http\Controllers\Portal\UmkmController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── Auth ─────────────────────────────────────────────────────────────────
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
    });

    // ── Bank Sampah ─────────────────────────────────────────────────────────

    // Jenis sampah — list publik, update admin only
    Route::get('jenis-sampah', [JenisSampahController::class, 'index']);

    // Nasabah — pencarian & detail publik (self-service saldo), input nasabah admin only
    Route::get('nasabah', [NasabahController::class, 'index']);
    Route::get('nasabah/{id}', [NasabahController::class, 'show']);

    // Setoran — detail & PDF publik, input setoran admin only
    Route::get('setoran/{id}', [SetoranController::class, 'show']);
    Route::get('setoran/{id}/pdf', [SetoranController::class, 'pdf']);

    // Tabungan — riwayat publik (self-service saldo), tarik tabungan admin only
    Route::get('tabungan/{nasabahId}', [TabunganController::class, 'show']);

    // Admin-only routes (Sanctum) — aksi pengurus, bukan self-service warga
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('nasabah', [NasabahController::class, 'store']);
        Route::post('setoran', [SetoranController::class, 'store']);
        Route::post('tabungan/tarik', [TabunganController::class, 'tarik']);
        Route::put('jenis-sampah/{id}', [JenisSampahController::class, 'update']);
        Route::get('laporan/harian', [LaporanController::class, 'harian']);
        Route::get('laporan/bulanan', [LaporanController::class, 'bulanan']);
        Route::get('laporan/export', [LaporanController::class, 'export']);
    });

    // ── Portal Desa ──────────────────────────────────────────────────────────

    // UMKM — list & detail publik
    Route::get('umkm', [UmkmController::class, 'index']);
    Route::get('umkm/{id}', [UmkmController::class, 'show']);

    // GeoJSON layers
    Route::get('layers/admin', [LayerController::class, 'admin']);
    Route::get('layers/fasilitas', [LayerController::class, 'fasilitas']);

    // Profil dusun & pengumuman
    Route::get('profil/{dusun}', [ProfilDusunController::class, 'show']);
    Route::get('pengumuman', [PengumumanController::class, 'index']);

    // Kegiatan KKN — dokumentasi per tahun, publik
    Route::get('kegiatan-kkn', [KegiatanKknController::class, 'index']);
    Route::get('kegiatan-kkn/{tahun}', [KegiatanKknController::class, 'show']);

    // Admin-only Portal (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('umkm', [UmkmController::class, 'store']);
        Route::put('umkm/{id}', [UmkmController::class, 'update']);
        Route::delete('umkm/{id}', [UmkmController::class, 'destroy']);
        Route::put('profil/{dusun}', [ProfilDusunController::class, 'update']);
        Route::post('pengumuman', [PengumumanController::class, 'store']);
        Route::put('pengumuman/{id}', [PengumumanController::class, 'update']);
        Route::delete('pengumuman/{id}', [PengumumanController::class, 'destroy']);
    });
});
