import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { PageProps } from '@/types';

interface ClassSchedule {
    id: number;
    name: string;
    instructor: {
        name: string;
    };
}

interface ClassBooking {
    id: number;
    booking_date: string;
    status: string;
    is_waiting_list: boolean;
    waiting_position: number | null;
    reserved_at: string;
    attended_at: string | null;
    cancelled_at: string | null;
    class_schedule: ClassSchedule;
    client: {
        id: number;
        user: {
            name: string;
            email: string;
        };
    };
}

interface Props extends PageProps {
    bookings: {
        data: ClassBooking[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        date?: string;
        status?: string;
        class_schedule_id?: string;
    };
}

export default function ClassBookingsIndex({ auth, bookings, filters = {} }: Props) {
    const [date, setDate] = useState(filters.date || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get('/class-bookings', {
            date: date || undefined,
            status: status !== 'all' ? status : undefined,
        });
    };

    const handleMarkAttended = (id: number) => {
        if (confirm('¿Marcar como asistido?')) {
            router.post(`/class-bookings/${id}/attended`);
        }
    };

    const handleMarkNoShow = (id: number) => {
        if (confirm('¿Marcar como no asistido?')) {
            router.post(`/class-bookings/${id}/no-show`);
        }
    };

    const handleCancel = (id: number) => {
        if (confirm('¿Cancelar esta reserva?')) {
            router.post(`/class-bookings/${id}/cancel`);
        }
    };

    const getStatusBadge = (booking: ClassBooking) => {
        if (booking.is_waiting_list) {
            return (
                <Badge className="bg-orange-100 text-orange-800">
                    Lista de espera #{booking.waiting_position}
                </Badge>
            );
        }

        const variants: Record<string, string> = {
            reserved: 'bg-blue-100 text-blue-800',
            confirmed: 'bg-green-100 text-green-800',
            attended: 'bg-green-100 text-green-800',
            no_show: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };

        const labels: Record<string, string> = {
            reserved: 'Reservado',
            confirmed: 'Confirmado',
            attended: 'Asistió',
            no_show: 'No asistió',
            cancelled: 'Cancelado',
        };

        return (
            <Badge className={variants[booking.status]}>
                {labels[booking.status] || booking.status}
            </Badge>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (datetime: string) => {
        return new Date(datetime).toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Reservas de Clases" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Reservas de Clases</h1>
                        <p className="text-muted-foreground">
                            Gestiona las reservas de clases grupales
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Reservas
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{bookings.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {
                                    bookings.data.filter((b) => b.status === 'confirmed')
                                        .length
                                }
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Asistieron</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {bookings.data.filter((b) => b.status === 'attended').length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Lista de Espera
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {bookings.data.filter((b) => b.is_waiting_list).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder="Fecha"
                                />
                            </div>
                            <div className="space-y-2">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="reserved">Reservado</SelectItem>
                                        <SelectItem value="confirmed">Confirmado</SelectItem>
                                        <SelectItem value="attended">Asistió</SelectItem>
                                        <SelectItem value="no_show">No asistió</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    <Search className="h-4 w-4 mr-2" />
                                    Buscar
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setDate('');
                                        setStatus('all');
                                        router.get('/class-bookings');
                                    }}
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de reservas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reservas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Clase</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead>Reservado</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.data.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">
                                            {formatDate(booking.booking_date)}
                                        </TableCell>
                                        <TableCell>
                                            {booking.class_schedule.name}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {booking.client.user.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.client.user.email}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {booking.class_schedule.instructor.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatTime(booking.reserved_at)}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(booking)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {booking.status === 'confirmed' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleMarkAttended(booking.id)
                                                            }
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleMarkNoShow(booking.id)
                                                            }
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                {(booking.status === 'reserved' ||
                                                    booking.status === 'confirmed') && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleCancel(booking.id)
                                                        }
                                                    >
                                                        Cancelar
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {bookings.data.length === 0 && (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No hay reservas
                                </h3>
                                <p className="text-muted-foreground">
                                    No se encontraron reservas con los filtros aplicados
                                </p>
                            </div>
                        )}

                        {/* Paginación */}
                        {bookings.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {bookings.data.length} de {bookings.total}{' '}
                                    reservas
                                </p>
                                <div className="flex gap-2">
                                    {bookings.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(
                                                    `/class-bookings?page=${
                                                        bookings.current_page - 1
                                                    }`
                                                )
                                            }
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    {bookings.current_page < bookings.last_page && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(
                                                    `/class-bookings?page=${
                                                        bookings.current_page + 1
                                                    }`
                                                )
                                            }
                                        >
                                            Siguiente
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
