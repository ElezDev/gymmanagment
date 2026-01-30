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
import { Plus, Search, CalendarClock, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string;
    membership_number?: string;
}

interface MembershipPlan {
    id: number;
    name: string;
    price: number;
    duration_days: number;
}

interface Membership {
    id: number;
    client: Client;
    membership_plan: MembershipPlan;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'suspended' | 'cancelled';
    days_remaining: number;
}

interface Props {
    memberships: {
        data: Membership[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    stats: {
        active: number;
        expiring_soon: number;
        suspended: number;
        expired: number;
    };
}

const statusConfig = {
    active: {
        label: 'Activa',
        icon: CheckCircle2,
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    expired: {
        label: 'Vencida',
        icon: XCircle,
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    },
    suspended: {
        label: 'Suspendida',
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    },
    cancelled: {
        label: 'Cancelada',
        icon: XCircle,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    },
};

export default function MembershipsIndex({ memberships, filters = {}, stats }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    // Valores por defecto para stats
    const safeStats = stats || { active: 0, expiring_soon: 0, suspended: 0, expired: 0 };

    const handleFilter = () => {
        router.get('/memberships', { search, status }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        router.get('/memberships', {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Membresías Activas" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Membresías</h1>
                        <p className="text-muted-foreground">
                            Gestiona las membresías de tus clientes
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/memberships/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Vender Membresía
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Activas</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.active}</div>
                            <p className="text-xs text-muted-foreground">Membresías vigentes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.expiring_soon}</div>
                            <p className="text-xs text-muted-foreground">Próximos 7 días</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Suspendidas</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.suspended}</div>
                            <p className="text-xs text-muted-foreground">Temporalmente pausadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.expired}</div>
                            <p className="text-xs text-muted-foreground">Requieren renovación</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtrar Membresías</CardTitle>
                        <CardDescription>Busca y filtra las membresías</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar por cliente, email o número de membresía..."
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
                                    <SelectItem value="active">Activas</SelectItem>
                                    <SelectItem value="expired">Vencidas</SelectItem>
                                    <SelectItem value="suspended">Suspendidas</SelectItem>
                                    <SelectItem value="cancelled">Canceladas</SelectItem>
                                </SelectContent>
                            </Select>
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

                {/* Memberships Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Membresías</CardTitle>
                                <CardDescription>
                                    Mostrando {memberships.data.length} de {memberships.total} membresías
                                </CardDescription>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/memberships/expiring">
                                    <CalendarClock className="mr-2 h-4 w-4" />
                                    Ver Por Vencer
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Inicio</TableHead>
                                    <TableHead>Vencimiento</TableHead>
                                    <TableHead>Días Restantes</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberships.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                            No se encontraron membresías
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    memberships.data.map((membership) => {
                                        const StatusIcon = statusConfig[membership.status].icon;
                                        return (
                                            <TableRow key={membership.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{membership.client.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {membership.client.membership_number}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {membership.membership_plan.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            ${membership.membership_plan.price}/mes
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(membership.start_date).toLocaleDateString('es-MX')}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(membership.end_date).toLocaleDateString('es-MX')}
                                                </TableCell>
                                                <TableCell>
                                                    <div
                                                        className={
                                                            membership.days_remaining <= 7
                                                                ? 'font-semibold text-yellow-600'
                                                                : ''
                                                        }
                                                    >
                                                        {membership.days_remaining > 0
                                                            ? `${membership.days_remaining} días`
                                                            : 'Vencida'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={statusConfig[membership.status].className}
                                                    >
                                                        <StatusIcon className="mr-1 h-3 w-3" />
                                                        {statusConfig[membership.status].label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/memberships/${membership.id}`}>Ver</Link>
                                                    </Button>
                                                    {membership.status === 'active' && (
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/memberships/${membership.id}/renew`}>
                                                                Renovar
                                                            </Link>
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
                        {memberships.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Página {memberships.current_page} de {memberships.last_page}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={memberships.current_page === 1}
                                        onClick={() =>
                                            router.get(`/memberships?page=${memberships.current_page - 1}`)
                                        }
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={memberships.current_page === memberships.last_page}
                                        onClick={() =>
                                            router.get(`/memberships?page=${memberships.current_page + 1}`)
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

MembershipsIndex.layout = (page: React.ReactElement) => <AppLayout children={page} />;
