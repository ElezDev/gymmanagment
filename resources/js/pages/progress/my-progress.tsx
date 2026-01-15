import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    TrendingUp,
    TrendingDown,
    Weight,
    Ruler,
    Calendar,
    Plus,
    LineChart as LineChartIcon,
    Save,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { useState } from 'react';

interface ProgressLog {
    id: number;
    log_date: string;
    weight: number;
    body_fat_percentage: number | null;
    muscle_mass: number | null;
    notes: string | null;
}

interface Props {
    progress_logs: ProgressLog[];
    client: {
        weight: number;
        height: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mi Progreso', href: '/my-progress' },
];

export default function MyProgress({ progress_logs, client }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        weight: '',
        body_fat_percentage: '',
        muscle_mass: '',
        notes: '',
    });

    const chartData = progress_logs
        .slice(0, 20)
        .reverse()
        .map((log) => ({
            date: new Date(log.log_date).toLocaleDateString('es', {
                day: 'numeric',
                month: 'short',
            }),
            peso: log.weight,
            grasa: log.body_fat_percentage || 0,
            musculo: log.muscle_mass || 0,
        }));

    const firstLog = progress_logs[progress_logs.length - 1];
    const lastLog = progress_logs[0];
    const weightChange = lastLog && firstLog ? lastLog.weight - firstLog.weight : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/my-progress', formData, {
            onSuccess: () => {
                setFormData({
                    weight: '',
                    body_fat_percentage: '',
                    muscle_mass: '',
                    notes: '',
                });
                setShowForm(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi Progreso" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Mi Progreso</h1>
                        <p className="text-muted-foreground">
                            Seguimiento de tu evolución física
                        </p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Registrar Medición
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Peso Actual</CardTitle>
                            <Weight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {lastLog ? lastLog.weight : client.weight} kg
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cambio Total</CardTitle>
                            {weightChange >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {weightChange > 0 ? '+' : ''}
                                {weightChange.toFixed(1)} kg
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Altura</CardTitle>
                            <Ruler className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{client.height} cm</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registros</CardTitle>
                            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{progress_logs.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* New Log Form */}
                {showForm && (
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle>Nueva Medición</CardTitle>
                            <CardDescription>Registra tus medidas actuales</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Peso (kg) *</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.1"
                                            required
                                            value={formData.weight}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    weight: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="body_fat">Grasa Corporal (%)</Label>
                                        <Input
                                            id="body_fat"
                                            type="number"
                                            step="0.1"
                                            value={formData.body_fat_percentage}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    body_fat_percentage: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="muscle_mass">Masa Muscular (kg)</Label>
                                        <Input
                                            id="muscle_mass"
                                            type="number"
                                            step="0.1"
                                            value={formData.muscle_mass}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    muscle_mass: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notas</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Ej: Me siento con más energía, he aumentado la intensidad..."
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, notes: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" className="gap-2">
                                        <Save className="h-4 w-4" />
                                        Guardar Medición
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Charts */}
                {chartData.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Weight Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Evolución del Peso</CardTitle>
                                <CardDescription>Últimas 20 mediciones</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="date" className="text-sm" />
                                        <YAxis className="text-sm" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="peso"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorWeight)"
                                            name="Peso (kg)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Body Composition Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Composición Corporal</CardTitle>
                                <CardDescription>Grasa y masa muscular</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="date" className="text-sm" />
                                        <YAxis className="text-sm" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="grasa"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            name="Grasa (%)"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="musculo"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name="Músculo (kg)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Progress Log History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Mediciones</CardTitle>
                        <CardDescription>Todas tus mediciones registradas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {progress_logs.length > 0 ? (
                            <div className="space-y-3">
                                {progress_logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-full bg-primary/10">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {new Date(log.log_date).toLocaleDateString('es', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                                {log.notes && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {log.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-xs text-muted-foreground mb-1">
                                                    Peso
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {log.weight} kg
                                                </p>
                                            </div>
                                            {log.body_fat_percentage && (
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        Grasa
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {log.body_fat_percentage}%
                                                    </p>
                                                </div>
                                            )}
                                            {log.muscle_mass && (
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        Músculo
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {log.muscle_mass} kg
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Weight className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No hay mediciones registradas
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Comienza a registrar tu progreso para ver tu evolución
                                </p>
                                <Button onClick={() => setShowForm(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Registrar Primera Medición
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
