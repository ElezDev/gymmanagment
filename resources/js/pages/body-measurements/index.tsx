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
import { Plus, Search, TrendingDown, TrendingUp, Ruler } from 'lucide-react';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface Measurement {
    id: number;
    client: Client;
    weight: number;
    height: number;
    body_fat_percentage?: number;
    muscle_mass_percentage?: number;
    bmi: number;
    measurement_date: string;
}

interface Props {
    measurements: {
        data: Measurement[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        client_id?: string;
    };
    clients: Array<{ id: number; name: string }>;
}

function getBMICategory(bmi: number): { label: string; color: string } {
    if (bmi < 18.5) return { label: 'Bajo Peso', color: 'bg-blue-100 text-blue-800' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-green-100 text-green-800' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Obesidad', color: 'bg-red-100 text-red-800' };
}

export default function BodyMeasurementsIndex({ measurements, filters, clients }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [clientId, setClientId] = useState(filters.client_id || '');

    const handleFilter = () => {
        router.get('/body-measurements', { search, client_id: clientId }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setClientId('');
        router.get('/body-measurements', {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Mediciones Corporales" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Mediciones Corporales</h1>
                        <p className="text-muted-foreground">
                            Seguimiento del progreso físico de tus clientes
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/clients">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Medición
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtrar Mediciones</CardTitle>
                        <CardDescription>Busca por cliente o filtra las mediciones</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar por nombre de cliente..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <Select value={clientId} onValueChange={setClientId}>
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los clientes</SelectItem>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id.toString()}>
                                            {client.name}
                                        </SelectItem>
                                    ))}
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

                {/* Measurements Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mediciones Registradas</CardTitle>
                        <CardDescription>
                            Mostrando {measurements.data.length} de {measurements.total} mediciones
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Peso</TableHead>
                                    <TableHead>Altura</TableHead>
                                    <TableHead>IMC</TableHead>
                                    <TableHead>% Grasa</TableHead>
                                    <TableHead>% Músculo</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {measurements.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            No se encontraron mediciones
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    measurements.data.map((measurement) => {
                                        const bmiCategory = getBMICategory(measurement.bmi);
                                        return (
                                            <TableRow key={measurement.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {measurement.client.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {measurement.client.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(measurement.measurement_date).toLocaleDateString(
                                                        'es-MX',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Ruler className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {measurement.weight} kg
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{measurement.height} cm</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={bmiCategory.color}>
                                                        {measurement.bmi.toFixed(1)} - {bmiCategory.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {measurement.body_fat_percentage ? (
                                                        <div className="flex items-center gap-1">
                                                            <TrendingDown className="h-4 w-4 text-red-600" />
                                                            <span>{measurement.body_fat_percentage}%</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {measurement.muscle_mass_percentage ? (
                                                        <div className="flex items-center gap-1">
                                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                                            <span>{measurement.muscle_mass_percentage}%</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link
                                                            href={`/clients/${measurement.client.id}/body-measurements/${measurement.id}`}
                                                        >
                                                            Ver
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link
                                                            href={`/clients/${measurement.client.id}/body-measurements/${measurement.id}/charts`}
                                                        >
                                                            Gráficos
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
                        {measurements.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Página {measurements.current_page} de {measurements.last_page}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={measurements.current_page === 1}
                                        onClick={() =>
                                            router.get(`/body-measurements?page=${measurements.current_page - 1}`)
                                        }
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={measurements.current_page === measurements.last_page}
                                        onClick={() =>
                                            router.get(`/body-measurements?page=${measurements.current_page + 1}`)
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sobre las Mediciones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>
                            <strong>IMC (Índice de Masa Corporal):</strong> Se calcula automáticamente basándose
                            en el peso y la altura.
                        </p>
                        <p>
                            <strong>Categorías de IMC:</strong>
                        </p>
                        <ul className="ml-6 list-disc space-y-1">
                            <li>Bajo Peso: IMC {'<'} 18.5</li>
                            <li>Normal: IMC 18.5 - 24.9</li>
                            <li>Sobrepeso: IMC 25 - 29.9</li>
                            <li>Obesidad: IMC ≥ 30</li>
                        </ul>
                        <p className="mt-4">
                            Las mediciones corporales permiten rastrear el progreso de los clientes a lo largo del
                            tiempo. Se recomienda tomar mediciones cada 2-4 semanas para un seguimiento efectivo.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

BodyMeasurementsIndex.layout = (page: React.ReactElement) => <AppLayout children={page} />;
