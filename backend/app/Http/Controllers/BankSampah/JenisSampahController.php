<?php

namespace App\Http\Controllers\BankSampah;

use App\Http\Controllers\Controller;
use App\Models\JenisSampah;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class JenisSampahController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $jenis = JenisSampah::where('aktif', true)
            ->orderBy('kategori')
            ->orderBy('nama')
            ->get();

        return $this->success($jenis);
    }

    public function update(Request $request, string $id)
    {
        $jenis = JenisSampah::findOrFail($id);

        $validated = $request->validate([
            'harga_per_satuan' => 'required|numeric|min:0',
            'aktif' => 'sometimes|boolean',
        ]);

        $jenis->update($validated);

        return $this->success($jenis, 'Harga berhasil diperbarui');
    }
}
