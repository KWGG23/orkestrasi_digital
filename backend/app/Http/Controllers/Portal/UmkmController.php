<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\StoreUmkmRequest;
use App\Http\Requests\Portal\UpdateUmkmRequest;
use App\Models\Umkm;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class UmkmController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Umkm::where('aktif', true);

        if ($dusun = $request->dusun) {
            $query->where('dusun', $dusun);
        }

        if ($kategori = $request->kategori) {
            $query->where('kategori', $kategori);
        }

        if ($q = $request->q) {
            $query->where(function ($query) use ($q) {
                $query->where('nama_usaha', 'like', "%{$q}%")
                    ->orWhere('nama_pemilik', 'like', "%{$q}%")
                    ->orWhere('deskripsi', 'like', "%{$q}%");
            });
        }

        $umkm = $query->orderBy('nama_usaha')->paginate(20);

        return $this->success(
            $umkm->items(),
            'OK',
            200,
            [
                'total' => $umkm->total(),
                'page' => $umkm->currentPage(),
                'last_page' => $umkm->lastPage(),
            ]
        );
    }

    public function show(string $id)
    {
        $umkm = Umkm::findOrFail($id);

        return $this->success($umkm);
    }

    public function store(StoreUmkmRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('foto_usaha')) {
            $data['foto_usaha'] = $this->simpanFoto($request->file('foto_usaha'));
        }

        if ($request->hasFile('foto_produk')) {
            $data['foto_produk'] = collect($request->file('foto_produk'))
                ->map(fn ($f) => $this->simpanFoto($f))
                ->values()
                ->all();
        }

        $umkm = Umkm::create($data);

        return $this->success($umkm->fresh(), 'UMKM berhasil ditambahkan', 201);
    }

    public function update(UpdateUmkmRequest $request, string $id)
    {
        $umkm = Umkm::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('foto_usaha')) {
            $this->hapusFoto($umkm->foto_usaha);
            $data['foto_usaha'] = $this->simpanFoto($request->file('foto_usaha'));
        }

        if ($request->hasFile('foto_produk')) {
            foreach ((array) $umkm->foto_produk as $lama) {
                $this->hapusFoto($lama);
            }
            $data['foto_produk'] = collect($request->file('foto_produk'))
                ->map(fn ($f) => $this->simpanFoto($f))
                ->values()
                ->all();
        }

        $umkm->update($data);

        return $this->success($umkm->fresh(), 'UMKM berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        $umkm = Umkm::findOrFail($id);

        $this->hapusFoto($umkm->foto_usaha);
        foreach ((array) $umkm->foto_produk as $foto) {
            $this->hapusFoto($foto);
        }

        $umkm->delete();

        return $this->success(null, 'UMKM berhasil dihapus');
    }

    private function simpanFoto($file): string
    {
        $filename = uniqid('umkm_').'.'.$file->getClientOriginalExtension();
        $path = storage_path('app/public/umkm/'.$filename);

        $image = Image::read($file);

        if ($image->width() > 800) {
            $image->scale(width: 800);
        }

        $image->save($path);

        return 'umkm/'.$filename;
    }

    private function hapusFoto(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
