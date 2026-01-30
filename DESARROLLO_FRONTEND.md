# Guía de Desarrollo - Frontend

## 🚀 Inicio Rápido

### Instalar Dependencias
```bash
npm install
```

### Compilar Assets
```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm run build
```

## 📂 Estructura de Archivos Frontend

```
resources/js/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de shadcn/ui
│   ├── app-sidebar.tsx # Navegación principal
│   └── ...
├── layouts/            # Layouts de página
│   └── app-layout.tsx
├── pages/              # Vistas de Inertia
│   ├── memberships/
│   │   ├── index.tsx
│   │   ├── plans/
│   │   │   └── index.tsx
│   │   └── create.tsx
│   ├── payments/
│   │   └── index.tsx
│   ├── check-ins/
│   │   ├── index.tsx
│   │   └── dashboard.tsx
│   ├── body-measurements/
│   │   └── index.tsx
│   ├── class-schedules/
│   │   └── index.tsx
│   ├── class-bookings/
│   │   └── index.tsx
│   └── nutrition-plans/
│       └── index.tsx
└── types/              # Definiciones de TypeScript
```

## 🎨 Crear una Nueva Vista

### 1. Crear el Archivo
```typescript
// resources/js/pages/ejemplo/index.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    items: Array<{
        id: number;
        name: string;
    }>;
}

export default function EjemploIndex({ items }: Props) {
    return (
        <>
            <Head title="Ejemplo" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Ejemplo</h1>
                    <Button asChild>
                        <Link href="/ejemplo/create">Nuevo</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Contenido */}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EjemploIndex.layout = (page: React.ReactElement) => <AppLayout children={page} />;
```

### 2. Crear la Ruta en Laravel
```php
// routes/web.php
Route::get('/ejemplo', [EjemploController::class, 'index'])
    ->middleware(['auth', 'can:view ejemplo'])
    ->name('ejemplo.index');
```

### 3. Crear el Controlador
```php
// app/Http/Controllers/EjemploController.php
public function index()
{
    $items = Ejemplo::latest()->paginate(10);
    
    return Inertia::render('ejemplo/index', [
        'items' => $items,
    ]);
}
```

### 4. Agregar al Sidebar (Opcional)
```typescript
// resources/js/components/app-sidebar.tsx
if (permissions.includes('view ejemplo')) {
    mainNavItems.push({
        title: 'Ejemplo',
        href: '/ejemplo',
        icon: IconName,
    });
}
```

## 🧩 Componentes Comunes

### Tarjeta de Estadística
```typescript
<Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Título</CardTitle>
        <Icon className="h-4 w-4 text-blue-600" />
    </CardHeader>
    <CardContent>
        <div className="text-2xl font-bold">123</div>
        <p className="text-xs text-muted-foreground">Descripción</p>
    </CardContent>
</Card>
```

### Tabla con Paginación
```typescript
<Table>
    <TableHeader>
        <TableRow>
            <TableHead>Columna 1</TableHead>
            <TableHead>Columna 2</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {data.data.map((item) => (
            <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.value}</TableCell>
            </TableRow>
        ))}
    </TableBody>
</Table>

{/* Paginación */}
{data.last_page > 1 && (
    <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
            Página {data.current_page} de {data.last_page}
        </div>
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                disabled={data.current_page === 1}
                onClick={() => router.get(`/ruta?page=${data.current_page - 1}`)}
            >
                Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={data.current_page === data.last_page}
                onClick={() => router.get(`/ruta?page=${data.current_page + 1}`)}
            >
                Siguiente
            </Button>
        </div>
    </div>
)}
```

### Filtros
```typescript
const [search, setSearch] = useState(filters.search || '');
const [status, setStatus] = useState(filters.status || '');

const handleFilter = () => {
    router.get('/ruta', { search, status }, { preserveState: true });
};

<Card>
    <CardHeader>
        <CardTitle>Filtros</CardTitle>
    </CardHeader>
    <CardContent>
        <div className="flex gap-4">
            <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            />
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleFilter}>Buscar</Button>
        </div>
    </CardContent>
</Card>
```

