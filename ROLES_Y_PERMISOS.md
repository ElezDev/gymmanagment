# 🔐 Módulo de Roles y Permisos

Sistema completo de gestión de roles y permisos usando Spatie Laravel Permission.

## 📋 Características

- ✅ Crear, editar y eliminar roles
- ✅ Crear, editar y eliminar permisos
- ✅ Asignar múltiples permisos a roles
- ✅ Interfaz React moderna con shadcn/ui
- ✅ Protección de rutas con middleware
- ✅ Sistema de autorización integrado

## 🚀 Instalación y Configuración

### 1. Ejecutar Migraciones

Las migraciones de Spatie ya están incluidas. Ejecuta:

```bash
php artisan migrate
```

### 2. Ejecutar Seeders

Para crear los roles y permisos por defecto:

```bash
# Opción 1: Ejecutar todos los seeders
php artisan db:seed

# Opción 2: Solo roles y permisos
php artisan db:seed --class=RolesAndPermissionsSeeder

# Opción 3: Solo permisos básicos adicionales
php artisan db:seed --class=BasicPermissionsSeeder
```

### 3. Roles Predefinidos

El seeder crea 4 roles por defecto:

#### 👑 Admin
- Acceso completo al sistema
- Gestión de roles y permisos
- Gestión de usuarios, clientes, ejercicios y rutinas

#### 💪 Trainer (Entrenador)
- Gestión de clientes
- Gestión de ejercicios
- Gestión de rutinas
- Asignación de rutinas a clientes
- Visualización de progreso

#### 📋 Receptionist (Recepcionista)
- Solo lectura de clientes
- Solo lectura de ejercicios
- Solo lectura de rutinas

#### 🏃 Client (Cliente)
- Ver sus propios datos
- Ver sus rutinas asignadas
- Registrar progreso

## 📱 Uso de la Interfaz

### Acceso al Módulo

1. **Iniciar sesión como Admin**
   ```
   Email: admin@gym.com
   Password: password
   ```

2. **Navegar al módulo**
   - En el sidebar encontrarás las opciones "Roles" y "Permisos"

### Gestión de Roles

#### Crear un Rol
1. Ir a "Roles"
2. Click en "Nuevo Rol"
3. Ingresar nombre del rol
4. Seleccionar los permisos deseados
5. Click en "Crear Rol"

#### Editar un Rol
1. Ir a "Roles"
2. Click en "Editar" en el rol deseado
3. Modificar nombre o permisos
4. Click en "Guardar Cambios"

#### Eliminar un Rol
1. Ir a "Roles"
2. Click en el icono de eliminar
3. Confirmar la eliminación

### Gestión de Permisos

#### Crear un Permiso
1. Ir a "Permisos"
2. Click en "Nuevo Permiso"
3. Ingresar nombre del permiso (ej: `view_reports`, `edit_settings`)
4. Click en "Crear Permiso"

#### Editar un Permiso
1. Ir a "Permisos"
2. Click en "Editar"
3. Modificar el nombre
4. Click en "Guardar Cambios"

## 💻 Uso en Código

### Asignar Roles a Usuarios

```php
use App\Models\User;

$user = User::find(1);

// Asignar un rol
$user->assignRole('trainer');

// Asignar múltiples roles
$user->assignRole(['trainer', 'receptionist']);

// Remover un rol
$user->removeRole('trainer');

// Sincronizar roles (remueve los anteriores)
$user->syncRoles(['admin']);
```

### Verificar Roles

```php
// Verificar si tiene un rol
if ($user->hasRole('admin')) {
    // ...
}

// Verificar si tiene alguno de los roles
if ($user->hasAnyRole(['admin', 'trainer'])) {
    // ...
}

// Verificar si tiene todos los roles
if ($user->hasAllRoles(['admin', 'trainer'])) {
    // ...
}

// Obtener todos los roles del usuario
$roles = $user->getRoleNames(); // Collection
```

### Asignar Permisos

```php
// Asignar permiso directamente a un usuario
$user->givePermissionTo('edit articles');

// Dar múltiples permisos
$user->givePermissionTo(['edit articles', 'delete articles']);

// Asignar permiso a un rol
$role = Role::findByName('trainer');
$role->givePermissionTo('view clients');
```

### Verificar Permisos

