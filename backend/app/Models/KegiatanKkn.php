<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KegiatanKkn extends Model
{
    protected $table = 'kegiatan_kkns';

    protected $fillable = [
        'tahun',
        'judul',
        'deskripsi',
        'foto',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'foto' => 'array',
    ];
}
