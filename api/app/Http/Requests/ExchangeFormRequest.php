<?php

namespace App\Http\Requests;

use App\Models\Exchange;
use Illuminate\Foundation\Http\FormRequest;

class ExchangeFormRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'currency_id_1' => 'required|exists:currencies,id',
            'currency_id_2' => [
                'required',
                'exists:currencies,id',
                'different:currency_id_1',
                function ($attribute, $value, $fail) {
                    $currencyId1 = $this->input('currency_id_1');

                    if (Exchange::where('currency_id_1', $currencyId1)
                        ->where('currency_id_2', $value)
                        ->exists()
                    ) {
                        $fail('The selected currencies combination already exists.');
                    }
                },
            ],
            'exchange_rate' => ['required', 'numeric', 'regex:/^\d{1,6}(\.\d{1,4})?$/',],
        ];
    }
}
