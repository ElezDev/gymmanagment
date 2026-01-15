<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'muscle_group',
        'difficulty',
        'video_url',
        'image_url',
    ];

    public function routineExercises(): HasMany
    {
        return $this->hasMany(RoutineExercise::class);
    }
}
