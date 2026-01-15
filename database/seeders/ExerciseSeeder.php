<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exercise;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        $exercises = [
            // Pecho
            [
                'name' => 'Press de Banca',
                'description' => 'Ejercicio fundamental para desarrollar el pecho',
                'category' => 'Fuerza',
                'muscle_group' => 'Pecho',
                'difficulty' => 'intermedio',
            ],
            [
                'name' => 'Flexiones',
                'description' => 'Ejercicio de peso corporal para pecho y tríceps',
                'category' => 'Fuerza',
                'muscle_group' => 'Pecho',
                'difficulty' => 'principiante',
            ],
            // Espalda
            [
                'name' => 'Dominadas',
                'description' => 'Ejercicio de peso corporal para espalda y bíceps',
                'category' => 'Fuerza',
                'muscle_group' => 'Espalda',
                'difficulty' => 'intermedio',
            ],
            [
                'name' => 'Remo con Barra',
                'description' => 'Ejercicio para desarrollar la espalda media',
                'category' => 'Fuerza',
                'muscle_group' => 'Espalda',
                'difficulty' => 'intermedio',
            ],
            // Piernas
            [
                'name' => 'Sentadillas',
                'description' => 'Ejercicio fundamental para piernas',
                'category' => 'Fuerza',
                'muscle_group' => 'Piernas',
                'difficulty' => 'intermedio',
            ],
            [
                'name' => 'Peso Muerto',
                'description' => 'Ejercicio compuesto para piernas y espalda baja',
                'category' => 'Fuerza',
                'muscle_group' => 'Piernas',
                'difficulty' => 'avanzado',
            ],
            [
                'name' => 'Zancadas',
                'description' => 'Ejercicio unilateral para piernas',
                'category' => 'Fuerza',
                'muscle_group' => 'Piernas',
                'difficulty' => 'principiante',
            ],
            // Hombros
            [
                'name' => 'Press Militar',
                'description' => 'Ejercicio para desarrollar los hombros',
                'category' => 'Fuerza',
                'muscle_group' => 'Hombros',
                'difficulty' => 'intermedio',
            ],
            [
                'name' => 'Elevaciones Laterales',
                'description' => 'Aislamiento para hombros laterales',
                'category' => 'Fuerza',
                'muscle_group' => 'Hombros',
                'difficulty' => 'principiante',
            ],
            // Brazos
            [
                'name' => 'Curl de Bíceps',
                'description' => 'Ejercicio de aislamiento para bíceps',
                'category' => 'Fuerza',
                'muscle_group' => 'Brazos',
                'difficulty' => 'principiante',
            ],
            [
                'name' => 'Extensiones de Tríceps',
                'description' => 'Ejercicio de aislamiento para tríceps',
                'category' => 'Fuerza',
                'muscle_group' => 'Brazos',
                'difficulty' => 'principiante',
            ],
            // Cardio
            [
                'name' => 'Carrera',
                'description' => 'Ejercicio cardiovascular de impacto',
                'category' => 'Cardio',
                'muscle_group' => 'Todo el cuerpo',
                'difficulty' => 'principiante',
            ],
            [
                'name' => 'Bicicleta Estática',
                'description' => 'Ejercicio cardiovascular de bajo impacto',
                'category' => 'Cardio',
                'muscle_group' => 'Piernas',
                'difficulty' => 'principiante',
            ],
            [
                'name' => 'Burpees',
                'description' => 'Ejercicio cardiovascular de alta intensidad',
                'category' => 'Cardio',
                'muscle_group' => 'Todo el cuerpo',
                'difficulty' => 'avanzado',
            ],
            // Core
            [
                'name' => 'Plancha',
                'description' => 'Ejercicio isométrico para core',
                'category' => 'Core',
                'muscle_group' => 'Abdominales',
                'difficulty' => 'principiante',
            ],
            [
                'name' => 'Abdominales',
                'description' => 'Ejercicio básico para abdominales',
                'category' => 'Core',
                'muscle_group' => 'Abdominales',
                'difficulty' => 'principiante',
            ],
        ];

        foreach ($exercises as $exercise) {
            Exercise::create($exercise);
        }
    }
}
