<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class AssignRole extends Command
{
    protected $signature = 'user:assign-role {email} {role}';
    protected $description = 'Assign a role to a user';

    public function handle(): int
    {
        $email = $this->argument('email');
        $roleName = $this->argument('role');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("Usuario con email {$email} no encontrado.");
            return 1;
        }

        $role = Role::where('name', $roleName)->first();

        if (!$role) {
            $this->error("Rol {$roleName} no encontrado.");
            $this->info("Roles disponibles: " . Role::pluck('name')->implode(', '));
            return 1;
        }

        $user->assignRole($role);

        $this->info("Rol {$roleName} asignado exitosamente al usuario {$user->name}.");
        return 0;
    }
}
