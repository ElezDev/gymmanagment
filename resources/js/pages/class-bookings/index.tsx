import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface ClassSchedule {
    id: number;
    name: string;
    day_of_week: number;
    start_time: string;
}

interface Booking {
    id: number;
    client: Client;
    class_schedule: ClassSchedule;
    booking_date: string;
    status: 'reserved' | 'confirmed' | 'cancelled' | 'attended' | 'no_show';
    is_waiting_list: boolean;
    waiting_position?: number;
}

interface Props {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        date?: string;
    };
    stats: {
        today: number;
        upcoming: number;
        waiting_list: number;
        attended: number;
    };
}

const statusConfig = {
    reserved: {
        label: 'Reservada',
        icon: Calendar,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    },
    confirmed: {
        label: 'Confirmada',
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    cancelled: {
        label: 'Cancelada',
        icon: XCircle,
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    },
    attended: {
        label: 'Asistió',
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    no_show: {
        label: 'No Asistió',
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    },
};

const daysOfWeek = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function ClassBookingsIndex({ bookings, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [date, setDate] = useState(filters.date || '');

    const handleFilter = () => {
        router.get('/class-bookings', { search, status, date }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setDate('');
        router.get('/class-bookings', {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Reservas de Clases" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Reservas de Clases</h1>
                        <p className="text-muted-foreground">Gestiona las reservas de clases grupales</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/class-schedules">
                                <Calendar className="mr-2 h-4 w-4" />
                                Ver Horarios
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/class-bookings/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Reserva
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.today}</div>
                            <p className="text-xs text-muted-foreground">Reservas para hoy</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Próximas</CardTitle>
                            <Clock className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.upcoming}</div>
                            <p className="text-xs text-muted-foreground">Próximos 7 días</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lista de Espera</CardTitle>
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.waiting_list}</div>
                            <p className="text-xs text-muted-foreground">Clientes esperando</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Asistencias</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.attended}</div>
                            <p className="text-xs text-muted-foreground">Este mes</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtrar Reservas</CardTitle>
                        <CardDescription>Busca y filtra las reservas de clases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar por cliente o clase..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="reserved">Reservadas</SelectItem>
                                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                                    <SelectItem value="attended">Asistieron</SelectItem>
                                    <SelectItem value="cancelled">Canceladas</SelectItem>
                                    <SelectItem value="no_show">No Asistieron</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                className="w-[200px]"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <Button onClick={handleFilter}>
                                <Search className="mr-2 h-4 w-4" />
                                Buscar
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Limpiar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reservas</CardTitle>
                        <CardDescription>
                            Mostrando {bookings.data.length} de {bookings.total} reservas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Clase</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No se encontraron reservas
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bookings.data.map((booking) => {
                                        const StatusIcon = statusConfig[booking.status].icon;
                                        return (
                                            <TableRow key={booking.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{booking.client.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {booking.client.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {booking.class_schedule.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {daysOfWeek[booking.class_schedule.day_of_week]}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(booking.booking_date).toLocaleDateString('es-MX', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {booking.class_schedule.start_time.substring(0, 5)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge
                                                            variant="secondary"
                                                            className={statusConfig[booking.status].color}
                                                        >
                                                            <StatusIcon className="mr-1 h-3 w-3" />
                                                            {statusConfig[booking.status].label}
                                                        </Badge>
                                                        {booking.is_waiting_list && (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-orange-50 text-orange-700 border-orange-200"
                                                            >
                                                                Lista de Espera #{booking.waiting_position}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/class-bookings/${booking.id}`}>Ver</Link>
                                                    </Button>
                                                    {booking.status === 'reserved' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.post(
                                                                    `/class-bookings/${booking.id}/confirm`
                                                                )
                                                            }
                                                        >
                                                            Confirmar
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {bookings.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Página {bookings.current_page} de {bookings.last_page}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={bookings.current_page === 1}
                                        onClick={() =>
                                            router.get(`/class-bookings?page=${bookings.current_page - 1}`)
                                        }
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={bookings.current_page === bookings.last_page}
                                        onClick={() =>
                                            router.get(`/class-bookings?page=${bookings.current_page + 1}`)
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ClassBookingsIndex.layout = (page: React.ReactElement) => <AppLayout children={page} />;
