<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ProgressLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgressLogController extends Controller
{
    public function index(Client $client)
    {
        $progressLogs = $client->progressLogs()
            ->orderBy('log_date', 'desc')
            ->get();

        return Inertia::render('Progress/Index', [
            'client' => $client->load('user'),
            'progressLogs' => $progressLogs,
        ]);
    }

    public function create(Client $client)
    {
        return Inertia::render('Progress/Create', [
            'client' => $client->load('user'),
        ]);
    }

    public function store(Request $request, Client $client)
    {
        $validated = $request->validate([
            'log_date' => 'required|date',
            'weight' => 'nullable|numeric|min:0',
            'body_fat_percentage' => 'nullable|numeric|min:0|max:100',
            'muscle_mass' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'measurements' => 'nullable|array',
            'measurements.chest' => 'nullable|numeric|min:0',
            'measurements.waist' => 'nullable|numeric|min:0',
            'measurements.hips' => 'nullable|numeric|min:0',
            'measurements.arms' => 'nullable|numeric|min:0',
            'measurements.thighs' => 'nullable|numeric|min:0',
        ]);

        $progressLog = $client->progressLogs()->create($validated);

        return redirect()->route('progress.index', $client->id)
            ->with('success', 'Progreso registrado exitosamente');
    }

    public function edit(Client $client, ProgressLog $progressLog)
    {
        return Inertia::render('Progress/Edit', [
            'client' => $client->load('user'),
            'progressLog' => $progressLog,
        ]);
    }

    public function update(Request $request, Client $client, ProgressLog $progressLog)
    {
        $validated = $request->validate([
            'log_date' => 'required|date',
            'weight' => 'nullable|numeric|min:0',
            'body_fat_percentage' => 'nullable|numeric|min:0|max:100',
            'muscle_mass' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'measurements' => 'nullable|array',
        ]);

        $progressLog->update($validated);

        return redirect()->route('progress.index', $client->id)
            ->with('success', 'Progreso actualizado exitosamente');
    }

    public function destroy(Client $client, ProgressLog $progressLog)
    {
        $progressLog->delete();

        return redirect()->route('progress.index', $client->id)
            ->with('success', 'Registro eliminado exitosamente');
    }
}
