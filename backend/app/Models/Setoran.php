<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setoran extends Model
{
    protected $fillable = [
        'no_nota',
        'id_nasabah',
        'tanggal',
        'total_harga',
        'metode',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'total_harga' => 'decimal:2',
    ];

    public function nasabah()
    {
        return $this->belongsTo(Nasabah::class, 'id_nasabah');
    }

    public function details()
    {
        return $this->hasMany(DetailSetoran::class, 'id_setoran');
    }

    public function transaksiTabungan()
    {
        return $this->hasOne(TransaksiTabungan::class, 'id_setoran');
    }
}
