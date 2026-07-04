<?php

namespace App\Http\Requests\BankSampah;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreNasabahRequest extends FormRequest
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
            'nama'       => 'required|string|max:255',
            'no_anggota' => 'required|string|max:20|unique:nasabah,no_anggota',
            'alamat'     => 'nullable|string',
            'rt'         => 'nullable|string|max:5',
            'rw'         => 'nullable|string|max:5',
            'no_hp'      => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'no_anggota.unique' => 'No anggota sudah terdaftar.',
        ];
    }
}
