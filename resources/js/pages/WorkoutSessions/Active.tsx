import { useState } from 'react';
import { router, usePage, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, Dumbbell, Timer } from 'lucide-react';

interface SetDetail {
    set: number;
    reps: number;
    weight: number;
    completed: boolean;
}

interface ExerciseLog {
    id: number;
    exercise_id: number;
    order: number;
    sets_completed: number;
    sets_planned: number;
    set_details: SetDetail[];
    notes: string | null;
    completed: boolean;
    exercise: {
        id: number;
        name: string;
        description: string | null;
        muscle_group: string;
    };
}

interface WorkoutSession {
    id: number;
    client: { id: number; name: string };
    routine: { id: number; name: string };
    started_at: string;
    exercise_logs: ExerciseLog[];
}

export default function ActiveWorkoutSession() {
    const { session, breadcrumbs, auth } = usePage<{ 
        session: WorkoutSession; 
        breadcrumbs: any[];
        auth: {
            user: {
                client?: { id: number };
            };
        };
    }>().props;
    const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(session.exercise_logs);
    const [sessionNotes, setSessionNotes] = useState('');
    
    // Verificar si el usuario actual es el cliente dueño de la sesión
    const isOwnSession = auth?.user?.client?.id === session.client.id;

    const startTime = new Date(session.started_at);
    const [elapsedTime, setElapsedTime] = useState(Math.floor((Date.now() - startTime.getTime()) / 1000));

    // Actualizar el tiempo transcurrido cada segundo
    useState(() => {
        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    });

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const updateSet = (exerciseLogId: number, setNumber: number, field: 'reps' | 'weight' | 'completed', value: any) => {
        setExerciseLogs(logs =>
            logs.map(log => {
                if (log.id !== exerciseLogId) return log;

                const setDetails = [...(log.set_details || [])];
                const setIndex = setDetails.findIndex(s => s.set === setNumber);

                if (setIndex === -1) {
                    // Crear nuevo set
                    setDetails.push({
                        set: setNumber,
                        reps: field === 'reps' ? Number(value) : 0,
                        weight: field === 'weight' ? Number(value) : 0,
                        completed: field === 'completed' ? value : false,
                    });
                } else {
                    // Actualizar set existente
                    setDetails[setIndex] = {
                        ...setDetails[setIndex],
                        [field]: field === 'completed' ? value : Number(value),
                    };
                }

                const completedSets = setDetails.filter(s => s.completed).length;
                const allSetsCompleted = completedSets === log.sets_planned;

                return {
                    ...log,
                    set_details: setDetails,
                    sets_completed: completedSets,
                    completed: allSetsCompleted,
                };
            })
        );
    };

    const saveExerciseProgress = (exerciseLog: ExerciseLog) => {
        router.put(
            `/workout-sessions/exercises/${exerciseLog.id}`,
            {
                set_details: JSON.stringify(exerciseLog.set_details),
                sets_completed: exerciseLog.sets_completed,
                notes: exerciseLog.notes,
                completed: exerciseLog.completed,
            },
            { preserveState: true }
        );
    };

    const completeWorkout = () => {
        if (confirm('¿Deseas completar este entrenamiento?')) {
            const route = isOwnSession 
                ? `/my-workout-sessions/${session.id}/complete`
                : `/workout-sessions/${session.id}/complete`;
            router.post(route, {
                notes: sessionNotes,
            });
        }
    };

    const completedExercises = exerciseLogs.filter(log => log.completed).length;
    const totalExercises = exerciseLogs.length;
    const progressPercentage = (completedExercises / totalExercises) * 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entrenamiento Activo" />
            <div className="space-y-6">
                {/* Header con información de la sesión */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl">Entrenamiento en Curso</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    {session.client.name} - {session.routine.name}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <Timer className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</p>
                                    <p className="text-xs text-muted-foreground">Tiempo</p>
                                </div>
                                <div className="text-center">
                                    <Dumbbell className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-2xl font-bold">{completedExercises}/{totalExercises}</p>
                                    <p className="text-xs text-muted-foreground">Ejercicios</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de ejercicios */}
                <div className="space-y-4">
                    {exerciseLogs.map((log, index) => (
                        <Card key={log.id} className={log.completed ? 'border-green-500' : ''}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <Badge variant="outline" className="mt-1">
                                            {index + 1}
                                        </Badge>
                                        <div>
                                            <CardTitle className="text-xl">{log.exercise.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {log.exercise.muscle_group} - {log.sets_planned} series
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {log.completed && (
                                        <Badge className="bg-green-500">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Completado
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Series */}
                                <div className="space-y-2">
                                    {Array.from({ length: log.sets_planned }, (_, i) => {
                                        const setNumber = i + 1;
                                        const setData = log.set_details?.find(s => s.set === setNumber) || {
                                            set: setNumber,
                                            reps: 0,
                                            weight: 0,
                                            completed: false,
                                        };

                                        return (
                                            <div
                                                key={setNumber}
                                                className={`flex items-center gap-3 p-3 rounded-lg border ${
                                                    setData.completed ? 'bg-green-50 border-green-200' : 'bg-muted/50'
                                                }`}
                                            >
                                                <button
                                                    onClick={() =>
                                                        updateSet(log.id, setNumber, 'completed', !setData.completed)
                                                    }
                                                    className="shrink-0"
                                                >
                                                    {setData.completed ? (
                                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                                    ) : (
                                                        <Circle className="h-6 w-6 text-muted-foreground" />
                                                    )}
                                                </button>

                                                <div className="flex-1 grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="text-xs text-muted-foreground">Serie</label>
                                                        <p className="font-semibold">{setNumber}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground block mb-1">
                                                            Reps
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={setData.reps || ''}
                                                            onChange={e =>
                                                                updateSet(log.id, setNumber, 'reps', e.target.value)
                                                            }
                                                            className="h-8"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground block mb-1">
                                                            Peso (kg)
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.5"
                                                            value={setData.weight || ''}
                                                            onChange={e =>
                                                                updateSet(log.id, setNumber, 'weight', e.target.value)
                                                            }
                                                            className="h-8"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button onClick={() => saveExerciseProgress(log)} variant="outline" size="sm">
                                    Guardar Progreso
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Notas finales y botón de completar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notas de la Sesión</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Agregar notas sobre el entrenamiento..."
                            value={sessionNotes}
                            onChange={e => setSessionNotes(e.target.value)}
                            rows={3}
                        />

                        <Button
                            onClick={completeWorkout}
                            className="w-full"
                            size="lg"
                            disabled={completedExercises === 0}
                        >
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Completar Entrenamiento
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
