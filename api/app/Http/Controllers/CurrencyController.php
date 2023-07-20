<?php

namespace App\Http\Controllers;

use App\Http\Requests\CurrencyFormRequest;
use App\Http\Requests\UpdateCurrencyFormRequest;
use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Currency::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CurrencyFormRequest $request)
    {
        $validatedData = $request->validated();
        $currency = Currency::create($validatedData);
        return Currency::all();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCurrencyFormRequest $request, Currency $currency)
    {
        $validatedData = $request->validated();
        $currency->update($validatedData);
        return Currency::all();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Currency $currency)
    {
        $currency->delete();
        return Currency::all();
    }
}
