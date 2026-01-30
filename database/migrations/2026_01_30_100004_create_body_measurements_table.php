<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('body_measurements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->date('measurement_date');
            $table->decimal('weight', 5, 2)->nullable(); // kg
            $table->decimal('height', 5, 2)->nullable(); // cm
            $table->decimal('body_fat_percentage', 5, 2)->nullable(); // %
            $table->decimal('muscle_mass', 5, 2)->nullable(); // kg
            $table->decimal('bmi', 5, 2)->nullable(); // Índice de masa corporal
            
            // Circunferencias en cm
            $table->decimal('neck', 5, 2)->nullable();
            $table->decimal('chest', 5, 2)->nullable();
            $table->decimal('waist', 5, 2)->nullable();
            $table->decimal('hips', 5, 2)->nullable();
            $table->decimal('right_arm', 5, 2)->nullable();
            $table->decimal('left_arm', 5, 2)->nullable();
            $table->decimal('right_thigh', 5, 2)->nullable();
            $table->decimal('left_thigh', 5, 2)->nullable();
            $table->decimal('right_calf', 5, 2)->nullable();
            $table->decimal('left_calf', 5, 2)->nullable();
            
            $table->text('notes')->nullable();
            $table->string('photo_front')->nullable(); // Foto frontal
            $table->string('photo_side')->nullable(); // Foto lateral
            $table->string('photo_back')->nullable(); // Foto trasera
            $table->foreignId('measured_by')->constrained('users'); // Entrenador
            $table->timestamps();
            
            // Índices
            $table->index('client_id');
            $table->index('measurement_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('body_measurements');
    }
};
