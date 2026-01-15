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
import { Input } from '@/components/ui/input';
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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Exercise {
    id: number;
    name: string;
    category: string;
    muscle_group: string;
    difficulty_level: string;
}

interface PaginatedExercises {
    data: Exercise[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    exercises: PaginatedExercises;
    filters: {
        search?: string;
        category?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ejercicios', href: '/exercises' },
];

export default function ExercisesIndex({ exercises, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);

    const handleSearch = () => {
        router.get('/exercises', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        setExerciseToDelete(id);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (exerciseToDelete) {
            router.delete(`/exercises/${exerciseToDelete}`, {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setExerciseToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ejercicios" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Ejercicios</h1>
                        <p className="text-muted-foreground">
                            Gestiona el catálogo de ejercicios
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/exercises/create">Nuevo Ejercicio</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Ejercicios</CardTitle>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Buscar ejercicios..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch}>Buscar</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Grupo Muscular</TableHead>
                                    <TableHead>Dificultad</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exercises.data.map((exercise) => (
                                    <TableRow key={exercise.id}>
                                        <TableCell className="font-medium">
                                            {exercise.name}
                                        </TableCell>
                                        <TableCell>
                                            {exercise.category || 'Sin categoría'}
                                        </TableCell>
                                        <TableCell>
                                            {exercise.muscle_group || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    exercise.difficulty_level === 'principiante'
                                                        ? 'default'
                                                        : exercise.difficulty_level ===
                                                            'intermedio'
                                                          ? 'secondary'
                                                          : 'destructive'
                                                }
                                            >
                                                {exercise.difficulty_level || 'N/A'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/exercises/${exercise.id}`}>
                                                        Ver
                                                    </Link>
                                                </Button>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/exercises/${exercise.id}/edit`}>
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(exercise.id)}
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
                                Mostrando {exercises.data.length} de {exercises.total} ejercicios
                            </p>
                            <div className="flex gap-2">
                                {exercises.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.get(
                                                `/exercises?page=${exercises.current_page - 1}`,
                                            )
                                        }
                                    >
                                        Anterior
                                    </Button>
                                )}
                                {exercises.current_page < exercises.last_page && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.get(
                                                `/exercises?page=${exercises.current_page + 1}`,
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
                        <AlertDialogTitle>¿Eliminar ejercicio?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El ejercicio se eliminará permanentemente
                            y se quitará de todas las rutinas que lo incluyan.
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
