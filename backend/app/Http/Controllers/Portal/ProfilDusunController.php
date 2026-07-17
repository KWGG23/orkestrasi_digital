<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\UpdateProfilDusunRequest;
use App\Models\ProfilDusun;
use App\Traits\ApiResponse;

class ProfilDusunController extends Controller
{
    use ApiResponse;

    public function show(string $dusun)
    {
        if (! $this->isDusunValid($dusun)) {
            return $this->error('Dusun tidak valid. Gunakan karangasem atau blongkeng.', 404);
        }

        $profil = ProfilDusun::where('dusun', $dusun)->first();

        if (! $profil) {
            return $this->success([
                'dusun' => $dusun,
                'konten' => null,
            ], 'Profil belum tersedia');
        }

        return $this->success($profil);
    }

    public function update(UpdateProfilDusunRequest $request, string $dusun)
    {
        if (! $this->isDusunValid($dusun)) {
            return $this->error('Dusun tidak valid. Gunakan karangasem atau blongkeng.', 404);
        }

        $profil = ProfilDusun::updateOrCreate(
            ['dusun' => $dusun],
            ['konten' => $request->validated('konten')]
        );

        return $this->success($profil, 'Profil dusun berhasil disimpan');
    }

    private function isDusunValid(string $dusun): bool
    {
        return in_array($dusun, ['karangasem', 'blongkeng']);
    }
}
