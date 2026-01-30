import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { PageProps } from '@/types';
import { FormEventHandler } from 'react';

interface Instructor {
    id: number;
    name: string;
    email: string;
}

interface Props extends PageProps {
    instructors: Instructor[];
}

export default function ClassScheduleCreate({ auth, instructors }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        instructor_id: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        max_capacity: 20,
        difficulty_level: '',
        room_location: '',
        requires_reservation: true,
        cancel_hours_before: 2,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/class-schedules');
    };

    return (
        <AppLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Nueva Clase" />

            <div className="space-y-6">
                <div>
                    <Link href="/class-schedules">
                        <Button variant="ghost" size="sm" className="mb-2">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Nueva Clase</h1>
                    <p className="text-muted-foreground">
                        Crea un nuevo horario de clase grupal
                    </p>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Clase</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nombre de la Clase <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Yoga Matutino, Spinning Avanzado"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe la clase..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Instructor */}
                            <div className="space-y-2">
                                <Label htmlFor="instructor_id">
                                    Instructor <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.instructor_id.toString()}
                                    onValueChange={(value) =>
                                        setData('instructor_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un instructor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {instructors.map((instructor) => (
                                            <SelectItem
                                                key={instructor.id}
                                                value={instructor.id.toString()}
                                            >
                                                {instructor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.instructor_id && (
                                    <p className="text-sm text-red-600">
                                        {errors.instructor_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Día de la semana */}
                                <div className="space-y-2">
                                    <Label htmlFor="day_of_week">
                                        Día de la Semana <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.day_of_week}
                                        onValueChange={(value) =>
                                            setData('day_of_week', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un día" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monday">Lunes</SelectItem>
                                            <SelectItem value="tuesday">Martes</SelectItem>
                                            <SelectItem value="wednesday">Miércoles</SelectItem>
                                            <SelectItem value="thursday">Jueves</SelectItem>
                                            <SelectItem value="friday">Viernes</SelectItem>
                                            <SelectItem value="saturday">Sábado</SelectItem>
                                            <SelectItem value="sunday">Domingo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.day_of_week && (
                                        <p className="text-sm text-red-600">
                                            {errors.day_of_week}
                                        </p>
                                    )}
                                </div>

                                {/* Nivel */}
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty_level">
                                        Nivel <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.difficulty_level}
                                        onValueChange={(value) =>
                                            setData('difficulty_level', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona nivel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Principiante</SelectItem>
                                            <SelectItem value="intermediate">
                                                Intermedio
                                            </SelectItem>
                                            <SelectItem value="advanced">Avanzado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.difficulty_level && (
                                        <p className="text-sm text-red-600">
                                            {errors.difficulty_level}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Hora de inicio */}
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">
                                        Hora de Inicio <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) =>
                                            setData('start_time', e.target.value)
                                        }
                                    />
                                    {errors.start_time && (
                                        <p className="text-sm text-red-600">
                                            {errors.start_time}
                                        </p>
                                    )}
                                </div>

                                {/* Hora de fin */}
                                <div className="space-y-2">
                                    <Label htmlFor="end_time">
                                        Hora de Fin <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                    />
                                    {errors.end_time && (
                                        <p className="text-sm text-red-600">{errors.end_time}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Capacidad máxima */}
                                <div className="space-y-2">
                                    <Label htmlFor="max_capacity">
                                        Capacidad Máxima <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="max_capacity"
                                        type="number"
                                        min="1"
                                        value={data.max_capacity}
                                        onChange={(e) =>
                                            setData('max_capacity', Number(e.target.value))
                                        }
                                    />
                                    {errors.max_capacity && (
                                        <p className="text-sm text-red-600">
                                            {errors.max_capacity}
                                        </p>
                                    )}
                                </div>

                                {/* Ubicación */}
                                <div className="space-y-2">
                                    <Label htmlFor="room_location">Ubicación/Sala</Label>
                                    <Input
                                        id="room_location"
                                        value={data.room_location}
                                        onChange={(e) =>
                                            setData('room_location', e.target.value)
                                        }
                                        placeholder="Ej: Sala 1, Piso 2"
                                    />
                                    {errors.room_location && (
                                        <p className="text-sm text-red-600">
                                            {errors.room_location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Requiere reserva */}
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="requires_reservation">
                                        Requiere Reservación
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Los clientes deben reservar con anticipación
                                    </p>
                                </div>
                                <Switch
                                    id="requires_reservation"
                                    checked={data.requires_reservation}
                                    onCheckedChange={(checked) =>
                                        setData('requires_reservation', checked)
                                    }
                                />
                            </div>

                            {/* Horas para cancelar */}
                            {data.requires_reservation && (
                                <div className="space-y-2">
                                    <Label htmlFor="cancel_hours_before">
                                        Horas antes para cancelar
                                    </Label>
                                    <Input
                                        id="cancel_hours_before"
                                        type="number"
                                        min="0"
                                        value={data.cancel_hours_before}
                                        onChange={(e) =>
                                            setData(
                                                'cancel_hours_before',
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Tiempo mínimo antes de la clase para poder cancelar la
                                        reserva
                                    </p>
                                    {errors.cancel_hours_before && (
                                        <p className="text-sm text-red-600">
                                            {errors.cancel_hours_before}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/class-schedules">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creando...' : 'Crear Clase'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
