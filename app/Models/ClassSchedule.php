<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'instructor_id',
        'day_of_week',
        'start_time',
        'end_time',
        'max_capacity',
        'duration_minutes',
        'difficulty_level',
        'room_location',
        'is_active',
        'requires_reservation',
        'cancel_hours_before',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_active' => 'boolean',
        'requires_reservation' => 'boolean',
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(ClassBooking::class);
    }

    // Bookings para una fecha específica
    public function bookingsForDate($date): HasMany
    {
        return $this->hasMany(ClassBooking::class)
            ->where('booking_date', $date);
    }

    // Capacidad disponible para una fecha
    public function availableCapacity($date): int
    {
        $bookedCount = $this->bookingsForDate($date)
            ->whereIn('status', ['reserved', 'confirmed', 'attended'])
            ->count();

        return $this->max_capacity - $bookedCount;
    }

    // Verificar si está llena
    public function isFull($date): bool
    {
        return $this->availableCapacity($date) <= 0;
    }

    // Scope para clases activas
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope por día de la semana
    public function scopeByDayOfWeek($query, $day)
    {
        return $query->where('day_of_week', $day);
    }
}
