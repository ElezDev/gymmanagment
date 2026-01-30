<?php

namespace App\Http\Controllers;

use App\Models\BodyMeasurement;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BodyMeasurementController extends Controller
{
    public function index(Client $client)
    {
        $measurements = BodyMeasurement::where('client_id', $client->id)
            ->with('measuredBy')
            ->latest('measurement_date')
            ->paginate(20);

        // Obtener primera y última medición para comparación
        $firstMeasurement = $client->bodyMeasurements()->oldest('measurement_date')->first();
        $latestMeasurement = $client->bodyMeasurements()->latest('measurement_date')->first();

        $progress = null;
        if ($firstMeasurement && $latestMeasurement && $firstMeasurement->id !== $latestMeasurement->id) {
            $progress = [
                'weight_change' => $latestMeasurement->weight - $firstMeasurement->weight,
                'body_fat_change' => $latestMeasurement->body_fat_percentage - $firstMeasurement->body_fat_percentage,
                'muscle_mass_change' => $latestMeasurement->muscle_mass - $firstMeasurement->muscle_mass,
            ];
        }

        return Inertia::render('body-measurements/index', [
            'client' => $client->load('user'),
            'measurements' => $measurements,
            'progress' => $progress,
        ]);
    }

    public function create(Client $client)
    {
        return Inertia::render('body-measurements/create', [
            'client' => $client->load('user'),
        ]);
    }

    public function store(Request $request, Client $client)
    {
        $validated = $request->validate([
            'measurement_date' => 'required|date',
            'weight' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'body_fat_percentage' => 'nullable|numeric|min:0|max:100',
            'muscle_mass' => 'nullable|numeric|min:0',
            'neck' => 'nullable|numeric|min:0',
            'chest' => 'nullable|numeric|min:0',
            'waist' => 'nullable|numeric|min:0',
            'hips' => 'nullable|numeric|min:0',
            'right_arm' => 'nullable|numeric|min:0',
            'left_arm' => 'nullable|numeric|min:0',
            'right_thigh' => 'nullable|numeric|min:0',
            'left_thigh' => 'nullable|numeric|min:0',
            'right_calf' => 'nullable|numeric|min:0',
            'left_calf' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'photo_front' => 'nullable|image|max:5120',
            'photo_side' => 'nullable|image|max:5120',
            'photo_back' => 'nullable|image|max:5120',
        ]);

        // Subir fotos si existen
        $photos = [];
        foreach (['photo_front', 'photo_side', 'photo_back'] as $photoField) {
            if ($request->hasFile($photoField)) {
                $photos[$photoField] = $request->file($photoField)->store('body-measurements', 'public');
            }
        }

        $measurement = BodyMeasurement::create([
            ...$validated,
            ...$photos,
            'client_id' => $client->id,
            'measured_by' => auth()->id(),
        ]);

        // Calcular BMI automáticamente
        if ($measurement->weight && $measurement->height) {
            $measurement->calculateBMI();
        }

        // Actualizar peso y altura del cliente
        $client->update([
            'weight' => $validated['weight'] ?? $client->weight,
            'height' => $validated['height'] ?? $client->height,
        ]);

        return redirect()->route('body-measurements.index', $client)
            ->with('success', 'Medición corporal registrada exitosamente');
    }

    public function show(Client $client, BodyMeasurement $bodyMeasurement)
    {
        $bodyMeasurement->load('measuredBy');

        return Inertia::render('body-measurements/show', [
            'client' => $client->load('user'),
            'measurement' => $bodyMeasurement,
        ]);
    }

    public function edit(Client $client, BodyMeasurement $bodyMeasurement)
    {
        return Inertia::render('body-measurements/edit', [
            'client' => $client->load('user'),
            'measurement' => $bodyMeasurement,
        ]);
    }

    public function update(Request $request, Client $client, BodyMeasurement $bodyMeasurement)
    {
        $validated = $request->validate([
            'measurement_date' => 'required|date',
            'weight' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'body_fat_percentage' => 'nullable|numeric|min:0|max:100',
            'muscle_mass' => 'nullable|numeric|min:0',
            'neck' => 'nullable|numeric|min:0',
            'chest' => 'nullable|numeric|min:0',
            'waist' => 'nullable|numeric|min:0',
            'hips' => 'nullable|numeric|min:0',
            'right_arm' => 'nullable|numeric|min:0',
            'left_arm' => 'nullable|numeric|min:0',
            'right_thigh' => 'nullable|numeric|min:0',
            'left_thigh' => 'nullable|numeric|min:0',
            'right_calf' => 'nullable|numeric|min:0',
            'left_calf' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'photo_front' => 'nullable|image|max:5120',
            'photo_side' => 'nullable|image|max:5120',
            'photo_back' => 'nullable|image|max:5120',
        ]);

        // Subir nuevas fotos si existen
        $photos = [];
        foreach (['photo_front', 'photo_side', 'photo_back'] as $photoField) {
            if ($request->hasFile($photoField)) {
                $photos[$photoField] = $request->file($photoField)->store('body-measurements', 'public');
            }
        }

        $bodyMeasurement->update([
            ...$validated,
            ...$photos,
        ]);

        // Recalcular BMI
        if ($bodyMeasurement->weight && $bodyMeasurement->height) {
            $bodyMeasurement->calculateBMI();
        }

        return redirect()->route('body-measurements.index', $client)
            ->with('success', 'Medición corporal actualizada exitosamente');
    }

    public function destroy(Client $client, BodyMeasurement $bodyMeasurement)
    {
        $bodyMeasurement->delete();

        return redirect()->route('body-measurements.index', $client)
            ->with('success', 'Medición corporal eliminada exitosamente');
    }

    // Obtener datos para gráficas
    public function charts(Client $client)
    {
        $measurements = $client->bodyMeasurements()
            ->orderBy('measurement_date')
            ->get();

        return response()->json([
            'weight' => $measurements->pluck('weight', 'measurement_date'),
            'body_fat' => $measurements->pluck('body_fat_percentage', 'measurement_date'),
            'muscle_mass' => $measurements->pluck('muscle_mass', 'measurement_date'),
            'waist' => $measurements->pluck('waist', 'measurement_date'),
        ]);
    }
}
