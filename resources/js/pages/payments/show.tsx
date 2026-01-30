import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Receipt,
    User,
    CreditCard,
    Calendar,
    FileText,
    DollarSign,
    AlertCircle,
} from 'lucide-react';
import { Payment, PageProps } from '@/types';

interface Props extends PageProps {
    payment: Payment;
}

export default function PaymentShow({ auth, payment }: Props) {
    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(Number(amount));
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            cash: 'Efectivo',
            card: 'Tarjeta',
            transfer: 'Transferencia',
            check: 'Cheque',
            online: 'En línea',
        };
        return labels[method] || method;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            membership: 'Membresía',
            product: 'Producto',
            service: 'Servicio',
            penalty: 'Penalización',
            other: 'Otro',
        };
        return labels[type] || type;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            refunded: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };

        const labels: Record<string, string> = {
            completed: 'Completado',
            pending: 'Pendiente',
            refunded: 'Reembolsado',
            cancelled: 'Cancelado',
        };

        return (
            <Badge className={variants[status]}>{labels[status] || status}</Badge>
        );
    };

    return (
        <AppLayout user={auth.user} permissions={auth.permissions}>
            <Head title={`Pago #${payment.payment_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/payments">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a pagos
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">
                            Pago #{payment.payment_number}
                        </h1>
                        <p className="text-muted-foreground">
                            Registrado el {formatDate(payment.payment_date)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/payments/${payment.id}/receipt`}>
                            <Button variant="outline">
                                <Receipt className="h-4 w-4 mr-2" />
                                Ver Recibo
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Banner de Estado */}
                {payment.status === 'refunded' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <div>
                                <h3 className="font-semibold text-red-900">
                                    Pago Reembolsado
                                </h3>
                                <p className="text-sm text-red-700">
                                    Reembolsado el{' '}
                                    {payment.refunded_at
                                        ? formatDate(payment.refunded_at)
                                        : 'N/A'}
                                </p>
                                {payment.refund_reason && (
                                    <p className="text-sm text-red-700 mt-1">
                                        <strong>Motivo:</strong> {payment.refund_reason}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Información del Cliente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Nombre</p>
                                <p className="font-semibold">
                                    {payment.client.user.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="text-sm">{payment.client.user.email}</p>
                            </div>
                            {payment.client.phone && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Teléfono
                                    </p>
                                    <p className="text-sm">{payment.client.phone}</p>
                                </div>
                            )}
                            <Separator />
                            <div className="pt-2">
                                <Link href={`/clients/${payment.client.id}`}>
                                    <Button variant="outline" size="sm">
                                        Ver perfil del cliente
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información del Pago */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Detalles del Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Monto</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {formatCurrency(payment.amount)}
                                </span>
                            </div>
                            {payment.status === 'refunded' && payment.refund_amount && (
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Monto Reembolsado
                                    </span>
                                    <span className="text-lg font-semibold text-red-600">
                                        -{formatCurrency(payment.refund_amount)}
                                    </span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Método</span>
                                <span className="font-medium">
                                    {getPaymentMethodLabel(payment.payment_method)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tipo</span>
                                <span className="font-medium">
                                    {getTypeLabel(payment.type)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estado</span>
                                {getStatusBadge(payment.status)}
                            </div>
                            {payment.transaction_reference && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Referencia
                                    </span>
                                    <span className="text-sm font-mono">
                                        {payment.transaction_reference}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Información de la Membresía (si aplica) */}
                    {payment.membership && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Membresía Asociada
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Plan</p>
                                    <p className="font-semibold">
                                        {payment.membership.membership_plan.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Vigencia
                                    </p>
                                    <p className="text-sm">
                                        {new Date(
                                            payment.membership.start_date
                                        ).toLocaleDateString('es-MX')}{' '}
                                        -{' '}
                                        {new Date(
                                            payment.membership.end_date
                                        ).toLocaleDateString('es-MX')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Estado</p>
                                    <Badge
                                        className={
                                            payment.membership.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }
                                    >
                                        {payment.membership.status === 'active'
                                            ? 'Activa'
                                            : payment.membership.status === 'suspended'
                                            ? 'Suspendida'
                                            : 'Expirada'}
                                    </Badge>
                                </div>
                                <Separator />
                                <Link href={`/memberships/${payment.membership.id}`}>
                                    <Button variant="outline" size="sm">
                                        Ver membresía
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Descripción y Notas */}
                    <Card className={payment.membership ? '' : 'md:col-span-2'}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Descripción y Notas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Descripción
                                </p>
                                <p className="text-sm">{payment.description}</p>
                            </div>
                            {payment.notes && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Notas adicionales
                                        </p>
                                        <p className="text-sm whitespace-pre-line">
                                            {payment.notes}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Información Adicional */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Información del Registro
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Fecha de Pago</p>
                            <p className="font-medium">
                                {formatDate(payment.payment_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Registrado por
                            </p>
                            <p className="font-medium">{payment.received_by.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Número de Pago
                            </p>
                            <p className="font-mono text-sm">{payment.payment_number}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
