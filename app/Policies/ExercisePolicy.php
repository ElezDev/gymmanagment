<?php

namespace App\Policies;

use App\Models\Exercise;
use App\Models\User;

class ExercisePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view exercises');
    }

    public function view(User $user, Exercise $exercise): bool
    {
        return $user->can('view exercises');
    }

    public function create(User $user): bool
    {
        return $user->can('create exercises');
    }

    public function update(User $user, Exercise $exercise): bool
    {
        return $user->can('edit exercises');
    }

    public function delete(User $user, Exercise $exercise): bool
    {
        return $user->can('delete exercises');
    }
}
