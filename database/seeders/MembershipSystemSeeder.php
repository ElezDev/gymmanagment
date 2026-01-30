<?php

namespace Database\Seeders;

use App\Models\MembershipPlan;
use App\Models\Membership;
use App\Models\Payment;
use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MembershipSystemSeeder extends Seeder
{
    public function run(): void
    {
        // Crear planes de membresía
        $plans = [
            [
                'name' => 'Plan Básico Mensual',
                'description' => 'Acceso al gimnasio de lunes a viernes de 6am a 10pm',
                'price' => 29.99,
                'duration_days' => 30,
                'billing_cycle' => 'monthly',
                'features' => [
                    'Acceso a área de pesas',
                    'Acceso a cardio',
                    'Casilleros',
                    'Wi-Fi'
                ],
                'max_classes_per_week' => 3,
                'max_classes_per_month' => 12,
                'includes_nutrition_plan' => false,
                'includes_personal_training' => false,
                'personal_training_sessions' => 0,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Plan Premium Mensual',
                'description' => 'Acceso ilimitado 24/7 + Clases grupales ilimitadas',
                'price' => 49.99,
                'duration_days' => 30,
                'billing_cycle' => 'monthly',
                'features' => [
                    'Acceso 24/7',
                    'Clases grupales ilimitadas',
                    'Área de pesas y cardio',
                    'Sauna y duchas',
                    'Plan nutricional básico',
                    'Casilleros VIP',
                    'Wi-Fi premium'
                ],
                'max_classes_per_week' => null, // Ilimitado
                'max_classes_per_month' => null,
                'includes_nutrition_plan' => true,
                'includes_personal_training' => false,
                'personal_training_sessions' => 0,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Plan Elite Mensual',
                'description' => 'Todo incluido + Entrenamiento personalizado',
                'price' => 79.99,
                'duration_days' => 30,
                'billing_cycle' => 'monthly',
                'features' => [
                    'Acceso 24/7',
                    'Clases grupales ilimitadas',
                    '4 sesiones de entrenamiento personal',
                    'Plan nutricional personalizado',
                    'Análisis de composición corporal',
                    'Sauna, spa y duchas',
                    'Toalla incluida',
                    'Casillero privado',
                    'Bebidas energéticas',
                    'Wi-Fi premium'
                ],
                'max_classes_per_week' => null,
                'max_classes_per_month' => null,
                'includes_nutrition_plan' => true,
                'includes_personal_training' => true,
                'personal_training_sessions' => 4,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Plan Trimestral',
                'description' => 'Ahorra 15% - 3 meses de acceso completo',
                'price' => 127.49, // (49.99 * 3) - 15%
                'duration_days' => 90,
                'billing_cycle' => 'quarterly',
                'features' => [
                    'Acceso 24/7 por 3 meses',
                    'Clases grupales ilimitadas',
                    '15% de descuento',
                    'Evaluación física incluida',
                    'Plan nutricional',
                    'Todas las amenidades'
                ],
                'max_classes_per_week' => null,
                'max_classes_per_month' => null,
                'includes_nutrition_plan' => true,
                'includes_personal_training' => false,
                'personal_training_sessions' => 0,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Plan Anual',
                'description' => 'Ahorra 25% - Membresía anual',
                'price' => 449.99, // (49.99 * 12) - 25%
                'duration_days' => 365,
                'billing_cycle' => 'yearly',
                'features' => [
                    'Acceso 24/7 por 12 meses',
                    'Clases grupales ilimitadas',
                    '25% de descuento',
                    '2 sesiones de entrenamiento personal gratis',
                    'Evaluaciones físicas trimestrales',
                    'Plan nutricional personalizado',
                    'Invitaciones a eventos especiales',
                    'Todas las amenidades'
                ],
                'max_classes_per_week' => null,
                'max_classes_per_month' => null,
                'includes_nutrition_plan' => true,
                'includes_personal_training' => true,
                'personal_training_sessions' => 2,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Plan Día (Inactivo)',
                'description' => 'Pase de un día - Ya no disponible',
                'price' => 10.00,
                'duration_days' => 1,
                'billing_cycle' => 'daily',
                'features' => ['Acceso por 1 día'],
                'max_classes_per_week' => 0,
                'max_classes_per_month' => 0,
                'includes_nutrition_plan' => false,
                'includes_personal_training' => false,
                'personal_training_sessions' => 0,
                'is_active' => false, // Plan inactivo
                'sort_order' => 6,
            ],
        ];

        foreach ($plans as $planData) {
            MembershipPlan::create($planData);
        }

        $this->command->info('✅ Planes de membresía creados');

        // Asignar membresías a clientes existentes
        $clients = Client::all();
        if ($clients->count() === 0) {
            $this->command->warn('⚠️  No hay clientes en la base de datos para asignar membresías');
            return;
        }

        $admin = User::where('email', 'admin@gym.com')->first();
        $trainer = User::where('email', 'trainer@gym.com')->first();
        $staffUser = $admin ?? $trainer ?? User::first();

        if (!$staffUser) {
            $this->command->warn('⚠️  No hay usuarios de staff para registrar ventas');
            return;
        }

        $membershipPlans = MembershipPlan::active()->get();

        foreach ($clients as $index => $client) {
            // Asignar diferentes tipos de membresías
            $plan = $membershipPlans->get($index % $membershipPlans->count());
            
            // Algunos con membresías activas, otros vencidas, otros por vencer
            $scenarios = [
                ['days_ago' => 5, 'status' => 'active'],  // Activa, vence en 25 días
                ['days_ago' => 25, 'status' => 'active'], // Activa, vence en 5 días
                ['days_ago' => 35, 'status' => 'expired'], // Vencida hace 5 días
            ];

            $scenario = $scenarios[$index % count($scenarios)];
            $startDate = Carbon::now()->subDays($scenario['days_ago']);
            $endDate = $startDate->copy()->addDays($plan->duration_days);

            $membership = Membership::create([
                'client_id' => $client->id,
                'membership_plan_id' => $plan->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $scenario['status'],
                'amount_paid' => $plan->price,
                'discount_amount' => $index === 0 ? 5.00 : 0, // Primer cliente con descuento
                'discount_reason' => $index === 0 ? 'Cliente nuevo - descuento promocional' : null,
                'notes' => "Membresía {$plan->name} asignada automáticamente",
                'auto_renew' => $index % 2 === 0, // Algunos con auto-renovación
                'classes_used' => rand(0, 5),
                'training_sessions_used' => 0,
                'sold_by' => $staffUser->id,
            ]);

            // Crear registro de pago
            Payment::create([
                'client_id' => $client->id,
                'membership_id' => $membership->id,
                'payment_number' => Payment::generatePaymentNumber(),
                'amount' => $membership->amount_paid,
                'payment_method' => ['cash', 'card', 'transfer'][$index % 3],
                'status' => 'completed',
                'type' => 'membership',
                'description' => "Pago de {$plan->name}",
                'notes' => 'Pago inicial de membresía',
                'received_by' => $staffUser->id,
                'payment_date' => $startDate,
            ]);

            // Actualizar cliente con número de membresía
            $client->update([
                'membership_number' => Client::generateMembershipNumber(),
                'membership_status' => $scenario['status'],
                'membership_start' => $startDate,
                'membership_end' => $endDate,
            ]);
        }

        $this->command->info('✅ Membresías asignadas a clientes');
        $this->command->info('✅ Pagos registrados');
    }
}
