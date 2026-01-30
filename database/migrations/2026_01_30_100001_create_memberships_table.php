<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('membership_plan_id')->constrained()->onDelete('restrict');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'expired', 'suspended', 'cancelled'])->default('active');
            $table->decimal('amount_paid', 10, 2); // Monto pagado (puede tener descuento)
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('discount_reason')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('auto_renew')->default(false);
            $table->integer('classes_used')->default(0); // Clases utilizadas
            $table->integer('training_sessions_used')->default(0); // Sesiones de entrenamiento usadas
            $table->foreignId('sold_by')->nullable()->constrained('users'); // Usuario que vendió
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->timestamps();
            
            // Índices para búsquedas rápidas
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};
