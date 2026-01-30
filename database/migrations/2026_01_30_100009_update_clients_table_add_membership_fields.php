<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            // Solo agregar columnas si no existen
            if (!Schema::hasColumn('clients', 'emergency_contact_name')) {
                $table->string('emergency_contact_name')->nullable()->after('goals');
            }
            if (!Schema::hasColumn('clients', 'emergency_contact_phone')) {
                $table->string('emergency_contact_phone')->nullable()->after('goals');
            }
            if (!Schema::hasColumn('clients', 'membership_number')) {
                $table->string('membership_number')->unique()->nullable()->after('id');
            }
            if (!Schema::hasColumn('clients', 'membership_status')) {
                $table->enum('membership_status', ['active', 'expired', 'suspended', 'none'])->default('none')->after('membership_end');
            }
            if (!Schema::hasColumn('clients', 'suspension_reason')) {
                $table->text('suspension_reason')->nullable()->after('membership_status');
            }
            if (!Schema::hasColumn('clients', 'suspended_at')) {
                $table->timestamp('suspended_at')->nullable()->after('suspension_reason');
            }
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $columns = ['emergency_contact_name', 'emergency_contact_phone', 'membership_number', 'membership_status', 'suspension_reason', 'suspended_at'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('clients', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
