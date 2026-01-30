<?php

namespace App\Http\Controllers;

use App\Models\ClassSchedule;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassScheduleController extends Controller
{
    public function index()
    {
        $classes = ClassSchedule::with('instructor')
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('classes/schedules/index', [
            'classes' => $classes,
        ]);
    }

    public function create()
    {
        $instructors = User::role(['admin', 'trainer'])->get();

        return Inertia::render('classes/schedules/create', [
            'instructors' => $instructors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructor_id' => 'required|exists:users,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_capacity' => 'required|integer|min:1',
            'difficulty_level' => 'required|in:beginner,intermediate,advanced',
            'room_location' => 'nullable|string',
            'requires_reservation' => 'boolean',
            'cancel_hours_before' => 'integer|min:0',
        ]);

        // Calcular duración en minutos
        $startTime = \Carbon\Carbon::createFromFormat('H:i', $validated['start_time']);
        $endTime = \Carbon\Carbon::createFromFormat('H:i', $validated['end_time']);
        $validated['duration_minutes'] = $startTime->diffInMinutes($endTime);

        ClassSchedule::create($validated);

        return redirect()->route('class-schedules.index')
            ->with('success', 'Clase creada exitosamente');
    }

    public function edit(ClassSchedule $classSchedule)
    {
        $instructors = User::role(['admin', 'trainer'])->get();

        return Inertia::render('classes/schedules/edit', [
            'class' => $classSchedule->load('instructor'),
            'instructors' => $instructors,
        ]);
    }

    public function update(Request $request, ClassSchedule $classSchedule)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructor_id' => 'required|exists:users,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_capacity' => 'required|integer|min:1',
            'difficulty_level' => 'required|in:beginner,intermediate,advanced',
            'room_location' => 'nullable|string',
            'is_active' => 'boolean',
            'requires_reservation' => 'boolean',
            'cancel_hours_before' => 'integer|min:0',
        ]);

        $startTime = \Carbon\Carbon::createFromFormat('H:i', $validated['start_time']);
        $endTime = \Carbon\Carbon::createFromFormat('H:i', $validated['end_time']);
        $validated['duration_minutes'] = $startTime->diffInMinutes($endTime);

        $classSchedule->update($validated);

        return redirect()->route('class-schedules.index')
            ->with('success', 'Clase actualizada exitosamente');
    }

    public function destroy(ClassSchedule $classSchedule)
    {
        // Verificar si tiene reservas futuras
        $futureBookings = $classSchedule->bookings()
            ->where('booking_date', '>=', today())
            ->whereIn('status', ['reserved', 'confirmed'])
            ->count();

        if ($futureBookings > 0) {
            return back()->with('error', 'No se puede eliminar una clase con reservas futuras');
        }

        $classSchedule->delete();

        return redirect()->route('class-schedules.index')
            ->with('success', 'Clase eliminada exitosamente');
    }

    // Calendario semanal de clases
    public function calendar()
    {
        $classes = ClassSchedule::active()
            ->with('instructor')
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        return Inertia::render('classes/calendar', [
            'classes' => $classes,
        ]);
    }
}
