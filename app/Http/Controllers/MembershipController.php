<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use App\Models\MembershipPlan;
use App\Models\Client;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MembershipController extends Controller
{
    public function index(Request $request)
    {
        $query = Membership::with(['client.user', 'membershipPlan', 'soldBy']);

        // Filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('client.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhereHas('client', function ($q) use ($search) {
                $q->where('membership_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $memberships = $query->latest()->paginate(15)->withQueryString();

        // Agregar días restantes a cada membresía
        $memberships->getCollection()->transform(function ($membership) {
            $membership->days_remaining = $membership->daysRemaining();
            return $membership;
        });

        // Estadísticas
        $stats = [
            'active' => Membership::where('status', 'active')->count(),
            'expiring_soon' => Membership::where('status', 'active')
                ->where('end_date', '<=', now()->addDays(7))
                ->count(),
            'suspended' => Membership::where('status', 'suspended')->count(),
            'expired' => Membership::where('status', 'expired')->count(),
        ];

        return Inertia::render('memberships/index', [
            'memberships' => $memberships,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        $clients = Client::with('user')->get();
        $plans = MembershipPlan::active()->orderBy('sort_order')->get();

        return Inertia::render('memberships/create', [
            'clients' => $clients,
            'plans' => $plans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'membership_plan_id' => 'required|exists:membership_plans,id',
            'start_date' => 'required|date',
            'amount_paid' => 'required|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string',
            'notes' => 'nullable|string',
            'auto_renew' => 'boolean',
            'payment_method' => 'required|in:cash,card,transfer,check,online',
        ]);

        $plan = MembershipPlan::findOrFail($validated['membership_plan_id']);
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = $plan->calculateEndDate($startDate);

        // Crear membresía
        $membership = Membership::create([
            'client_id' => $validated['client_id'],
            'membership_plan_id' => $validated['membership_plan_id'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active',
            'amount_paid' => $validated['amount_paid'],
            'discount_amount' => $validated['discount_amount'] ?? 0,
            'discount_reason' => $validated['discount_reason'],
            'notes' => $validated['notes'],
            'auto_renew' => $validated['auto_renew'] ?? false,
            'sold_by' => auth()->id(),
        ]);

        // Crear registro de pago
        Payment::create([
            'client_id' => $validated['client_id'],
            'membership_id' => $membership->id,
            'payment_number' => Payment::generatePaymentNumber(),
            'amount' => $validated['amount_paid'],
            'payment_method' => $validated['payment_method'],
            'status' => 'completed',
            'type' => 'membership',
            'description' => "Pago de {$plan->name}",
            'received_by' => auth()->id(),
            'payment_date' => now(),
        ]);

        // Actualizar estado del cliente
        $client = Client::find($validated['client_id']);
        $client->update([
            'membership_status' => 'active',
            'membership_start' => $startDate,
            'membership_end' => $endDate,
            'membership_number' => $client->membership_number ?? Client::generateMembershipNumber(),
        ]);

        return redirect()->route('memberships.index')
            ->with('success', 'Membresía creada y pago registrado exitosamente');
    }

    public function show(Membership $membership)
    {
        $membership->load(['client.user', 'membershipPlan', 'soldBy', 'payments.receivedBy']);

        return Inertia::render('memberships/show', [
            'membership' => $membership,
        ]);
    }

    public function renewForm(Membership $membership)
    {
        $membership->load(['client.user', 'membershipPlan']);

        return Inertia::render('memberships/renew', [
            'membership' => $membership,
        ]);
    }

    public function renew(Request $request, Membership $membership)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:cash,card,transfer,check,online',
            'amount_paid' => 'required|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string',
        ]);

        $plan = $membership->membershipPlan;
        $newStartDate = $membership->end_date->addDay();
        $newEndDate = $plan->calculateEndDate($newStartDate);

        // Crear nueva membresía
        $newMembership = Membership::create([
            'client_id' => $membership->client_id,
            'membership_plan_id' => $membership->membership_plan_id,
            'start_date' => $newStartDate,
            'end_date' => $newEndDate,
            'status' => 'active',
            'amount_paid' => $validated['amount_paid'],
            'discount_amount' => $validated['discount_amount'] ?? 0,
            'discount_reason' => $validated['discount_reason'],
            'notes' => 'Renovación automática',
            'auto_renew' => $membership->auto_renew,
            'sold_by' => auth()->id(),
        ]);

        // Registrar pago
        Payment::create([
            'client_id' => $membership->client_id,
            'membership_id' => $newMembership->id,
            'payment_number' => Payment::generatePaymentNumber(),
            'amount' => $validated['amount_paid'],
            'payment_method' => $validated['payment_method'],
            'status' => 'completed',
            'type' => 'membership',
            'description' => "Renovación de {$plan->name}",
            'received_by' => auth()->id(),
            'payment_date' => now(),
        ]);

        // Actualizar membresía antigua
        $membership->update(['status' => 'expired']);

        // Actualizar cliente
        $membership->client->update([
            'membership_status' => 'active',
            'membership_start' => $newStartDate,
            'membership_end' => $newEndDate,
        ]);

        return redirect()->route('memberships.show', $newMembership)
            ->with('success', 'Membresía renovada exitosamente');
    }

    public function cancel(Request $request, Membership $membership)
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string',
        ]);

        $membership->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $validated['cancellation_reason'],
        ]);

        $membership->client->update([
            'membership_status' => 'cancelled',
        ]);

        return redirect()->route('memberships.index')
            ->with('success', 'Membresía cancelada exitosamente');
    }

    public function suspend(Request $request, Membership $membership)
    {
        $validated = $request->validate([
            'suspension_reason' => 'required|string',
        ]);

        $membership->update(['status' => 'suspended']);

        $membership->client->update([
            'membership_status' => 'suspended',
            'suspension_reason' => $validated['suspension_reason'],
            'suspended_at' => now(),
        ]);

        return back()->with('success', 'Membresía suspendida exitosamente');
    }

    public function reactivate(Membership $membership)
    {
        if ($membership->end_date < now()) {
            return back()->with('error', 'No se puede reactivar una membresía vencida. Debe renovarla.');
        }

        $membership->update(['status' => 'active']);

        $membership->client->update([
            'membership_status' => 'active',
            'suspension_reason' => null,
            'suspended_at' => null,
        ]);

        return back()->with('success', 'Membresía reactivada exitosamente');
    }

    // Obtener membresías por vencer
    public function expiring()
    {
        $memberships = Membership::query()
            ->where('status', 'active')
            ->whereBetween('end_date', [now(), now()->addDays(7)])
            ->with(['client.user', 'membershipPlan'])
            ->orderBy('end_date', 'asc')
            ->get();

        return Inertia::render('memberships/expiring', [
            'memberships' => $memberships,
        ]);
    }
}
