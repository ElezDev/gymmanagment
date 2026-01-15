<?php

namespace App\Policies;

use App\Models\Routine;
use App\Models\User;

class RoutinePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view routines') || $user->can('view own routines');
    }

    public function view(User $user, Routine $routine): bool
    {
        // Admin and trainers can view all routines
        if ($user->can('view routines')) {
            return true;
        }

        // Clients can only view their assigned routines
        if ($user->can('view own routines') && $user->client) {
            return $routine->clients()->where('client_id', $user->client->id)->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->can('create routines');
    }

    public function update(User $user, Routine $routine): bool
    {
        return $user->can('edit routines');
    }

    public function delete(User $user, Routine $routine): bool
    {
        return $user->can('delete routines');
    }

    public function assign(User $user, Routine $routine): bool
    {
        return $user->can('assign routines');
    }
}
