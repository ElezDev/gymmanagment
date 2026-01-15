# Sistema de Gestión de Gimnasio

Sistema completo de gestión de gimnasio con roles y permisos usando Laravel, Inertia y React.

## 🎯 Características

- ✅ **Sistema de Roles y Permisos** con Spatie Permission
- ✅ **Dashboard para Administradores** - Vista completa de estadísticas
- ✅ **Dashboard para Clientes** - Vista personalizada de su progreso
- ✅ **Gestión de Clientes** - CRUD completo
- ✅ **Gestión de Ejercicios** - Catálogo de ejercicios
- ✅ **Gestión de Rutinas** - Crear y asignar rutinas
- ✅ **Control de Acceso** - Permisos granulares por recurso

## 👥 Roles Disponibles

### Admin
- Acceso completo a todo el sistema
- Gestión de usuarios y roles
- Acceso a todas las funcionalidades

### Trainer (Entrenador)
- Gestionar clientes
- Crear y editar ejercicios
- Crear y asignar rutinas
- Ver progreso de todos los clientes

### Client (Cliente)
- Ver solo su información personal
- Ver sus rutinas asignadas
- Registrar su progreso
- Ver sus entrenamientos

## 🚀 Instalación

### 1. Instalar dependencias
```bash
composer install
npm install
```

### 2. Configurar base de datos
```bash
cp .env.example .env
php artisan key:generate
# Configurar DB_* en .env
```

### 3. Ejecutar migraciones y seeders
```bash
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
```

### 4. Asignar rol a un usuario
```bash
# Asignar rol de admin
php artisan user:assign-role usuario@email.com admin

# Asignar rol de entrenador
php artisan user:assign-role entrenador@email.com trainer

# Asignar rol de cliente
php artisan user:assign-role cliente@email.com client
```

### 5. Iniciar servidor de desarrollo
```bash
# Terminal 1 - Backend
php artisan serve

# Terminal 2 - Frontend
npm run dev
```

## 📋 Permisos del Sistema

### Dashboard
- `view dashboard` - Ver dashboard

### Clientes
- `view clients` - Ver lista de clientes
- `create clients` - Crear nuevos clientes
- `edit clients` - Editar clientes
- `delete clients` - Eliminar clientes
- `view own client data` - Ver solo datos propios (clientes)

### Ejercicios
- `view exercises` - Ver ejercicios
- `create exercises` - Crear ejercicios
- `edit exercises` - Editar ejercicios
- `delete exercises` - Eliminar ejercicios

### Rutinas
- `view routines` - Ver todas las rutinas
- `create routines` - Crear rutinas
- `edit routines` - Editar rutinas
- `delete routines` - Eliminar rutinas
- `assign routines` - Asignar rutinas a clientes
- `view own routines` - Ver solo rutinas propias (clientes)

### Progreso
- `view all progress` - Ver progreso de todos
- `view own progress` - Ver solo progreso propio
- `add progress` - Agregar registros de progreso

### Sesiones
- `view all sessions` - Ver todas las sesiones
- `view own sessions` - Ver solo sesiones propias
- `create sessions` - Crear sesiones de entrenamiento

### Usuarios
- `manage users` - Gestionar usuarios
- `manage roles` - Gestionar roles y permisos

## 🎨 Páginas Principales

### Admin/Trainer
- `/dashboard` - Dashboard con estadísticas generales
- `/clients` - Lista y gestión de clientes
- `/exercises` - Catálogo de ejercicios
- `/routines` - Gestión de rutinas

### Client
- `/dashboard` - Dashboard personalizado con su progreso
- `/my-routines` - Sus rutinas asignadas
- `/my-profile` - Su información y progreso

## 🔐 Crear Cliente para un Usuario

Para crear un perfil de cliente asociado a un usuario existente:

```bash
php artisan tinker

# Crear cliente para usuario
$user = User::where('email', 'cliente@email.com')->first();
$client = Client::create([
    'user_id' => $user->id,
    'phone' => '1234567890',
    'birth_date' => '1990-01-01',
    'gender' => 'male',
    'height' => 175.5,
    'weight' => 70.0,
    'goals' => 'Ganar masa muscular',
    'membership_start' => now(),
    'membership_end' => now()->addMonths(3),
    'is_active' => true,
]);
```

## 📝 Flujo de Trabajo Típico

1. **Admin crea usuarios** y les asigna roles
2. **Trainer crea ejercicios** en el catálogo
3. **Trainer crea rutinas** combinando ejercicios
4. **Trainer asigna rutinas** a clientes específicos
5. **Cliente inicia sesión** y ve sus rutinas
6. **Cliente registra progreso** de sus entrenamientos
7. **Trainer revisa progreso** de los clientes

## 🛠️ Comandos Útiles

```bash
# Ver roles y permisos
php artisan permission:show

# Limpiar caché de permisos
php artisan permission:cache-reset

# Crear un nuevo usuario admin desde tinker
php artisan tinker
User::create([
    'name' => 'Admin',
    'email' => 'admin@gym.com',
    'password' => bcrypt('password'),
    'email_verified_at' => now()
])->assignRole('admin');
```

## 📦 Próximas Mejoras

- [ ] Páginas de creación/edición de clientes
- [ ] Páginas de creación/edición de ejercicios
- [ ] Páginas de creación/edición de rutinas
- [ ] Sistema de notificaciones para membresías por vencer
- [ ] Reportes y estadísticas avanzadas
- [ ] Calendario de entrenamientos
- [ ] Sistema de mensajería entre trainer y cliente

## 🤝 Contribuir

Este es tu proyecto. ¡Personalízalo como necesites!

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
