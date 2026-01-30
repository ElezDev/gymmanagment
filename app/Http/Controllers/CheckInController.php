<?php

namespace App\Http\Controllers;

use App\Models\CheckIn;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CheckInController extends Controller
{
    public function index(Request $request)
    {
        $query = CheckIn::with(['client.user', 'registeredBy']);

        // Filtro por fecha
        if ($request->filled('date')) {
            $query->whereDate('check_in_time', $request->date);
        } else {
            $query->whereDate('check_in_time', today());
        }

        // Filtro por cliente
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Filtro activos/completados
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'completed') {
                $query->whereNotNull('check_out_time');
            }
        }

        $checkIns = $query->latest('check_in_time')->paginate(30);

        // Estadísticas del día
        $stats = [
            'today_total' => CheckIn::today()->count(),
            'currently_in' => CheckIn::active()->count(),
            'avg_duration' => CheckIn::today()
                ->whereNotNull('duration_minutes')
                ->avg('duration_minutes'),
        ];

        return Inertia::render('check-ins/index', [
            'checkIns' => $checkIns,
            'stats' => $stats,
            'filters' => $request->only(['date', 'client_id', 'status']),
        ]);
    }

    // Check-in de un cliente
    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'entry_method' => 'in:manual,card,qr,biometric',
            'notes' => 'nullable|string',
        ]);

        // Verificar si ya tiene un check-in activo
        $activeCheckIn = CheckIn::where('client_id', $validated['client_id'])
            ->active()
            ->first();

        if ($activeCheckIn) {
            return back()->with('error', 'El cliente ya tiene un check-in activo');
        }

        // Verificar membresía activa
        $client = Client::with('activeMembership')->find($validated['client_id']);
        if (!$client->hasActiveMembership()) {
            return back()->with('error', 'El cliente no tiene una membresía activa');
        }

        CheckIn::create([
            'client_id' => $validated['client_id'],
            'check_in_time' => now(),
            'entry_method' => $validated['entry_method'] ?? 'manual',
            'notes' => $validated['notes'],
            'registered_by' => auth()->id(),
        ]);

        return back()->with('success', 'Check-in registrado exitosamente');
    }

    // Check-out de un cliente
    public function checkOut(CheckIn $checkIn)
    {
        if ($checkIn->check_out_time) {
            return back()->with('error', 'Este check-in ya tiene un check-out registrado');
        }

        $checkIn->update([
            'check_out_time' => now(),
        ]);

        $checkIn->calculateDuration();

        return back()->with('success', 'Check-out registrado exitosamente');
    }

    // Búsqueda de cliente para check-in rápido
    public function search(Request $request)
    {
        $search = $request->input('search');

        $clients = Client::with(['user', 'activeMembership'])
            ->whereHas('user', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orWhere('membership_number', 'like', "%{$search}%")
            ->limit(10)
            ->get();

        return response()->json($clients);
    }

    // Historial de check-ins de un cliente
    public function clientHistory(Client $client)
    {
        $checkIns = CheckIn::where('client_id', $client->id)
            ->with('registeredBy')
            ->latest('check_in_time')
            ->paginate(50);

        $stats = [
            'total_visits' => $client->checkIns()->count(),
            'this_month' => $client->checkIns()
                ->whereMonth('check_in_time', now()->month)
                ->count(),
            'avg_duration' => $client->checkIns()
                ->whereNotNull('duration_minutes')
                ->avg('duration_minutes'),
        ];

        return Inertia::render('check-ins/client-history', [
            'client' => $client->load('user'),
            'checkIns' => $checkIns,
            'stats' => $stats,
        ]);
    }

    // Dashboard de check-ins en tiempo real
    public function dashboard()
    {
        $activeCheckIns = CheckIn::active()
            ->with(['client.user'])
            ->latest('check_in_time')
            ->get();

        $todayStats = [
            'total_today' => CheckIn::today()->count(),
            'currently_in' => $activeCheckIns->count(),
            'peak_hour' => CheckIn::today()
                ->selectRaw('HOUR(check_in_time) as hour, COUNT(*) as count')
                ->groupBy('hour')
                ->orderByDesc('count')
                ->first(),
        ];

        return Inertia::render('check-ins/dashboard', [
            'activeCheckIns' => $activeCheckIns,
            'stats' => $todayStats,
        ]);
    }
}
