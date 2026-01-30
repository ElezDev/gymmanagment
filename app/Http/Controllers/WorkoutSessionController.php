<?php

namespace App\Http\Controllers;

use App\Models\WorkoutSession;
use App\Models\WorkoutExerciseLog;
use App\Models\Client;
use App\Models\Routine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkoutSessionController extends Controller
{
    // Iniciar una nueva sesión de entrenamiento
    public function start(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'routine_id' => 'required|exists:routines,id',
        ]);

        $routine = Routine::with('routineExercises.exercise')->findOrFail($request->routine_id);

        // Crear la sesión de entrenamiento
        $session = WorkoutSession::create([
            'client_id' => $request->client_id,
            'routine_id' => $request->routine_id,
            'started_at' => now(),
            'completed' => false,
        ]);

        // Crear logs para cada ejercicio de la rutina
        foreach ($routine->routineExercises as $index => $routineExercise) {
            WorkoutExerciseLog::create([
                'workout_session_id' => $session->id,
                'exercise_id' => $routineExercise->exercise_id,
                'order' => $index + 1,
                'sets_planned' => $routineExercise->sets,
                'sets_completed' => 0,
                'set_details' => [],
                'completed' => false,
            ]);
        }

        return redirect()->route('workout-sessions.active', $session);
    }

    // Ver la sesión activa de entrenamiento
    public function active(WorkoutSession $workoutSession)
    {
        $session = $workoutSession->load([
            'client',
            'routine',
            'exerciseLogs.exercise',
        ]);

        return Inertia::render('WorkoutSessions/Active', [
            'session' => $session,
            'breadcrumbs' => [
                ['label' => 'Clientes', 'href' => '/clients'],
                ['label' => $session->client->name, 'href' => "/clients/{$session->client->id}"],
                ['label' => 'Entrenamiento Activo'],
            ],
        ]);
    }

    // Actualizar el progreso de un ejercicio
    public function updateExercise(Request $request, WorkoutExerciseLog $exerciseLog)
    {
        // Verificar autorización: debe ser trainer con permiso o el cliente dueño de la sesión
        $user = auth()->user();
        $session = $exerciseLog->workoutSession;
        
        $isOwner = $user->client && $user->client->id === $session->client_id;
        $hasPermission = $user->can('view clients');
        
        if (!$isOwner && !$hasPermission) {
            abort(403, 'No autorizado para actualizar este ejercicio');
        }
        
        $validated = $request->validate([
            'set_details' => 'required|string',
            'sets_completed' => 'required|integer',
            'notes' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        // Decodificar JSON si es string
        if (is_string($validated['set_details'])) {
            $validated['set_details'] = json_decode($validated['set_details'], true);
        }

        $exerciseLog->update($validated);

        return back();
    }

    // Completar la sesión de entrenamiento
    public function complete(Request $request, WorkoutSession $workoutSession)
    {
        $request->validate([
            'notes' => 'nullable|string',
        ]);

        $startedAt = $workoutSession->started_at;
        $endedAt = now();
        $durationMinutes = $startedAt->diffInMinutes($endedAt);

        $workoutSession->update([
            'ended_at' => $endedAt,
            'duration_minutes' => $durationMinutes,
            'notes' => $request->notes,
            'completed' => true,
        ]);

        return redirect()->route('clients.show', $workoutSession->client_id)
            ->with('success', 'Entrenamiento completado exitosamente');
    }

    // Ver historial de entrenamientos de un cliente
    public function history(Client $client)
    {
        $sessions = WorkoutSession::where('client_id', $client->id)
            ->where('completed', true)
            ->with(['routine', 'exerciseLogs.exercise'])
            ->orderBy('started_at', 'desc')
            ->paginate(10);

        return Inertia::render('WorkoutSessions/History', [
            'client' => $client,
            'sessions' => $sessions,
            'breadcrumbs' => [
                ['label' => 'Clientes', 'href' => '/clients'],
                ['label' => $client->name, 'href' => "/clients/{$client->id}"],
                ['label' => 'Historial de Entrenamientos'],
            ],
        ]);
    }

    // Ver detalle de una sesión específica
    public function show(WorkoutSession $workoutSession)
    {
        $session = $workoutSession->load([
            'client',
            'routine',
            'exerciseLogs.exercise',
        ]);

        return Inertia::render('WorkoutSessions/Show', [
            'session' => $session,
            'breadcrumbs' => [
                ['label' => 'Clientes', 'href' => '/clients'],
                ['label' => $session->client->name, 'href' => "/clients/{$session->client->id}"],
                ['label' => 'Historial', 'href' => "/clients/{$session->client->id}/workout-history"],
                ['label' => 'Detalle de Entrenamiento'],
            ],
        ]);
    }

    // ============ Métodos para Clientes (Own) ============
    
    // Cliente inicia su propio entrenamiento
    public function startOwn(Request $request)
    {
        $request->validate([
            'routine_id' => 'required|exists:routines,id',
        ]);

        $client = auth()->user()->client;
        if (!$client) {
            return back()->with('error', 'No tienes un perfil de cliente');
        }

        // Verificar que la rutina esté asignada al cliente
        $hasRoutine = $client->routines()->where('routine_id', $request->routine_id)->exists();
        if (!$hasRoutine) {
            return back()->with('error', 'No tienes acceso a esta rutina');
        }

        $routine = Routine::with('routineExercises.exercise')->findOrFail($request->routine_id);

        // Crear la sesión de entrenamiento
        $session = WorkoutSession::create([
            'client_id' => $client->id,
            'routine_id' => $request->routine_id,
            'started_at' => now(),
            'completed' => false,
        ]);

        // Crear logs para cada ejercicio de la rutina
        foreach ($routine->routineExercises as $index => $routineExercise) {
            WorkoutExerciseLog::create([
                'workout_session_id' => $session->id,
                'exercise_id' => $routineExercise->exercise_id,
                'order' => $index + 1,
                'sets_planned' => $routineExercise->sets,
                'sets_completed' => 0,
                'set_details' => [],
                'completed' => false,
            ]);
        }

        return redirect()->route('my-workout-sessions.active', $session);
    }

    // Cliente ve su sesión activa
    public function activeOwn(WorkoutSession $workoutSession)
    {
        $client = auth()->user()->client;
        if (!$client || $workoutSession->client_id !== $client->id) {
            abort(403, 'No autorizado');
        }

        $session = $workoutSession->load([
            'client',
            'routine',
            'exerciseLogs.exercise',
        ]);

        return Inertia::render('WorkoutSessions/Active', [
            'session' => $session,
            'breadcrumbs' => [
                ['label' => 'Mis Rutinas', 'href' => '/my-routines'],
                ['label' => 'Entrenamiento Activo'],
            ],
        ]);
    }

    // Cliente completa su entrenamiento
    public function completeOwn(Request $request, WorkoutSession $workoutSession)
    {
        $user = auth()->user();
        
        // Cargar explícitamente la relación client si no está cargada
        if (!$user->relationLoaded('client')) {
            $user->load('client');
        }
        
        $client = $user->client;
        
        if (!$client) {
            abort(403, 'No tienes un perfil de cliente asociado');
        }
        
        if ($workoutSession->client_id !== $client->id) {
            abort(403, 'No autorizado para completar este entrenamiento');
        }

        $request->validate([
            'notes' => 'nullable|string',
        ]);

        $startedAt = $workoutSession->started_at;
        $endedAt = now();
        $durationMinutes = $startedAt->diffInMinutes($endedAt);

        $workoutSession->update([
            'ended_at' => $endedAt,
            'duration_minutes' => $durationMinutes,
            'notes' => $request->notes,
            'completed' => true,
        ]);

        return redirect()->route('my-routines')
            ->with('success', '¡Entrenamiento completado! 💪');
    }

    // Cliente ve su historial
    public function historyOwn()
    {
        $client = auth()->user()->client;
        if (!$client) {
            return redirect()->route('dashboard')->with('error', 'No tienes un perfil de cliente');
        }

        $sessions = WorkoutSession::where('client_id', $client->id)
            ->where('completed', true)
            ->with(['routine', 'exerciseLogs.exercise'])
            ->orderBy('started_at', 'desc')
            ->paginate(10);

        return Inertia::render('WorkoutSessions/History', [
            'client' => $client,
            'sessions' => $sessions,
            'breadcrumbs' => [
                ['label' => 'Mis Rutinas', 'href' => '/my-routines'],
                ['label' => 'Mi Historial de Entrenamientos'],
            ],
        ]);
    }

    // Cliente ve detalle de su sesión
    public function showOwn(WorkoutSession $workoutSession)
    {
        $client = auth()->user()->client;
        if (!$client || $workoutSession->client_id !== $client->id) {
            abort(403, 'No autorizado');
        }

        $session = $workoutSession->load([
            'client',
            'routine',
            'exerciseLogs.exercise',
        ]);

        return Inertia::render('WorkoutSessions/Show', [
            'session' => $session,
            'breadcrumbs' => [
                ['label' => 'Mis Rutinas', 'href' => '/my-routines'],
                ['label' => 'Historial', 'href' => '/my-workout-history'],
                ['label' => 'Detalle de Entrenamiento'],
            ],
        ]);
    }
}
