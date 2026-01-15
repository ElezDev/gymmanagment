import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/stats-card';
import { ActivityCalendar } from '@/components/activity-calendar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Dumbbell,
    TrendingUp,
    Award,
    Calendar,
    Target,
    Activity,
    Clock,
    Zap,
    Flame,
    TrendingDown,
    Pill,
    MessageSquare,
    ArrowRight,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

interface Stats {
    active_routines: number;
    total_workouts: number;
    achievements: number;
    days_until_expiry: number | null;
    workouts_this_month: number;
    workouts_this_week: number;
    consistency_rate: number;
    weight_change: number | null;
    last_workout_date: string | null;
}

interface ProgressLog {
    id: number;
    log_date: string;
    weight: number;
    notes: string;
}

interface Routine {
    id: number;
    name: string;
    description: string;
    routine_exercises: Array<{
        exercise: {
            name: string;
            category: string;
        };
        sets: number;
        reps: string;
    }>;
}

interface WorkoutSession {
    id: number;
    routine: {
        name: string;
    };
    started_at: string;
    ended_at: string | null;
    completed: boolean;
}

interface Achievement {
    id: number;
    title: string;
    description: string;
    achieved_at: string;
}

interface Note {
    id: number;
    content: string;
    created_at: string;
}

interface Supplement {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    notes: string | null;
    is_active: boolean;
}

interface Client {
    id: number;
    weight: number;
    height: number;
    goals: string;
    membership_end: string;
    routines: Routine[];
    progress_logs: ProgressLog[];
    workout_sessions: WorkoutSession[];
    achievements: Achievement[];
    notes: Note[];
    supplements: Supplement[];
}

