import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    CreditCard,
    DollarSign,
    Calendar,
    Users,
    Check,
    AlertCircle,
    ArrowLeft,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Client {
    id: number;
    user: {
        name: string;
        email: string;
    };
    membership_number: string;
}

interface MembershipPlan {
    id: number;
    name: string;
    description: string;
    price: string;
    duration_days: number;
    billing_cycle: string;
    features: string[];
    includes_nutrition_plan: boolean;
    includes_personal_training: boolean;
    personal_training_sessions: number;
}

interface Props {
    clients: Client[];
    plans: MembershipPlan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Membresías', href: '/memberships' },
    { title: 'Nueva Membresía', href: '/memberships/create' },
];

export default function CreateMembership({ clients, plans }: Props) {
    const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        membership_plan_id: '',
        start_date: new Date().toISOString().split('T')[0],
        amount_paid: '',
        discount_amount: '0',
        discount_reason: '',
        notes: '',
        auto_renew: false,
        payment_method: 'cash',
    });

    useEffect(() => {
        if (selectedPlan) {
            const basePrice = parseFloat(selectedPlan.price);
            const discount = (basePrice * discountPercentage) / 100;
            const finalAmount = basePrice - discount;

            setData({
                ...data,
                amount_paid: finalAmount.toFixed(2),
                discount_amount: discount.toFixed(2),
            });
        }
    }, [selectedPlan, discountPercentage]);

    const handlePlanChange = (planId: string) => {
        const plan = plans.find((p) => p.id === parseInt(planId));
        setSelectedPlan(plan || null);
        setData({
            ...data,
            membership_plan_id: planId,
            amount_paid: plan?.price || '',
        });
        setDiscountPercentage(0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/memberships');
    };

    const getEndDate = () => {
        if (!selectedPlan || !data.start_date) return '';
        const startDate = new Date(data.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + selectedPlan.duration_days);
        return endDate.toLocaleDateString('es-ES');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Membresía" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/memberships">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Nueva Membresía</h2>
                        <p className="text-muted-foreground">
                            Vende una membresía a un cliente
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Seleccionar Cliente */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Cliente
                                </CardTitle>
                                <CardDescription>Selecciona el cliente</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="client_id">Cliente *</Label>
                                    <Select
                                        value={data.client_id}
                                        onValueChange={(value) =>
                                            setData('client_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem
                                                    key={client.id}
                                                    value={client.id.toString()}
                                                >
                                                    {client.user.name} - {client.user.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.client_id && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.client_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Fecha de Inicio *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-red-500">{errors.start_date}</p>
                                    )}
                                </div>

                                {selectedPlan && data.start_date && (
                                    <div className="p-3 bg-primary/5 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            <span className="font-medium">Vigencia hasta:</span>
                                            <span className="text-primary font-bold">
                                                {getEndDate()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Seleccionar Plan */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Plan
                                </CardTitle>
                                <CardDescription>Elige el tipo de membresía</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="membership_plan_id">Plan de Membresía *</Label>
                                    <Select
                                        value={data.membership_plan_id}
                                        onValueChange={handlePlanChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {plans.map((plan) => (
                                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                                    {plan.name} - ${plan.price}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.membership_plan_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.membership_plan_id}
                                        </p>
                                    )}
                                </div>

                                {selectedPlan && (
                                    <div className="space-y-3 p-3 bg-muted rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium mb-2">
                                                Incluye:
                                            </p>
                                            <ul className="space-y-1">
                                                {selectedPlan.features.slice(0, 3).map((feature, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <Check className="h-4 w-4 text-green-500" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {selectedPlan.includes_nutrition_plan && (
                                            <Badge variant="secondary">Plan Nutricional</Badge>
                                        )}
                                        {selectedPlan.includes_personal_training && (
                                            <Badge variant="secondary">
                                                {selectedPlan.personal_training_sessions} Entrenamientos
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pago */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Información de Pago
                            </CardTitle>
                            <CardDescription>Detalles del pago y método</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Precio Base</Label>
                                    <div className="text-2xl font-bold">
                                        ${selectedPlan?.price || '0.00'}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discount_percentage">
                                        Descuento (%)
                                    </Label>
                                    <Input
                                        id="discount_percentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={discountPercentage}
                                        onChange={(e) =>
                                            setDiscountPercentage(Number(e.target.value))
                                        }
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount_paid">Total a Pagar *</Label>
                                    <Input
                                        id="amount_paid"
                                        type="number"
                                        step="0.01"
                                        value={data.amount_paid}
                                        onChange={(e) => setData('amount_paid', e.target.value)}
                                        className="text-lg font-bold"
                                    />
                                    {errors.amount_paid && (
                                        <p className="text-sm text-red-500">{errors.amount_paid}</p>
                                    )}
                                </div>
                            </div>

                            {discountPercentage > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="discount_reason">
                                        Motivo del Descuento
                                    </Label>
                                    <Input
                                        id="discount_reason"
                                        value={data.discount_reason}
                                        onChange={(e) =>
                                            setData('discount_reason', e.target.value)
                                        }
                                        placeholder="Ej: Promoción de lanzamiento"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="payment_method">Método de Pago *</Label>
                                <Select
                                    value={data.payment_method}
                                    onValueChange={(value) => setData('payment_method', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Efectivo</SelectItem>
                                        <SelectItem value="card">Tarjeta</SelectItem>
                                        <SelectItem value="transfer">Transferencia</SelectItem>
                                        <SelectItem value="check">Cheque</SelectItem>
                                        <SelectItem value="online">Pago Online</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.payment_method && (
                                    <p className="text-sm text-red-500">{errors.payment_method}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Notas adicionales..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="auto_renew"
                                    checked={data.auto_renew}
                                    onCheckedChange={(checked) =>
                                        setData('auto_renew', checked as boolean)
                                    }
                                />
                                <Label htmlFor="auto_renew" className="cursor-pointer">
                                    Renovación automática
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones */}
                    <div className="flex gap-4 justify-end">
                        <Link href="/memberships">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Procesando...' : 'Registrar Membresía y Pago'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
