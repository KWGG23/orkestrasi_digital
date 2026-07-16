<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\StorePengumumanRequest;
use App\Http\Requests\Portal\UpdatePengumumanRequest;
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

    public function store(StorePengumumanRequest $request)
    {
        $pengumuman = Pengumuman::create($request->validated());

        return $this->success($pengumuman->fresh(), 'Pengumuman berhasil ditambahkan', 201);
    }

    public function update(UpdatePengumumanRequest $request, string $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->update($request->validated());

        return $this->success($pengumuman->fresh(), 'Pengumuman berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->delete();

        return $this->success(null, 'Pengumuman berhasil dihapus');
    }
}
