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
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gym.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create trainer user
        User::create([
            'name' => 'Entrenador Demo',
            'email' => 'trainer@gym.com',
            'password' => Hash::make('password'),
            'role' => 'trainer',
            'email_verified_at' => now(),
        ]);
    }
}
