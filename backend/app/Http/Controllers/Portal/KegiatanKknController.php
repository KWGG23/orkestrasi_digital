<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\StoreKegiatanKknRequest;
use App\Http\Requests\Portal\UpdateKegiatanKknRequest;
use App\Models\KegiatanKkn;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class KegiatanKknController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $kegiatan = KegiatanKkn::orderBy('tahun', 'desc')->orderBy('dusun')->get();

        return $this->success($kegiatan->map(fn ($item) => $this->withFotoUrl($item)));
    }

    public function show(string $tahun, string $dusun)
    {
        $kegiatan = KegiatanKkn::where('tahun', $tahun)->where('dusun', $dusun)->first();

        if (! $kegiatan) {
            return $this->error("Dokumentasi kegiatan KKN dusun {$dusun} tahun {$tahun} belum tersedia.", 404);
        }

        return $this->success($this->withFotoUrl($kegiatan));
    }

    public function store(StoreKegiatanKknRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            $data['foto'] = collect($request->file('foto'))
                ->map(fn ($f) => $this->simpanFoto($f))
                ->values()
                ->all();
        }

        $kegiatan = KegiatanKkn::create($data);

        return $this->success($this->withFotoUrl($kegiatan->fresh()), 'Dokumentasi kegiatan KKN berhasil ditambahkan', 201);
    }

    public function update(UpdateKegiatanKknRequest $request, string $id)
    {
        $kegiatan = KegiatanKkn::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            foreach ((array) $kegiatan->foto as $lama) {
                $this->hapusFoto($lama);
            }
            $data['foto'] = collect($request->file('foto'))
                ->map(fn ($f) => $this->simpanFoto($f))
                ->values()
                ->all();
        }

        $kegiatan->update($data);

        return $this->success($this->withFotoUrl($kegiatan->fresh()), 'Dokumentasi kegiatan KKN berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        $kegiatan = KegiatanKkn::findOrFail($id);

        foreach ((array) $kegiatan->foto as $foto) {
            $this->hapusFoto($foto);
        }

        $kegiatan->delete();

        return $this->success(null, 'Dokumentasi kegiatan KKN berhasil dihapus');
    }

    // foto disimpan di DB sebagai path relatif -- lihat UmkmController::withFotoUrl
    // untuk alasan lengkap kenapa transform URL dilakukan di sini, bukan diserahkan
    // ke frontend untuk ditebak.
    private function withFotoUrl(KegiatanKkn $kegiatan): array
    {
        $data = $kegiatan->toArray();
        $data['foto'] = collect($kegiatan->foto)
            ->map(fn ($path) => Storage::disk('public')->url($path))
            ->values()
            ->all();

        return $data;
    }

    private function simpanFoto($file): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = uniqid('kegiatan_').'.'.$extension;
        $path = 'kegiatan-kkn/'.$filename;

        $image = Image::read($file);

        if ($image->width() > 1200) {
            $image->scale(width: 1200);
        }

        Storage::disk('public')->put($path, (string) $image->encodeByExtension($extension));

        return $path;
    }

    private function hapusFoto(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
