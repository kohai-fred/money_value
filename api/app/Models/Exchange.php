<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exchange extends Model
{
    use HasFactory;

    protected $fillable = ['currency_id_1', 'currency_id_2', 'exchange_rate'];

    public function currency1()
    {
        return $this->belongsTo(Currency::class, 'currency_id_1');
    }

    public function currency2()
    {
        return $this->belongsTo(Currency::class, 'currency_id_2');
    }
}
