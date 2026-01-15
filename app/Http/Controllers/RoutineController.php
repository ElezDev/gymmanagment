<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Routine;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoutineController extends Controller
{
    public function index()
    {
        $routines = Routine::withCount(['clients', 'routineExercises'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('routines/index', [
            'routines' => $routines,
        ]);
    }

    public function create()
    {
        $exercises = Exercise::orderBy('name')->get();

        return Inertia::render('routines/create', [
            'exercises' => $exercises,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
            'exercises' => 'required|array|min:1',
            'exercises.*.id' => 'required|exists:exercises,id',
            'exercises.*.sets' => 'required|integer|min:1',
            'exercises.*.reps' => 'required|integer|min:1',
            'exercises.*.weight' => 'nullable|numeric|min:0',
            'exercises.*.rest_seconds' => 'required|integer|min:0',
            'exercises.*.order' => 'required|integer|min:1',
        ]);

        $routine = Routine::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'] ?? now(),
            'end_date' => $validated['end_date'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        foreach ($validated['exercises'] as $exercise) {
            $routine->routineExercises()->create([
                'exercise_id' => $exercise['id'],
                'order' => $exercise['order'],
                'sets' => $exercise['sets'],
                'reps' => $exercise['reps'],
                'weight' => $exercise['weight'] ?? 0,
                'rest_seconds' => $exercise['rest_seconds'],
            ]);
        }

        return redirect()->route('routines.show', $routine->id)
            ->with('success', 'Rutina creada exitosamente');
    }

    public function show(Routine $routine)
    {
        $routine->load([
            'clients.user',
            'routineExercises.exercise',
        ]);

        // Obtener clientes activos que no tienen esta rutina asignada
        $availableClients = Client::with('user')
            ->where('is_active', true)
            ->whereDoesntHave('routines', function ($query) use ($routine) {
                $query->where('routines.id', $routine->id);
            })
            ->get();

        return Inertia::render('routines/show', [
            'routine' => $routine,
            'availableClients' => $availableClients,
        ]);
    }

    public function edit(Routine $routine)
    {
        $routine->load(['routineExercises.exercise']);
        $exercises = Exercise::orderBy('name')->get();

        return Inertia::render('routines/edit', [
            'routine' => $routine,
            'exercises' => $exercises,
        ]);
    }

    public function update(Request $request, Routine $routine)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
            'exercises' => 'required|array|min:1',
            'exercises.*.id' => 'required|exists:exercises,id',
            'exercises.*.sets' => 'required|integer|min:1',
            'exercises.*.reps' => 'required|integer|min:1',
            'exercises.*.weight' => 'nullable|numeric|min:0',
            'exercises.*.rest_seconds' => 'required|integer|min:0',
            'exercises.*.order' => 'required|integer|min:1',
        ]);

        $routine->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'] ?? now(),
            'end_date' => $validated['end_date'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Delete old exercises and create new ones
        $routine->routineExercises()->delete();
        foreach ($validated['exercises'] as $exercise) {
            $routine->routineExercises()->create([
                'exercise_id' => $exercise['id'],
                'order' => $exercise['order'],
                'sets' => $exercise['sets'],
                'reps' => $exercise['reps'],
                'weight' => $exercise['weight'] ?? 0,
                'rest_seconds' => $exercise['rest_seconds'],
            ]);
        }

        return redirect()->route('routines.show', $routine->id)
            ->with('success', 'Rutina actualizada exitosamente');
    }

    public function destroy(Routine $routine)
    {
        $routine->delete();

        return redirect()->route('routines.index')
            ->with('success', 'Rutina eliminada exitosamente');
    }

    // Asignar rutina a un cliente
    public function assignToClient(Request $request, Routine $routine)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
        ]);

        $routine->clients()->attach($validated['client_id'], [
            'assigned_date' => now(),
            'is_active' => true,
        ]);

        return back()->with('success', 'Rutina asignada al cliente exitosamente');
    }

    // Desasignar rutina de un cliente
    public function unassignFromClient(Routine $routine, Client $client)
    {
        $routine->clients()->detach($client->id);

        return back()->with('success', 'Rutina desasignada del cliente exitosamente');
    }
}
