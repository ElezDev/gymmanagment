<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@gym.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create trainer user
        $trainer = User::create([
            'name' => 'Entrenador Demo',
            'email' => 'trainer@gym.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $trainer->assignRole('trainer');
    }
}
