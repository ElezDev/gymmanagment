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
}

interface ClassSchedule {
    id: number;
    name: string;
    description: string;
    instructor_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    max_capacity: number;
    difficulty_level: string;
    room_location: string;
    is_active: boolean;
    requires_reservation: boolean;
    cancel_hours_before: number;
}

interface Props extends PageProps {
    class: ClassSchedule;
    instructors: Instructor[];
}

export default function ClassScheduleEdit({ auth, class: classSchedule, instructors }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: classSchedule.name,
        description: classSchedule.description || '',
        instructor_id: classSchedule.instructor_id.toString(),
        day_of_week: classSchedule.day_of_week,
        start_time: classSchedule.start_time.slice(0, 5),
        end_time: classSchedule.end_time.slice(0, 5),
        max_capacity: classSchedule.max_capacity,
        difficulty_level: classSchedule.difficulty_level,
        room_location: classSchedule.room_location || '',
        is_active: classSchedule.is_active,
        requires_reservation: classSchedule.requires_reservation,
        cancel_hours_before: classSchedule.cancel_hours_before,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/class-schedules/${classSchedule.id}`);
    };

    return (
        <AppLayout user={auth.user} permissions={auth.permissions}>
            <Head title={`Editar ${classSchedule.name}`} />

            <div className="space-y-6">
                <div>
                    <Link href="/class-schedules">
                        <Button variant="ghost" size="sm" className="mb-2">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Editar Clase</h1>
                    <p className="text-muted-foreground">{classSchedule.name}</p>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Clase</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre de la Clase</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instructor_id">Instructor</Label>
                                <Select
                                    value={data.instructor_id}
                                    onValueChange={(value) => setData('instructor_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
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
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="day_of_week">Día de la Semana</Label>
                                    <Select
                                        value={data.day_of_week}
                                        onValueChange={(value) =>
                                            setData('day_of_week', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
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
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="difficulty_level">Nivel</Label>
                                    <Select
                                        value={data.difficulty_level}
                                        onValueChange={(value) =>
                                            setData('difficulty_level', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Principiante</SelectItem>
                                            <SelectItem value="intermediate">
                                                Intermedio
                                            </SelectItem>
                                            <SelectItem value="advanced">Avanzado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Hora de Inicio</Label>
                                    <Input
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) =>
                                            setData('start_time', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time">Hora de Fin</Label>
                                    <Input
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="max_capacity">Capacidad Máxima</Label>
                                    <Input
                                        id="max_capacity"
                                        type="number"
                                        value={data.max_capacity}
                                        onChange={(e) =>
                                            setData('max_capacity', Number(e.target.value))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="room_location">Ubicación/Sala</Label>
                                    <Input
                                        id="room_location"
                                        value={data.room_location}
                                        onChange={(e) =>
                                            setData('room_location', e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="is_active">Clase Activa</Label>
                                    <p className="text-sm text-muted-foreground">
                                        La clase estará disponible para reservas
                                    </p>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                            </div>

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

                            {data.requires_reservation && (
                                <div className="space-y-2">
                                    <Label htmlFor="cancel_hours_before">
                                        Horas antes para cancelar
                                    </Label>
                                    <Input
                                        id="cancel_hours_before"
                                        type="number"
                                        value={data.cancel_hours_before}
                                        onChange={(e) =>
                                            setData(
                                                'cancel_hours_before',
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/class-schedules">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
