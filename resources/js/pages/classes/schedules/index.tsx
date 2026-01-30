import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';

interface ClassSchedule {
    id: number;
    name: string;
    description: string;
    instructor_id: number;
    instructor: {
        id: number;
        name: string;
        email: string;
    };
    day_of_week: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    max_capacity: number;
    difficulty_level: string;
    room_location: string;
    is_active: boolean;
    requires_reservation: boolean;
}

interface Props extends PageProps {
    classes: ClassSchedule[];
}

export default function ClassSchedulesIndex({ auth, classes }: Props) {
    const dayLabels: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    const difficultyLabels: Record<string, string> = {
        beginner: 'Principiante',
        intermediate: 'Intermedio',
        advanced: 'Avanzado',
    };

    const difficultyColors: Record<string, string> = {
        beginner: 'bg-green-100 text-green-800',
        intermediate: 'bg-yellow-100 text-yellow-800',
        advanced: 'bg-red-100 text-red-800',
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta clase?')) {
            router.delete(`/class-schedules/${id}`);
        }
    };

    // Agrupar clases por día
    const classesByDay: Record<string, ClassSchedule[]> = {};
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    daysOrder.forEach(day => {
        classesByDay[day] = classes.filter(c => c.day_of_week === day);
    });

    return (
        <AppLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Horarios de Clases" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Horarios de Clases</h1>
                        <p className="text-muted-foreground">
                            Gestiona los horarios de clases grupales
                        </p>
                    </div>
                    <Link href="/class-schedules/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Clase
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de Clases
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{classes.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {classes.filter(c => c.is_active).length} activas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Capacidad Total
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {classes.reduce((sum, c) => sum + c.max_capacity, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">Personas por semana</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Nivel Principiante
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {classes.filter(c => c.difficulty_level === 'beginner').length}
                            </div>
                            <p className="text-xs text-muted-foreground">Clases</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Requieren Reserva
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {classes.filter(c => c.requires_reservation).length}
                            </div>
                            <p className="text-xs text-muted-foreground">Clases</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Schedule by Day */}
                {daysOrder.map(day => {
                    const dayClasses = classesByDay[day];
                    if (dayClasses.length === 0) return null;

                    return (
                        <Card key={day}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    {dayLabels[day]}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Hora</TableHead>
                                            <TableHead>Clase</TableHead>
                                            <TableHead>Instructor</TableHead>
                                            <TableHead>Nivel</TableHead>
                                            <TableHead>Capacidad</TableHead>
                                            <TableHead>Ubicación</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dayClasses.map(classItem => (
                                            <TableRow key={classItem.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        {classItem.start_time.slice(0, 5)} -{' '}
                                                        {classItem.end_time.slice(0, 5)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {classItem.name}
                                                        </p>
                                                        {classItem.description && (
                                                            <p className="text-sm text-muted-foreground">
                                                                {classItem.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {classItem.instructor.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            difficultyColors[
                                                                classItem.difficulty_level
                                                            ]
                                                        }
                                                    >
                                                        {
                                                            difficultyLabels[
                                                                classItem.difficulty_level
                                                            ]
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        {classItem.max_capacity}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {classItem.room_location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                                            {classItem.room_location}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            classItem.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }
                                                    >
                                                        {classItem.is_active
                                                            ? 'Activa'
                                                            : 'Inactiva'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/class-schedules/${classItem.id}/edit`}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(classItem.id)
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                })}

                {classes.length === 0 && (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center space-y-4">
                                <Calendar className="h-16 w-16 text-muted-foreground mx-auto" />
                                <h3 className="text-xl font-semibold">
                                    No hay clases programadas
                                </h3>
                                <p className="text-muted-foreground">
                                    Comienza creando tu primer horario de clase
                                </p>
                                <Link href="/class-schedules/create">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nueva Clase
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
