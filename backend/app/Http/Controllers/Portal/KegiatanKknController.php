<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\KegiatanKkn;
use App\Traits\ApiResponse;

class KegiatanKknController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $kegiatan = KegiatanKkn::orderBy('tahun', 'desc')->get();

        return $this->success($kegiatan);
    }

    public function show(string $tahun)
    {
        $kegiatan = KegiatanKkn::where('tahun', $tahun)->first();

        if (! $kegiatan) {
            return $this->error("Dokumentasi kegiatan KKN tahun {$tahun} belum tersedia.", 404);
        }

        return $this->success($kegiatan);
    }
}
