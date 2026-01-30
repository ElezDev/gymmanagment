import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    User,
    FileText,
    DollarSign,
    RefreshCw,
    XCircle,
    Pause,
    Play,
    CheckCircle2,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Client {
    id: number;
    user: User;
    membership_number?: string;
    phone?: string;
}

interface MembershipPlan {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration_days: number;
    billing_cycle: string;
}

interface Payment {
    id: number;
    payment_number: string;
    amount: number;
    payment_method: string;
    status: string;
    created_at: string;
    received_by: User;
}

interface Membership {
    id: number;
    client: Client;
    membership_plan: MembershipPlan;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'suspended' | 'cancelled';
    amount_paid: number;
    discount_amount: number;
    discount_reason?: string;
    notes?: string;
    auto_renew: boolean;
    sold_by: User;
    payments: Payment[];
    created_at: string;
}

interface Props {
    membership: Membership;
}

const statusConfig = {
    active: { label: 'Activa', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    expired: { label: 'Vencida', color: 'bg-red-100 text-red-800', icon: XCircle },
    suspended: { label: 'Suspendida', color: 'bg-yellow-100 text-yellow-800', icon: Pause },
    cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export default function MembershipShow({ membership }: Props) {
    const StatusIcon = statusConfig[membership.status].icon;
    const daysRemaining = Math.ceil(
        (new Date(membership.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <>
            <Head title={`Membresía #${membership.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.get('/memberships')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Membresía #{membership.id}</h1>
                            <p className="text-muted-foreground">{membership.client.user.name}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {membership.status === 'active' && (
                            <>
                                <Button asChild>
                                    <Link href={`/memberships/${membership.id}/renew`}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Renovar
                                    </Link>
                                </Button>
                                <Button variant="outline">
                                    <Pause className="mr-2 h-4 w-4" />
                                    Suspender
                                </Button>
                            </>
                        )}
                        {membership.status === 'suspended' && (
                            <Button>
                                <Play className="mr-2 h-4 w-4" />
                                Reactivar
                            </Button>
                        )}
                    </div>
                </div>

                {/* Status Banner */}
                <Card className={membership.status === 'active' ? 'border-green-200' : ''}>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-4">
                            <StatusIcon className="h-8 w-8" />
                            <div>
                                <Badge variant="secondary" className={statusConfig[membership.status].color}>
                                    {statusConfig[membership.status].label}
                                </Badge>
                                {membership.status === 'active' && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {daysRemaining > 0
                                            ? `${daysRemaining} días restantes`
                                            : 'Vence hoy'}
                                    </p>
                                )}
                            </div>
                        </div>
                        {membership.auto_renew && (
                            <Badge variant="outline" className="bg-blue-50">
                                Auto-renovación activa
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Client Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Información del Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Nombre</div>
                                <div className="font-medium">{membership.client.user.name}</div>
                            </div>
                            <Separator />
                            <div>
                                <div className="text-sm text-muted-foreground">Email</div>
                                <div className="font-medium">{membership.client.user.email}</div>
                            </div>
                            <Separator />
                            <div>
                                <div className="text-sm text-muted-foreground">Número de Membresía</div>
                                <div className="font-medium">
                                    {membership.client.membership_number || 'Sin asignar'}
                                </div>
                            </div>
                            {membership.client.phone && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Teléfono</div>
                                        <div className="font-medium">{membership.client.phone}</div>
                                    </div>
                                </>
                            )}
                            <Separator />
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/clients/${membership.client.id}`}>Ver Perfil Completo</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Plan Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Plan de Membresía
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Plan</div>
                                <div className="font-medium text-lg">{membership.membership_plan.name}</div>
                            </div>
                            {membership.membership_plan.description && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Descripción</div>
                                        <div className="text-sm">{membership.membership_plan.description}</div>
                                    </div>
                                </>
                            )}
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Precio</div>
                                    <div className="font-medium">${membership.membership_plan.price}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Duración</div>
                                    <div className="font-medium">
                                        {membership.membership_plan.duration_days} días
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Fechas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Fecha de Inicio</div>
                                <div className="font-medium">
                                    {new Date(membership.start_date).toLocaleDateString('es-MX', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <div className="text-sm text-muted-foreground">Fecha de Vencimiento</div>
                                <div className="font-medium">
                                    {new Date(membership.end_date).toLocaleDateString('es-MX', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <div className="text-sm text-muted-foreground">Vendida por</div>
                                <div className="font-medium">{membership.sold_by.name}</div>
                            </div>
                            <Separator />
                            <div>
                                <div className="text-sm text-muted-foreground">Fecha de Creación</div>
                                <div className="text-sm">
                                    {new Date(membership.created_at).toLocaleDateString('es-MX')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Información de Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Monto Pagado</div>
                                <div className="font-medium text-lg">${membership.amount_paid}</div>
                            </div>
                            {membership.discount_amount > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Descuento Aplicado</div>
                                        <div className="font-medium text-green-600">
                                            -${membership.discount_amount}
                                        </div>
                                        {membership.discount_reason && (
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {membership.discount_reason}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Notes */}
                {membership.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Notas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{membership.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Payment History */}
                {membership.payments && membership.payments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Pagos</CardTitle>
                            <CardDescription>Pagos asociados a esta membresía</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {membership.payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium">{payment.payment_number}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(payment.created_at).toLocaleDateString('es-MX')} •{' '}
                                                {payment.received_by.name}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">${payment.amount}</div>
                                            <Badge variant="secondary" className="text-xs">
                                                {payment.payment_method}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

MembershipShow.layout = (page: React.ReactElement) => <AppLayout children={page} />;
