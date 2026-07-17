<?php

namespace App\Http\Requests\Portal;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePengumumanRequest extends FormRequest
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
            'judul' => 'sometimes|string|max:255',
            'isi' => 'sometimes|string',
            'tanggal_publish' => 'sometimes|date',
            'aktif' => 'sometimes|boolean',
        ];
    }
}
