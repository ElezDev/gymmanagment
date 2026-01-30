<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UpdatePermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Nuevos permisos para el sistema completo

        $permissions = [
            // Membresías
            'view membership plans',
            'create membership plans',
            'edit membership plans',
            'delete membership plans',
            'view memberships',
            'create memberships',
            'renew memberships',
            'cancel memberships',
            'suspend memberships',
            
            // Pagos
            'view payments',
            'create payments',
            'refund payments',
            'view payment reports',
            
            // Check-ins
            'view check-ins',
            'create check-ins',
            'manage check-ins',
            
            // Mediciones
            'view body measurements',
            'create body measurements',
            'edit body measurements',
            'delete body measurements',
            
            // Clases
            'view class schedules',
            'create class schedules',
            'edit class schedules',
            'delete class schedules',
            'view class bookings',
            'create class bookings',
            'manage class bookings',
            'mark class attendance',
            
            // Nutrición
            'view nutrition plans',
            'create nutrition plans',
            'edit nutrition plans',
            'delete nutrition plans',
            'view own nutrition plan',
            
            // Notificaciones
            'send notifications',
            'view all notifications',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $this->command->info('✅ Permisos creados');

        // Asignar permisos a roles
        $admin = Role::findByName('admin');
        $trainer = Role::findByName('trainer');
        $client = Role::findByName('client');

        // Admin tiene TODOS los permisos
        $admin->syncPermissions(Permission::all());

        // Trainer tiene permisos de gestión (menos administración)
        $trainerPermissions = [
            // Clientes
            'view clients',
            'create clients',
            'edit clients',
            'delete clients',
            
            // Ejercicios y rutinas
            'view exercises',
            'create exercises',
            'edit exercises',
            'delete exercises',
            'view routines',
            'create routines',
            'edit routines',
            'delete routines',
            'assign routines',
            
            // Membresías
            'view membership plans',
            'create membership plans',
            'edit membership plans',
            'view memberships',
            'create memberships',
            'renew memberships',
            'cancel memberships',
            'suspend memberships',
            
            // Pagos
            'view payments',
            'create payments',
            'refund payments',
            'view payment reports',
            
            // Check-ins
            'view check-ins',
            'create check-ins',
            'manage check-ins',
            
            // Mediciones
            'view body measurements',
            'create body measurements',
            'edit body measurements',
            'delete body measurements',
            
            // Clases
            'view class schedules',
            'create class schedules',
            'edit class schedules',
            'delete class schedules',
            'view class bookings',
            'create class bookings',
            'manage class bookings',
            'mark class attendance',
            
            // Nutrición
            'view nutrition plans',
            'create nutrition plans',
            'edit nutrition plans',
            'delete nutrition plans',
            
            // Notificaciones
            'send notifications',
        ];
        
        // Solo sincronizar permisos que existen
        $existingTrainerPermissions = Permission::whereIn('name', $trainerPermissions)->pluck('name')->toArray();
        $trainer->syncPermissions($existingTrainerPermissions);

        // Cliente solo ve sus datos
        $clientPermissions = [
            'view dashboard',
            'view own client data',
            'view own routines',
            'view own nutrition plan',
        ];
        
        $existingClientPermissions = Permission::whereIn('name', $clientPermissions)->pluck('name')->toArray();
        $client->syncPermissions($existingClientPermissions);

        $this->command->info('✅ Permisos asignados a roles');
        $this->command->info('');
        $this->command->info('📋 Resumen de permisos:');
        $this->command->info("   Admin: " . $admin->permissions->count() . " permisos");
        $this->command->info("   Trainer: " . $trainer->permissions->count() . " permisos");
        $this->command->info("   Client: " . $client->permissions->count() . " permisos");
    }
}
