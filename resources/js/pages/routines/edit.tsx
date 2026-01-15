import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Exercise {
    id: number;
    name: string;
    category: string;
    muscle_group: string;
}

interface RoutineExercise {
    id: number;
    exercise_id: number;
    order: number;
    sets: number;
    reps: number;
    weight: number;
    rest_seconds: number;
}

interface Routine {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    routine_exercises: RoutineExercise[];
}

interface Props {
    routine: Routine;
    exercises: Exercise[];
}

interface SelectedExercise {
    id: number;
    order: number;
    sets: number;
    reps: number;
    weight: number;
    rest_seconds: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rutinas', href: '/routines' },
    { title: 'Editar', href: '#' },
];

export default function EditRoutine({ routine, exercises }: Props) {
    // Inicializar ejercicios seleccionados con los datos existentes
    const initialSelectedExercises: SelectedExercise[] = routine.routine_exercises.map((re) => ({
        id: re.exercise_id,
        order: re.order,
        sets: re.sets,
        reps: re.reps,
        weight: re.weight,
        rest_seconds: re.rest_seconds,
    }));

    const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>(
        initialSelectedExercises,
    );

    const { data, setData, put, processing, errors } = useForm({
        name: routine.name,
        description: routine.description || '',
        start_date: routine.start_date || '',
        end_date: routine.end_date || '',
        is_active: routine.is_active,
        exercises: initialSelectedExercises,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/routines/${routine.id}`);
    };

    const toggleExercise = (exerciseId: number) => {
        const isSelected = selectedExercises.find((e) => e.id === exerciseId);

        if (isSelected) {
            const updated = selectedExercises.filter((e) => e.id !== exerciseId);
            setSelectedExercises(updated);
            setData('exercises', updated);
        } else {
            const nextOrder = selectedExercises.length + 1;
            const updated = [
                ...selectedExercises,
                {
                    id: exerciseId,
                    order: nextOrder,
                    sets: 3,
                    reps: 10,
                    weight: 0,
                    rest_seconds: 60,
                },
            ];
            setSelectedExercises(updated);
            setData('exercises', updated);
        }
    };

    const updateExerciseConfig = (
        exerciseId: number,
        field: 'sets' | 'reps' | 'weight' | 'rest_seconds',
        value: number,
    ) => {
        const updated = selectedExercises.map((e) =>
            e.id === exerciseId ? { ...e, [field]: value } : e,
        );
        setSelectedExercises(updated);
        setData('exercises', updated);
    };

    const isExerciseSelected = (exerciseId: number) => {
        return selectedExercises.some((e) => e.id === exerciseId);
    };

    const getExerciseConfig = (exerciseId: number) => {
        return selectedExercises.find((e) => e.id === exerciseId);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${routine.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Editar Rutina</h1>
                        <p className="text-muted-foreground">Modifica la rutina de entrenamiento</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/routines">Cancelar</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información Básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nombre de la Rutina <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Rutina Full Body"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe los objetivos de esta rutina..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Fecha de Inicio</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Fecha de Fin</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked as boolean)
                                    }
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Rutina activa
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Selección de Ejercicios */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ejercicios</CardTitle>
                            <CardDescription>
                                Selecciona los ejercicios y configura series, repeticiones y peso
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {errors.exercises && (
                                <p className="text-sm text-red-500">{errors.exercises}</p>
                            )}
                            <div className="space-y-4">
                                {exercises.map((exercise) => (
                                    <div key={exercise.id} className="rounded-lg border p-4">
                                        <div className="flex items-start space-x-3">
                                            <Checkbox
                                                id={`exercise-${exercise.id}`}
                                                checked={isExerciseSelected(exercise.id)}
                                                onCheckedChange={() => toggleExercise(exercise.id)}
                                            />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor={`exercise-${exercise.id}`}
                                                    className="cursor-pointer font-medium"
                                                >
                                                    {exercise.name}
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    {exercise.category} · {exercise.muscle_group}
                                                </p>

                                                {isExerciseSelected(exercise.id) && (
                                                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                                                        <div className="space-y-2">
                                                            <Label>Series</Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    getExerciseConfig(exercise.id)
                                                                        ?.sets || 3
                                                                }
                                                                onChange={(e) =>
                                                                    updateExerciseConfig(
                                                                        exercise.id,
                                                                        'sets',
                                                                        parseInt(e.target.value) ||
                                                                            0,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Repeticiones</Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    getExerciseConfig(exercise.id)
                                                                        ?.reps || 10
                                                                }
                                                                onChange={(e) =>
                                                                    updateExerciseConfig(
                                                                        exercise.id,
                                                                        'reps',
                                                                        parseInt(e.target.value) ||
                                                                            0,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Peso (kg)</Label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.5"
                                                                value={
                                                                    getExerciseConfig(exercise.id)
                                                                        ?.weight || 0
                                                                }
                                                                onChange={(e) =>
                                                                    updateExerciseConfig(
                                                                        exercise.id,
                                                                        'weight',
                                                                        parseFloat(
                                                                            e.target.value,
                                                                        ) || 0,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Descanso (seg)</Label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="15"
                                                                value={
                                                                    getExerciseConfig(exercise.id)
                                                                        ?.rest_seconds || 60
                                                                }
                                                                onChange={(e) =>
                                                                    updateExerciseConfig(
                                                                        exercise.id,
                                                                        'rest_seconds',
                                                                        parseInt(e.target.value) ||
                                                                            0,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedExercises.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {selectedExercises.length} ejercicio(s) seleccionado(s)
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/routines">Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
