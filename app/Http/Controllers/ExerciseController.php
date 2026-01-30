<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $exercises = Exercise::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('muscle_group', 'like', "%{$search}%");
            })
            ->when($category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->orderBy('name', 'asc')
            ->paginate(10);

        return Inertia::render('exercises/index', [
            'exercises' => $exercises,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('exercises/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'muscle_group' => 'nullable|string',
            'difficulty' => 'nullable|in:principiante,intermedio,avanzado',
            'video_url' => 'nullable|url',
            'image_url' => 'nullable|url',
        ]);

        $exercise = Exercise::create($validated);

        return redirect()->route('exercises.index')
            ->with('success', 'Ejercicio creado exitosamente');
    }

    public function show(Exercise $exercise)
    {
        return Inertia::render('exercises/show', [
            'exercise' => $exercise,
        ]);
    }

    public function edit(Exercise $exercise)
    {
        return Inertia::render('exercises/edit', [
            'exercise' => $exercise,
        ]);
    }

    public function update(Request $request, Exercise $exercise)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'muscle_group' => 'nullable|string',
            'difficulty' => 'nullable|in:principiante,intermedio,avanzado',
            'video_url' => 'nullable|url',
            'image_url' => 'nullable|url',
        ]);

        $exercise->update($validated);

        return redirect()->route('exercises.index')
            ->with('success', 'Ejercicio actualizado exitosamente');
    }

    public function destroy(Exercise $exercise)
    {
        $exercise->delete();

        return redirect()->route('exercises.index')
            ->with('success', 'Ejercicio eliminado exitosamente');
    }
}
