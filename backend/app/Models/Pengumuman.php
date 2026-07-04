<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengumuman extends Model
{
    protected $table = 'pengumumans';

    protected $fillable = [
        'judul',
        'isi',
        'tanggal_publish',
        'aktif',
    ];

    protected $casts = [
        'tanggal_publish' => 'date',
        'aktif'           => 'boolean',
    ];
}
