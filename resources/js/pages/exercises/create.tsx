import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ejercicios', href: '/exercises' },
    { title: 'Crear', href: '/exercises/create' },
];

export default function CreateExercise() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category: '',
        muscle_group: '',
        difficulty: 'principiante',
        video_url: '',
        image_url: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/exercises');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Ejercicio" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Crear Ejercicio</h1>
                        <p className="text-muted-foreground">
                            Agrega un nuevo ejercicio al catálogo
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/exercises">Cancelar</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Ejercicio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nombre <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Press de Banca"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Categoría */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría</Label>
                                    <Input
                                        id="category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        placeholder="Fuerza, Cardio, Flexibilidad..."
                                    />
                                    {errors.category && (
                                        <p className="text-sm text-red-500">{errors.category}</p>
                                    )}
                                </div>

                                {/* Grupo Muscular */}
                                <div className="space-y-2">
                                    <Label htmlFor="muscle_group">Grupo Muscular</Label>
                                    <Input
                                        id="muscle_group"
                                        value={data.muscle_group}
                                        onChange={(e) => setData('muscle_group', e.target.value)}
                                        placeholder="Pecho, Espalda, Piernas..."
                                    />
                                    {errors.muscle_group && (
                                        <p className="text-sm text-red-500">
                                            {errors.muscle_group}
                                        </p>
                                    )}
                                </div>

                                {/* Dificultad */}
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Dificultad</Label>
                                    <Select
                                        value={data.difficulty}
                                        onValueChange={(value) => setData('difficulty', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona dificultad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="principiante">
                                                Principiante
                                            </SelectItem>
                                            <SelectItem value="intermedio">Intermedio</SelectItem>
                                            <SelectItem value="avanzado">Avanzado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.difficulty && (
                                        <p className="text-sm text-red-500">{errors.difficulty}</p>
                                    )}
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Descripción detallada del ejercicio..."
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* URL Video */}
                                <div className="space-y-2">
                                    <Label htmlFor="video_url">URL del Video (opcional)</Label>
                                    <Input
                                        id="video_url"
                                        type="url"
                                        value={data.video_url}
                                        onChange={(e) => setData('video_url', e.target.value)}
                                        placeholder="https://youtube.com/..."
                                    />
                                    {errors.video_url && (
                                        <p className="text-sm text-red-500">{errors.video_url}</p>
                                    )}
                                </div>

                                {/* URL Imagen */}
                                <div className="space-y-2">
                                    <Label htmlFor="image_url">URL de Imagen (opcional)</Label>
                                    <Input
                                        id="image_url"
                                        type="url"
                                        value={data.image_url}
                                        onChange={(e) => setData('image_url', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    {errors.image_url && (
                                        <p className="text-sm text-red-500">{errors.image_url}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/exercises">Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Crear Ejercicio'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
