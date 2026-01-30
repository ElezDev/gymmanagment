<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'membership_plan_id',
        'start_date',
        'end_date',
        'status',
        'amount_paid',
        'discount_amount',
        'discount_reason',
        'notes',
        'auto_renew',
        'classes_used',
        'training_sessions_used',
        'sold_by',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'amount_paid' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'auto_renew' => 'boolean',
        'cancelled_at' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function membershipPlan(): BelongsTo
    {
        return $this->belongsTo(MembershipPlan::class);
    }

    public function soldBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sold_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('end_date', '>=', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('end_date', '<', now())
            ->whereIn('status', ['active', 'expired']);
    }

    public function scopeExpiringSoon($query, $days = 7)
    {
        return $query->where('status', 'active')
            ->whereBetween('end_date', [now(), now()->addDays($days)]);
    }

    // Verificar si está activa
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->end_date >= now();
    }

    // Días restantes
    public function daysRemaining(): int
    {
        if ($this->end_date < now()) {
            return 0;
        }
        return now()->diffInDays($this->end_date);
    }

    // Verificar si puede usar clases
    public function canUseClasses(): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        $plan = $this->membershipPlan;
        
        if ($plan->max_classes_per_month && $this->classes_used >= $plan->max_classes_per_month) {
            return false;
        }

        return true;
    }
}
