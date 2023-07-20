<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\Exchange;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExchangeSeeder extends Seeder
{
    public function run(): void
    {
        $currencies = Currency::all();

        $numberOfEntries = 10;
        $entriesCount = 0;

        foreach ($currencies as $currency1) {
            foreach ($currencies as $currency2) {
                if ($currency1->id !== $currency2->id && $entriesCount < $numberOfEntries) {
                    $exchangeRate = mt_rand(100, 1000) / 100; // Montant aléatoire entre 1.00 et 10.00
                    $exchangeRate = trim($exchangeRate, 0);
                    Exchange::create([
                        'currency_id_1' => $currency1->id,
                        'currency_id_2' => $currency2->id,
                        'exchange_rate' => $exchangeRate,
                    ]);

                    // Créer l'exchange inverse
                    $exchangeRateInverse = 1 / $exchangeRate;
                    $exchangeRateInverse = trim($exchangeRateInverse, 0);
                    Exchange::create([
                        'currency_id_1' => $currency2->id,
                        'currency_id_2' => $currency1->id,
                        'exchange_rate' => $exchangeRateInverse,
                    ]);

                    $entriesCount += 2;
                }
            }
        }
    }
}
