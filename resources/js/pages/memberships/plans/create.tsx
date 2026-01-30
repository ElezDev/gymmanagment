import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function CreateMembershipPlan() {
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        duration_days: '30',
        billing_cycle: 'monthly',
        features: [] as string[],
        max_classes_per_week: '',
        max_classes_per_month: '',
        includes_nutrition_plan: false,
        includes_personal_training: false,
        personal_training_sessions: '0',
        is_active: true,
        sort_order: '0',
    });

    const addFeature = () => {
        if (newFeature.trim()) {
            const updatedFeatures = [...features, newFeature.trim()];
            setFeatures(updatedFeatures);
            setData('features', updatedFeatures);
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        const updatedFeatures = features.filter((_, i) => i !== index);
        setFeatures(updatedFeatures);
        setData('features', updatedFeatures);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/membership-plans');
    };

    return (
        <>
            <Head title="Crear Plan de Membresía" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get('/membership-plans')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Crear Plan de Membresía</h1>
                        <p className="text-muted-foreground">Define un nuevo plan para tus clientes</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Básica</CardTitle>
                                    <CardDescription>Datos principales del plan</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nombre del Plan <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="ej: Plan Básico"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Descripción del plan..."
                                            rows={3}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">
                                                Precio <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0.00"
                                                required
                                            />
                                            {errors.price && (
                                                <p className="text-sm text-red-500">{errors.price}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="billing_cycle">
                                                Ciclo de Facturación <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.billing_cycle}
                                                onValueChange={(value) => setData('billing_cycle', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="daily">Diario</SelectItem>
                                                    <SelectItem value="weekly">Semanal</SelectItem>
                                                    <SelectItem value="monthly">Mensual</SelectItem>
                                                    <SelectItem value="quarterly">Trimestral</SelectItem>
                                                    <SelectItem value="yearly">Anual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration_days">
                                            Duración (días) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="duration_days"
                                            type="number"
                                            value={data.duration_days}
                                            onChange={(e) => setData('duration_days', e.target.value)}
                                            required
                                        />
                                        {errors.duration_days && (
                                            <p className="text-sm text-red-500">{errors.duration_days}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Características del Plan</CardTitle>
                                    <CardDescription>
                                        Agrega las características que incluye este plan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="ej: Acceso ilimitado al gimnasio"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        />
                                        <Button type="button" onClick={addFeature}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Agregar
                                        </Button>
                                    </div>

                                    {features.length > 0 && (
                                        <div className="space-y-2">
                                            {features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-muted p-3 rounded-md"
                                                >
                                                    <span>{feature}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFeature(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Límites de Clases</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="max_classes_per_week">Clases por Semana</Label>
                                        <Input
                                            id="max_classes_per_week"
                                            type="number"
                                            value={data.max_classes_per_week}
                                            onChange={(e) => setData('max_classes_per_week', e.target.value)}
                                            placeholder="0 = ilimitado"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="max_classes_per_month">Clases por Mes</Label>
                                        <Input
                                            id="max_classes_per_month"
                                            type="number"
                                            value={data.max_classes_per_month}
                                            onChange={(e) => setData('max_classes_per_month', e.target.value)}
                                            placeholder="0 = ilimitado"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Servicios Incluidos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="nutrition"
                                            checked={data.includes_nutrition_plan}
                                            onCheckedChange={(checked) =>
                                                setData('includes_nutrition_plan', checked as boolean)
                                            }
                                        />
                                        <Label htmlFor="nutrition" className="cursor-pointer">
                                            Plan Nutricional
                                        </Label>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="personal_training"
                                                checked={data.includes_personal_training}
                                                onCheckedChange={(checked) =>
                                                    setData('includes_personal_training', checked as boolean)
                                                }
                                            />
                                            <Label htmlFor="personal_training" className="cursor-pointer">
                                                Entrenamiento Personal
                                            </Label>
                                        </div>

                                        {data.includes_personal_training && (
                                            <div className="ml-6 space-y-2">
                                                <Label htmlFor="personal_training_sessions">Sesiones</Label>
                                                <Input
                                                    id="personal_training_sessions"
                                                    type="number"
                                                    value={data.personal_training_sessions}
                                                    onChange={(e) =>
                                                        setData('personal_training_sessions', e.target.value)
                                                    }
                                                    placeholder="Número de sesiones"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sort_order">Orden</Label>
                                        <Input
                                            id="sort_order"
                                            type="number"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', e.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Los planes se ordenan de menor a mayor
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                        />
                                        <Label htmlFor="is_active" className="cursor-pointer">
                                            Plan Activo
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-2">
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Crear Plan'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.get('/membership-plans')}
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

CreateMembershipPlan.layout = (page: React.ReactElement) => <AppLayout children={page} />;
