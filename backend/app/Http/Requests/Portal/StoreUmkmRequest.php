<?php

namespace App\Http\Requests\Portal;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUmkmRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_usaha'        => 'required|string|max:255',
            'nama_pemilik'      => 'required|string|max:255',
            'dusun'             => 'required|in:karangasem,tegalwungu',
            'kategori'          => 'required|in:kuliner,kerajinan,pertanian,jasa,perdagangan',
            'deskripsi'         => 'nullable|string',
            'produk_utama'      => 'nullable|array',
            'produk_utama.*'    => 'string|max:100',
            'kisaran_harga'     => 'nullable|string|max:100',
            'no_wa'             => 'nullable|string|max:20',
            'instagram'         => 'nullable|string|max:100',
            'jam_buka'          => 'nullable|string|max:50',
            'hari_buka'         => 'nullable|string|max:100',
            'metode_bayar'      => 'nullable|array',
            'metode_bayar.*'    => 'string|max:50',
            'platform_online'   => 'nullable|array',
            'platform_online.*' => 'string|max:50',
            'punya_nib'         => 'sometimes|boolean',
            'aktif'             => 'sometimes|boolean',
            'lat'               => 'nullable|numeric|between:-90,90',
            'lng'               => 'nullable|numeric|between:-180,180',
            'foto_usaha'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'foto_produk'       => 'nullable|array|max:5',
            'foto_produk.*'     => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }
}
