import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Apple, TrendingUp, Flame, Activity } from 'lucide-react';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface User {
    id: number;
    name: string;
}

interface NutritionPlan {
    id: number;
    client: Client;
    created_by: User;
    daily_calories_target: number;
    protein_grams: number;
    carbs_grams: number;
    fats_grams: number;
    goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance';
    start_date: string;
    end_date?: string;
    is_active: boolean;
}

interface Props {
    nutritionPlans: {
        data: NutritionPlan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        goal?: string;
        is_active?: string;
    };
    clients: Array<{ id: number; name: string }>;
    stats: {
        active_plans: number;
        avg_calories: number;
        weight_loss: number;
        muscle_gain: number;
    };
}

const goalConfig = {
    weight_loss: {
        label: 'Pérdida de Peso',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        icon: TrendingUp,
    },
    muscle_gain: {
        label: 'Ganancia Muscular',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        icon: Activity,
    },
    maintenance: {
        label: 'Mantenimiento',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        icon: Flame,
    },
    performance: {
        label: 'Rendimiento',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
        icon: TrendingUp,
    },
};

export default function NutritionPlansIndex({ nutritionPlans, filters, clients, stats }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [goal, setGoal] = useState(filters.goal || '');
    const [isActive, setIsActive] = useState(filters.is_active || '');

    const handleFilter = () => {
        router.get('/nutrition-plans', { search, goal, is_active: isActive }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setGoal('');
        setIsActive('');
        router.get('/nutrition-plans', {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Planes Nutricionales" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Planes Nutricionales</h1>
                        <p className="text-muted-foreground">
                            Gestiona los planes de alimentación de tus clientes
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/nutrition-plans/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Plan
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
                            <Apple className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_plans}</div>
                            <p className="text-xs text-muted-foreground">Clientes con plan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Calorías Promedio</CardTitle>
                            <Flame className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avg_calories}</div>
                            <p className="text-xs text-muted-foreground">kcal diarias</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pérdida de Peso</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.weight_loss}</div>
                            <p className="text-xs text-muted-foreground">Planes activos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ganancia Muscular</CardTitle>
                            <Activity className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.muscle_gain}</div>
                            <p className="text-xs text-muted-foreground">Planes activos</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtrar Planes</CardTitle>
                        <CardDescription>Busca y filtra los planes nutricionales</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar por cliente..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <Select value={goal} onValueChange={setGoal}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Objetivo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="weight_loss">Pérdida de Peso</SelectItem>
                                    <SelectItem value="muscle_gain">Ganancia Muscular</SelectItem>
                                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                                    <SelectItem value="performance">Rendimiento</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={isActive} onValueChange={setIsActive}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="1">Activos</SelectItem>
                                    <SelectItem value="0">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter}>
                                <Search className="mr-2 h-4 w-4" />
                                Buscar
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Limpiar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Nutrition Plans Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Planes Nutricionales</CardTitle>
                        <CardDescription>
                            Mostrando {nutritionPlans.data.length} de {nutritionPlans.total} planes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Objetivo</TableHead>
                                    <TableHead>Calorías</TableHead>
                                    <TableHead>Macronutrientes</TableHead>
                                    <TableHead>Periodo</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Creado por</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nutritionPlans.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            No se encontraron planes nutricionales
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    nutritionPlans.data.map((plan) => {
                                        const GoalIcon = goalConfig[plan.goal].icon;
                                        return (
                                            <TableRow key={plan.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{plan.client.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {plan.client.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={goalConfig[plan.goal].color}
                                                    >
                                                        <GoalIcon className="mr-1 h-3 w-3" />
                                                        {goalConfig[plan.goal].label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Flame className="h-4 w-4 text-orange-600" />
                                                        <span className="font-medium">
                                                            {plan.daily_calories_target} kcal
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1 text-xs">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium text-red-600">P:</span>
                                                            <span>{plan.protein_grams}g</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium text-blue-600">C:</span>
                                                            <span>{plan.carbs_grams}g</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium text-yellow-600">G:</span>
                                                            <span>{plan.fats_grams}g</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>
                                                            {new Date(plan.start_date).toLocaleDateString('es-MX', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </div>
                                                        {plan.end_date && (
                                                            <div className="text-muted-foreground">
                                                                hasta{' '}
                                                                {new Date(plan.end_date).toLocaleDateString('es-MX', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={plan.is_active ? 'default' : 'secondary'}
                                                        className={
                                                            plan.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }
                                                    >
                                                        {plan.is_active ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-muted-foreground">
                                                        {plan.created_by.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/nutrition-plans/${plan.id}`}>Ver</Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/nutrition-plans/${plan.id}/edit`}>
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {nutritionPlans.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Página {nutritionPlans.current_page} de {nutritionPlans.last_page}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={nutritionPlans.current_page === 1}
                                        onClick={() =>
                                            router.get(`/nutrition-plans?page=${nutritionPlans.current_page - 1}`)
                                        }
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={nutritionPlans.current_page === nutritionPlans.last_page}
                                        onClick={() =>
                                            router.get(`/nutrition-plans?page=${nutritionPlans.current_page + 1}`)
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Macros Legend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Guía de Macronutrientes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-red-600">P (Proteína):</span>
                            <span className="text-muted-foreground">4 calorías por gramo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-blue-600">C (Carbohidratos):</span>
                            <span className="text-muted-foreground">4 calorías por gramo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-yellow-600">G (Grasas):</span>
                            <span className="text-muted-foreground">9 calorías por gramo</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

NutritionPlansIndex.layout = (page: React.ReactElement) => <AppLayout children={page} />;
