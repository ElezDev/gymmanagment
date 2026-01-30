<?php

namespace Database\Seeders;

use App\Models\Routine;
use App\Models\Exercise;
use Illuminate\Database\Seeder;

class GymRoutinesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Rutina para Principiantes - Full Body
        $beginnerRoutine = Routine::create([
            'name' => 'Rutina Principiantes - Full Body',
            'description' => 'Rutina de cuerpo completo ideal para personas que están empezando en el gimnasio. 3 días por semana.',
            'is_active' => true,
            'start_date' => now(),
        ]);

        $beginnerExercises = [
            ['name' => 'Sentadilla con Barra', 'sets' => 3, 'reps' => 12, 'rest' => 90],
            ['name' => 'Press de Banca Plano', 'sets' => 3, 'reps' => 10, 'rest' => 90],
            ['name' => 'Remo con Barra', 'sets' => 3, 'reps' => 12, 'rest' => 90],
            ['name' => 'Press Militar', 'sets' => 3, 'reps' => 10, 'rest' => 90],
            ['name' => 'Curl de Bíceps con Barra', 'sets' => 3, 'reps' => 12, 'rest' => 60],
            ['name' => 'Plancha', 'sets' => 3, 'reps' => 30, 'rest' => 60],
        ];

        $this->attachExercisesToRoutine($beginnerRoutine, $beginnerExercises);

        // Rutina Push (Empuje)
        $pushRoutine = Routine::create([
            'name' => 'Rutina Push - Pecho, Hombros y Tríceps',
            'description' => 'Rutina enfocada en músculos de empuje. Ideal para rutina dividida.',
            'is_active' => true,
            'start_date' => now(),
        ]);

        $pushExercises = [
            ['name' => 'Press de Banca Plano', 'sets' => 4, 'reps' => 8, 'rest' => 120],
            ['name' => 'Press de Banca Inclinado', 'sets' => 3, 'reps' => 10, 'rest' => 90],
            ['name' => 'Aperturas con Mancuernas', 'sets' => 3, 'reps' => 12, 'rest' => 60],
            ['name' => 'Press Militar', 'sets' => 4, 'reps' => 8, 'rest' => 90],
            ['name' => 'Elevaciones Laterales', 'sets' => 3, 'reps' => 15, 'rest' => 60],
            ['name' => 'Press Francés', 'sets' => 3, 'reps' => 12, 'rest' => 60],
        ];

        $this->attachExercisesToRoutine($pushRoutine, $pushExercises);

        // Rutina Pull (Tirón)
        $pullRoutine = Routine::create([
            'name' => 'Rutina Pull - Espalda y Bíceps',
            'description' => 'Rutina enfocada en músculos de tirón. Complementa la rutina Push.',
            'is_active' => true,
            'start_date' => now(),
        ]);

        $pullExercises = [
            ['name' => 'Dominadas', 'sets' => 4, 'reps' => 8, 'rest' => 120],
            ['name' => 'Remo con Barra', 'sets' => 4, 'reps' => 8, 'rest' => 90],
            ['name' => 'Jalón al Pecho', 'sets' => 3, 'reps' => 10, 'rest' => 90],
            ['name' => 'Peso Muerto', 'sets' => 4, 'reps' => 6, 'rest' => 120],
            ['name' => 'Curl de Bíceps con Barra', 'sets' => 3, 'reps' => 12, 'rest' => 60],
            ['name' => 'Curl Martillo', 'sets' => 3, 'reps' => 12, 'rest' => 60],
        ];

        $this->attachExercisesToRoutine($pullRoutine, $pullExercises);

        // Rutina Legs (Piernas)
        $legsRoutine = Routine::create([
            'name' => 'Rutina Legs - Piernas Completo',
            'description' => 'Rutina intensiva de piernas. Incluye cuádriceps, femorales y glúteos.',
            'is_active' => true,
            'start_date' => now(),
        ]);

        $legsExercises = [
            ['name' => 'Sentadilla con Barra', 'sets' => 4, 'reps' => 8, 'rest' => 120],
            ['name' => 'Prensa de Piernas', 'sets' => 4, 'reps' => 12, 'rest' => 90],
            ['name' => 'Zancadas', 'sets' => 3, 'reps' => 12, 'rest' => 90],
            ['name' => 'Curl Femoral', 'sets' => 4, 'reps' => 12, 'rest' => 60],
            ['name' => 'Elevación de Piernas', 'sets' => 3, 'reps' => 15, 'rest' => 60],
        ];

        $this->attachExercisesToRoutine($legsRoutine, $legsExercises);

        // Rutina de Definición
        $cuttingRoutine = Routine::create([
            'name' => 'Rutina de Definición y Cardio',
            'description' => 'Rutina con enfoque en quemar grasa manteniendo masa muscular. Incluye cardio.',
            'is_active' => true,
            'start_date' => now(),
        ]);

        $cuttingExercises = [
            ['name' => 'Burpees', 'sets' => 4, 'reps' => 15, 'rest' => 45],
            ['name' => 'Sentadilla con Barra', 'sets' => 3, 'reps' => 15, 'rest' => 60],
            ['name' => 'Press de Banca Plano', 'sets' => 3, 'reps' => 12, 'rest' => 60],
            ['name' => 'Remo con Barra', 'sets' => 3, 'reps' => 12, 'rest' => 60],
            ['name' => 'Zancadas', 'sets' => 3, 'reps' => 15, 'rest' => 60],
            ['name' => 'Cinta de Correr', 'sets' => 1, 'reps' => 20, 'rest' => 0],
        ];

        $this->attachExercisesToRoutine($cuttingRoutine, $cuttingExercises);

        // Rutina de Fuerza
        $strengthRoutine = Routine::create([
            'name' => 'Rutina de Fuerza Avanzada',
            'description' => 'Rutina para aumentar fuerza máxima. Bajas repeticiones, alto peso.',
            'is_active' => true,
            'start_date' => now(),
        ]);

        $strengthExercises = [
            ['name' => 'Sentadilla con Barra', 'sets' => 5, 'reps' => 5, 'rest' => 180],
            ['name' => 'Press de Banca Plano', 'sets' => 5, 'reps' => 5, 'rest' => 180],
            ['name' => 'Peso Muerto', 'sets' => 5, 'reps' => 5, 'rest' => 180],
            ['name' => 'Press Militar', 'sets' => 4, 'reps' => 6, 'rest' => 150],
        ];

        $this->attachExercisesToRoutine($strengthRoutine, $strengthExercises);

        $this->command->info('Rutinas predefinidas creadas exitosamente!');
    }

    private function attachExercisesToRoutine(Routine $routine, array $exercises)
    {
        $order = 1;
        foreach ($exercises as $exerciseData) {
            $exercise = Exercise::where('name', $exerciseData['name'])->first();
            
            if ($exercise) {
                $routine->routineExercises()->create([
                    'exercise_id' => $exercise->id,
                    'order' => $order++,
                    'sets' => $exerciseData['sets'],
                    'reps' => $exerciseData['reps'],
                    'weight' => 0,
                    'rest_seconds' => $exerciseData['rest'],
                ]);
            }
        }
    }
}