### Badge con Color
```typescript
const statusConfig = {
    active: {
        label: 'Activo',
        className: 'bg-green-100 text-green-800',
    },
    inactive: {
        label: 'Inactivo',
        className: 'bg-gray-100 text-gray-800',
    },
};

<Badge variant="secondary" className={statusConfig[item.status].className}>
    {statusConfig[item.status].label}
</Badge>
```

## 🎯 Patrones de Diseño

### Props Interface
```typescript
interface Props {
    // Datos principales (siempre paginados si es lista)
    items: {
        data: Item[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    // Filtros actuales
    filters: {
        search?: string;
        status?: string;
    };
    // Estadísticas opcionales
    stats?: {
        total: number;
        active: number;
    };
}
```

### Estado Local
```typescript
// Para formularios
const { data, setData, post, processing, errors } = useForm({
    field1: '',
    field2: '',
});

// Para filtros
const [search, setSearch] = useState(filters.search || '');

// Para modals
const [isOpen, setIsOpen] = useState(false);
```

### Navegación
```typescript
// Link estático
<Link href="/ruta">Texto</Link>

// Link con parámetros
<Link href={`/ruta/${id}`}>Texto</Link>

// Navegación programática
router.get('/ruta', { param: value });
router.post('/ruta', data);
```

## 🎨 Estilos y Clases

### Espaciado Consistente
```typescript
<div className="space-y-6">  {/* Espaciado vertical entre secciones */}
    <div className="flex gap-4">  {/* Espaciado horizontal entre elementos */}
    </div>
</div>
```

### Grid Responsivo
```typescript
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {/* 1 columna en móvil, 2 en tablet, 4 en desktop */}
</div>
```

### Colores Semánticos
```typescript
// Estados
className="text-green-600"  // Éxito/Activo
className="text-red-600"     // Error/Vencido
className="text-yellow-600"  // Advertencia
className="text-blue-600"    // Información
className="text-gray-600"    // Neutral

// Backgrounds
className="bg-green-100 text-green-800"  // Badge éxito
className="bg-red-100 text-red-800"      // Badge error
```

## 📊 Iconos (Lucide React)

### Importar
```typescript
import { User, Check, X, Calendar } from 'lucide-react';
```

### Usar
```typescript
<User className="h-4 w-4" />              // Pequeño (en badges)
<Calendar className="h-5 w-5" />          // Mediano (en títulos)
<Check className="mr-2 h-4 w-4" />        // Con margen (en botones)
<Icon className="h-4 w-4 text-blue-600" />  // Con color
```

### Iconos Comunes
- `User, Users` - Usuarios/Clientes
- `Calendar, Clock` - Fechas/Tiempo
- `Check, X` - Confirmación/Cancelación
- `Plus, Minus` - Agregar/Quitar
- `Edit, Trash2` - Editar/Eliminar
- `Search` - Búsqueda
- `Filter` - Filtros
- `Download, Upload` - Descargas/Subidas
- `Eye, EyeOff` - Mostrar/Ocultar

## 🔄 Acciones Comunes

### Eliminar con Confirmación
```typescript
const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro?')) {
        router.delete(`/ruta/${id}`);
    }
};
```

### Actualizar Estado
```typescript
const handleToggle = (id: number) => {
    router.post(`/ruta/${id}/toggle`, {}, {
        preserveState: true,
        preserveScroll: true,
    });
};
```

## 🐛 Debugging

### Ver Props en Consola
```typescript
console.log('Props:', { items, filters, stats });
```

### Inspeccionar Errores de Inertia
```typescript
console.log('Errors:', errors);
```

### React DevTools
- Instalar extensión de navegador
- Inspeccionar componentes y props
- Ver árbol de componentes

## 📚 Recursos

### Documentación
- [Inertia.js](https://inertiajs.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [date-fns](https://date-fns.org/)

### Comandos Útiles
```bash
# Compilar en modo watch
npm run dev

# Verificar tipos TypeScript
npm run types

# Formatear código
npm run format

# Verificar linting
npm run lint
```

---

**Tip:** Usa las vistas existentes como referencia. Todas siguen el mismo patrón y estructura.
