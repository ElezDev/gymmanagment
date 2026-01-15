import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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

interface Routine {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    clients_count: number;
    routine_exercises_count: number;
}

interface PaginatedRoutines {
    data: Routine[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    routines: PaginatedRoutines;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rutinas', href: '/routines' },
];

export default function RoutinesIndex({ routines }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [routineToDelete, setRoutineToDelete] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setRoutineToDelete(id);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (routineToDelete) {
            router.delete(`/routines/${routineToDelete}`, {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setRoutineToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rutinas" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Rutinas</h1>
                        <p className="text-muted-foreground">
                            Gestiona las rutinas de entrenamiento
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/routines/create">Nueva Rutina</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Rutinas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Ejercicios</TableHead>
                                    <TableHead>Clientes</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {routines.data.map((routine) => (
                                    <TableRow key={routine.id}>
                                        <TableCell className="font-medium">
                                            {routine.name}
                                        </TableCell>
                                        <TableCell>
                                            {routine.description
                                                ? routine.description.substring(0, 50) + '...'
                                                : 'Sin descripción'}
                                        </TableCell>
                                        <TableCell>
                                            {routine.routine_exercises_count}
                                        </TableCell>
                                        <TableCell>{routine.clients_count}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    routine.is_active ? 'default' : 'secondary'
                                                }
                                            >
                                                {routine.is_active ? 'Activa' : 'Inactiva'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/routines/${routine.id}`}>
                                                        Ver
                                                    </Link>
                                                </Button>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/routines/${routine.id}/edit`}>
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(routine.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Mostrando {routines.data.length} de {routines.total} rutinas
                            </p>
                            <div className="flex gap-2">
                                {routines.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.get(
                                                `/routines?page=${routines.current_page - 1}`,
                                            )
                                        }
                                    >
                                        Anterior
                                    </Button>
                                )}
                                {routines.current_page < routines.last_page && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.get(
                                                `/routines?page=${routines.current_page + 1}`,
                                            )
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar rutina?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la rutina y
                            se desasignará de todos los clientes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
