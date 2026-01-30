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
import { Badge } from '@/components/ui/badge';
import { Search, LogIn, LogOut, Clock, DoorOpen } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Client {
    id: number;
    name: string;
    membership_number?: string;
}

interface CheckIn {
    id: number;
    client: Client;
    check_in_time: string;
    check_out_time?: string;
    duration_minutes?: number;
    entry_method: 'manual' | 'card' | 'qr' | 'biometric';
}

interface Props {
    checkIns: {
        data: CheckIn[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        date?: string;
    };
    stats: {
        today: number;
        this_week: number;
        this_month: number;
        avg_duration: number;
    };
}

const entryMethodLabels = {
    manual: 'Manual',
    card: 'Tarjeta',
    qr: 'Código QR',
    biometric: 'Biométrico',
};

const entryMethodColors = {
    manual: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    card: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    qr: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    biometric: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
};

function formatDuration(minutes?: number): string {
    if (!minutes) return '-';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

export default function CheckInsIndex({ checkIns, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');

    const handleFilter = () => {
        router.get('/check-ins', { search, date }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setDate('');
        router.get('/check-ins', {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Historial de Check-ins" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Historial de Check-ins</h1>
                        <p className="text-muted-foreground">
                            Registro completo de entradas y salidas
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/check-ins/dashboard">
                            <DoorOpen className="mr-2 h-4 w-4" />
                            Dashboard en Vivo
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
                            <LogIn className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.today}</div>
                            <p className="text-xs text-muted-foreground">Visitas de hoy</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                            <LogIn className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.this_week}</div>
                            <p className="text-xs text-muted-foreground">Últimos 7 días</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
                            <LogIn className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.this_month}</div>
                            <p className="text-xs text-muted-foreground">Visitas del mes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Duración Promedio</CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatDuration(stats.avg_duration)}</div>
                            <p className="text-xs text-muted-foreground">Por sesión</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtrar Registros</CardTitle>
                        <CardDescription>Busca por cliente o filtra por fecha</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar por nombre de cliente o número de membresía..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
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

                {/* Check-ins Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registros</CardTitle>
                        <CardDescription>
                            Mostrando {checkIns.data.length} de {checkIns.total} registros
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Entrada</TableHead>
                                    <TableHead>Salida</TableHead>
                                    <TableHead>Duración</TableHead>
                                    <TableHead>Método</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {checkIns.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No se encontraron registros
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    checkIns.data.map((checkIn) => (
                                        <TableRow key={checkIn.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{checkIn.client.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {checkIn.client.membership_number || 'Sin número'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <LogIn className="h-4 w-4 text-green-600" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {format(new Date(checkIn.check_in_time), 'HH:mm', {
                                                                locale: es,
                                                            })}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {format(new Date(checkIn.check_in_time), 'dd MMM yyyy', {
                                                                locale: es,
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {checkIn.check_out_time ? (
                                                    <div className="flex items-center gap-2">
                                                        <LogOut className="h-4 w-4 text-red-600" />
                                                        <div>
                                                            <div className="font-medium">
                                                                {format(new Date(checkIn.check_out_time), 'HH:mm', {
                                                                    locale: es,
                                                                })}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {format(new Date(checkIn.check_out_time), 'dd MMM yyyy', {
                                                                    locale: es,
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                        En el gimnasio
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {formatDuration(checkIn.duration_minutes)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={entryMethodColors[checkIn.entry_method]}
                                                >
                                                    {entryMethodLabels[checkIn.entry_method]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/clients/${checkIn.client.id}`}>Ver Cliente</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {checkIns.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Página {checkIns.current_page} de {checkIns.last_page}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={checkIns.current_page === 1}
                                        onClick={() =>
                                            router.get(`/check-ins?page=${checkIns.current_page - 1}`)
                                        }
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={checkIns.current_page === checkIns.last_page}
                                        onClick={() =>
                                            router.get(`/check-ins?page=${checkIns.current_page + 1}`)
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

CheckInsIndex.layout = (page: React.ReactElement) => <AppLayout children={page} />;
