import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Play, History, Dumbbell } from 'lucide-react';

interface User {
    name: string;
    email: string;
}

interface Routine {
    id: number;
    name: string;
    description: string;
}

interface ProgressLog {
    id: number;
    log_date: string;
    weight: number;
    notes: string;
}

interface WorkoutSession {
    id: number;
    started_at: string;
    completed_at: string;
    routine: {
        name: string;
    };
}

interface Client {
    id: number;
    user: User;
    phone: string;
    birth_date: string;
    gender: string;
    height: number;
    weight: number;
    medical_notes: string;
    goals: string;
    membership_start: string;
    membership_end: string;
    is_active: boolean;
    routines: Routine[];
    progress_logs: ProgressLog[];
    workout_sessions: WorkoutSession[];
}

interface Props {
    client: Client;
    auth: {
        user: {
            id: number;
            client?: {
                id: number;
            };
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Clientes', href: '/clients' },
    { title: 'Perfil', href: '#' },
];

export default function ShowClient({ client, auth }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    
    // Verificar si el usuario actual es el cliente que está viendo su propio perfil
    const isOwnProfile = auth?.user?.client?.id === client.id;

    const handleDelete = () => {
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        router.delete(`/clients/${client.id}`, {
            onSuccess: () => {
                setShowDeleteDialog(false);
            },
        });
    };

    const age = client.birth_date
        ? new Date().getFullYear() - new Date(client.birth_date).getFullYear()
        : null;

    const daysUntilExpiry = client.membership_end
        ? Math.ceil(
              (new Date(client.membership_end).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
          )
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={client.user.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{client.user.name}</h1>
                            <Badge variant={client.is_active ? 'default' : 'secondary'}>
                                {client.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{client.user.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/clients">Volver</Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/clients/${client.id}/edit`}>Editar</Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Eliminar
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Información Personal */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {client.phone && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Teléfono
                                    </p>
                                    <p className="text-sm">{client.phone}</p>
                                </div>
                            )}
                            {client.birth_date && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Edad
                                    </p>
                                    <p className="text-sm">{age} años</p>
                                </div>
                            )}
                            {client.gender && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Género
                                    </p>
                                    <p className="text-sm">
                                        {client.gender === 'male'
                                            ? 'Masculino'
                                            : client.gender === 'female'
                                              ? 'Femenino'
                                              : 'Otro'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Datos Físicos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos Físicos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {client.height && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Altura
                                    </p>
                                    <p className="text-sm">{client.height} cm</p>
                                </div>
                            )}
                            {client.weight && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Peso
                                    </p>
                                    <p className="text-sm">{client.weight} kg</p>
                                </div>
                            )}
                            {client.height && client.weight && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        IMC
                                    </p>
                                    <p className="text-sm">
                                        {(
                                            client.weight /
                                            Math.pow(client.height / 100, 2)
                                        ).toFixed(1)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Membresía */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Membresía</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {client.membership_start && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Inicio
                                    </p>
                                    <p className="text-sm">
                                        {new Date(client.membership_start).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            {client.membership_end && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Vencimiento
                                    </p>
                                    <p className="text-sm">
                                        {new Date(client.membership_end).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            {daysUntilExpiry !== null && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Días restantes
                                    </p>
                                    <p
                                        className={`text-sm font-bold ${daysUntilExpiry < 30 ? 'text-red-600' : 'text-green-600'}`}
                                    >
                                        {daysUntilExpiry > 0
                                            ? `${daysUntilExpiry} días`
                                            : 'Vencida'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Objetivos */}
                {client.goals && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Objetivos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{client.goals}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Notas Médicas */}
                {client.medical_notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notas Médicas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{client.medical_notes}</p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Rutinas */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Rutinas Asignadas</CardTitle>
                                    <CardDescription>{client.routines.length} rutina(s)</CardDescription>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={isOwnProfile ? '/my-workout-history' : `/clients/${client.id}/workout-history`}>
                                        <History className="h-4 w-4 mr-2" />
                                        Historial
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {client.routines.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No tiene rutinas asignadas
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {client.routines.map((routine) => (
                                        <div
                                            key={routine.id}
                                            className="rounded-lg border p-3 flex items-center justify-between"
                                        >
                                            <div>
                                                <h3 className="font-medium">{routine.name}</h3>
                                                {routine.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {routine.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Button 
                                                size="sm"
                                                onClick={() => {
                                                    const route = isOwnProfile 
                                                        ? '/my-workout-sessions/start'
                                                        : '/workout-sessions/start';
                                                    const data = isOwnProfile
                                                        ? { routine_id: routine.id }
                                                        : { client_id: client.id, routine_id: routine.id };
                                                    router.post(route, data);
                                                }}
                                            >
                                                <Play className="h-4 w-4 mr-1" />
                                                Iniciar
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Progreso Reciente */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Progreso Reciente</CardTitle>
                            <CardDescription>
                                Últimas {client.progress_logs.length} mediciones
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {client.progress_logs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Sin registros de progreso
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {client.progress_logs.map((log) => (
                                        <div key={log.id} className="flex justify-between border-b pb-2">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {log.weight} kg
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(log.log_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {log.notes && (
                                                <p className="text-xs text-muted-foreground">
                                                    {log.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Entrenamientos Recientes */}
                {client.workout_sessions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Entrenamientos Recientes</CardTitle>
                            <CardDescription>
                                Últimas {client.workout_sessions.length} sesiones
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {client.workout_sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">{session.routine.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(session.started_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {session.completed_at ? (
                                            <Badge>Completado</Badge>
                                        ) : (
                                            <Badge variant="secondary">En progreso</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente a{' '}
                            <span className="font-semibold">{client.user.name}</span>, su cuenta de
                            usuario, rutinas asignadas y todo su historial de progreso.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
