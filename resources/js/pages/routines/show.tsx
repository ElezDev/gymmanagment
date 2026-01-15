import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Exercise {
    id: number;
    name: string;
    category: string;
}

interface RoutineExercise {
    id: number;
    sets: number;
    reps: number;
    weight: number;
    rest_seconds: number;
    order: number;
    notes: string;
    exercise: Exercise;
}

interface User {
    name: string;
    email: string;
}

interface Client {
    id: number;
    user: User;
}

interface Routine {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    routine_exercises: RoutineExercise[];
    clients: Client[];
}

interface Props {
    routine: Routine;
    availableClients: Client[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rutinas', href: '/routines' },
    { title: 'Detalle', href: '#' },
];

export default function ShowRoutine({ routine, availableClients }: Props) {
    const { data, setData, post, processing } = useForm({
        client_id: '',
    });
    const [showUnassignDialog, setShowUnassignDialog] = useState(false);
    const [clientToUnassign, setClientToUnassign] = useState<number | null>(null);

    const handleAssignClient = () => {
        if (!data.client_id) return;
        post(`/routines/${routine.id}/assign`, {
            preserveScroll: true,
            onSuccess: () => setData('client_id', ''),
        });
    };

    const handleUnassignClient = (clientId: number) => {
        setClientToUnassign(clientId);
        setShowUnassignDialog(true);
    };

    const confirmUnassign = () => {
        if (clientToUnassign) {
            router.delete(`/routines/${routine.id}/clients/${clientToUnassign}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowUnassignDialog(false);
                    setClientToUnassign(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={routine.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{routine.name}</h1>
                            <Badge variant={routine.is_active ? 'default' : 'secondary'}>
                                {routine.is_active ? 'Activa' : 'Inactiva'}
                            </Badge>
                        </div>
                        {routine.description && (
                            <p className="mt-2 text-muted-foreground">{routine.description}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/routines">Volver</Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/routines/${routine.id}/edit`}>Editar</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Información */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Rutina</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Fecha de Inicio
                                </p>
                                <p className="text-sm">
                                    {routine.start_date
                                        ? new Date(routine.start_date).toLocaleDateString()
                                        : 'No especificada'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Fecha de Fin
                                </p>
                                <p className="text-sm">
                                    {routine.end_date
                                        ? new Date(routine.end_date).toLocaleDateString()
                                        : 'No especificada'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total de Ejercicios
                                </p>
                                <p className="text-sm">{routine.routine_exercises.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clientes asignados */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Clientes Asignados</CardTitle>
                            <CardDescription>
                                {routine.clients.length} cliente(s)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Formulario para asignar */}
                            {availableClients.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Asignar cliente</p>
                                    <div className="flex gap-2">
                                        <Select
                                            value={data.client_id}
                                            onValueChange={(value) => setData('client_id', value)}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Selecciona un cliente" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableClients.map((client) => (
                                                    <SelectItem
                                                        key={client.id}
                                                        value={client.id.toString()}
                                                    >
                                                        {client.user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={handleAssignClient}
                                            disabled={!data.client_id || processing}
                                        >
                                            Asignar
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Lista de clientes asignados */}
                            {routine.clients.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No hay clientes asignados
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {routine.clients.map((client) => (
                                        <div
                                            key={client.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-medium">{client.user.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {client.user.email}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/clients/${client.id}`}>Ver</Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleUnassignClient(client.id)}
                                                >
                                                    Quitar
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Ejercicios */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ejercicios de la Rutina</CardTitle>
                        <CardDescription>
                            {routine.routine_exercises.length} ejercicio(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {routine.routine_exercises.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Esta rutina no tiene ejercicios
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {routine.routine_exercises
                                    .sort((a, b) => a.order - b.order)
                                    .map((routineExercise, index) => (
                                        <div
                                            key={routineExercise.id}
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="mb-3 flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                            {index + 1}
                                                        </span>
                                                        <h3 className="font-semibold">
                                                            {routineExercise.exercise.name}
                                                        </h3>
                                                    </div>
                                                    <p className="ml-8 text-sm text-muted-foreground">
                                                        {routineExercise.exercise.category}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="ml-8 grid gap-4 md:grid-cols-4">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Series
                                                    </p>
                                                    <p className="text-lg font-bold">
                                                        {routineExercise.sets}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Repeticiones
                                                    </p>
                                                    <p className="text-lg font-bold">
                                                        {routineExercise.reps}
                                                    </p>
                                                </div>
                                                {routineExercise.weight > 0 && (
                                                    <div>
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            Peso
                                                        </p>
                                                        <p className="text-lg font-bold">
                                                            {routineExercise.weight} kg
                                                        </p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Descanso
                                                    </p>
                                                    <p className="text-lg font-bold">
                                                        {routineExercise.rest_seconds}s
                                                    </p>
                                                </div>
                                            </div>

                                            {routineExercise.notes && (
                                                <div className="ml-8 mt-3 rounded bg-muted p-2">
                                                    <p className="text-sm">
                                                        {routineExercise.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Unassign Confirmation Dialog */}
            <AlertDialog open={showUnassignDialog} onOpenChange={setShowUnassignDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Desasignar rutina?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción desasignará la rutina del cliente seleccionado. El cliente ya no
                            tendrá acceso a esta rutina.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmUnassign}>
                            Sí, desasignar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
