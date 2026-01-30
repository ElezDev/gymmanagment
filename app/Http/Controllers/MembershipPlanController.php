<?php

namespace App\Http\Controllers;

use App\Models\MembershipPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembershipPlanController extends Controller
{
    public function index()
    {
        $plans = MembershipPlan::orderBy('sort_order')->get();

        return Inertia::render('memberships/plans/index', [
            'plans' => $plans,
        ]);
    }

    public function create()
    {
        return Inertia::render('memberships/plans/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'billing_cycle' => 'required|in:daily,weekly,monthly,quarterly,yearly',
            'features' => 'nullable|array',
            'max_classes_per_week' => 'nullable|integer|min:0',
            'max_classes_per_month' => 'nullable|integer|min:0',
            'includes_nutrition_plan' => 'boolean',
            'includes_personal_training' => 'boolean',
            'personal_training_sessions' => 'integer|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        MembershipPlan::create($validated);

        return redirect()->route('membership-plans.index')
            ->with('success', 'Plan de membresía creado exitosamente');
    }

    public function edit(MembershipPlan $membershipPlan)
    {
        return Inertia::render('memberships/plans/edit', [
            'plan' => $membershipPlan,
        ]);
    }

    public function update(Request $request, MembershipPlan $membershipPlan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'billing_cycle' => 'required|in:daily,weekly,monthly,quarterly,yearly',
            'features' => 'nullable|array',
            'max_classes_per_week' => 'nullable|integer|min:0',
            'max_classes_per_month' => 'nullable|integer|min:0',
            'includes_nutrition_plan' => 'boolean',
            'includes_personal_training' => 'boolean',
            'personal_training_sessions' => 'integer|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $membershipPlan->update($validated);

        return redirect()->route('membership-plans.index')
            ->with('success', 'Plan de membresía actualizado exitosamente');
    }

    public function destroy(MembershipPlan $membershipPlan)
    {
        // Verificar si hay membresías activas con este plan
        if ($membershipPlan->activeMemberships()->exists()) {
            return back()->with('error', 'No se puede eliminar un plan con membresías activas');
        }

        $membershipPlan->delete();

        return redirect()->route('membership-plans.index')
            ->with('success', 'Plan de membresía eliminado exitosamente');
    }

    // API endpoint para obtener planes activos
    public function active()
    {
        $plans = MembershipPlan::active()
            ->orderBy('sort_order')
            ->get();

        return response()->json($plans);
    }
}
