import { usePage, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Dumbbell, TrendingUp } from 'lucide-react';

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
    };
    sets_completed: number;
    sets_planned: number;
    set_details: SetDetail[];
    completed: boolean;
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

interface Props {
    sessions: {
        data: WorkoutSession[];
        current_page: number;
        last_page: number;
    };
    client: {
        id: number;
        name: string;
    };
    breadcrumbs: any[];
    [key: string]: any;
}

export default function WorkoutHistory() {
    const { sessions, client, breadcrumbs } = usePage<Props>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const calculateTotalVolume = (exerciseLogs: ExerciseLog[]) => {
        return exerciseLogs.reduce((total, log) => {
            const exerciseVolume = log.set_details.reduce((sum, set) => {
                return sum + (set.completed ? set.reps * set.weight : 0);
            }, 0);
            return total + exerciseVolume;
        }, 0);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial de Entrenamientos" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Historial de Entrenamientos</h1>
                    <p className="text-muted-foreground mt-2">
                        Registro completo de las sesiones de entrenamiento de {client.name}
                    </p>
                </div>

                {sessions.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-lg text-muted-foreground">
                                No hay entrenamientos registrados aún
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {sessions.data.map(session => {
                            const totalVolume = calculateTotalVolume(session.exercise_logs);
                            const completedExercises = session.exercise_logs.filter(log => log.completed).length;
                            const totalExercises = session.exercise_logs.length;

                            return (
                                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl">{session.routine.name}</CardTitle>
                                                <CardDescription className="flex items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(session.started_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {session.duration_minutes} min
                                                    </span>
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="secondary" className="mb-2">
                                                    {completedExercises}/{totalExercises} ejercicios
                                                </Badge>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span className="font-semibold">{totalVolume.toFixed(0)} kg</span>
                                                    <span>volumen</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {session.exercise_logs.map((log, index) => (
                                                <div
                                                    key={log.id}
                                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline">{index + 1}</Badge>
                                                        <div>
                                                            <p className="font-medium">{log.exercise.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {log.exercise.muscle_group}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">
                                                            {log.sets_completed}/{log.sets_planned} series
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {log.set_details
                                                                .filter(s => s.completed)
                                                                .map(s => `${s.reps}×${s.weight}kg`)
                                                                .join(', ') || 'No completado'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {session.notes && (
                                            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                                                <p className="text-sm font-medium mb-1">Notas:</p>
                                                <p className="text-sm text-muted-foreground">{session.notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Paginación */}
                {sessions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {Array.from({ length: sessions.last_page }, (_, i) => (
                            <a
                                key={i + 1}
                                href={`/clients/${client.id}/workout-history?page=${i + 1}`}
                                className={`px-3 py-1 rounded ${
                                    sessions.current_page === i + 1
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                }`}
                            >
                                {i + 1}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
