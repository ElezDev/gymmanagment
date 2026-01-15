<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Exercise;
use App\Models\Routine;
use App\Models\User;
use App\Models\WorkoutSession;
use App\Models\ProgressLog;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        if ($user->hasRole('client')) {
            return $this->clientDashboard($user);
        }

        return $this->adminDashboard($user);
    }

    private function adminDashboard($user): Response
    {
        $stats = [
            'total_clients' => Client::where('is_active', true)->count(),
            'total_exercises' => Exercise::count(),
            'total_routines' => Routine::where('is_active', true)->count(),
            'total_users' => User::count(),
            'active_clients_today' => WorkoutSession::whereDate('created_at', today())->distinct('client_id')->count('client_id'),
            'new_clients_this_month' => Client::whereMonth('created_at', now()->month)->count(),
        ];

        // Monthly data for charts
        $monthlyData = DB::table('clients')
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%b") as month'),
                DB::raw('COUNT(*) as clients')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy(DB::raw('DATE_FORMAT(created_at, "%m")'))
            ->get();

        $recentClients = Client::with('user')
            ->latest()
            ->take(5)
            ->get();

        $activeRoutines = Routine::where('is_active', true)
            ->withCount('clients')
            ->latest()
            ->take(5)
            ->get();

        $expiringMemberships = Client::with('user')
            ->where('is_active', true)
            ->whereNotNull('membership_end')
            ->whereBetween('membership_end', [now(), now()->addDays(30)])
            ->orderBy('membership_end')
            ->take(10)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'monthlyData' => $monthlyData,
            'recentClients' => $recentClients,
            'activeRoutines' => $activeRoutines,
            'expiringMemberships' => $expiringMemberships,
        ]);
    }

    private function clientDashboard($user): Response
    {
        $client = $user->client;

        if (!$client) {
            return Inertia::render('dashboard/no-client');
        }

        $client->load([
            'routines' => fn($q) => $q->wherePivot('is_active', true)
                ->where('routines.is_active', true)
                ->with('routineExercises.exercise'),
            'progressLogs' => fn($q) => $q->latest()->take(10),
            'workoutSessions' => fn($q) => $q->latest()->take(10)->with('routine'),
            'achievements' => fn($q) => $q->latest()->take(5),
            'notes' => fn($q) => $q->latest()->take(5),
            'supplements' => fn($q) => $q->where('is_active', true),
        ]);

        // Calcular estadísticas de consistencia
        $last30DaysWorkouts = WorkoutSession::where('client_id', $client->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->where('completed', true)
            ->count();

        $last7DaysWorkouts = WorkoutSession::where('client_id', $client->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->where('completed', true)
            ->count();

        // Calcular progreso de peso
        $firstWeight = ProgressLog::where('client_id', $client->id)
            ->oldest()
            ->value('weight');
        
        $lastWeight = ProgressLog::where('client_id', $client->id)
            ->latest()
            ->value('weight');

        $weightChange = $firstWeight && $lastWeight ? $lastWeight - $firstWeight : null;

        // Próximo entrenamiento sugerido
        $lastWorkout = WorkoutSession::where('client_id', $client->id)
            ->where('completed', true)
            ->latest('ended_at')
            ->first();

        $stats = [
            'active_routines' => $client->routines()->wherePivot('is_active', true)->count(),
            'total_workouts' => $client->workoutSessions()->count(),
            'achievements' => $client->achievements()->count(),
            'days_until_expiry' => $client->membership_end 
                ? now()->diffInDays($client->membership_end, false) 
                : null,
            'workouts_this_month' => $last30DaysWorkouts,
            'workouts_this_week' => $last7DaysWorkouts,
            'consistency_rate' => $last30DaysWorkouts > 0 ? round(($last30DaysWorkouts / 30) * 100) : 0,
            'weight_change' => $weightChange,
            'last_workout_date' => $lastWorkout ? $lastWorkout->ended_at : null,
        ];

        return Inertia::render('dashboard/client', [
            'client' => $client,
            'stats' => $stats,
        ]);
    }
}
