<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class CompletePermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $this->command->info('🔄 Limpiando permisos anteriores...');

        // Crear todos los permisos
        $permissions = [
            // Dashboard
            'view dashboard',
            
            // Clientes
            'view clients',
            'create clients',
            'edit clients',
            'delete clients',
            'view own client data',
            
            // Ejercicios
            'view exercises',
            'create exercises',
            'edit exercises',
            'delete exercises',
            
            // Rutinas
            'view routines',
            'create routines',
            'edit routines',
            'delete routines',
            'assign routines',
            'view own routines',
            
            // Progreso
            'view all progress',
            'view own progress',
            'add progress',
            
            // Sesiones de entrenamiento
            'view all sessions',
            'view own sessions',
            'create sessions',
            
            // Usuarios
            'manage users',
            'manage roles',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'assign roles',
            
            // Roles y permisos
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
            
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
            
            // Mediciones corporales
            'view body-measurements',
            'create body-measurements',
            'edit body-measurements',
            'delete body-measurements',
            'view own body-measurements',
            
            // Clases
            'view class-schedules',
            'create class-schedules',
            'edit class-schedules',
            'delete class-schedules',
            'view class-bookings',
            'create class-bookings',
            'manage class-bookings',
            'mark class-attendance',
            'view own class-bookings',
            
            // Nutrición
            'view nutrition-plans',
            'create nutrition-plans',
            'edit nutrition-plans',
            'delete nutrition-plans',
            'view own nutrition-plan',
            
            // Notificaciones
            'send notifications',
            'view all notifications',
        ];

        $this->command->info('📝 Creando permisos...');
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        $this->command->info('✅ ' . count($permissions) . ' permisos creados');

        // Crear/actualizar roles
        $this->command->info('');
        $this->command->info('👥 Creando roles...');

        // ADMIN - Acceso total
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());
        $this->command->info('✅ Admin: ' . $admin->permissions->count() . ' permisos');

        // TRAINER - Gestión del gimnasio (sin administración de sistema)
        $trainer = Role::firstOrCreate(['name' => 'trainer']);
        $trainerPermissions = [
            'view dashboard',
            // Clientes
            'view clients',
            'create clients',
            'edit clients',
            'delete clients',
            // Ejercicios
            'view exercises',
            'create exercises',
            'edit exercises',
            'delete exercises',
            // Rutinas
            'view routines',
            'create routines',
            'edit routines',
            'delete routines',
            'assign routines',
            // Progreso
            'view all progress',
            'add progress',
            // Sesiones
            'view all sessions',
            'create sessions',
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
            'view body-measurements',
            'create body-measurements',
            'edit body-measurements',
            'delete body-measurements',
            // Clases
            'view class-schedules',
            'create class-schedules',
            'edit class-schedules',
            'delete class-schedules',
            'view class-bookings',
            'create class-bookings',
            'manage class-bookings',
            'mark class-attendance',
            // Nutrición
            'view nutrition-plans',
            'create nutrition-plans',
            'edit nutrition-plans',
            'delete nutrition-plans',
            // Notificaciones
            'send notifications',
        ];
        $trainer->syncPermissions($trainerPermissions);
        $this->command->info('✅ Trainer: ' . $trainer->permissions->count() . ' permisos');

        // CLIENT - Solo ver sus propios datos
        $client = Role::firstOrCreate(['name' => 'client']);
        $clientPermissions = [
            'view dashboard',
            'view own client data',
            'view own routines',
            'view own progress',
            'view own sessions',
            'add progress',
            'create sessions',
            'view own body-measurements',
            'view own class-bookings',
            'create class-bookings',
            'view own nutrition-plan',
        ];
        $client->syncPermissions($clientPermissions);
        $this->command->info('✅ Client: ' . $client->permissions->count() . ' permisos');

        // Asignar roles a usuarios existentes si no tienen
        $this->command->info('');
        $this->command->info('🔗 Asignando roles a usuarios...');
        
        $users = User::all();
        foreach ($users as $user) {
            if (!$user->hasAnyRole(['admin', 'trainer', 'client'])) {
                // Si el email contiene 'admin', asignar admin
                if (str_contains($user->email, 'admin')) {
                    $user->assignRole('admin');
                    $this->command->info("   ✅ {$user->email} → admin");
                } 
                // Si tiene clientes asociados, es trainer
                elseif ($user->client()->exists()) {
                    $user->assignRole('client');
                    $this->command->info("   ✅ {$user->email} → client");
                } 
                // Por defecto, trainer
                else {
                    $user->assignRole('trainer');
                    $this->command->info("   ✅ {$user->email} → trainer");
                }
            } else {
                $this->command->info("   ℹ️  {$user->email} ya tiene rol: " . $user->roles->pluck('name')->implode(', '));
            }
        }

        $this->command->info('');
        $this->command->info('✨ Permisos configurados exitosamente!');
        $this->command->info('');
        $this->command->info('📊 Resumen:');
        $this->command->info('   • Total permisos: ' . Permission::count());
        $this->command->info('   • Total roles: ' . Role::count());
        $this->command->info('   • Total usuarios: ' . User::count());
    }
}
