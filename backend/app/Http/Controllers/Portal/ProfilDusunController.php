<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\ProfilDusun;
use App\Traits\ApiResponse;

class ProfilDusunController extends Controller
{
    use ApiResponse;

    public function show(string $dusun)
    {
        if (! in_array($dusun, ['karangasem', 'tegalwungu'])) {
            return $this->error('Dusun tidak valid. Gunakan karangasem atau tegalwungu.', 404);
        }

        $profil = ProfilDusun::where('dusun', $dusun)->first();

        if (! $profil) {
            return $this->success([
                'dusun'  => $dusun,
                'konten' => null,
            ], 'Profil belum tersedia');
        }

        return $this->success($profil);
    }
}
