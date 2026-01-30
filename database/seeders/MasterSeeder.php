<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class MasterSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Este seeder ejecuta todos los demás en el orden correcto
     */
    public function run(): void
    {
        $this->command->info('');
        $this->command->info('🚀 Iniciando configuración completa del sistema...');
        $this->command->info('═══════════════════════════════════════════════════════');
        $this->command->info('');

        // 1. Roles y permisos (PRIMERO - base del sistema)
        $this->command->info('📋 Paso 1/6: Configurando roles y permisos...');
        $this->call(CompletePermissionsSeeder::class);
        $this->command->info('');

        // 2. Usuario administrador
        $this->command->info('👤 Paso 2/6: Creando usuario administrador...');
        $this->call(AdminUserSeeder::class);
        $this->command->info('');

        // 3. Ejercicios
        $this->command->info('💪 Paso 3/6: Cargando catálogo de ejercicios...');
        $this->call(GymExercisesSeeder::class);
        $this->command->info('');

        // 4. Datos de demostración (clientes, rutinas)
        $this->command->info('🎭 Paso 4/6: Creando datos de demostración...');
        $this->call(DemoSeeder::class);
        $this->command->info('');

        // 5. Sistema de membresías (planes y membresías activas)
        $this->command->info('💳 Paso 5/6: Configurando sistema de membresías...');
        $this->call(MembershipSystemSeeder::class);
        $this->command->info('');

        // 6. Sesiones de entrenamiento
        $this->command->info('📊 Paso 6/6: Generando sesiones de entrenamiento...');
        $this->call(WorkoutSessionsSeeder::class);
        $this->command->info('');

        $this->command->info('═══════════════════════════════════════════════════════');
        $this->command->info('✨ SISTEMA COMPLETAMENTE CONFIGURADO ✨');
        $this->command->info('');
        $this->command->info('📝 Credenciales de acceso:');
        $this->command->info('   ┌─────────────────────────────────────────┐');
        $this->command->info('   │ 👨‍💼 Administrador                       │');
        $this->command->info('   │    Email: admin@gym.com                 │');
        $this->command->info('   │    Password: password                   │');
        $this->command->info('   ├─────────────────────────────────────────┤');
        $this->command->info('   │ 👟 Entrenador                           │');
        $this->command->info('   │    Email: trainer@gym.com               │');
        $this->command->info('   │    Password: password                   │');
        $this->command->info('   ├─────────────────────────────────────────┤');
        $this->command->info('   │ 🏃 Cliente (con membresía activa)       │');
        $this->command->info('   │    Email: edwin@gmail.com               │');
        $this->command->info('   │    Password: password                   │');
        $this->command->info('   └─────────────────────────────────────────┘');
        $this->command->info('');
        $this->command->info('🎉 ¡Sistema listo para usar!');
        $this->command->info('');
    }
}
