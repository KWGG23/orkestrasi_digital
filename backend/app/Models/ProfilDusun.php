<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilDusun extends Model
{
    use HasFactory;

    protected $fillable = [
        'dusun',
        'konten',
    ];

    protected $casts = [
        'konten' => 'array',
    ];
}
