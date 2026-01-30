import { usePage, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Dumbbell, TrendingUp, ArrowLeft } from 'lucide-react';

interface SetDetail {
    set: number;
    reps: number;
    weight: number;
    completed: boolean;
}

interface ExerciseLog {
    id: number;
    exercise: {
        name: string;
        muscle_group: string;
        description: string | null;
    };
    sets_completed: number;
    sets_planned: number;
    set_details: SetDetail[];
    completed: boolean;
    notes: string | null;
}

interface WorkoutSession {
    id: number;
    client: { id: number; name: string };
    routine: { id: number; name: string };
    started_at: string;
    ended_at: string;
    duration_minutes: number;
    notes: string | null;
    exercise_logs: ExerciseLog[];
}

export default function ShowWorkoutSession() {
    const { session, breadcrumbs } = usePage<{ session: WorkoutSession; breadcrumbs: any[] }>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const calculateTotalVolume = () => {
        return session.exercise_logs.reduce((total, log) => {
            const exerciseVolume = log.set_details.reduce((sum, set) => {
                return sum + (set.completed ? set.reps * set.weight : 0);
            }, 0);
            return total + exerciseVolume;
        }, 0);
    };

    const totalVolume = calculateTotalVolume();
    const completedExercises = session.exercise_logs.filter(log => log.completed).length;
    const totalExercises = session.exercise_logs.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detalle del Entrenamiento" />
            <div className="space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-3xl">{session.routine.name}</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    {session.client.name}
                                </CardDescription>
                            </div>
                            <Button variant="outline" asChild>
                                <a href={`/clients/${session.client.id}/workout-history`}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver
                                </a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha</p>
                                    <p className="font-semibold">{formatDate(session.started_at)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Duración</p>
                                    <p className="font-semibold">{session.duration_minutes} minutos</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Dumbbell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Ejercicios</p>
                                    <p className="font-semibold">{completedExercises}/{totalExercises}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Volumen Total</p>
                                    <p className="font-semibold">{totalVolume.toFixed(0)} kg</p>
                                </div>
                            </div>
                        </div>

                        {session.notes && (
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium mb-1">Notas de la sesión:</p>
                                <p className="text-sm text-muted-foreground">{session.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Ejercicios realizados */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Ejercicios Realizados</h2>
                    {session.exercise_logs.map((log, index) => {
                        const volume = log.set_details.reduce((sum, set) => {
                            return sum + (set.completed ? set.reps * set.weight : 0);
                        }, 0);

                        return (
                            <Card key={log.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <Badge variant="outline">{index + 1}</Badge>
                                            <div>
                                                <CardTitle className="text-xl">{log.exercise.name}</CardTitle>
                                                <CardDescription className="mt-1">
                                                    {log.exercise.muscle_group}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={log.completed ? 'bg-green-500' : 'bg-yellow-500'}>
                                                {log.completed ? 'Completado' : 'Parcial'}
                                            </Badge>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {log.sets_completed}/{log.sets_planned} series
                                            </p>
                                            <p className="text-sm font-semibold mt-1">
                                                Volumen: {volume.toFixed(0)} kg
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-3">
                                            <div className="col-span-2">Serie</div>
                                            <div className="col-span-3">Repeticiones</div>
                                            <div className="col-span-3">Peso (kg)</div>
                                            <div className="col-span-3">Volumen</div>
                                            <div className="col-span-1">Estado</div>
                                        </div>
                                        {log.set_details.map((set) => (
                                            <div
                                                key={set.set}
                                                className={`grid grid-cols-12 gap-2 p-3 rounded-lg ${
                                                    set.completed ? 'bg-green-50' : 'bg-muted/30'
                                                }`}
                                            >
                                                <div className="col-span-2 font-semibold">#{set.set}</div>
                                                <div className="col-span-3">{set.reps}</div>
                                                <div className="col-span-3">{set.weight}</div>
                                                <div className="col-span-3 font-semibold">
                                                    {(set.reps * set.weight).toFixed(0)} kg
                                                </div>
                                                <div className="col-span-1">
                                                    {set.completed ? '✅' : '⏸️'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {log.notes && (
                                        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                                            <p className="text-sm font-medium mb-1">Notas:</p>
                                            <p className="text-sm text-muted-foreground">{log.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
