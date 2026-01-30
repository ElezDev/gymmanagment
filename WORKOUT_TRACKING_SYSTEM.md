# Sistema de Registro y Seguimiento de Entrenamientos

## Descripción General
Sistema completo de trazabilidad y control de entrenamientos para el gimnasio, permitiendo registrar cada sesión de entrenamiento con detalle de ejercicios, series, repeticiones y peso utilizado.

## Características Implementadas

### 1. Base de Datos
✅ Tabla `workout_exercise_logs`:
- Registro detallado de cada ejercicio en una sesión
- Almacenamiento de series planificadas vs completadas
- Detalles de cada serie (repeticiones, peso, estado)
- Notas por ejercicio
- Estado de completitud

### 2. Modelos y Relaciones

#### WorkoutExerciseLog
- `fillable`: workout_session_id, exercise_id, order, sets_completed, sets_planned, set_details, notes, completed
- `casts`: set_details (array), completed (boolean)
- Relaciones:
  - `belongsTo(WorkoutSession)`
  - `belongsTo(Exercise)`

#### WorkoutSession (Actualizado)
- Nueva relación `hasMany(WorkoutExerciseLog)` como `exerciseLogs`

### 3. Controlador: WorkoutSessionController

#### Métodos Implementados:

**`start(Request $request)`**
- Inicia una nueva sesión de entrenamiento
- Crea logs para cada ejercicio de la rutina
- Redirige a la sesión activa

**`active(WorkoutSession $workoutSession)`**
- Muestra la sesión de entrenamiento en curso
- Carga cliente, rutina y ejercicios con detalles

**`updateExercise(Request $request, WorkoutExerciseLog $exerciseLog)`**
- Actualiza el progreso de un ejercicio específico
- Maneja set_details como JSON
- Actualiza series completadas y estado

**`complete(Request $request, WorkoutSession $workoutSession)`**
- Marca la sesión como completada
- Calcula duración total
- Guarda notas finales

**`history(Client $client)`**
- Muestra historial de entrenamientos de un cliente
- Paginación de 10 sesiones por página
- Incluye todos los ejercicios realizados

**`show(WorkoutSession $workoutSession)`**
- Detalle completo de una sesión específica
- Muestra todas las series de cada ejercicio
- Calcula volumen total de entrenamiento

### 4. Rutas Configuradas

```php
Route::middleware('role:admin')->group(function () {
    Route::post('workout-sessions/start', [WorkoutSessionController::class, 'start'])
        ->name('workout-sessions.start');
    
    Route::get('workout-sessions/{workoutSession}/active', [WorkoutSessionController::class, 'active'])
        ->name('workout-sessions.active');
    
    Route::put('workout-sessions/exercises/{exerciseLog}', [WorkoutSessionController::class, 'updateExercise'])
        ->name('workout-sessions.update-exercise');
    
    Route::post('workout-sessions/{workoutSession}/complete', [WorkoutSessionController::class, 'complete'])
        ->name('workout-sessions.complete');
    
    Route::get('clients/{client}/workout-history', [WorkoutSessionController::class, 'history'])
        ->name('clients.workout-history');
    
    Route::get('workout-sessions/{workoutSession}', [WorkoutSessionController::class, 'show'])
        ->name('workout-sessions.show');
});
```

### 5. Componentes React/TypeScript

#### Active.tsx - Sesión de Entrenamiento Activa
**Características:**
- ⏱️ Temporizador en tiempo real desde inicio de sesión
- 📊 Barra de progreso visual de ejercicios completados
- ✅ Checkbox para marcar series como completadas
- 📝 Inputs para registrar repeticiones y peso en cada serie
- 💾 Botón "Guardar Progreso" por ejercicio
- 📋 Área de notas finales de la sesión
- 🎯 Botón "Completar Entrenamiento"

**Estados Manejados:**
- Lista de ejercicios con sets individuales
- Detalles de cada serie (reps, weight, completed)
- Tiempo transcurrido actualizado cada segundo
- Notas de la sesión

#### History.tsx - Historial de Entrenamientos
**Características:**
- 📅 Lista de sesiones completadas ordenadas por fecha
- 🏋️ Tarjetas expandibles por sesión
- 📈 Métricas por sesión:
  - Fecha y hora
  - Duración
  - Ejercicios completados
  - Volumen total (kg)
- 📊 Detalle de series por ejercicio (ej: 10×50kg, 8×55kg)
- 📝 Notas de la sesión si existen
- 🔢 Paginación para múltiples sesiones

