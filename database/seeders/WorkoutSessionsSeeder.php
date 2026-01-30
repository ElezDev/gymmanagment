<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\WorkoutSession;
use App\Models\WorkoutExerciseLog;
use Illuminate\Database\Seeder;

class WorkoutSessionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener el primer cliente con rutinas
        $client = Client::with('routines.routineExercises')->first();
        
        if (!$client || $client->routines->isEmpty()) {
            $this->command->warn('No hay clientes con rutinas asignadas. Ejecuta primero los seeders de clientes y rutinas.');
            return;
        }

        $routine = $client->routines->first();

        // Crear 3 sesiones de entrenamiento completadas en el pasado
        $dates = [
            now()->subDays(7),
            now()->subDays(4),
            now()->subDays(2),
        ];

        foreach ($dates as $index => $date) {
            $session = WorkoutSession::create([
                'client_id' => $client->id,
                'routine_id' => $routine->id,
                'started_at' => $date,
                'ended_at' => $date->copy()->addMinutes(rand(45, 75)),
                'duration_minutes' => rand(45, 75),
                'notes' => $this->getRandomNote($index),
                'completed' => true,
            ]);

            // Crear logs para cada ejercicio de la rutina
            foreach ($routine->routineExercises as $routineExercise) {
                $sets = $routineExercise->sets;
                $setDetails = [];

                for ($i = 1; $i <= $sets; $i++) {
                    $setDetails[] = [
                        'set' => $i,
                        'reps' => rand(8, 12),
                        'weight' => rand(10, 50),
                        'completed' => true,
                    ];
                }

                WorkoutExerciseLog::create([
                    'workout_session_id' => $session->id,
                    'exercise_id' => $routineExercise->exercise_id,
                    'order' => $routineExercise->order,
                    'sets_planned' => $sets,
                    'sets_completed' => $sets,
                    'set_details' => $setDetails,
                    'completed' => true,
                    'notes' => null,
                ]);
            }

            $this->command->info("Sesión de entrenamiento #{$session->id} creada para {$date->format('Y-m-d')}");
        }

        $this->command->info('✅ Sesiones de entrenamiento de ejemplo creadas exitosamente');
    }

    private function getRandomNote(int $index): ?string
    {
        $notes = [
            'Excelente sesión, buen progreso en todos los ejercicios',
            'Cliente reporta buena energía, aumentar peso la próxima sesión',
            'Sesión completa sin problemas, cliente motivado',
        ];

        return $notes[$index] ?? null;
    }
}
