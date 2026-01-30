import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Users,
    LogIn,
    LogOut,
    Clock,
    Search,
    CheckCircle,
    AlertCircle,
    TrendingUp,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Client {
    id: number;
    user: {
        name: string;
        email: string;
    };
    membership_number: string;
    membership_status: string;
}

interface CheckIn {
    id: number;
    client: Client;
    check_in_time: string;
    check_out_time: string | null;
    duration_minutes: number | null;
    entry_method: string;
}

interface Stats {
    today_total: number;
    currently_in: number;
    avg_duration: number;
}

interface Props {
    activeCheckIns: CheckIn[];
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Check-ins', href: '/check-ins/dashboard' },
];

export default function CheckInDashboard({ activeCheckIns, stats }: Props) {
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const handleSearch = async (value: string) => {
        setSearch(value);
        if (value.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const response = await fetch(`/check-ins/search?search=${encodeURIComponent(value)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleCheckIn = (client: Client) => {
        router.post('/check-ins', {
            client_id: client.id,
            entry_method: 'manual',
        }, {
            onSuccess: () => {
                setSearch('');
                setSearchResults([]);
                setSelectedClient(null);
            },
        });
    };

    const handleCheckOut = (checkInId: number) => {
        router.post(`/check-ins/${checkInId}/check-out`, {}, {
            preserveScroll: true,
        });
    };

    const formatTime = (datetime: string) => {
        return new Date(datetime).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDuration = (minutes: number | null) => {
        if (!minutes) return '--';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getMembershipStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'expired':
                return 'bg-red-500';
            case 'suspended':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Control de Acceso" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Control de Acceso</h2>
                    <p className="text-muted-foreground">
                        Gestiona las entradas y salidas del gimnasio en tiempo real
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Visitas Hoy</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.today_total}</div>
                            <p className="text-xs text-muted-foreground">
                                Total de check-ins registrados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Actualmente en Gimnasio</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.currently_in}
                            </div>
                            <p className="text-xs text-muted-foreground">Clientes activos ahora</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Duración Promedio</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatDuration(stats.avg_duration)}
                            </div>
                            <p className="text-xs text-muted-foreground">Tiempo promedio de estancia</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Búsqueda y Check-in */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LogIn className="h-5 w-5" />
                                Registrar Check-in
                            </CardTitle>
                            <CardDescription>
                                Busca el cliente por nombre, email o número de membresía
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar cliente..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {searching && (
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    Buscando...
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {searchResults.map((client) => (
                                        <div
                                            key={client.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                                            onClick={() => setSelectedClient(client)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {getInitials(client.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{client.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {client.membership_number || client.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${getMembershipStatusColor(
                                                        client.membership_status
                                                    )}`}
                                                />
                                                {client.membership_status === 'active' ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedClient && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback>
                                                        {getInitials(selectedClient.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">
                                                        {selectedClient.user.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {selectedClient.membership_number}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    selectedClient.membership_status === 'active'
                                                        ? 'default'
                                                        : 'destructive'
                                                }
                                            >
                                                {selectedClient.membership_status === 'active'
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleCheckIn(selectedClient)}
                                                disabled={
                                                    selectedClient.membership_status !== 'active'
                                                }
                                                className="flex-1"
                                            >
                                                <LogIn className="mr-2 h-4 w-4" />
                                                Registrar Entrada
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setSelectedClient(null)}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                        {selectedClient.membership_status !== 'active' && (
                                            <p className="text-sm text-red-500 mt-2">
                                                ⚠️ Cliente sin membresía activa
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    {/* Clientes Activos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                En Gimnasio Ahora ({activeCheckIns.length})
                            </CardTitle>
                            <CardDescription>Clientes que están actualmente entrenando</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {activeCheckIns.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No hay clientes en el gimnasio</p>
                                    </div>
                                ) : (
                                    activeCheckIns.map((checkIn) => (
                                        <div
                                            key={checkIn.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {getInitials(checkIn.client.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {checkIn.client.user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Entrada: {formatTime(checkIn.check_in_time)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleCheckOut(checkIn.id)}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Salida
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Historial del día */}
                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Hoy</CardTitle>
                        <CardDescription>
                            Todas las entradas y salidas del día
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" onClick={() => router.visit('/check-ins')}>
                            Ver Historial Completo
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
