<?php

namespace App\Http\Controllers;

use App\Models\NutritionPlan;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NutritionPlanController extends Controller
{
    public function index(Request $request)
    {
        $query = NutritionPlan::with(['client.user', 'createdBy']);

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $plans = $query->latest('start_date')->paginate(20);

        return Inertia::render('nutrition/plans/index', [
            'plans' => $plans,
            'filters' => $request->only(['client_id', 'is_active']),
        ]);
    }

    public function create(Request $request)
    {
        $client = null;
        if ($request->filled('client_id')) {
            $client = Client::with('user')->findOrFail($request->client_id);
        } else {
            $clients = Client::with('user')->get();
        }

        return Inertia::render('nutrition/plans/create', [
            'client' => $client,
            'clients' => $clients ?? [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'daily_calories_target' => 'nullable|integer|min:0',
            'protein_grams' => 'nullable|integer|min:0',
            'carbs_grams' => 'nullable|integer|min:0',
            'fats_grams' => 'nullable|integer|min:0',
            'meals_per_day' => 'integer|min:1|max:10',
            'water_liters' => 'numeric|min:0',
            'meal_plan' => 'nullable|array',
            'supplements' => 'nullable|array',
            'restrictions' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Desactivar otros planes activos del cliente
        NutritionPlan::where('client_id', $validated['client_id'])
            ->where('is_active', true)
            ->update(['is_active' => false]);

        NutritionPlan::create([
            ...$validated,
            'is_active' => true,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('nutrition-plans.index')
            ->with('success', 'Plan nutricional creado exitosamente');
    }

    public function show(NutritionPlan $nutritionPlan)
    {
        $nutritionPlan->load(['client.user', 'createdBy']);

        return Inertia::render('nutrition/plans/show', [
            'plan' => $nutritionPlan,
        ]);
    }

    public function edit(NutritionPlan $nutritionPlan)
    {
        $nutritionPlan->load(['client.user']);

        return Inertia::render('nutrition/plans/edit', [
            'plan' => $nutritionPlan,
        ]);
    }

    public function update(Request $request, NutritionPlan $nutritionPlan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
            'daily_calories_target' => 'nullable|integer|min:0',
            'protein_grams' => 'nullable|integer|min:0',
            'carbs_grams' => 'nullable|integer|min:0',
            'fats_grams' => 'nullable|integer|min:0',
            'meals_per_day' => 'integer|min:1|max:10',
            'water_liters' => 'numeric|min:0',
            'meal_plan' => 'nullable|array',
            'supplements' => 'nullable|array',
            'restrictions' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $nutritionPlan->update($validated);

        return redirect()->route('nutrition-plans.show', $nutritionPlan)
            ->with('success', 'Plan nutricional actualizado exitosamente');
    }

    public function destroy(NutritionPlan $nutritionPlan)
    {
        $nutritionPlan->delete();

        return redirect()->route('nutrition-plans.index')
            ->with('success', 'Plan nutricional eliminado exitosamente');
    }

    // Mi plan nutricional (para clientes)
    public function myPlan()
    {
        $client = auth()->user()->client;
        
        if (!$client) {
            return redirect()->route('dashboard')->with('error', 'No tienes perfil de cliente');
        }

        $activePlan = $client->activeNutritionPlan;

        if (!$activePlan) {
            return Inertia::render('nutrition/no-plan');
        }

        $activePlan->load('createdBy');

        return Inertia::render('nutrition/my-plan', [
            'plan' => $activePlan,
        ]);
    }
}
