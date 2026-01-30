<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Seeder;

class GymExercisesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exercises = [
            // PECHO
            [
                'name' => 'Press de Banca Plano',
                'category' => 'Fuerza',
                'muscle_group' => 'Pecho',
                'difficulty' => 'Intermedio',
                'description' => 'Ejercicio fundamental para desarrollar el pecho',
            ],
            [
                'name' => 'Press de Banca Inclinado',
                'category' => 'Fuerza',
                'muscle_group' => 'Pecho',
                'difficulty' => 'Intermedio',
                'description' => 'Trabaja la parte superior del pecho',
            ],
            [
                'name' => 'Aperturas con Mancuernas',
                'category' => 'Fuerza',
                'muscle_group' => 'Pecho',
                'difficulty' => 'Principiante',
                'description' => 'Aislamiento del pecho',
            ],
            [
                'name' => 'Fondos en Paralelas',
                'category' => 'Fuerza',
                'muscle_group' => 'Pecho',
                'difficulty' => 'Avanzado',
                'description' => 'Ejercicio compuesto para pecho inferior y tríceps',
            ],
            
            // ESPALDA
            [
                'name' => 'Dominadas',
                'category' => 'Fuerza',
                'muscle_group' => 'Espalda',
                'difficulty' => 'Avanzado',
                'description' => 'Ejercicio rey para la espalda',
            ],
            [
                'name' => 'Remo con Barra',
                'category' => 'Fuerza',
                'muscle_group' => 'Espalda',
                'difficulty' => 'Intermedio',
                'description' => 'Desarrolla el grosor de la espalda',
            ],
            [
                'name' => 'Peso Muerto',
                'category' => 'Fuerza',
                'muscle_group' => 'Espalda',
                'difficulty' => 'Avanzado',
                'description' => 'Ejercicio compuesto fundamental',
            ],
            [
                'name' => 'Jalón al Pecho',
                'category' => 'Fuerza',
                'muscle_group' => 'Espalda',
                'difficulty' => 'Principiante',
                'description' => 'Alternativa a las dominadas',
            ],
            
            // PIERNAS
            [
                'name' => 'Sentadilla con Barra',
                'category' => 'Fuerza',
                'muscle_group' => 'Piernas',
                'difficulty' => 'Intermedio',
                'description' => 'El rey de los ejercicios de piernas',
            ],
            [
                'name' => 'Prensa de Piernas',
                'category' => 'Fuerza',
                'muscle_group' => 'Piernas',
                'difficulty' => 'Principiante',
                'description' => 'Ejercicio seguro para cuádriceps',
            ],
            [
                'name' => 'Zancadas',
                'category' => 'Fuerza',
                'muscle_group' => 'Piernas',
                'difficulty' => 'Principiante',
                'description' => 'Trabaja piernas y glúteos',
            ],
            [
                'name' => 'Curl Femoral',
                'category' => 'Fuerza',
                'muscle_group' => 'Piernas',
                'difficulty' => 'Principiante',
                'description' => 'Aislamiento de femorales',
            ],
            
            // HOMBROS
            [
                'name' => 'Press Militar',
                'category' => 'Fuerza',
                'muscle_group' => 'Hombros',
                'difficulty' => 'Intermedio',
                'description' => 'Ejercicio principal para hombros',
            ],
            [
                'name' => 'Elevaciones Laterales',
                'category' => 'Fuerza',
                'muscle_group' => 'Hombros',
                'difficulty' => 'Principiante',
                'description' => 'Trabaja el deltoides lateral',
            ],
            [
                'name' => 'Pájaros',
                'category' => 'Fuerza',
                'muscle_group' => 'Hombros',
                'difficulty' => 'Principiante',
                'description' => 'Para deltoides posterior',
            ],
            
            // BRAZOS
            [
                'name' => 'Curl de Bíceps con Barra',
                'category' => 'Fuerza',
                'muscle_group' => 'Brazos',
                'difficulty' => 'Principiante',
                'description' => 'Ejercicio básico de bíceps',
            ],
            [
                'name' => 'Press Francés',
                'category' => 'Fuerza',
                'muscle_group' => 'Brazos',
                'difficulty' => 'Intermedio',
                'description' => 'Aislamiento de tríceps',
            ],
            [
                'name' => 'Curl Martillo',
                'category' => 'Fuerza',
                'muscle_group' => 'Brazos',
                'difficulty' => 'Principiante',
                'description' => 'Trabaja bíceps y antebrazos',
            ],
            
            // CORE
            [
                'name' => 'Plancha',
                'category' => 'Core',
                'muscle_group' => 'Abdomen',
                'difficulty' => 'Principiante',
                'description' => 'Fortalece todo el core',
            ],
            [
                'name' => 'Abdominales Crunch',
                'category' => 'Core',
                'muscle_group' => 'Abdomen',
                'difficulty' => 'Principiante',
                'description' => 'Ejercicio básico de abdomen',
            ],
            [
                'name' => 'Elevación de Piernas',
                'category' => 'Core',
                'muscle_group' => 'Abdomen',
                'difficulty' => 'Intermedio',
                'description' => 'Trabaja el abdomen inferior',
            ],
            
            // CARDIO
            [
                'name' => 'Cinta de Correr',
                'category' => 'Cardio',
                'muscle_group' => 'Cuerpo completo',
                'difficulty' => 'Principiante',
                'description' => 'Ejercicio cardiovascular',
            ],
            [
                'name' => 'Bicicleta Estática',
                'category' => 'Cardio',
                'muscle_group' => 'Piernas',
                'difficulty' => 'Principiante',
                'description' => 'Cardio de bajo impacto',
            ],
            [
                'name' => 'Burpees',
                'category' => 'Cardio',
                'muscle_group' => 'Cuerpo completo',
                'difficulty' => 'Avanzado',
                'description' => 'Ejercicio de alta intensidad',
            ],
        ];

        foreach ($exercises as $exercise) {
            Exercise::create($exercise);
        }

        $this->command->info('Ejercicios creados exitosamente!');
    }
}

