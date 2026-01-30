<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BodyMeasurement extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'measurement_date',
        'weight',
        'height',
        'body_fat_percentage',
        'muscle_mass',
        'bmi',
        'neck',
        'chest',
        'waist',
        'hips',
        'right_arm',
        'left_arm',
        'right_thigh',
        'left_thigh',
        'right_calf',
        'left_calf',
        'notes',
        'photo_front',
        'photo_side',
        'photo_back',
        'measured_by',
    ];

    protected $casts = [
        'measurement_date' => 'date',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'body_fat_percentage' => 'decimal:2',
        'muscle_mass' => 'decimal:2',
        'bmi' => 'decimal:2',
        'neck' => 'decimal:2',
        'chest' => 'decimal:2',
        'waist' => 'decimal:2',
        'hips' => 'decimal:2',
        'right_arm' => 'decimal:2',
        'left_arm' => 'decimal:2',
        'right_thigh' => 'decimal:2',
        'left_thigh' => 'decimal:2',
        'right_calf' => 'decimal:2',
        'left_calf' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function measuredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'measured_by');
    }

    // Calcular BMI automáticamente
    public function calculateBMI(): void
    {
        if ($this->weight && $this->height) {
            $heightInMeters = $this->height / 100;
            $this->bmi = $this->weight / ($heightInMeters * $heightInMeters);
            $this->save();
        }
    }

    // Obtener categoría de BMI
    public function getBMICategory(): string
    {
        if (!$this->bmi) return 'N/A';

        if ($this->bmi < 18.5) return 'Bajo peso';
        if ($this->bmi < 25) return 'Normal';
        if ($this->bmi < 30) return 'Sobrepeso';
        return 'Obesidad';
    }
}
