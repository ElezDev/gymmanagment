# 🚀 INICIO RÁPIDO - Sistema de Gimnasio

## ✅ Todo está listo!

El sistema está completamente instalado y configurado con:
- ✅ Spatie Permission instalado
- ✅ Roles y permisos creados
- ✅ Usuarios de prueba creados
- ✅ Datos de demostración cargados
- ✅ UI compilada y lista

## 🎯 Iniciar el Sistema

### Paso 1: Levantar servidores

**Terminal 1 - Backend:**
```bash
cd /Users/macbook/Desktop/TorneosApp/gymAdmin
php artisan serve
```

**Terminal 2 - Frontend (solo si necesitas editar UI):**
```bash
cd /Users/macbook/Desktop/TorneosApp/gymAdmin
npm run dev
```

> **Nota**: Si solo vas a probar el sistema, con el comando de PHP es suficiente (ya compilamos los assets).

### Paso 2: Acceder al sistema

Abre tu navegador en: **http://localhost:8000**

### Paso 3: Probar los diferentes roles

#### 👑 Como ADMINISTRADOR
```
Email: admin@gym.com
Password: password
```
**Puedes hacer:**
- Ver dashboard completo con todas las estadísticas
- Gestionar clientes, ejercicios y rutinas
- Acceso completo al sistema

#### 👨‍🏫 Como ENTRENADOR
```
Email: trainer@gym.com
Password: password
```
**Puedes hacer:**
- Ver y gestionar clientes
- Crear y editar ejercicios
- Crear y asignar rutinas
- Ver progreso de todos los clientes

#### 💪 Como CLIENTE
```
Email: juan@gym.com
Password: password
```
**Puedes hacer:**
- Ver tu dashboard personalizado
- Ver tus rutinas asignadas
- Ver tu progreso y estadísticas
- **NO puedes** ver otros clientes ni gestionar nada

#### 💪 Como CLIENTE 2
```
Email: maria@gym.com  
Password: password
```

## 🎨 Lo que verás

### Dashboard Admin
- 4 tarjetas con estadísticas (clientes, ejercicios, rutinas, usuarios)
- Lista de clientes recientes
- Rutinas más populares
- Alertas de membresías por vencer

### Dashboard Cliente
- Tus estadísticas personales
- Tus rutinas activas
- Tu progreso reciente
- Tus entrenamientos
- Días hasta vencer membresía

### Navegación
El menú lateral (sidebar) se adapta automáticamente según tu rol:
- **Admin/Trainer**: Clientes, Ejercicios, Rutinas
- **Cliente**: Mis Rutinas, Mi Progreso

## 🔧 Comandos Útiles

### Crear nuevo usuario y asignar rol
```bash
php artisan user:assign-role email@ejemplo.com admin
php artisan user:assign-role email@ejemplo.com trainer
php artisan user:assign-role email@ejemplo.com client
```

### Resetear permisos si algo falla
```bash
php artisan permission:cache-reset
```

### Ver todos los roles y permisos
```bash
php artisan permission:show
```

### Crear perfil de cliente para un usuario
```bash
php artisan tinker

$user = User::where('email', 'usuario@ejemplo.com')->first();
Client::create([
    'user_id' => $user->id,
    'phone' => '555-1234',
    'goals' => 'Ganar músculo',
    'membership_start' => now(),
    'membership_end' => now()->addMonths(3),
    'is_active' => true,
]);
```

## 📱 Rutas Disponibles

### Públicas
- `/` - Página de bienvenida
- `/login` - Iniciar sesión
- `/register` - Registrarse (si está habilitado)

### Autenticadas - Admin/Trainer
- `/dashboard` - Dashboard principal
- `/clients` - Lista de clientes
- `/clients/{id}` - Ver cliente (aún no implementado el detalle)
- `/exercises` - Catálogo de ejercicios
- `/exercises?search=press` - Buscar ejercicios
- `/routines` - Lista de rutinas

### Autenticadas - Cliente
- `/dashboard` - Tu dashboard personalizado
- `/my-routines` - Tus rutinas
- `/my-profile` - Tu perfil y progreso

## ⚡ Tips

1. **Cerrar sesión**: Click en tu nombre en el sidebar
2. **Búsqueda de ejercicios**: Escribe y presiona Enter
3. **Ver permisos**: El sidebar solo muestra lo que puedes acceder
4. **Datos demo**: Usa los usuarios de prueba para probar cada rol

## 🐛 ¿Problemas?

### No puedo ver ciertas páginas
➡️ Verifica que tu usuario tenga el rol correcto:
```bash
php artisan tinker
User::where('email', 'tu@email.com')->first()->roles;
```

### Error de permisos
➡️ Limpia la caché:
```bash
php artisan permission:cache-reset
php artisan cache:clear
```

### La UI no se ve bien
➡️ Recompila los assets:
```bash
npm run build
```

## 📖 Más Información

- Ver [GIMNASIO_README.md](GIMNASIO_README.md) para documentación completa
- Ver [IMPLEMENTACION_COMPLETADA.md](IMPLEMENTACION_COMPLETADA.md) para detalles técnicos

---

## 🎉 ¡A disfrutar del sistema!

Todo está listo para empezar a usarlo. El sistema base está completo y funcional.
