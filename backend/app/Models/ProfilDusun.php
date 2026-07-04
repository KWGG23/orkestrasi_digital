<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilDusun extends Model
{
    protected $fillable = [
        'dusun',
        'konten',
    ];

    protected $casts = [
        'konten' => 'array',
    ];
}
