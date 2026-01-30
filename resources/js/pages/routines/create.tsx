import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Exercise {
    id: number;
    name: string;
    category: string;
    muscle_group: string;
}

interface Props {
    exercises: Exercise[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rutinas', href: '/routines' },
    { title: 'Crear', href: '/routines/create' },
];

export default function CreateRoutine({ exercises }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        is_active: true,
        exercises: [] as any[],
    });

    const [selectedExercises, setSelectedExercises] = useState<number[]>([]);

    const handleExerciseToggle = (exerciseId: number) => {
        if (selectedExercises.includes(exerciseId)) {
            setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId));
            setData(
                'exercises',
                data.exercises.filter((ex) => ex.id !== exerciseId),
            );
        } else {
            setSelectedExercises([...selectedExercises, exerciseId]);
            setData('exercises', [
                ...data.exercises,
                {
                    id: exerciseId,
                    sets: 3,
                    reps: 10,
                    weight: 0,
                    duration_seconds: 0,
                    rest_seconds: 60,
                    order: data.exercises.length + 1,
                    notes: '',
                },
            ]);
        }
    };

    const updateExerciseData = (exerciseId: number, field: string, value: any) => {
        setData(
            'exercises',
            data.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, [field]: value } : ex,
            ),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/routines');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Rutina" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Crear Rutina</h1>
                        <p className="text-muted-foreground">
                            Crea una nueva rutina de entrenamiento
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/routines">Cancelar</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nombre <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Rutina Full Body"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 pt-8">
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Descripción de la rutina..."
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
                        </CardContent>
                    </Card>

                    {/* Ejercicios */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ejercicios</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {exercises.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No hay ejercicios disponibles.{' '}
                                    <Link href="/exercises/create" className="text-primary">
                                        Crear ejercicio
                                    </Link>
                                </p>
                            ) : (
                                exercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className="space-y-4 rounded-lg border p-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`ex-${exercise.id}`}
                                                checked={selectedExercises.includes(exercise.id)}
                                                onCheckedChange={() =>
                                                    handleExerciseToggle(exercise.id)
                                                }
                                            />
                                            <Label
                                                htmlFor={`ex-${exercise.id}`}
                                                className="cursor-pointer font-medium"
                                            >
                                                {exercise.name}
                                            </Label>
                                            <span className="text-sm text-muted-foreground">
                                                {exercise.category} - {exercise.muscle_group}
                                            </span>
                                        </div>

                                        {selectedExercises.includes(exercise.id) && (
                                            <div className="grid gap-4 md:grid-cols-4">
                                                <div className="space-y-2">
                                                    <Label>Series</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        defaultValue="3"
                                                        onChange={(e) =>
                                                            updateExerciseData(
                                                                exercise.id,
                                                                'sets',
                                                                parseInt(e.target.value),
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Repeticiones</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        defaultValue="10"
                                                        onChange={(e) =>
                                                            updateExerciseData(
                                                                exercise.id,
                                                                'reps',
                                                                parseInt(e.target.value),
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
                                                        defaultValue="0"
                                                        onChange={(e) =>
                                                            updateExerciseData(
                                                                exercise.id,
                                                                'weight',
                                                                parseFloat(e.target.value),
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Descanso (seg)</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        defaultValue="60"
                                                        onChange={(e) =>
                                                            updateExerciseData(
                                                                exercise.id,
                                                                'rest_seconds',
                                                                parseInt(e.target.value),
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/routines">Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creando...' : 'Crear Rutina'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
