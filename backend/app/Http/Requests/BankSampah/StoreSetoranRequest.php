<?php

namespace App\Http\Requests\BankSampah;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSetoranRequest extends FormRequest
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
            'id_nasabah'              => 'required|exists:nasabah,id',
            'tanggal'                 => 'required|date',
            'metode'                  => 'required|in:tunai,tabung,tukar_barang',
            'catatan'                 => 'nullable|string|max:500',
            'items'                   => 'required|array|min:1',
            'items.*.id_jenis_sampah' => 'required|exists:jenis_sampahs,id',
            'items.*.berat_kg'        => 'required|numeric|min:0.001',
        ];
    }
}
