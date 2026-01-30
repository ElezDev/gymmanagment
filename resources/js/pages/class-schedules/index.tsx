import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, Users, User } from 'lucide-react';

interface Instructor {
    id: number;
    name: string;
}

interface ClassSchedule {
    id: number;
    name: string;
    description?: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    max_capacity: number;
    current_bookings: number;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    instructor: Instructor;
    is_active: boolean;
}

interface Props {
    schedules: ClassSchedule[];
    filters: {
        day_of_week?: string;
        difficulty?: string;
    };
}

const daysOfWeek = [
    { value: '1', label: 'Lunes' },
    { value: '2', label: 'Martes' },
    { value: '3', label: 'Miércoles' },
    { value: '4', label: 'Jueves' },
    { value: '5', label: 'Viernes' },
    { value: '6', label: 'Sábado' },
    { value: '7', label: 'Domingo' },
];

const difficultyConfig = {
    beginner: {
        label: 'Principiante',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    intermediate: {
        label: 'Intermedio',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    },
    advanced: {
        label: 'Avanzado',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    },
};

function getDayName(dayNumber: number): string {
    return daysOfWeek[dayNumber - 1]?.label || '';
}

function formatTime(time: string): string {
    return time.substring(0, 5); // HH:MM
}

function getCapacityColor(current: number, max: number): string {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
}

export default function ClassSchedulesIndex({ schedules, filters }: Props) {
    const [dayOfWeek, setDayOfWeek] = useState(filters.day_of_week || '');
    const [difficulty, setDifficulty] = useState(filters.difficulty || '');

    const handleFilter = () => {
        router.get('/class-schedules', { day_of_week: dayOfWeek, difficulty }, { preserveState: true });
    };

    const handleReset = () => {
        setDayOfWeek('');
        setDifficulty('');
        router.get('/class-schedules', {}, { preserveState: true });
    };

    // Group schedules by day
    const schedulesByDay = schedules.reduce((acc, schedule) => {
        const day = schedule.day_of_week;
        if (!acc[day]) acc[day] = [];
        acc[day].push(schedule);
        return acc;
    }, {} as Record<number, ClassSchedule[]>);

    // Sort schedules within each day by start time
    Object.keys(schedulesByDay).forEach((day) => {
        schedulesByDay[Number(day)].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    return (
        <>
            <Head title="Horarios de Clases" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Horarios de Clases</h1>
                        <p className="text-muted-foreground">Gestiona el calendario de clases grupales</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/class-bookings">
                                <Calendar className="mr-2 h-4 w-4" />
                                Ver Reservas
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/class-schedules/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Clase
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtrar Clases</CardTitle>
                        <CardDescription>Filtra por día de la semana o nivel de dificultad</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Día de la semana" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los días</SelectItem>
                                    {daysOfWeek.map((day) => (
                                        <SelectItem key={day.value} value={day.value}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Dificultad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los niveles</SelectItem>
                                    <SelectItem value="beginner">Principiante</SelectItem>
                                    <SelectItem value="intermediate">Intermedio</SelectItem>
                                    <SelectItem value="advanced">Avanzado</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button onClick={handleFilter}>Filtrar</Button>
                            <Button variant="outline" onClick={handleReset}>
                                Limpiar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Schedule Grid */}
                <div className="space-y-6">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                        const daySchedules = schedulesByDay[day] || [];
                        if (daySchedules.length === 0) return null;

                        return (
                            <Card key={day}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        {getDayName(day)}
                                    </CardTitle>
                                    <CardDescription>
                                        {daySchedules.length} {daySchedules.length === 1 ? 'clase' : 'clases'}{' '}
                                        programadas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {daySchedules.map((schedule) => (
                                            <Card key={schedule.id} className="overflow-hidden">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-lg">
                                                                {schedule.name}
                                                            </CardTitle>
                                                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Clock className="h-4 w-4" />
                                                                {formatTime(schedule.start_time)} -{' '}
                                                                {formatTime(schedule.end_time)}
                                                            </div>
                                                        </div>
                                                        {!schedule.is_active && (
                                                            <Badge variant="secondary" className="bg-gray-200">
                                                                Inactiva
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    {schedule.description && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {schedule.description}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">
                                                            {schedule.instructor.name}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <Badge
                                                            variant="secondary"
                                                            className={
                                                                difficultyConfig[schedule.difficulty_level].color
                                                            }
                                                        >
                                                            {difficultyConfig[schedule.difficulty_level].label}
                                                        </Badge>

                                                        <div
                                                            className={`flex items-center gap-1 text-sm font-medium ${getCapacityColor(
                                                                schedule.current_bookings,
                                                                schedule.max_capacity
                                                            )}`}
                                                        >
                                                            <Users className="h-4 w-4" />
                                                            {schedule.current_bookings}/{schedule.max_capacity}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 pt-2">
                                                        <Button variant="outline" size="sm" asChild className="flex-1">
                                                            <Link href={`/class-schedules/${schedule.id}`}>Ver</Link>
                                                        </Button>
                                                        <Button variant="outline" size="sm" asChild className="flex-1">
                                                            <Link href={`/class-schedules/${schedule.id}/edit`}>
                                                                Editar
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {schedules.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p className="text-lg font-medium">No hay clases programadas</p>
                                <p className="text-sm mt-2">
                                    Comienza creando tu primera clase grupal
                                </p>
                                <Button asChild className="mt-4">
                                    <Link href="/class-schedules/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Primera Clase
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Legend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leyenda</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-green-600">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">{'<'}70%</span>
                            </div>
                            <span className="text-muted-foreground">- Cupos disponibles</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-yellow-600">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">70-90%</span>
                            </div>
                            <span className="text-muted-foreground">- Casi llena</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-red-600">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">≥90%</span>
                            </div>
                            <span className="text-muted-foreground">- Pocos cupos</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ClassSchedulesIndex.layout = (page: React.ReactElement) => <AppLayout children={page} />;
