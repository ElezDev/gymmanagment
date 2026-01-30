<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nutrition_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Plan de pérdida de peso, Ganancia muscular, etc.
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Objetivos calóricos y macros
            $table->integer('daily_calories_target')->nullable();
            $table->integer('protein_grams')->nullable();
            $table->integer('carbs_grams')->nullable();
            $table->integer('fats_grams')->nullable();
            $table->integer('meals_per_day')->default(5);
            $table->decimal('water_liters')->default(2.0);
            
            $table->json('meal_plan')->nullable(); // Plan de comidas en JSON
            $table->json('supplements')->nullable(); // Suplementos recomendados
            $table->text('restrictions')->nullable(); // Alergias, restricciones
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users'); // Nutricionista/Trainer
            $table->timestamps();
            
            // Índices
            $table->index('client_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nutrition_plans');
    }
};
