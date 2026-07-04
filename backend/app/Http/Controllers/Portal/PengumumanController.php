<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use App\Traits\ApiResponse;

class PengumumanController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $pengumuman = Pengumuman::where('aktif', true)
            ->orderBy('tanggal_publish', 'desc')
            ->get();

        return $this->success($pengumuman);
    }
}
