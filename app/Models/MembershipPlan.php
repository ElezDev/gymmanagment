<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_days',
        'billing_cycle',
        'features',
        'max_classes_per_week',
        'max_classes_per_month',
        'includes_nutrition_plan',
        'includes_personal_training',
        'personal_training_sessions',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
        'includes_nutrition_plan' => 'boolean',
        'includes_personal_training' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class);
    }

    public function activeMemberships(): HasMany
    {
        return $this->hasMany(Membership::class)->where('status', 'active');
    }

    // Scope para planes activos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Calcular fecha de fin basada en fecha de inicio
    public function calculateEndDate($startDate)
    {
        return \Carbon\Carbon::parse($startDate)->addDays($this->duration_days);
    }
}
