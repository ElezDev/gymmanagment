<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_schedule_id',
        'client_id',
        'booking_date',
        'status',
        'reserved_at',
        'cancelled_at',
        'cancellation_reason',
        'is_waiting_list',
        'waiting_position',
        'notes',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'reserved_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'is_waiting_list' => 'boolean',
    ];

    public function classSchedule(): BelongsTo
    {
        return $this->belongsTo(ClassSchedule::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    // Verificar si puede cancelar
    public function canCancel(): bool
    {
        if (!in_array($this->status, ['reserved', 'confirmed'])) {
            return false;
        }

        $classSchedule = $this->classSchedule;
        $classDateTime = \Carbon\Carbon::parse($this->booking_date->format('Y-m-d') . ' ' . $classSchedule->start_time->format('H:i:s'));
        $hoursUntilClass = now()->diffInHours($classDateTime, false);

        return $hoursUntilClass >= $classSchedule->cancel_hours_before;
    }

    // Cancelar reserva
    public function cancel($reason = null): void
    {
        $this->status = 'cancelled';
        $this->cancelled_at = now();
        $this->cancellation_reason = $reason;
        $this->save();
    }

    // Marcar como asistido
    public function markAsAttended(): void
    {
        $this->status = 'attended';
        $this->save();

        // Incrementar contador de clases usadas en la membresía
        $membership = $this->client->memberships()->active()->first();
        if ($membership) {
            $membership->increment('classes_used');
        }
    }

    // Scope para reservas activas
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['reserved', 'confirmed']);
    }

    // Scope para hoy
    public function scopeToday($query)
    {
        return $query->where('booking_date', today());
    }
}
