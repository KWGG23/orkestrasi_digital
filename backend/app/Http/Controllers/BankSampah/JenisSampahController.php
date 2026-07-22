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

    // BSI belum punya API harga dinamis (masih manual lewat nota), jadi admin
    // bank sampah perlu bisa menambah jenis sampah baru sendiri -- bukan cuma
    // update harga dari daftar yang sudah di-seed dari nota lama.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:jenis_sampahs,nama',
            'kategori' => 'required|string|max:100',
            'satuan' => 'required|in:kg,pcs',
            'harga_per_satuan' => 'required|numeric|min:0',
            'aktif' => 'sometimes|boolean',
        ]);

        $jenis = JenisSampah::create($validated);

        return $this->success($jenis->fresh(), 'Jenis sampah berhasil ditambahkan', 201);
    }

    public function update(Request $request, string $id)
    {
        $jenis = JenisSampah::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255|unique:jenis_sampahs,nama,'.$jenis->id,
            'kategori' => 'sometimes|string|max:100',
            'satuan' => 'sometimes|in:kg,pcs',
            'harga_per_satuan' => 'required|numeric|min:0',
            'aktif' => 'sometimes|boolean',
        ]);

        $jenis->update($validated);

        return $this->success($jenis->fresh(), 'Jenis sampah berhasil diperbarui');
    }
}
