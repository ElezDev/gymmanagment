<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('membership_id')->nullable()->constrained()->onDelete('set null');
            $table->string('payment_number')->unique(); // Número de factura/recibo
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['cash', 'card', 'transfer', 'check', 'online']);
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('completed');
            $table->enum('type', ['membership', 'product', 'service', 'penalty', 'other'])->default('membership');
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->string('transaction_reference')->nullable(); // Referencia bancaria/online
            $table->foreignId('received_by')->constrained('users'); // Usuario que recibió el pago
            $table->timestamp('payment_date');
            $table->timestamp('refunded_at')->nullable();
            $table->decimal('refund_amount', 10, 2)->nullable();
            $table->string('refund_reason')->nullable();
            $table->timestamps();
            
            // Índices
            $table->index('payment_date');
            $table->index('status');
            $table->index('payment_method');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
