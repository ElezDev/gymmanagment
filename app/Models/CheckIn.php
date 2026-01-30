<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CheckIn extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'check_in_time',
        'check_out_time',
        'duration_minutes',
        'entry_method',
        'notes',
        'registered_by',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    // Calcular duración al hacer checkout
    public function calculateDuration(): void
    {
        if ($this->check_out_time) {
            $this->duration_minutes = $this->check_in_time->diffInMinutes($this->check_out_time);
            $this->save();
        }
    }

    // Scope para check-ins activos (sin checkout)
    public function scopeActive($query)
    {
        return $query->whereNull('check_out_time');
    }

    // Scope para check-ins de hoy
    public function scopeToday($query)
    {
        return $query->whereDate('check_in_time', today());
    }
}
