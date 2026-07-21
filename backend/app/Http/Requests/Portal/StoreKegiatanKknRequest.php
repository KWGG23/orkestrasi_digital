<?php

namespace App\Http\Requests\Portal;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKegiatanKknRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tahun' => ['required', 'integer', 'min:2000', 'max:2100'],
            'dusun' => [
                'required',
                'in:karangasem,blongkeng',
                Rule::unique('kegiatan_kkns')->where(fn ($query) => $query->where('tahun', $this->tahun)),
            ],
            'nama_kelompok' => 'required|string|max:255',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|array|max:10',
            'foto.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'dusun.unique' => 'Dokumentasi untuk tahun dan dusun ini sudah ada.',
        ];
    }
}
