<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiTabungan extends Model
{
    protected $fillable = [
        'id_nasabah',
        'id_setoran',
        'jenis',
        'jumlah',
        'saldo_sesudah',
        'keterangan',
        'tanggal',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
        'saldo_sesudah' => 'decimal:2',
        'tanggal' => 'date',
    ];

    public function nasabah()
    {
        return $this->belongsTo(Nasabah::class, 'id_nasabah');
    }

    public function setoran()
    {
        return $this->belongsTo(Setoran::class, 'id_setoran');
    }
}