interface Props {
    client: Client;
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function ClientDashboard({ client, stats }: Props) {
    // Preparar datos para gráfica de progreso de peso
    const weightProgressData = client.progress_logs
        .slice(0, 10)
        .reverse()
        .map((log) => ({
            date: new Date(log.log_date).toLocaleDateString('es', {
                day: 'numeric',
                month: 'short',
            }),
            peso: log.weight,
        }));

    // Datos para gráfica de entrenamientos semanales
    const workoutsByWeek = client.workout_sessions
        .slice(0, 7)
        .reverse()
        .reduce((acc: any[], session) => {
            const day = new Date(session.started_at).toLocaleDateString('es', {
                weekday: 'short',
            });
            const existing = acc.find((item) => item.day === day);
            if (existing) {
                existing.entrenamientos += 1;
            } else {
                acc.push({ day, entrenamientos: 1 });
            }
            return acc;
        }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold">¡Bienvenido de vuelta!</h1>
                    <p className="text-muted-foreground">Aquí está tu progreso y rutinas</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <StatsCard
                        title="Rutinas Activas"
                        value={stats.active_routines}
                        description="Programas asignados"
                        icon={Dumbbell}
                    />
                    <StatsCard
                        title="Esta Semana"
                        value={stats.workouts_this_week}
                        description="Entrenamientos completados"
                        icon={Flame}
                        trend={{ value: 20, isPositive: true }}
                    />
                    <StatsCard
                        title="Consistencia"
                        value={`${stats.consistency_rate}%`}
                        description="Últimos 30 días"
                        icon={Target}
                    />
                    <StatsCard
                        title="Logros"
                        value={stats.achievements}
                        description="Metas alcanzadas"
                        icon={Award}
                    />
                    <Card
                        className={`hover:shadow-lg transition-shadow ${
                            stats.days_until_expiry !== null && stats.days_until_expiry < 30
                                ? 'border-orange-500'
                                : ''
                        }`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Membresía</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.days_until_expiry !== null
                                    ? `${stats.days_until_expiry} días`
                                    : 'N/A'}
                            </div>
                            {stats.days_until_expiry !== null && stats.days_until_expiry < 30 && (
                                <p className="text-xs text-orange-600 mt-1 font-medium">
                                    ¡Renueva pronto!
                                </p>
                            )}
                            {stats.days_until_expiry !== null && stats.days_until_expiry >= 30 && (
                                <p className="text-xs text-green-600 mt-1">Activa</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Próximo Entrenamiento y Cambio de Peso */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Próximo Entrenamiento */}
                    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Siguiente Paso</CardTitle>
                                    <CardDescription>
                                        {stats.last_workout_date
                                            ? `Último entrenamiento: ${new Date(stats.last_workout_date).toLocaleDateString('es', { day: 'numeric', month: 'long' })}`
                                            : 'Comienza tu primera sesión'}
                                    </CardDescription>
                                </div>
                                <Zap className="h-8 w-8 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <p className="text-sm font-medium">
                                    {client.routines.length > 0
                                        ? '¡Es hora de entrenar!'
                                        : 'Espera a que te asignen una rutina'}
                                </p>
                                {client.routines.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Activity className="h-4 w-4" />
                                            <span>{client.routines[0].name}</span>
                                        </div>
                                        <Button asChild className="w-full">
                                            <Link href="/my-routines">
                                                <ArrowRight className="mr-2 h-4 w-4" />
                                                Comenzar Entrenamiento
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cambio de Peso */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Progreso de Peso</CardTitle>
                                    <CardDescription>Desde el inicio</CardDescription>
                                </div>
                                {stats.weight_change !== null && (
                                    stats.weight_change > 0 ? (
                                        <TrendingUp className="h-8 w-8 text-primary" />
                                    ) : stats.weight_change < 0 ? (
                                        <TrendingDown className="h-8 w-8 text-primary" />
                                    ) : null
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {stats.weight_change !== null ? (
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold">
                                            {stats.weight_change > 0 ? '+' : ''}
                                            {stats.weight_change.toFixed(1)} kg
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {stats.weight_change > 0
                                            ? 'Has ganado peso'
                                            : stats.weight_change < 0
                                            ? 'Has perdido peso'
                                            : 'Peso estable'}
                                    </p>
                                    {client.progress_logs.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Última medición:{' '}
                                            {new Date(client.progress_logs[0].log_date).toLocaleDateString('es', {
                                                day: 'numeric',
                                                month: 'long',
                                            })}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Registra tu primer peso para ver el progreso
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Calendar */}
                <ActivityCalendar workoutSessions={client.workout_sessions} />

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Progreso de Peso */}
                    {weightProgressData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Progreso de Peso</CardTitle>
                                <CardDescription>Evolución de tu peso corporal</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={weightProgressData}>
                                        <defs>
                                            <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="date" className="text-sm" />
                                        <YAxis className="text-sm" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="peso"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorPeso)"
                                            name="Peso (kg)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actividad Semanal */}
                    {workoutsByWeek.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Actividad Semanal</CardTitle>
                                <CardDescription>Entrenamientos esta semana</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={workoutsByWeek}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="day" className="text-sm" />
                                        <YAxis className="text-sm" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Bar
                                            dataKey="entrenamientos"
                                            fill="#10b981"
                                            radius={[8, 8, 0, 0]}
                                            name="Entrenamientos"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* My Routines */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Mis Rutinas</CardTitle>
                                    <CardDescription>Programas de entrenamiento activos</CardDescription>
                                </div>
                                <Dumbbell className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {client.routines.length > 0 ? (
                                    <>
                                        {client.routines.slice(0, 3).map((routine) => (
                                            <div
                                                key={routine.id}
                                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {routine.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {routine.routine_exercises.length} ejercicios
                                                    </p>
                                                </div>
                                                <Badge variant="default">Activa</Badge>
                                            </div>
                                        ))}
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/my-routines">
                                                <Target className="mr-2 h-4 w-4" />
                                                Ver todas mis rutinas
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            No tienes rutinas asignadas aún
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Workouts */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Entrenamientos Recientes</CardTitle>
                                    <CardDescription>Tus últimas sesiones</CardDescription>
                                </div>
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {client.workout_sessions.length > 0 ? (
                                    client.workout_sessions.slice(0, 5).map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-full ${session.completed ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}
                                                >
                                                    {session.completed ? (
                                                        <Zap className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Clock className="h-4 w-4 text-yellow-600" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {session.routine.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            session.started_at,
                                                        ).toLocaleDateString('es', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            {session.completed ? (
                                                <Badge variant="default" className="bg-green-600">
                                                    Completado
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">En progreso</Badge>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            No hay entrenamientos registrados
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Progress */}
                    {client.progress_logs.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Progreso Reciente</CardTitle>
                                        <CardDescription>Últimas mediciones</CardDescription>
                                    </div>
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {client.progress_logs.slice(0, 5).map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex items-center justify-between p-3 rounded-lg border"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {log.weight} kg
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(log.log_date).toLocaleDateString('es', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                    })}
                                                </p>
                                            </div>
                                            {log.notes && (
                                                <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                                                    {log.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Achievements */}
                    {client.achievements.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Logros Recientes</CardTitle>
                                        <CardDescription>Tus últimos logros</CardDescription>
                                    </div>
                                    <Award className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {client.achievements.slice(0, 5).map((achievement) => (
                                        <div
                                            key={achievement.id}
                                            className="flex items-start gap-3 p-3 rounded-lg border bg-accent/30"
                                        >
                                            <div className="p-2 rounded-full bg-primary/10">
                                                <Award className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {achievement.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {achievement.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        achievement.achieved_at,
                                                    ).toLocaleDateString('es', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Suplementos y Notas del Entrenador */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Suplementos */}
                    {client.supplements && client.supplements.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Mis Suplementos</CardTitle>
                                        <CardDescription>Plan de suplementación activo</CardDescription>
                                    </div>
                                    <Pill className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {client.supplements.map((supplement) => (
                                        <div
                                            key={supplement.id}
                                            className="flex items-start gap-3 p-3 rounded-lg border bg-accent/30"
                                        >
                                            <div className="p-2 rounded-full bg-primary/10">
                                                <Pill className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {supplement.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {supplement.dosage} - {supplement.frequency}
                                                </p>
                                                {supplement.notes && (
                                                    <p className="text-xs text-muted-foreground italic">
                                                        {supplement.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant="default" className="bg-green-600">
                                                Activo
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notas del Entrenador */}
                    {client.notes && client.notes.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Notas del Entrenador</CardTitle>
                                        <CardDescription>Mensajes y recomendaciones</CardDescription>
                                    </div>
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {client.notes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="p-4 rounded-lg border bg-accent/20 space-y-2"
                                        >
                                            <p className="text-sm leading-relaxed">{note.content}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(note.created_at).toLocaleDateString('es', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Goals */}
                {client.goals && (
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                <CardTitle>Mis Objetivos</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{client.goals}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
