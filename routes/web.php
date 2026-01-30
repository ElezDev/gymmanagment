<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\RoutineController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkoutSessionController;
use App\Http\Controllers\MembershipPlanController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\BodyMeasurementController;
use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\ClassBookingController;
use App\Http\Controllers\NutritionPlanController;
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

    // Membership Plans (Admin/Trainer)
    Route::middleware('can:view clients')->group(function () {
        Route::resource('membership-plans', MembershipPlanController::class);
        Route::get('membership-plans/active/list', [MembershipPlanController::class, 'active'])->name('membership-plans.active');
    });

    // Memberships (Admin/Trainer)
    Route::middleware('can:view clients')->group(function () {
        Route::get('memberships/expiring', [MembershipController::class, 'expiring'])->name('memberships.expiring');
        Route::resource('memberships', MembershipController::class)->except(['edit', 'update', 'destroy']);
        Route::get('memberships/{membership}/renew', [MembershipController::class, 'renewForm'])->name('memberships.renew.form');
        Route::post('memberships/{membership}/renew', [MembershipController::class, 'renew'])->name('memberships.renew');
        Route::post('memberships/{membership}/cancel', [MembershipController::class, 'cancel'])->name('memberships.cancel');
        Route::post('memberships/{membership}/suspend', [MembershipController::class, 'suspend'])->name('memberships.suspend');
        Route::post('memberships/{membership}/reactivate', [MembershipController::class, 'reactivate'])->name('memberships.reactivate');
    });

    // Payments (Admin/Trainer/Receptionist)
    Route::middleware('can:view clients')->group(function () {
        Route::resource('payments', PaymentController::class)->only(['index', 'create', 'store', 'show']);
        Route::post('payments/{payment}/refund', [PaymentController::class, 'refund'])->name('payments.refund');
        Route::get('payments/{payment}/receipt', [PaymentController::class, 'receipt'])->name('payments.receipt');
        Route::get('payments-report', [PaymentController::class, 'report'])->name('payments.report');
    });

    // Check-ins (Admin/Trainer/Receptionist)
    Route::middleware('can:view clients')->group(function () {
        Route::get('check-ins', [CheckInController::class, 'index'])->name('check-ins.index');
        Route::post('check-ins', [CheckInController::class, 'checkIn'])->name('check-ins.check-in');
        Route::post('check-ins/{checkIn}/check-out', [CheckInController::class, 'checkOut'])->name('check-ins.check-out');
        Route::get('check-ins/search', [CheckInController::class, 'search'])->name('check-ins.search');
        Route::get('check-ins/dashboard', [CheckInController::class, 'dashboard'])->name('check-ins.dashboard');
        Route::get('clients/{client}/check-in-history', [CheckInController::class, 'clientHistory'])->name('clients.check-in-history');
    });

    // Body Measurements (Admin/Trainer)
    Route::middleware('can:view clients')->group(function () {
        Route::get('clients/{client}/body-measurements', [BodyMeasurementController::class, 'index'])->name('body-measurements.index');
        Route::get('clients/{client}/body-measurements/create', [BodyMeasurementController::class, 'create'])->name('body-measurements.create');
        Route::post('clients/{client}/body-measurements', [BodyMeasurementController::class, 'store'])->name('body-measurements.store');
        Route::get('clients/{client}/body-measurements/{bodyMeasurement}', [BodyMeasurementController::class, 'show'])->name('body-measurements.show');
        Route::get('clients/{client}/body-measurements/{bodyMeasurement}/edit', [BodyMeasurementController::class, 'edit'])->name('body-measurements.edit');
        Route::put('clients/{client}/body-measurements/{bodyMeasurement}', [BodyMeasurementController::class, 'update'])->name('body-measurements.update');
        Route::delete('clients/{client}/body-measurements/{bodyMeasurement}', [BodyMeasurementController::class, 'destroy'])->name('body-measurements.destroy');
        Route::get('clients/{client}/body-measurements-charts', [BodyMeasurementController::class, 'charts'])->name('body-measurements.charts');
    });

    // Class Schedules (Admin/Trainer)
    Route::middleware('can:view clients')->group(function () {
        Route::resource('class-schedules', ClassScheduleController::class);
        Route::get('class-schedules-calendar', [ClassScheduleController::class, 'calendar'])->name('class-schedules.calendar');
    });

    // Class Bookings (Admin/Trainer/Receptionist)
    Route::middleware('can:view clients')->group(function () {
        Route::get('class-bookings', [ClassBookingController::class, 'index'])->name('class-bookings.index');
        Route::post('class-bookings', [ClassBookingController::class, 'book'])->name('class-bookings.book');
        Route::post('class-bookings/{classBooking}/cancel', [ClassBookingController::class, 'cancel'])->name('class-bookings.cancel');
        Route::post('class-bookings/{classBooking}/attended', [ClassBookingController::class, 'markAttended'])->name('class-bookings.attended');
        Route::post('class-bookings/{classBooking}/no-show', [ClassBookingController::class, 'markNoShow'])->name('class-bookings.no-show');
        Route::get('class-bookings/available', [ClassBookingController::class, 'available'])->name('class-bookings.available');
        Route::get('class-bookings/attendance-report', [ClassBookingController::class, 'attendanceReport'])->name('class-bookings.attendance-report');
    });

    // Nutrition Plans (Admin/Trainer)
    Route::middleware('can:view clients')->group(function () {
        Route::resource('nutrition-plans', NutritionPlanController::class);
    });

    // Client routes for classes and nutrition
    Route::middleware('can:view own client data')->group(function () {
        Route::get('my-class-bookings', [ClassBookingController::class, 'myBookings'])->name('my-class-bookings');
        Route::get('my-nutrition-plan', [NutritionPlanController::class, 'myPlan'])->name('my-nutrition-plan');
    });

    // Roles and Permissions management (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::resource('users', UserController::class);
    });

    // Clients can view their own routines
    Route::middleware('can:view own routines')->group(function () {
        // My Membership
        Route::get('my-membership', function () {
            $client = auth()->user()->client;
            if (!$client) {
                return Inertia::render('my-membership', [
                    'membership' => null,
                    'daysRemaining' => null,
                ]);
            }
            
            $membership = $client->memberships()
                ->where('status', 'active')
                ->with('membershipPlan')
                ->first();
            
            $daysRemaining = null;
            if ($membership) {
                $endDate = \Carbon\Carbon::parse($membership->end_date);
                $daysRemaining = now()->diffInDays($endDate, false);
                $daysRemaining = $daysRemaining < 0 ? 0 : $daysRemaining;
            }
            
            return Inertia::render('my-membership', [
                'membership' => $membership,
                'daysRemaining' => $daysRemaining,
            ]);
        })->name('my-membership');
        
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
