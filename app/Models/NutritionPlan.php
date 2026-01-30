<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NutritionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'is_active',
        'daily_calories_target',
        'protein_grams',
        'carbs_grams',
        'fats_grams',
        'meals_per_day',
        'water_liters',
        'meal_plan',
        'supplements',
        'restrictions',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'meal_plan' => 'array',
        'supplements' => 'array',
        'water_liters' => 'decimal:1',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scope para planes activos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Verificar si está activo
    public function isCurrentlyActive(): bool
    {
        if (!$this->is_active) return false;
        
        $now = now();
        if ($this->end_date && $this->end_date < $now) return false;
        
        return $this->start_date <= $now;
    }
}