#### Show.tsx - Detalle de Sesión Específica
**Características:**
- 📋 Información completa de la sesión:
  - Fecha y hora exacta
  - Duración total
  - Ejercicios completados
  - Volumen total calculado
- 💪 Detalle completo por ejercicio:
  - Todas las series con estado
  - Repeticiones y peso de cada serie
  - Volumen individual del ejercicio
  - Notas específicas del ejercicio
- 🎨 Código de colores:
  - Verde: Serie completada
  - Amarillo: Ejercicio parcialmente completado
- ↩️ Botón volver al historial

#### Actualizaciones en show.tsx (Cliente)
**Nuevas características:**
- ▶️ Botón "Iniciar" en cada rutina asignada
- 📜 Botón "Historial" para ver entrenamientos pasados
- 🎯 Inicio directo de sesión desde vista de cliente

### 6. Seeder: WorkoutSessionsSeeder

**Datos de ejemplo creados:**
- 3 sesiones de entrenamiento completadas
- Fechas: hace 7, 4 y 2 días
- Duración aleatoria: 45-75 minutos
- Todas las series de cada ejercicio completadas
- Repeticiones: 8-12 por serie
- Peso: 10-50 kg por ejercicio
- Notas de ejemplo en cada sesión

## Flujo de Uso

### Para Entrenadores (Admin):

1. **Iniciar Entrenamiento:**
   - Desde vista del cliente (`/clients/{id}`)
   - Click en "Iniciar" en la rutina deseada
   - Sistema crea sesión y redirige a pantalla activa

2. **Durante el Entrenamiento:**
   - Ver timer en tiempo real
   - Marcar cada serie como completada
   - Registrar reps y peso utilizados
   - Guardar progreso continuamente
   - Agregar notas por ejercicio

3. **Completar Entrenamiento:**
   - Agregar notas finales de la sesión
   - Click en "Completar Entrenamiento"
   - Sistema calcula duración y guarda

4. **Ver Historial:**
   - Acceder desde perfil del cliente
   - Ver todas las sesiones pasadas
   - Click en sesión para ver detalles completos

### Métricas Calculadas Automáticamente:

- ⏱️ **Duración**: Tiempo total de la sesión
- 🏋️ **Volumen por ejercicio**: Suma de (reps × peso) de todas las series completadas
- 📊 **Volumen total**: Suma de volumen de todos los ejercicios
- ✅ **Tasa de completitud**: Ejercicios completados vs totales
- 📈 **Progreso**: Series completadas vs planificadas

## Archivos Creados/Modificados

### Backend:
- ✅ `database/migrations/2026_01_30_012109_create_workout_exercise_logs_table.php`
- ✅ `app/Models/WorkoutExerciseLog.php`
- ✅ `app/Models/WorkoutSession.php` (actualizado)
- ✅ `app/Http/Controllers/WorkoutSessionController.php`
- ✅ `database/seeders/WorkoutSessionsSeeder.php`
- ✅ `routes/web.php` (rutas agregadas)

### Frontend:
- ✅ `resources/js/pages/WorkoutSessions/Active.tsx`
- ✅ `resources/js/pages/WorkoutSessions/History.tsx`
- ✅ `resources/js/pages/WorkoutSessions/Show.tsx`
- ✅ `resources/js/pages/clients/show.tsx` (actualizado)

## Comandos Ejecutados

```bash
# Crear migración
php artisan make:migration create_workout_exercise_logs_table

# Crear modelo
php artisan make:model WorkoutExerciseLog

# Crear controlador
php artisan make:controller WorkoutSessionController

# Crear seeder
php artisan make:seeder WorkoutSessionsSeeder

# Ejecutar migración
php artisan migrate

# Ejecutar seeder
php artisan db:seed --class=WorkoutSessionsSeeder
```

## Próximas Mejoras Sugeridas

1. **Analytics y Reportes:**
   - Gráficas de progreso de volumen por ejercicio
   - Comparación de sesiones
   - Tendencias de peso y repeticiones

2. **Notificaciones:**
   - Recordatorios de entrenamiento
   - Alertas de récords personales

3. **Exportación:**
   - PDF de sesiones
   - Excel con histórico completo

4. **Móvil:**
   - App nativa para registro desde el piso del gimnasio
   - Modo offline con sincronización

5. **Social:**
   - Compartir logros
   - Comentarios del entrenador en sesiones

## Estado Final

✅ **Sistema completamente funcional y listo para usar**
- Base de datos migrada
- Modelos con relaciones configuradas
- Controlador con todos los métodos implementados
- Rutas protegidas con middleware de admin
- Componentes React funcionales y sin errores
- Datos de ejemplo creados
- Integración completa con el sistema existente
