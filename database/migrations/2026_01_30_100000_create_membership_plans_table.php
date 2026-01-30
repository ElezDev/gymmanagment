<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Mensual, Trimestral, Anual, etc.
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2); // Precio del plan
            $table->integer('duration_days'); // Duración en días (30, 90, 365)
            $table->enum('billing_cycle', ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);
            $table->json('features')->nullable(); // Características del plan (JSON)
            $table->integer('max_classes_per_week')->nullable(); // Límite de clases semanales
            $table->integer('max_classes_per_month')->nullable(); // Límite de clases mensuales
            $table->boolean('includes_nutrition_plan')->default(false);
            $table->boolean('includes_personal_training')->default(false);
            $table->integer('personal_training_sessions')->default(0); // Sesiones incluidas
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0); // Para ordenar en la UI
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_plans');
    }
};
