<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_schedule_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->date('booking_date'); // Fecha específica de la clase
            $table->enum('status', ['reserved', 'confirmed', 'cancelled', 'attended', 'no_show'])->default('reserved');
            $table->timestamp('reserved_at');
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->boolean('is_waiting_list')->default(false); // Lista de espera
            $table->integer('waiting_position')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // No permitir duplicados (un cliente no puede reservar la misma clase dos veces)
            $table->unique(['class_schedule_id', 'client_id', 'booking_date'], 'unique_booking');
            
            // Índices
            $table->index('booking_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_bookings');
    }
};
