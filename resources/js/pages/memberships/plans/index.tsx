import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Check, X, Edit, Trash2, Plus, DollarSign, Calendar, Users, Dumbbell } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MembershipPlan {
    id: number;
    name: string;
    description: string;
    price: string;
    duration_days: number;
    billing_cycle: string;
    features: string[];
    max_classes_per_week: number | null;
    max_classes_per_month: number | null;
    includes_nutrition_plan: boolean;
    includes_personal_training: boolean;
    personal_training_sessions: number;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    plans: MembershipPlan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Planes de Membresía', href: '/membership-plans' },
];

export default function MembershipPlansIndex({ plans }: Props) {
    const [deletingPlan, setDeletingPlan] = useState<MembershipPlan | null>(null);

    const handleDelete = () => {
        if (deletingPlan) {
            router.delete(`/membership-plans/${deletingPlan.id}`, {
                onSuccess: () => setDeletingPlan(null),
            });
        }
    };

    const getBillingCycleLabel = (cycle: string) => {
        const labels: Record<string, string> = {
            daily: 'Diario',
            weekly: 'Semanal',
            monthly: 'Mensual',
            quarterly: 'Trimestral',
            yearly: 'Anual',
        };
        return labels[cycle] || cycle;
    };

    const getDurationLabel = (days: number) => {
        if (days === 1) return '1 día';
        if (days === 7) return '1 semana';
        if (days === 30) return '1 mes';
        if (days === 90) return '3 meses';
        if (days === 365) return '1 año';
        return `${days} días`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planes de Membresía" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Planes de Membresía</h2>
                    <p className="text-muted-foreground">
                        Gestiona los planes disponibles para tus clientes
                    </p>
                </div>
                <Link href="/membership-plans/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Plan
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.id} className={!plan.is_active ? 'opacity-60' : ''}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {plan.name}
                                        {!plan.is_active && (
                                            <Badge variant="secondary">Inactivo</Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {plan.description}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Precio */}
                                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        <span className="font-medium">Precio</span>
                                    </div>
                                    <span className="text-2xl font-bold text-primary">
                                        ${plan.price}
                                    </span>
                                </div>

                                {/* Duración */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Duración</span>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {getDurationLabel(plan.duration_days)}
                                    </span>
                                </div>

                                {/* Ciclo de facturación */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Facturación</span>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {getBillingCycleLabel(plan.billing_cycle)}
                                    </span>
                                </div>

                                {/* Límite de clases */}
                                {(plan.max_classes_per_week || plan.max_classes_per_month) && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Clases</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {plan.max_classes_per_week
                                                ? `${plan.max_classes_per_week}/semana`
                                                : plan.max_classes_per_month
                                                ? `${plan.max_classes_per_month}/mes`
                                                : 'Ilimitadas'}
                                        </span>
                                    </div>
                                )}

                                {/* Entrenamiento personal */}
                                {plan.includes_personal_training && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Entrenamiento</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {plan.personal_training_sessions} sesiones
                                        </span>
                                    </div>
                                )}

                                {/* Características */}
                                {plan.features && plan.features.length > 0 && (
                                    <div className="pt-2 border-t">
                                        <p className="text-sm font-medium mb-2">
                                            Características:
                                        </p>
                                        <ul className="space-y-1">
                                            {plan.features.slice(0, 4).map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-muted-foreground">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        {plan.features.length > 4 && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                +{plan.features.length - 4} más
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {plan.includes_nutrition_plan && (
                                        <Badge variant="secondary" className="text-xs">
                                            <Check className="h-3 w-3 mr-1" />
                                            Plan Nutricional
                                        </Badge>
                                    )}
                                    {plan.includes_personal_training && (
                                        <Badge variant="secondary" className="text-xs">
                                            <Check className="h-3 w-3 mr-1" />
                                            Entrenamiento Personal
                                        </Badge>
                                    )}
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2 pt-4">
                                    <Link
                                        href={`/membership-plans/${plan.id}/edit`}
                                        className="flex-1"
                                    >
                                        <Button variant="outline" className="w-full">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => setDeletingPlan(plan)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {plans.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay planes de membresía</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Comienza creando tu primer plan de membresía
                        </p>
                        <Link href="/membership-plans/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Plan
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={!!deletingPlan} onOpenChange={() => setDeletingPlan(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar el plan "{deletingPlan?.name}"?
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
