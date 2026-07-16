<?php

namespace App\Http\Controllers\BankSampah;

use App\Http\Controllers\Controller;
use App\Http\Requests\BankSampah\StoreNasabahRequest;
use App\Models\Nasabah;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class NasabahController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Nasabah::query();

        if ($q = $request->q) {
            $query->where(function ($query) use ($q) {
                $query->where('nama', 'like', "%{$q}%")
                    ->orWhere('no_anggota', 'like', "%{$q}%");
            });
        }

        $nasabah = $query->orderBy('no_anggota')->paginate(20);

        return $this->success(
            $nasabah->items(),
            'OK',
            200,
            [
                'total' => $nasabah->total(),
                'page' => $nasabah->currentPage(),
                'last_page' => $nasabah->lastPage(),
                'per_page' => $nasabah->perPage(),
            ]
        );
    }

    public function store(StoreNasabahRequest $request)
    {
        $nasabah = Nasabah::create($request->validated());

        return $this->success($nasabah->fresh(), 'Nasabah berhasil ditambahkan', 201);
    }

    public function show(string $id)
    {
        $nasabah = Nasabah::with([
            'setorans' => fn ($q) => $q->latest('tanggal')->limit(10)->with('details.jenisSampah'),
        ])->findOrFail($id);

        return $this->success($nasabah);
    }
}
