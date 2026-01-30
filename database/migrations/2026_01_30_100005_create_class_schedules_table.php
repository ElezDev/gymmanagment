<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Spinning, Yoga, CrossFit, etc.
            $table->text('description')->nullable();
            $table->foreignId('instructor_id')->constrained('users'); // Entrenador
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('max_capacity'); // Capacidad máxima
            $table->integer('duration_minutes'); // Duración en minutos
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->string('room_location')->nullable(); // Sala/ubicación
            $table->boolean('is_active')->default(true);
            $table->boolean('requires_reservation')->default(true);
            $table->integer('cancel_hours_before')->default(2); // Horas mínimas para cancelar
            $table->timestamps();
            
            // Índices
            $table->index('day_of_week');
            $table->index('start_time');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_schedules');
    }
};
