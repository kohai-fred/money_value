<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exchanges', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('currency_id_1');
            $table->unsignedBigInteger('currency_id_2');
            $table->decimal('exchange_rate', 10, 4);
            $table->timestamps();

            // Déclaration des clés étrangères
            $table->foreign('currency_id_1')->references('id')->on('currencies')->onDelete('cascade');
            $table->foreign('currency_id_2')->references('id')->on('currencies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exchanges');
    }
};
