<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Dashboard
            'view dashboard',
            
            // Clients
            'view clients',
            'create clients',
            'edit clients',
            'delete clients',
            'view own client data',
            
            // Exercises
            'view exercises',
            'create exercises',
            'edit exercises',
            'delete exercises',
            
            // Routines
            'view routines',
            'create routines',
            'edit routines',
            'delete routines',
            'assign routines',
            'view own routines',
            
            // Progress
            'view all progress',
            'view own progress',
            'add progress',
            
            // Workout Sessions
            'view all sessions',
            'view own sessions',
            'create sessions',
            
            // Users
            'manage users',
            'manage roles',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Admin role - full access
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // Trainer role - can manage clients, routines, exercises
        $trainer = Role::create(['name' => 'trainer']);
        $trainer->givePermissionTo([
            'view dashboard',
            'view clients',
            'create clients',
            'edit clients',
            'view exercises',
            'create exercises',
            'edit exercises',
            'view routines',
            'create routines',
            'edit routines',
            'assign routines',
            'view all progress',
            'add progress',
            'view all sessions',
            'create sessions',
        ]);

        // Client role - can only view their own data
        $client = Role::create(['name' => 'client']);
        $client->givePermissionTo([
            'view dashboard',
            'view own client data',
            'view own routines',
            'view own progress',
            'view own sessions',
            'add progress',
            'create sessions',
        ]);
    }
}
