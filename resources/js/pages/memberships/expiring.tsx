import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Client {
    id: number;
    user: User;
    membership_number?: string;
}

interface MembershipPlan {
    id: number;
    name: string;
    price: number;
}

interface Membership {
    id: number;
    client: Client;
    membership_plan: MembershipPlan;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'suspended' | 'cancelled';
    days_remaining?: number;
}

interface Props {
    memberships: Membership[];
}

function getDaysRemainingColor(days: number): string {
    if (days <= 3) return 'text-red-600 font-bold';
    if (days <= 7) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
}

function getDaysRemainingText(days: number): string {
    if (days === 0) return 'Vence hoy';
    if (days === 1) return 'Vence mañana';
    return `${days} días restantes`;
}

export default function MembershipsExpiring({ memberships }: Props) {
    return (
        <>
            <Head title="Membresías Por Vencer" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/memberships">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Membresías Por Vencer</h1>
                        <p className="text-muted-foreground">
                            Membresías que vencen en los próximos 7 días
                        </p>
                    </div>
                </div>

                {/* Alert */}
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <AlertCircle className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-yellow-900">
                                {memberships.length} {memberships.length === 1 ? 'Membresía' : 'Membresías'} por
                                Vencer
                            </h3>
                            <p className="text-sm text-yellow-800">
                                Contacta a estos clientes para ofrecerles renovación antes de que venzan sus
                                membresías.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Memberships Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Membresías Próximas a Vencer</CardTitle>
                        <CardDescription>
                            Clientes que requieren atención para renovación
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {memberships.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No hay membresías por vencer</p>
                                <p className="text-sm mt-2">
                                    Todas las membresías activas tienen más de 7 días de vigencia
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Fecha de Vencimiento</TableHead>
                                        <TableHead>Días Restantes</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberships.map((membership) => {
                                        // Calcular días restantes
                                        const endDate = new Date(membership.end_date);
                                        const today = new Date();
                                        const diffTime = endDate.getTime() - today.getTime();
                                        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                        return (
                                            <TableRow key={membership.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {membership.client.user.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {membership.client.membership_number || 'Sin número'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {membership.client.user.email}
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
                                                    <div>
                                                        <div className="font-medium">
                                                            {new Date(membership.end_date).toLocaleDateString(
                                                                'es-MX',
                                                                {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                }
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Inicio:{' '}
                                                            {new Date(membership.start_date).toLocaleDateString(
                                                                'es-MX',
                                                                {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className={getDaysRemainingColor(daysRemaining)}>
                                                        {getDaysRemainingText(daysRemaining)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-yellow-100 text-yellow-800"
                                                    >
                                                        Por Vencer
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/memberships/${membership.id}`}>
                                                            Ver
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" asChild>
                                                        <Link href={`/memberships/${membership.id}/renew`}>
                                                            Renovar
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Tips Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Consejos para Renovación</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>
                            <strong>Contacto Proactivo:</strong> Contacta a los clientes 5-7 días antes del
                            vencimiento para maximizar renovaciones.
                        </p>
                        <p>
                            <strong>Ofertas Especiales:</strong> Considera ofrecer descuentos por renovación
                            anticipada o upgrade a planes superiores.
                        </p>
                        <p>
                            <strong>Seguimiento:</strong> Si un cliente no renueva, haz seguimiento en los días
                            posteriores al vencimiento.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MembershipsExpiring.layout = (page: React.ReactElement) => <AppLayout children={page} />;
