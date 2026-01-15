<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::with(['user', 'routines', 'progressLogs'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('clients/index', [
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        return Inertia::render('clients/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'medical_notes' => 'nullable|string',
            'goals' => 'nullable|string',
            'membership_start' => 'nullable|date',
            'membership_end' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        // Crear el usuario primero
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'email_verified_at' => now(), // Verificar email automáticamente
        ]);

        // Crear el cliente asociado al usuario
        $client = Client::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'height' => $validated['height'] ?? null,
            'weight' => $validated['weight'] ?? null,
            'medical_notes' => $validated['medical_notes'] ?? null,
            'goals' => $validated['goals'] ?? null,
            'membership_start' => $validated['membership_start'] ?? now(),
            'membership_end' => $validated['membership_end'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('clients.show', $client->id)
            ->with('success', 'Cliente y usuario creados exitosamente');
    }

    public function show(Client $client)
    {
        $client->load([
            'user',
            'routines' => function ($query) {
                $query->orderBy('start_date', 'desc');
            },
            'progressLogs' => function ($query) {
                $query->orderBy('log_date', 'desc')->take(10);
            },
            'workoutSessions' => function ($query) {
                $query->with('routine')->orderBy('started_at', 'desc')->take(10);
            },
        ]);

        return Inertia::render('clients/show', [
            'client' => $client,
        ]);
    }

    public function edit(Client $client)
    {
        $client->load('user');

        return Inertia::render('clients/edit', [
            'client' => $client,
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'phone' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'medical_notes' => 'nullable|string',
            'goals' => 'nullable|string',
            'membership_start' => 'nullable|date',
            'membership_end' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $client->update([
            'phone' => $validated['phone'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'height' => $validated['height'] ?? null,
            'weight' => $validated['weight'] ?? null,
            'medical_notes' => $validated['medical_notes'] ?? null,
            'goals' => $validated['goals'] ?? null,
            'membership_start' => $validated['membership_start'] ?? null,
            'membership_end' => $validated['membership_end'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('clients.show', $client->id)
            ->with('success', 'Cliente actualizado exitosamente');
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', 'Cliente eliminado exitosamente');
    }
}
