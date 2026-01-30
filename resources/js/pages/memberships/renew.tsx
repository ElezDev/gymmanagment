import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

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
    description?: string;
    price: number;
    duration_days: number;
}

interface Membership {
    id: number;
    client: Client;
    membership_plan: MembershipPlan;
    start_date: string;
    end_date: string;
    status: string;
    amount_paid: number;
}

interface Props {
    membership: Membership;
}

export default function RenewMembership({ membership }: Props) {
    const plan = membership.membership_plan;
    
    // Calcular nueva fecha de inicio (día después del vencimiento actual)
    const currentEndDate = new Date(membership.end_date);
    const newStartDate = new Date(currentEndDate);
    newStartDate.setDate(currentEndDate.getDate() + 1);
    
    // Calcular nueva fecha de fin
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + plan.duration_days);

    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'cash',
        amount_paid: plan.price.toString(),
        discount_amount: '0',
        discount_reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/memberships/${membership.id}/renew`, {
            onSuccess: () => {
                router.get('/memberships');
            },
        });
    };

    const finalAmount = parseFloat(data.amount_paid) - parseFloat(data.discount_amount || '0');

    return (
        <>
            <Head title="Renovar Membresía" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(`/memberships/${membership.id}`)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Renovar Membresía</h1>
                        <p className="text-muted-foreground">{membership.client.user.name}</p>
                    </div>
                </div>

                {/* Warning if already expired */}
                {new Date(membership.end_date) < new Date() && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <AlertCircle className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-yellow-900">Membresía Vencida</h3>
                                <p className="text-sm text-yellow-800">
                                    Esta membresía venció el{' '}
                                    {new Date(membership.end_date).toLocaleDateString('es-MX')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Payment Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información de Pago</CardTitle>
                                    <CardDescription>Configura el pago de renovación</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="payment_method">
                                                Método de Pago <span className="text-red-500">*</span>
                                            </Label>
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
                                                    <SelectItem value="online">Pago en Línea</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.payment_method && (
                                                <p className="text-sm text-red-500">{errors.payment_method}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="amount_paid">
                                                Monto Pagado <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="amount_paid"
                                                type="number"
                                                step="0.01"
                                                value={data.amount_paid}
                                                onChange={(e) => setData('amount_paid', e.target.value)}
                                                required
                                            />
                                            {errors.amount_paid && (
                                                <p className="text-sm text-red-500">{errors.amount_paid}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="font-medium">Descuento (Opcional)</h4>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="discount_amount">Monto de Descuento</Label>
                                                <Input
                                                    id="discount_amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.discount_amount}
                                                    onChange={(e) => setData('discount_amount', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="discount_reason">Razón del Descuento</Label>
                                                <Input
                                                    id="discount_reason"
                                                    value={data.discount_reason}
                                                    onChange={(e) => setData('discount_reason', e.target.value)}
                                                    placeholder="ej: Cliente frecuente"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="bg-muted p-4 rounded-lg space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Precio del Plan:</span>
                                            <span className="font-medium">${plan.price}</span>
                                        </div>
                                        {parseFloat(data.discount_amount) > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Descuento:</span>
                                                <span>-${data.discount_amount}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total a Pagar:</span>
                                            <span>${finalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resumen de Renovación</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Cliente</div>
                                        <div className="font-medium">{membership.client.user.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {membership.client.membership_number}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Plan</div>
                                        <div className="font-medium">{plan.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {plan.duration_days} días
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Vencimiento Actual</div>
                                        <div className="font-medium">
                                            {new Date(membership.end_date).toLocaleDateString('es-MX')}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="bg-green-50 p-3 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2 text-green-800 font-medium">
                                            <Calendar className="h-4 w-4" />
                                            Nueva Vigencia
                                        </div>
                                        <div className="text-sm">
                                            <div className="text-muted-foreground">Inicio:</div>
                                            <div className="font-medium">
                                                {newStartDate.toLocaleDateString('es-MX', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <div className="text-muted-foreground">Vencimiento:</div>
                                            <div className="font-medium">
                                                {newEndDate.toLocaleDateString('es-MX', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-2">
                                <Button type="submit" className="w-full" disabled={processing}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    {processing ? 'Procesando...' : 'Renovar Membresía'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.get(`/memberships/${membership.id}`)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

RenewMembership.layout = (page: React.ReactElement) => <AppLayout children={page} />;
