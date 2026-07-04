<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisSampah extends Model
{
    protected $fillable = [
        'nama',
        'kategori',
        'satuan',
        'harga_per_satuan',
        'aktif',
    ];

    protected $casts = [
        'harga_per_satuan' => 'decimal:2',
        'aktif'            => 'boolean',
    ];

    public function detailSetorans()
    {
        return $this->hasMany(DetailSetoran::class, 'id_jenis_sampah');
    }
}
