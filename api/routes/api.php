<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\ExchangeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('currencies', [CurrencyController::class, 'index'])->name("currencies");

Route::post('login', [AuthController::class, 'authenticate'])->name('login');

Route::get('pairs', [ExchangeController::class, 'index'])->name("pairs");

Route::prefix('dashboard')->middleware('auth:sanctum')->name('dashboard.')->group(function () {
    Route::resource('currencies', CurrencyController::class)->except(['show', 'create', 'edit']);
    Route::resource('exchanges', ExchangeController::class)->except(['show', 'create', 'edit']);
    Route::get('exchanges/all_pairs', [ExchangeController::class, 'generateAllPossiblePairs'])->name('all_pairs');
    Route::get('exchanges/available_pairs', [ExchangeController::class, 'filterCompletedPairs'])->name('available_pairs');
});

Route::get('/{code_iso_1}/{code_iso_2}/{amount}', [ExchangeController::class, 'calculateAmount'])->name('calculateAmount');
