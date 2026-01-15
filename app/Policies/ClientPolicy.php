<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view clients');
    }

    public function view(User $user, Client $client): bool
    {
        // Admin and trainers can view all clients
        if ($user->can('view clients')) {
            return true;
        }

        // Clients can only view their own data
        return $user->can('view own client data') && $user->id === $client->user_id;
    }

    public function create(User $user): bool
    {
        return $user->can('create clients');
    }

    public function update(User $user, Client $client): bool
    {
        return $user->can('edit clients');
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->can('delete clients');
    }
}
