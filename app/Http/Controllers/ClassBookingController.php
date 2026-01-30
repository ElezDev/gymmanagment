<?php

namespace App\Http\Controllers;

use App\Models\ClassBooking;
use App\Models\ClassSchedule;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ClassBookingController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassBooking::with(['classSchedule.instructor', 'client.user']);

        // Filtros
        if ($request->filled('date')) {
            $query->where('booking_date', $request->date);
        } else {
            $query->where('booking_date', '>=', today());
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('class_schedule_id')) {
            $query->where('class_schedule_id', $request->class_schedule_id);
        }

        $bookings = $query->latest('booking_date')->paginate(30);

        return Inertia::render('classes/bookings/index', [
            'bookings' => $bookings,
            'filters' => $request->only(['date', 'status', 'class_schedule_id']),
        ]);
    }

    // Reservar una clase
    public function book(Request $request)
    {
        $validated = $request->validate([
            'class_schedule_id' => 'required|exists:class_schedules,id',
            'client_id' => 'required|exists:clients,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'notes' => 'nullable|string',
        ]);

        $classSchedule = ClassSchedule::findOrFail($validated['class_schedule_id']);
        $client = Client::with('activeMembership')->findOrFail($validated['client_id']);

        // Verificar membresía activa
        if (!$client->hasActiveMembership()) {
            return back()->with('error', 'El cliente no tiene una membresía activa');
        }

        // Verificar límite de clases del plan
        $membership = $client->activeMembership;
        if (!$membership->canUseClasses()) {
            return back()->with('error', 'El cliente ha alcanzado el límite de clases de su plan');
        }

        // Verificar si ya tiene una reserva para esta clase y fecha
        $existingBooking = ClassBooking::where('class_schedule_id', $validated['class_schedule_id'])
            ->where('client_id', $validated['client_id'])
            ->where('booking_date', $validated['booking_date'])
            ->whereIn('status', ['reserved', 'confirmed', 'attended'])
            ->first();

        if ($existingBooking) {
            return back()->with('error', 'El cliente ya tiene una reserva para esta clase');
        }

        // Verificar capacidad disponible
        $isWaitingList = false;
        $waitingPosition = null;

        if ($classSchedule->isFull($validated['booking_date'])) {
            $isWaitingList = true;
            $waitingPosition = $classSchedule->bookings()
                ->where('booking_date', $validated['booking_date'])
                ->where('is_waiting_list', true)
                ->count() + 1;
        }

        ClassBooking::create([
            'class_schedule_id' => $validated['class_schedule_id'],
            'client_id' => $validated['client_id'],
            'booking_date' => $validated['booking_date'],
            'status' => $isWaitingList ? 'reserved' : 'confirmed',
            'reserved_at' => now(),
            'is_waiting_list' => $isWaitingList,
            'waiting_position' => $waitingPosition,
            'notes' => $validated['notes'],
        ]);

        $message = $isWaitingList
            ? "Reserva agregada a lista de espera (posición #{$waitingPosition})"
            : 'Reserva confirmada exitosamente';

        return back()->with('success', $message);
    }

    // Cancelar reserva
    public function cancel(Request $request, ClassBooking $classBooking)
    {
        if (!$classBooking->canCancel()) {
            return back()->with('error', 'No se puede cancelar esta reserva. Tiempo límite excedido.');
        }

        $validated = $request->validate([
            'cancellation_reason' => 'nullable|string',
        ]);

        $classBooking->cancel($validated['cancellation_reason']);

        // Si había lista de espera, mover al siguiente
        if (!$classBooking->is_waiting_list) {
            $nextInLine = ClassBooking::where('class_schedule_id', $classBooking->class_schedule_id)
                ->where('booking_date', $classBooking->booking_date)
                ->where('is_waiting_list', true)
                ->where('status', 'reserved')
                ->orderBy('waiting_position')
                ->first();

            if ($nextInLine) {
                $nextInLine->update([
                    'is_waiting_list' => false,
                    'waiting_position' => null,
                    'status' => 'confirmed',
                ]);
                // TODO: Enviar notificación al cliente
            }
        }

        return back()->with('success', 'Reserva cancelada exitosamente');
    }

    // Marcar asistencia
    public function markAttended(ClassBooking $classBooking)
    {
        if ($classBooking->status === 'attended') {
            return back()->with('error', 'Esta reserva ya fue marcada como asistida');
        }

        $classBooking->markAsAttended();

        return back()->with('success', 'Asistencia registrada exitosamente');
    }

    // Marcar como no asistido
    public function markNoShow(ClassBooking $classBooking)
    {
        $classBooking->update(['status' => 'no_show']);

        return back()->with('success', 'Marcado como no asistido');
    }

    // Mis reservas (para clientes)
    public function myBookings()
    {
        $client = auth()->user()->client;
        
        if (!$client) {
            return redirect()->route('dashboard')->with('error', 'No tienes perfil de cliente');
        }

        $bookings = ClassBooking::where('client_id', $client->id)
            ->with(['classSchedule.instructor'])
            ->latest('booking_date')
            ->paginate(20);

        return Inertia::render('classes/my-bookings', [
            'bookings' => $bookings,
        ]);
    }

    // Clases disponibles para reservar
    public function available(Request $request)
    {
        $date = $request->input('date', today()->addDay());
        $dayOfWeek = Carbon::parse($date)->locale('en')->dayName;

        $classes = ClassSchedule::active()
            ->where('day_of_week', strtolower($dayOfWeek))
            ->where('requires_reservation', true)
            ->with('instructor')
            ->orderBy('start_time')
            ->get()
            ->map(function ($class) use ($date) {
                return [
                    ...$class->toArray(),
                    'available_capacity' => $class->availableCapacity($date),
                    'is_full' => $class->isFull($date),
                ];
            });

        return Inertia::render('classes/available', [
            'classes' => $classes,
            'date' => $date,
        ]);
    }

    // Reporte de asistencia a clases
    public function attendanceReport(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $bookings = ClassBooking::whereBetween('booking_date', [$startDate, $endDate])
            ->with(['classSchedule', 'client.user'])
            ->get();

        $stats = [
            'total_bookings' => $bookings->count(),
            'attended' => $bookings->where('status', 'attended')->count(),
            'no_shows' => $bookings->where('status', 'no_show')->count(),
            'cancelled' => $bookings->where('status', 'cancelled')->count(),
            'by_class' => $bookings->groupBy('classSchedule.name')->map->count(),
        ];

        return Inertia::render('classes/attendance-report', [
            'bookings' => $bookings,
            'stats' => $stats,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }
}
