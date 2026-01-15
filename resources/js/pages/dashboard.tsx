import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/stats-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import {
    Users,
    Activity,
    Dumbbell,
    TrendingUp,
    Calendar,
    Award,
    Clock,
    Target,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    stats: {
        total_clients: number;
        total_exercises: number;
        total_routines: number;
        total_users: number;
        active_clients_today?: number;
        new_clients_this_month?: number;
    };
    monthlyData?: Array<{
        month: string;
        clients: number;
        sessions: number;
    }>;
}

// Datos de ejemplo para las gráficas
const monthlyActivityData = [
    { month: 'Ene', clientes: 45, sesiones: 320 },
    { month: 'Feb', clientes: 52, sesiones: 380 },
    { month: 'Mar', clientes: 61, sesiones: 450 },
    { month: 'Abr', clientes: 58, sesiones: 420 },
    { month: 'May', clientes: 67, sesiones: 510 },
    { month: 'Jun', clientes: 74, sesiones: 580 },
];

const routineDistribution = [
    { name: 'Fuerza', value: 35, color: '#10b981' },
    { name: 'Cardio', value: 25, color: '#34d399' },
    { name: 'Funcional', value: 20, color: '#6ee7b7' },
    { name: 'Híbrido', value: 20, color: '#a7f3d0' },
];

const weeklyAttendance = [
    { day: 'Lun', asistencia: 45 },
    { day: 'Mar', asistencia: 52 },
    { day: 'Mié', asistencia: 49 },
    { day: 'Jue', asistencia: 58 },
    { day: 'Vie', asistencia: 62 },
    { day: 'Sáb', asistencia: 38 },
    { day: 'Dom', asistencia: 25 },
];

export default function Dashboard({ stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Panel de Control</h1>
                    <p className="text-muted-foreground">
                        Bienvenido al sistema de gestión del gimnasio
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Clientes Activos"
                        value={stats.total_clients}
                        description="Total de clientes registrados"
                        icon={Users}
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatsCard
                        title="Ejercicios"
                        value={stats.total_exercises}
                        description="En la biblioteca"
                        icon={Dumbbell}
                        trend={{ value: 8, isPositive: true }}
                    />
                    <StatsCard
                        title="Rutinas Activas"
                        value={stats.total_routines}
                        description="Programas en uso"
                        icon={Activity}
                        trend={{ value: 5, isPositive: true }}
                    />
                    <StatsCard
                        title="Usuarios Sistema"
                        value={stats.total_users}
                        description="Administradores y clientes"
                        icon={Target}
                        trend={{ value: 3, isPositive: false }}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Actividad Mensual - Línea */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Actividad Mensual</CardTitle>
                            <CardDescription>
                                Crecimiento de clientes y sesiones realizadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={monthlyActivityData}>
                                    <defs>
                                        <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSesiones" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" className="text-sm" />
                                    <YAxis className="text-sm" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="clientes"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorClientes)"
                                        name="Clientes"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sesiones"
                                        stroke="#34d399"
                                        fillOpacity={1}
                                        fill="url(#colorSesiones)"
                                        name="Sesiones"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Distribución de Rutinas - Pie */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Distribución de Rutinas</CardTitle>
                            <CardDescription>Tipos de entrenamiento activos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={routineDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {routineDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Second Row Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Asistencia Semanal - Barras */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Asistencia Semanal</CardTitle>
                            <CardDescription>Promedio de visitas por día</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={weeklyAttendance}>
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
                                        dataKey="asistencia"
                                        fill="#10b981"
                                        radius={[8, 8, 0, 0]}
                                        name="Asistencia"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estadísticas Rápidas</CardTitle>
                            <CardDescription>Resumen de actividad reciente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Sesiones Hoy</p>
                                        <p className="text-2xl font-bold">42</p>
                                    </div>
                                </div>
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Promedio Duración</p>
                                        <p className="text-2xl font-bold">58 min</p>
                                    </div>
                                </div>
                                <Activity className="h-8 w-8 text-primary" />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Award className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Logros del Mes</p>
                                        <p className="text-2xl font-bold">127</p>
                                    </div>
                                </div>
                                <Award className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