```php
// Verificar si tiene un permiso
if ($user->can('edit articles')) {
    // ...
}

// Verificar si tiene alguno de los permisos
if ($user->hasAnyPermission(['edit articles', 'delete articles'])) {
    // ...
}

// Verificar si tiene todos los permisos
if ($user->hasAllPermissions(['edit articles', 'delete articles'])) {
    // ...
}
```

### Proteger Rutas

```php
// En routes/web.php

// Con middleware de permiso
Route::middleware('permission:edit articles')->group(function () {
    Route::get('/articles/edit', [ArticleController::class, 'edit']);
});

// Con middleware de rol
Route::middleware('role:admin')->group(function () {
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
});

// Con múltiples roles (OR)
Route::middleware('role:admin|trainer')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

### En Controladores

```php
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function __construct()
    {
        // Aplicar middleware de permiso
        $this->middleware('permission:view articles')->only(['index', 'show']);
        $this->middleware('permission:create articles')->only(['create', 'store']);
        $this->middleware('permission:edit articles')->only(['edit', 'update']);
        $this->middleware('permission:delete articles')->only('destroy');
    }
}
```

### En Blade/React

```php
// En Blade
@role('admin')
    <p>Solo visible para admin</p>
@endrole

@hasrole('admin|trainer')
    <p>Visible para admin o trainer</p>
@endhasrole

@can('edit articles')
    <button>Editar</button>
@endcan
```

```typescript
// En React (usando Inertia)
import { usePage } from '@inertiajs/react';

function MyComponent() {
    const { auth } = usePage().props as any;
    const permissions = auth?.user?.permissions || [];
    const roles = auth?.user?.roles || [];

    return (
        <>
            {roles.includes('admin') && (
                <button>Admin Button</button>
            )}
            
            {permissions.includes('edit articles') && (
                <button>Edit Article</button>
            )}
        </>
    );
}
```

## 🎯 Permisos Predefinidos del Sistema

### Clientes
- `view clients` - Ver lista de clientes
- `create clients` - Crear nuevos clientes
- `edit clients` - Editar clientes
- `delete clients` - Eliminar clientes
- `view own client data` - Ver propios datos (para clientes)

### Ejercicios
- `view exercises` - Ver ejercicios
- `create exercises` - Crear ejercicios
- `edit exercises` - Editar ejercicios
- `delete exercises` - Eliminar ejercicios

### Rutinas
- `view routines` - Ver rutinas
- `create routines` - Crear rutinas
- `edit routines` - Editar rutinas
- `delete routines` - Eliminar rutinas
- `assign routines` - Asignar rutinas a clientes
- `view own routines` - Ver propias rutinas (para clientes)

### Progreso
- `view all progress` - Ver todo el progreso
- `view own progress` - Ver propio progreso
- `add progress` - Agregar progreso

### Roles y Permisos
- `view roles` - Ver roles
- `create roles` - Crear roles
- `edit roles` - Editar roles
- `delete roles` - Eliminar roles
- `view permissions` - Ver permisos
- `create permissions` - Crear permisos
- `edit permissions` - Editar permisos
- `delete permissions` - Eliminar permisos

### Usuarios
- `view users` - Ver usuarios
- `create users` - Crear usuarios
- `edit users` - Editar usuarios
- `delete users` - Eliminar usuarios
- `assign roles` - Asignar roles a usuarios

## 🔧 Comandos Útiles

```bash
# Limpiar caché de permisos
php artisan permission:cache-reset

# Crear permiso desde CLI
php artisan permission:create-permission "view reports"

# Crear rol desde CLI
php artisan permission:create-role admin

# Asignar permiso a rol
php artisan permission:create-permission "edit articles" --role=admin
```

## 📚 Recursos Adicionales

- [Documentación de Spatie Permission](https://spatie.be/docs/laravel-permission/v6/introduction)
- [Laravel Authorization](https://laravel.com/docs/11.x/authorization)
- [Inertia.js](https://inertiajs.com/)

## 🐛 Troubleshooting

### Error: "Role does not exist"
```bash
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan permission:cache-reset
```

### Los permisos no se actualizan
```bash
php artisan permission:cache-reset
php artisan cache:clear
```

### Error en producción
Asegúrate de ejecutar:
```bash
php artisan config:cache
php artisan route:cache
php artisan permission:cache-reset
```
