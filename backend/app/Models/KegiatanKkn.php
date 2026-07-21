<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KegiatanKkn extends Model
{
    use HasFactory;

    protected $table = 'kegiatan_kkns';

    protected $fillable = [
        'tahun',
        'dusun',
        'nama_kelompok',
        'judul',
        'deskripsi',
        'foto',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'foto' => 'array',
    ];
}
