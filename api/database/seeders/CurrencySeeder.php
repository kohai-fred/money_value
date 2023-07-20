<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currencies = [
            ['name' => 'euro', 'code' => 'EUR'],
            ['name' => 'dollar americain', 'code' => 'USD'],
            ['name' => 'dollar canadien', 'code' => 'CAD'],
            ['name' => 'dong', 'code' => 'VND'],
            ['name' => 'florin', 'code' => 'HUF'],
            ['name' => 'franc cfa', 'code' => 'XAF'],
            ['name' => 'yen', 'code' => 'JPY'],
            ['name' => 'livre sterling', 'code' => 'GBP'],
            ['name' => 'baht', 'code' => 'THB'],
            ['name' => 'riel', 'code' => 'KHR'],
        ];

        foreach ($currencies as $currency) {
            Currency::create($currency);
        }
    }
}
