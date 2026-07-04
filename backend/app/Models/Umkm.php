<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Umkm extends Model
{
    protected $fillable = [
        'nama_usaha',
        'nama_pemilik',
        'dusun',
        'kategori',
        'deskripsi',
        'produk_utama',
        'kisaran_harga',
        'no_wa',
        'instagram',
        'jam_buka',
        'hari_buka',
        'metode_bayar',
        'platform_online',
        'punya_nib',
        'aktif',
        'lat',
        'lng',
        'foto_usaha',
        'foto_produk',
    ];

    protected $casts = [
        'produk_utama'    => 'array',
        'metode_bayar'    => 'array',
        'platform_online' => 'array',
        'foto_produk'     => 'array',
        'punya_nib'       => 'boolean',
        'aktif'           => 'boolean',
        'lat'             => 'decimal:8',
        'lng'             => 'decimal:8',
    ];
}
