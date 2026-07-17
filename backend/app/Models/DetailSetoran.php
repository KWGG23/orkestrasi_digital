<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailSetoran extends Model
{
    protected $fillable = [
        'id_setoran',
        'id_jenis_sampah',
        'berat_kg',
        'harga_satuan',
        'subtotal',
    ];

    protected $casts = [
        'berat_kg' => 'decimal:3',
        'harga_satuan' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function setoran()
    {
        return $this->belongsTo(Setoran::class, 'id_setoran');
    }

    public function jenisSampah()
    {
        return $this->belongsTo(JenisSampah::class, 'id_jenis_sampah');
    }
}
