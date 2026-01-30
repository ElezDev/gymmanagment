<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\RoutineController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkoutSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
    
    // Shared workout exercise update (both trainers and clients can update exercises)
    Route::put('workout-sessions/exercises/{exerciseLog}', [WorkoutSessionController::class, 'updateExercise'])->name('workout-sessions.update-exercise');
    Route::put('my-workout-sessions/exercises/{exerciseLog}', [WorkoutSessionController::class, 'updateExercise'])->name('my-workout-sessions.update-exercise');

    // Clients routes
    Route::middleware('can:view clients')->group(function () {
        Route::resource('clients', ClientController::class);
        
        // Workout Sessions Management
        Route::post('workout-sessions/start', [WorkoutSessionController::class, 'start'])->name('workout-sessions.start');
        Route::get('workout-sessions/{workoutSession}/active', [WorkoutSessionController::class, 'active'])->name('workout-sessions.active');
        Route::post('workout-sessions/{workoutSession}/complete', [WorkoutSessionController::class, 'complete'])->name('workout-sessions.complete');
        Route::get('clients/{client}/workout-history', [WorkoutSessionController::class, 'history'])->name('clients.workout-history');
        Route::get('workout-sessions/{workoutSession}', [WorkoutSessionController::class, 'show'])->name('workout-sessions.show');
    });

    // Clients can view their own data
    Route::middleware('can:view own client data')->group(function () {
        Route::get('my-profile', function () {
            $client = auth()->user()->client;
            if (!$client) {
                return redirect()->route('dashboard');
            }
            
            $client->load([
                'user',
                'routines' => function ($query) {
                    $query->orderBy('start_date', 'desc');
                },
                'progressLogs' => function ($query) {
                    $query->orderBy('log_date', 'desc')->take(10);
                },
                'workoutSessions' => function ($query) {
                    $query->with('routine')->orderBy('started_at', 'desc')->take(10);
                },
            ]);

            return Inertia::render('clients/show', [
                'client' => $client,
            ]);
        })->name('my-profile');
    });

    // Exercises routes
    Route::middleware('can:view exercises')->group(function () {
        Route::resource('exercises', ExerciseController::class);
    });

    // Routines routes
    Route::middleware('can:view routines')->group(function () {
        Route::resource('routines', RoutineController::class);
        
        Route::post('routines/{routine}/assign', [RoutineController::class, 'assignToClient'])
            ->name('routines.assign')
            ->middleware('can:assign routines');
            
        Route::delete('routines/{routine}/clients/{client}', [RoutineController::class, 'unassignFromClient'])
            ->name('routines.unassign')
            ->middleware('can:assign routines');
    });

    // Roles and Permissions management (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::resource('users', UserController::class);
    });

    // Clients can view their own routines
    Route::middleware('can:view own routines')->group(function () {
        Route::get('my-routines', function () {
            $client = auth()->user()->client;
            if (!$client) {
                return Inertia::render('routines/no-routines');
            }
            $routines = $client->routines()
                ->wherePivot('is_active', true)
                ->where('routines.is_active', true)
                ->with('routineExercises.exercise')
                ->get();
            return Inertia::render('routines/my-routines', ['routines' => $routines]);
        })->name('my-routines');
        
        // Workout Sessions for Clients
        Route::post('my-workout-sessions/start', [WorkoutSessionController::class, 'startOwn'])->name('my-workout-sessions.start');
        Route::get('my-workout-sessions/{workoutSession}/active', [WorkoutSessionController::class, 'activeOwn'])->name('my-workout-sessions.active');
        Route::post('my-workout-sessions/{workoutSession}/complete', [WorkoutSessionController::class, 'completeOwn'])->name('my-workout-sessions.complete');
        Route::get('my-workout-history', [WorkoutSessionController::class, 'historyOwn'])->name('my-workout-history');
        Route::get('my-workout-sessions/{workoutSession}', [WorkoutSessionController::class, 'showOwn'])->name('my-workout-sessions.show');

        Route::get('my-progress', function () {
            $client = auth()->user()->client;
            if (!$client) {
                return redirect()->route('dashboard');
            }
            $progressLogs = $client->progressLogs()
                ->latest('log_date')
                ->get();
            return Inertia::render('progress/my-progress', [
                'progress_logs' => $progressLogs,
                'client' => $client->only(['weight', 'height']),
            ]);
        })->name('my-progress');

        Route::post('my-progress', function () {
            $client = auth()->user()->client;
            if (!$client) {
                return redirect()->route('dashboard');
            }
            
            $validated = request()->validate([
                'weight' => 'required|numeric|min:20|max:300',
                'body_fat_percentage' => 'nullable|numeric|min:0|max:100',
                'muscle_mass' => 'nullable|numeric|min:0|max:200',
                'notes' => 'nullable|string|max:500',
            ]);

            $client->progressLogs()->create([
                'log_date' => now(),
                'weight' => $validated['weight'],
                'body_fat_percentage' => $validated['body_fat_percentage'] ?? null,
                'muscle_mass' => $validated['muscle_mass'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            return redirect()->route('my-progress')->with('success', 'Medición registrada exitosamente');
        })->name('my-progress.store');

        // Iniciar entrenamiento
        Route::post('workout-sessions/start', function () {
            $client = auth()->user()->client;
            if (!$client) {
                return redirect()->route('dashboard');
            }

            $validated = request()->validate([
                'routine_id' => 'required|exists:routines,id',
            ]);

            // Verificar que la rutina esté asignada al cliente
            $hasRoutine = $client->routines()->where('routine_id', $validated['routine_id'])->exists();
            if (!$hasRoutine) {
                return back()->with('error', 'No tienes acceso a esta rutina');
            }

            $session = $client->workoutSessions()->create([
                'routine_id' => $validated['routine_id'],
                'started_at' => now(),
                'completed' => false,
            ]);

            return redirect()->route('workout-session.active', $session->id)->with('success', '¡Entrenamiento iniciado!');
        })->name('workout-session.start');

        // Completar entrenamiento
        Route::post('workout-sessions/{session}/complete', function ($sessionId) {
            $client = auth()->user()->client;
            if (!$client) {
                return redirect()->route('dashboard');
            }

            $session = \App\Models\WorkoutSession::where('id', $sessionId)
                ->where('client_id', $client->id)
                ->firstOrFail();

            $validated = request()->validate([
                'notes' => 'nullable|string|max:1000',
            ]);

            $session->update([
                'ended_at' => now(),
                'completed' => true,
                'duration_minutes' => now()->diffInMinutes($session->started_at),
                'notes' => $validated['notes'] ?? null,
            ]);

            return redirect()->route('my-routines')->with('success', '¡Entrenamiento completado! 💪');
        })->name('workout-session.complete');

        // Ver sesión de entrenamiento activa
        Route::get('workout-sessions/{session}', function ($sessionId) {
            $client = auth()->user()->client;
            if (!$client) {
                return redirect()->route('dashboard');
            }

            $session = \App\Models\WorkoutSession::with(['routine.routineExercises.exercise'])
                ->where('id', $sessionId)
                ->where('client_id', $client->id)
                ->firstOrFail();

            return Inertia::render('workouts/active-session', [
                'session' => $session,
            ]);
        })->name('workout-session.active');
    });
});

require __DIR__.'/settings.php';
