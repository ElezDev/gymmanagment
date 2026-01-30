import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    CreditCard,
    Calendar,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Clock,
    Receipt,
} from 'lucide-react';
import { PageProps } from '@/types';

interface Membership {
    id: number;
    membership_number: string;
    start_date: string;
    end_date: string;
    status: string;
    amount_paid: number;
    discount_applied: number;
    final_amount: number;
    payment_status: string;
    membership_plan: {
        id: number;
        name: string;
        description: string;
        price: number;
        duration_days: number;
        features: string[];
        max_classes_per_week: number | null;
        max_classes_per_month: number | null;
        includes_nutrition_plan: boolean;
        includes_personal_training: boolean;
        personal_training_sessions: number;
    };
}

interface Props extends PageProps {
    membership: Membership | null;
    daysRemaining: number | null;
}

export default function MyMembership({ auth, membership, daysRemaining }: Props) {
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
        });
    };

    const getStatusColor = () => {
        if (!membership) return 'bg-gray-100 text-gray-800';
        if (membership.status === 'active') {
            if (daysRemaining !== null && daysRemaining <= 7) {
                return 'bg-yellow-100 text-yellow-800';
            }
            return 'bg-green-100 text-green-800';
        }
        if (membership.status === 'expired') return 'bg-red-100 text-red-800';
        if (membership.status === 'suspended') return 'bg-orange-100 text-orange-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = () => {
        if (!membership) return 'Sin membresía';
        if (membership.status === 'active') return 'Activa';
        if (membership.status === 'expired') return 'Vencida';
        if (membership.status === 'suspended') return 'Suspendida';
        return membership.status;
    };

    if (!membership) {
        return (
            <AppLayout user={auth.user} permissions={auth.permissions}>
                <Head title="Mi Membresía" />
                
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Mi Membresía</h1>
                        <p className="text-muted-foreground">
                            Información sobre tu plan de membresía
                        </p>
                    </div>

                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center space-y-4">
                                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                                <h3 className="text-xl font-semibold">
                                    No tienes una membresía activa
                                </h3>
                                <p className="text-muted-foreground">
                                    Contacta con la recepción para adquirir un plan
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Mi Membresía" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Mi Membresía</h1>
                    <p className="text-muted-foreground">
                        #{membership.membership_number}
                    </p>
                </div>

                {/* Estado de la membresía */}
                <Card className="border-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl">
                                {membership.membership_plan.name}
                            </CardTitle>
                            <Badge className={getStatusColor()}>
                                {getStatusLabel()}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            {membership.membership_plan.description}
                        </p>

                        {/* Días restantes */}
                        {membership.status === 'active' && daysRemaining !== null && (
                            <div
                                className={`flex items-center gap-2 p-3 rounded-lg ${
                                    daysRemaining <= 7
                                        ? 'bg-yellow-50 text-yellow-900'
                                        : 'bg-green-50 text-green-900'
                                }`}
                            >
                                <Clock className="h-5 w-5" />
                                <span className="font-semibold">
                                    {daysRemaining === 0
                                        ? 'Vence hoy'
                                        : daysRemaining === 1
                                        ? 'Vence mañana'
                                        : `${daysRemaining} días restantes`}
                                </span>
                            </div>
                        )}

                        <Separator />

                        {/* Fechas */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Fecha de inicio
                                    </p>
                                    <p className="font-semibold">
                                        {formatDate(membership.start_date)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Fecha de vencimiento
                                    </p>
                                    <p className="font-semibold">
                                        {formatDate(membership.end_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Características del plan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Características de tu plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {membership.membership_plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Separator className="my-4" />

                        <div className="grid gap-4 md:grid-cols-2">
                            {membership.membership_plan.max_classes_per_week && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Clases por semana
                                    </p>
                                    <p className="font-semibold">
                                        {membership.membership_plan.max_classes_per_week}{' '}
                                        clases
                                    </p>
                                </div>
                            )}
                            {membership.membership_plan.max_classes_per_month && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Clases por mes
                                    </p>
                                    <p className="font-semibold">
                                        {membership.membership_plan.max_classes_per_month}{' '}
                                        clases
                                    </p>
                                </div>
                            )}
                            {membership.membership_plan.includes_personal_training && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Sesiones de entrenamiento personal
                                    </p>
                                    <p className="font-semibold">
                                        {membership.membership_plan.personal_training_sessions}{' '}
                                        sesiones incluidas
                                    </p>
                                </div>
                            )}
                            {membership.membership_plan.includes_nutrition_plan && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Plan nutricional
                                    </p>
                                    <p className="font-semibold text-green-600">
                                        ✓ Incluido
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Información de pago */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            Información de pago
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Precio del plan</span>
                            <span className="font-semibold">
                                {formatCurrency(membership.amount_paid)}
                            </span>
                        </div>
                        {membership.discount_applied > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Descuento aplicado</span>
                                <span>-{formatCurrency(membership.discount_applied)}</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total pagado</span>
                            <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(membership.final_amount)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Aviso de renovación */}
                {membership.status === 'active' &&
                    daysRemaining !== null &&
                    daysRemaining <= 7 && (
                        <Card className="border-yellow-200 bg-yellow-50">
                            <CardContent className="py-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-yellow-900 mb-1">
                                            Tu membresía está por vencer
                                        </h3>
                                        <p className="text-sm text-yellow-800 mb-3">
                                            Contacta con la recepción para renovar tu plan y
                                            seguir disfrutando de todos los beneficios.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
            </div>
        </AppLayout>
    );
}
