import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import {
    Dumbbell,
    Clock,
    Target,
    Play,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

interface Exercise {
    id: number;
    name: string;
    category: string;
    description: string | null;
    video_url: string | null;
}

interface RoutineExercise {
    id: number;
    sets: number;
    reps: string;
    rest_seconds: number;
    notes: string | null;
    order: number;
    exercise: Exercise;
}

interface Routine {
    id: number;
    name: string;
    description: string;
    difficulty: string;
    estimated_duration: number;
    is_active: boolean;
    created_at: string;
    routine_exercises: RoutineExercise[];
    pivot?: {
        assigned_date: string;
        is_active: boolean;
    };
}

interface Props {
    routines: Routine[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mis Rutinas', href: '/my-routines' },
];

const difficultyColors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500',
};

const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
};

export default function MyRoutines({ routines }: Props) {
    const [expandedRoutine, setExpandedRoutine] = useState<number | null>(null);

    const toggleRoutine = (routineId: number) => {
        setExpandedRoutine(expandedRoutine === routineId ? null : routineId);
    };

    const handleStartWorkout = (routineId: number) => {
        router.post('/my-workout-sessions/start', {
            routine_id: routineId,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Rutinas" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Mis Rutinas</h1>
                        <p className="text-muted-foreground">
                            Programas de entrenamiento asignados por tu entrenador
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                            <Dumbbell className="mr-1 h-4 w-4" />
                            {routines.length} rutinas activas
                        </Badge>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rutinas Activas</CardTitle>
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{routines.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Ejercicios</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {routines.reduce(
                                    (sum, routine) => sum + routine.routine_exercises.length,
                                    0,
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Duración Estimada</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.round(
                                    routines.reduce(
                                        (sum, routine) => sum + (routine.estimated_duration || 0),
                                        0,
                                    ) / routines.length || 0,
                                )}{' '}
                                min
                            </div>
                            <p className="text-xs text-muted-foreground">promedio por rutina</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">esta semana</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Routines List */}
                {routines.length > 0 ? (
                    <div className="grid gap-4">
                        {routines.map((routine) => {
                            const isExpanded = expandedRoutine === routine.id;

                            return (
                                <Card key={routine.id} className="overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <CardTitle className="text-2xl">
                                                        {routine.name}
                                                    </CardTitle>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`${
                                                            difficultyColors[
                                                                routine.difficulty as keyof typeof difficultyColors
                                                            ]
                                                        } text-white`}
                                                    >
                                                        {
                                                            difficultyLabels[
                                                                routine.difficulty as keyof typeof difficultyLabels
                                                            ]
                                                        }
                                                    </Badge>
                                                </div>
                                                <CardDescription className="text-base">
                                                    {routine.description}
                                                </CardDescription>
                                                
                                                {/* Routine Info */}
                                                <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                                                    <div className="flex items-center gap-2">
                                                        <Dumbbell className="h-4 w-4" />
                                                        <span>{routine.routine_exercises.length} ejercicios</span>
                                                    </div>
                                                    {routine.estimated_duration && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{routine.estimated_duration} min</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleRoutine(routine.id)}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp className="h-4 w-4 mr-1" />
                                                            Ocultar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="h-4 w-4 mr-1" />
                                                            Ver Ejercicios
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() => handleStartWorkout(routine.id)}
                                                    size="sm"
                                                >
                                                    <Play className="h-4 w-4 mr-1" />
                                                    Comenzar
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {isExpanded && (
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                {routine.routine_exercises
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((routineExercise, index) => (
                                                        <div
                                                            key={routineExercise.id}
                                                            className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                                                        >
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold">
                                                                    {routineExercise.exercise.name}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {routineExercise.exercise.category}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <div className="text-center">
                                                                    <p className="font-semibold">{routineExercise.sets}</p>
                                                                    <p className="text-xs text-muted-foreground">series</p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="font-semibold">{routineExercise.reps}</p>
                                                                    <p className="text-xs text-muted-foreground">reps</p>
                                                                </div>
                                                                {routineExercise.rest_seconds > 0 && (
                                                                    <div className="text-center">
                                                                        <p className="font-semibold">
                                                                            {routineExercise.rest_seconds}s
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">descanso</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Dumbbell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No tienes rutinas asignadas
                            </h3>
                            <p className="text-muted-foreground text-center max-w-md">
                                Tu entrenador aún no te ha asignado ninguna rutina. Contacta con él
                                para comenzar tu programa de entrenamiento.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
