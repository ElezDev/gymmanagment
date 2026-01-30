import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    DollarSign,
    Search,
    Filter,
    Download,
    Receipt,
    TrendingUp,
    Calendar,
    CreditCard,
} from 'lucide-react';
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

interface Payment {
    id: number;
    payment_number: string;
    amount: string;
    payment_method: string;
    status: string;
    type: string;
    description: string;
    payment_date: string;
    client: {
        user: {
            name: string;
            email: string;
        };
    };
    received_by: {
        name: string;
    };
}

interface PaginatedPayments {
    data: Payment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Stats {
    total_today: number;
    total_month: number;
    count_today: number;
    count_month: number;
}

interface Props {
    payments: PaginatedPayments;
    stats: Stats;
    filters: {
        search?: string;
        payment_method?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pagos', href: '/payments' },
];

export default function PaymentsIndex({ payments, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get('/payments', {
            search,
            payment_method: paymentMethod !== 'all' ? paymentMethod : undefined,
            status: status !== 'all' ? status : undefined,
        });
    };

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            cash: 'Efectivo',
            card: 'Tarjeta',
            transfer: 'Transferencia',
            check: 'Cheque',
            online: 'Online',
        };
        return labels[method] || method;
    };

    const getPaymentMethodColor = (method: string) => {
        const colors: Record<string, string> = {
            cash: 'bg-green-100 text-green-800',
            card: 'bg-blue-100 text-blue-800',
            transfer: 'bg-purple-100 text-purple-800',
            check: 'bg-yellow-100 text-yellow-800',
            online: 'bg-indigo-100 text-indigo-800',
        };
        return colors[method] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge>Completado</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pendiente</Badge>;
            case 'failed':
                return <Badge variant="destructive">Fallido</Badge>;
            case 'refunded':
                return <Badge variant="outline">Reembolsado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: string) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pagos" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Pagos</h2>
                        <p className="text-muted-foreground">
                            Gestiona y visualiza todos los pagos registrados
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/payments/create">
                            <Button>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Registrar Pago
                            </Button>
                        </Link>
                        <Link href="/payments-report">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Reporte
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.total_today.toString())}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.count_today} pagos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.total_month.toString())}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.count_month} pagos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Promedio por Pago</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(
                                    (stats.total_month / (stats.count_month || 1)).toString()
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">Este mes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Registrado</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{payments.total}</div>
                            <p className="text-xs text-muted-foreground">Todos los tiempos</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por cliente o #"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Método de pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="cash">Efectivo</SelectItem>
                                    <SelectItem value="card">Tarjeta</SelectItem>
                                    <SelectItem value="transfer">Transferencia</SelectItem>
                                    <SelectItem value="check">Cheque</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="completed">Completado</SelectItem>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="failed">Fallido</SelectItem>
                                    <SelectItem value="refunded">Reembolsado</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button onClick={handleFilter}>Aplicar Filtros</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de Pagos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pagos Registrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#Pago</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Método</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Recibido por</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.data.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-mono text-sm">
                                            {payment.payment_number}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {payment.client.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {payment.client.user.email}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {payment.description}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(
                                                    payment.payment_method
                                                )}`}
                                            >
                                                {getPaymentMethodLabel(payment.payment_method)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {formatCurrency(payment.amount)}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                        <TableCell className="text-sm">
                                            {formatDate(payment.payment_date)}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {payment.received_by.name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/payments/${payment.id}/receipt`}>
                                                    <Button variant="outline" size="sm">
                                                        <Receipt className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/payments/${payment.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        Ver
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {payments.data.length === 0 && (
                            <div className="text-center py-12">
                                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No hay pagos</h3>
                                <p className="text-muted-foreground">
                                    No se encontraron pagos con los filtros aplicados
                                </p>
                            </div>
                        )}

                        {/* Paginación */}
                        {payments.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {payments.data.length} de {payments.total} pagos
                                </p>
                                <div className="flex gap-2">
                                    {payments.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(
                                                    `/payments?page=${payments.current_page - 1}`
                                                )
                                            }
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    {payments.current_page < payments.last_page && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(
                                                    `/payments?page=${payments.current_page + 1}`
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
