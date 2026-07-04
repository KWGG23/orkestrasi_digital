<?php

namespace App\Http\Requests\BankSampah;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TarikTabunganRequest extends FormRequest
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
            'id_nasabah' => 'required|exists:nasabah,id',
            'jumlah'     => 'required|numeric|min:1000',
            'keterangan' => 'nullable|string|max:255',
        ];
    }
}
