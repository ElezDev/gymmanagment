<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // membership_expiring, payment_received, class_reminder, etc.
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Datos adicionales en JSON
            $table->enum('channel', ['database', 'email', 'sms', 'push'])->default('database');
            $table->boolean('read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->boolean('sent')->default(false);
            $table->timestamps();
            
            // Índices
            $table->index('user_id');
            $table->index('read');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
