<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Exercise;
use App\Models\Routine;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@gym.com'],
            [
                'name' => 'Admin GymApp',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // Create Trainer User
        $trainer = User::firstOrCreate(
            ['email' => 'trainer@gym.com'],
            [
                'name' => 'Carlos Trainer',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        if (!$trainer->hasRole('trainer')) {
            $trainer->assignRole('trainer');
        }

        // Create Client Users
        $clientUser1 = User::firstOrCreate(
            ['email' => 'juan@gym.com'],
            [
                'name' => 'Juan Pérez',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        if (!$clientUser1->hasRole('client')) {
            $clientUser1->assignRole('client');
        }

        $clientUser2 = User::firstOrCreate(
            ['email' => 'maria@gym.com'],
            [
                'name' => 'María García',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        if (!$clientUser2->hasRole('client')) {
            $clientUser2->assignRole('client');
        }

        // Create Client Profiles
        $client1 = Client::firstOrCreate(
            ['user_id' => $clientUser1->id],
            [
                'phone' => '555-0001',
                'birth_date' => '1990-05-15',
                'gender' => 'male',
                'height' => 175.5,
                'weight' => 70.0,
                'goals' => 'Ganar masa muscular y mejorar resistencia',
                'membership_start' => now(),
                'membership_end' => now()->addMonths(3),
                'is_active' => true,
            ]
        );

        $client2 = Client::firstOrCreate(
            ['user_id' => $clientUser2->id],
            [
                'phone' => '555-0002',
                'birth_date' => '1992-08-20',
                'gender' => 'female',
                'height' => 165.0,
                'weight' => 60.0,
                'goals' => 'Perder peso y tonificar',
                'membership_start' => now(),
                'membership_end' => now()->addMonths(6),
                'is_active' => true,
            ]
        );

        // Create Sample Exercises
        $exercises = [
            [
                'name' => 'Press de Banca',
                'description' => 'Ejercicio compuesto para pecho con barra',
                'category' => 'Fuerza',
                'muscle_group' => 'Pecho',
                'difficulty' => 'intermedio',
            ],
            [
                'name' => 'Sentadillas',
                'description' => 'Ejercicio compuesto para piernas con barra',
                'category' => 'Fuerza',
                'muscle_group' => 'Piernas',
                'difficulty' => 'intermedio',
            ],
            [
                'name' => 'Dominadas',
                'description' => 'Ejercicio para espalda en barra',
                'category' => 'Fuerza',
                'muscle_group' => 'Espalda',
                'difficulty' => 'avanzado',
            ],
            [
                'name' => 'Flexiones',
                'description' => 'Ejercicio de peso corporal para pecho',
                'category' => 'Fuerza',
                'muscle_group' => 'Pecho',
                'difficulty' => 'principiante',
            ],
            [
                'name' => 'Plancha',
                'description' => 'Ejercicio isométrico para core',
                'category' => 'Core',
                'muscle_group' => 'Abdomen',
                'difficulty' => 'principiante',
            ],
            [
                'name' => 'Burpees',
                'description' => 'Ejercicio cardiovascular completo',
                'category' => 'Cardio',
                'muscle_group' => 'Cuerpo completo',
                'difficulty' => 'intermedio',
            ],
        ];

        foreach ($exercises as $exerciseData) {
            Exercise::create($exerciseData);
        }

        // Create Sample Routine
        $routine = Routine::create([
            'name' => 'Rutina Full Body Principiante',
            'description' => 'Rutina completa para trabajar todo el cuerpo 3 veces por semana',
            'start_date' => now(),
            'end_date' => now()->addMonths(2),
            'is_active' => true,
        ]);

        // Add exercises to routine
        $routine->routineExercises()->create([
            'exercise_id' => 1, // Press de Banca
            'sets' => 3,
            'reps' => 10,
            'weight' => 40,
            'order' => 1,
            'rest_seconds' => 90,
        ]);

        $routine->routineExercises()->create([
            'exercise_id' => 2, // Sentadillas
            'sets' => 4,
            'reps' => 8,
            'weight' => 60,
            'order' => 2,
            'rest_seconds' => 120,
        ]);

        $routine->routineExercises()->create([
            'exercise_id' => 4, // Flexiones
            'sets' => 3,
            'reps' => 15,
            'order' => 3,
            'rest_seconds' => 60,
        ]);

        $routine->routineExercises()->create([
            'exercise_id' => 5, // Plancha
            'sets' => 3,
            'duration_seconds' => 45,
            'order' => 4,
            'rest_seconds' => 60,
        ]);

        // Assign routine to client
        $routine->clients()->attach($client1->id, [
            'assigned_date' => now(),
            'is_active' => true,
        ]);

        $this->command->info('✅ Datos de demostración creados exitosamente!');
        $this->command->info('');
        $this->command->info('👥 Usuarios creados:');
        $this->command->info('Admin: admin@gym.com / password');
        $this->command->info('Trainer: trainer@gym.com / password');
        $this->command->info('Cliente 1: juan@gym.com / password');
        $this->command->info('Cliente 2: maria@gym.com / password');
    }
}
