<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->timestamp('check_in_time');
            $table->timestamp('check_out_time')->nullable();
            $table->integer('duration_minutes')->nullable(); // Calculado automáticamente
            $table->enum('entry_method', ['manual', 'card', 'qr', 'biometric'])->default('manual');
            $table->text('notes')->nullable();
            $table->foreignId('registered_by')->nullable()->constrained('users'); // Staff que registró
            $table->timestamps();
            
            // Índices
            $table->index('client_id');
            $table->index('check_in_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_ins');
    }
};
