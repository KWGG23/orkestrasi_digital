<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nasabah extends Model
{
    use HasFactory;

    protected $table = 'nasabah';

    protected $fillable = [
        'nama',
        'no_anggota',
        'alamat',
        'rt',
        'rw',
        'no_hp',
        'saldo_tabungan',
    ];

    protected $casts = [
        'saldo_tabungan' => 'decimal:2',
    ];

    public function setorans()
    {
        return $this->hasMany(Setoran::class, 'id_nasabah');
    }

    public function transaksiTabungans()
    {
        return $this->hasMany(TransaksiTabungan::class, 'id_nasabah');
    }
}
