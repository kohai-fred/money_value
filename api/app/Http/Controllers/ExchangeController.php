<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExchangeFormRequest;
use App\Models\Exchange;
use Illuminate\Http\Request;

class ExchangeController extends Controller
{
    public function index()
    {
        return Exchange::all();
    }

    public function store(ExchangeFormRequest $request)
    {
        $data = $request->validated();

        Exchange::create($data);

        return Exchange::all();
    }

    public function update(ExchangeFormRequest $request, Exchange $exchange)
    {
        $data = $request->validated();

        $exchange->update($data);

        return Exchange::all();
    }

    public function destroy(Exchange $exchange)
    {
        $exchange->delete();

        return Exchange::all();
    }
}
