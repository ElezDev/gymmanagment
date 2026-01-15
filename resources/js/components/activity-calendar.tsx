import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ActivityDay {
    date: Date;
    count: number;
}

interface ActivityCalendarProps {
    workoutSessions: Array<{
        started_at: string;
        ended_at: string | null;
        completed: boolean;
    }>;
}

export function ActivityCalendar({ workoutSessions }: ActivityCalendarProps) {
    // Generar últimos 30 días
    const days: ActivityDay[] = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push({
            date,
            count: 0,
        });
    }

    // Contar entrenamientos por día
    workoutSessions.forEach((session) => {
        if (session.completed && session.ended_at) {
            const sessionDate = new Date(session.ended_at);
            const day = days.find(
                (d) =>
                    d.date.toDateString() === sessionDate.toDateString()
            );
            if (day) {
                day.count++;
            }
        }
    });

    const getIntensityColor = (count: number) => {
        if (count === 0) return 'bg-muted';
        if (count === 1) return 'bg-green-200 dark:bg-green-900/30';
        if (count === 2) return 'bg-green-400 dark:bg-green-700/50';
        return 'bg-green-600 dark:bg-green-600';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimos 30 días de entrenamiento</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-10 gap-2">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={cn(
                                'aspect-square rounded-sm transition-all hover:scale-110',
                                getIntensityColor(day.count)
                            )}
                            title={`${day.date.toLocaleDateString('es', {
                                day: 'numeric',
                                month: 'short',
                            })}: ${day.count} entrenamiento${day.count !== 1 ? 's' : ''}`}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span>Menos activo</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-muted" />
                        <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/30" />
                        <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/50" />
                        <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-600" />
                    </div>
                    <span>Más activo</span>
                </div>
            </CardContent>
        </Card>
    );
}
