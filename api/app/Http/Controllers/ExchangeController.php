<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExchangeFormRequest;
use App\Models\Currency;
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

    public function generateAllPossiblePairs()
    {
        // Générer les paires possibles en combinant toutes les devises disponibles
        $currencies = Currency::all();
        $possiblePairs = [];

        foreach ($currencies as $currency1) {
            foreach ($currencies as $currency2) {
                if ($currency1->id !== $currency2->id) {
                    $pair = $currency1->id . '-' . $currency2->id;
                    $possiblePairs[$pair] = [
                        'currency_1' => [
                            'id' => $currency1->id,
                            'name' => $currency1->name,
                            'code' => $currency1->code,
                        ],
                        'currency_2' => [
                            'id' => $currency2->id,
                            'name' => $currency2->name,
                            'code' => $currency2->code,
                        ],

                    ];
                }
            }
        }

        return array_values($possiblePairs);
    }

    public function filterCompletedPairs()
    {
        $exchanges = Exchange::all();
        $possiblePairs = $this->generateAllPossiblePairs();

        $completedPairs = $exchanges->map(function ($exchange) {
            return $exchange->currency_id_1 . '-' . $exchange->currency_id_2;
        })->toArray();

        // Filtrer les paires possibles pour ne garder que celles qui n'ont pas encore été effectuées
        $availablePairs = array_filter($possiblePairs, function ($pair) use ($completedPairs) {
            $pairKey1 = $pair['currency_1']['id'] . '-' . $pair['currency_2']['id'];
            $pairKey2 = $pair['currency_2']['id'] . '-' . $pair['currency_1']['id'];
            return !in_array($pairKey1, $completedPairs) && !in_array($pairKey2, $completedPairs);
        });

        return array_values($availablePairs);
    }
}
