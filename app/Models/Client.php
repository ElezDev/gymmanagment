<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'membership_number',
        'photo',
        'phone',
        'birth_date',
        'gender',
        'height',
        'weight',
        'medical_notes',
        'goals',
        'emergency_contact_name',
        'emergency_contact_phone',
        'membership_start',
        'membership_end',
        'membership_status',
        'suspension_reason',
        'suspended_at',
        'is_active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'membership_start' => 'date',
        'membership_end' => 'date',
        'suspended_at' => 'datetime',
        'height' => 'decimal:2',
        'weight' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function routines(): BelongsToMany
    {
        return $this->belongsToMany(Routine::class, 'client_routine')
            ->withPivot(['assigned_date', 'is_active'])
            ->withTimestamps();
    }

    public function progressLogs(): HasMany
    {
        return $this->hasMany(ProgressLog::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class);
    }

    public function workoutSessions(): HasMany
    {
        return $this->hasMany(WorkoutSession::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(ClientNote::class);
    }

    public function supplements(): HasMany
    {
        return $this->hasMany(ClientSupplement::class);
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class);
    }

    public function activeMembership()
    {
        return $this->hasOne(Membership::class)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->latest('start_date');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function checkIns(): HasMany
    {
        return $this->hasMany(CheckIn::class);
    }

    public function bodyMeasurements(): HasMany
    {
        return $this->hasMany(BodyMeasurement::class);
    }

    public function classBookings(): HasMany
    {
        return $this->hasMany(ClassBooking::class);
    }

    public function nutritionPlans(): HasMany
    {
        return $this->hasMany(NutritionPlan::class);
    }

    public function activeNutritionPlan()
    {
        return $this->hasOne(NutritionPlan::class)
            ->where('is_active', true)
            ->latest('start_date');
    }

    public function getPhotoUrlAttribute()
    {
        if ($this->photo) {
            return asset('storage/' . $this->photo);
        }
        return null;
    }

    // Generar número de membresía único
    public static function generateMembershipNumber(): string
    {
        $year = now()->year;
        $lastClient = self::whereYear('created_at', $year)
            ->whereNotNull('membership_number')
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = $lastClient ? intval(substr($lastClient->membership_number, -5)) + 1 : 1;
        
        return sprintf('MEM-%d-%05d', $year, $nextNumber);
    }

    // Verificar si tiene membresía activa
    public function hasActiveMembership(): bool
    {
        return $this->activeMembership()->exists();
    }
}
