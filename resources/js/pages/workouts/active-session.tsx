import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Dumbbell,
    Clock,
    CheckCircle2,
    Target,
    Repeat,
    Timer,
    Play,
    ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
    routine_exercises: RoutineExercise[];
}

interface WorkoutSession {
    id: number;
    routine_id: number;
    started_at: string;
    ended_at: string | null;
    completed: boolean;
    notes: string | null;
    routine: Routine;
}

interface Props {
    session: WorkoutSession;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mis Rutinas', href: '/my-routines' },
    { title: 'Entrenamiento Activo', href: '#' },
];

export default function ActiveSession({ session }: Props) {
    const [notes, setNotes] = useState('');
    const [completedExercises, setCompletedExercises] = useState<number[]>([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);

    useEffect(() => {
        const startTime = new Date(session.started_at).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const elapsed = Math.floor((now - startTime) / 1000);
            setElapsedTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [session.started_at]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleExercise = (exerciseId: number) => {
        setCompletedExercises((prev) =>
            prev.includes(exerciseId)
                ? prev.filter((id) => id !== exerciseId)
                : [...prev, exerciseId],
        );
    };

    const handleComplete = () => {
        router.post(`/workout-sessions/${session.id}/complete`, {
            notes,
        });
    };

    const progress = Math.round(
        (completedExercises.length / session.routine.routine_exercises.length) * 100,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Entrenamiento: ${session.routine.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold">{session.routine.name}</h1>
                            <Badge variant="default" className="bg-green-600">
                                En Progreso
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{session.routine.description}</p>
                    </div>
                </div>

                {/* Timer and Progress */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-primary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tiempo Transcurrido</CardTitle>
                            <Timer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                {formatTime(elapsedTime)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{progress}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {completedExercises.length} de {session.routine.routine_exercises.length}{' '}
                                ejercicios
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ejercicios Restantes</CardTitle>
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {session.routine.routine_exercises.length - completedExercises.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-3">
                    <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Exercises List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ejercicios</CardTitle>
                        <CardDescription>
                            Marca cada ejercicio al completarlo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {session.routine.routine_exercises
                                .sort((a, b) => a.order - b.order)
                                .map((routineExercise) => {
                                    const isCompleted = completedExercises.includes(
                                        routineExercise.id,
                                    );
                                    return (
                                        <div
                                            key={routineExercise.id}
                                            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                                                isCompleted
                                                    ? 'bg-green-500/10 border-green-500'
                                                    : 'hover:bg-accent/50'
                                            }`}
                                        >
                                            <button
                                                onClick={() => toggleExercise(routineExercise.id)}
                                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                                                    isCompleted
                                                        ? 'bg-green-600 border-green-600'
                                                        : 'border-muted-foreground'
                                                }`}
                                            >
                                                {isCompleted && (
                                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                                )}
                                            </button>

                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                                {routineExercise.order}
                                            </div>

                                            <div className="flex-1">
                                                <h4
                                                    className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
                                                >
                                                    {routineExercise.exercise.name}
                                                </h4>
                                                {routineExercise.exercise.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {routineExercise.exercise.description}
                                                    </p>
                                                )}
                                                {routineExercise.notes && (
                                                    <p className="text-sm text-primary/70 mt-1 italic">
                                                        💡 {routineExercise.notes}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="text-center">
                                                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                        <Repeat className="h-3 w-3" />
                                                        <span className="text-xs">Series</span>
                                                    </div>
                                                    <div className="font-semibold">
                                                        {routineExercise.sets}
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                        <Target className="h-3 w-3" />
                                                        <span className="text-xs">Reps</span>
                                                    </div>
                                                    <div className="font-semibold">
                                                        {routineExercise.reps}
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-xs">Descanso</span>
                                                    </div>
                                                    <div className="font-semibold">
                                                        {routineExercise.rest_seconds}s
                                                    </div>
                                                </div>
                                            </div>

                                            {routineExercise.exercise.video_url && (
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a
                                                        href={routineExercise.exercise.video_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Play className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notas del Entrenamiento</CardTitle>
                        <CardDescription>
                            Añade observaciones sobre este entrenamiento (opcional)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea
                                id="notes"
                                placeholder="Ej: Me sentí con mucha energía, logré aumentar el peso en press de banca..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Complete Button */}
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowCompleteDialog(true)}
                        className="flex-1 gap-2 text-lg py-6"
                        disabled={completedExercises.length === 0}
                    >
                        <CheckCircle2 className="h-5 w-5" />
                        Completar Entrenamiento
                    </Button>
                </div>

                {/* Complete Confirmation Dialog */}
                <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Completar entrenamiento?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Has completado {completedExercises.length} de{' '}
                                {session.routine.routine_exercises.length} ejercicios ({progress}%).
                                <br />
                                <br />
                                Se registrará este entrenamiento en tu historial con una duración de{' '}
                                <span className="font-semibold text-primary">
                                    {formatTime(elapsedTime)}
                                </span>
                                .
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleComplete}>
                                Sí, completar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
