<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExchangeFormRequest;
use App\Models\Exchange;
use Illuminate\Http\Request;

class ExchangeController extends Controller
{
    public function index()
    {
        return Exchange::with('currency1', 'currency2')->get();
    }

    public function store(ExchangeFormRequest $request)
    {
        $data = $request->validated();

        Exchange::create($data);

        return Exchange::with('currency1', 'currency2')->get();
    }

    public function update(ExchangeFormRequest $request, Exchange $exchange)
    {
        $data = $request->validated();

        $exchange->update($data);

        return Exchange::with('currency1', 'currency2')->get();
    }

    public function destroy(Exchange $exchange)
    {
        $exchange->delete();

        return Exchange::with('currency1', 'currency2')->get();
    }
}
