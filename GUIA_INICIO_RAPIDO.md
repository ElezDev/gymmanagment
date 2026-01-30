# 🚀 GUÍA DE INICIO RÁPIDO - Sistema de Gimnasio v2.0

## ✅ VERIFICACIÓN DEL SISTEMA

### 1. Base de Datos
Las siguientes tablas deben existir:
```sql
- membership_plans (Planes de membresía)
- memberships (Membresías activas)
- payments (Pagos registrados)
- check_ins (Control de acceso)
- body_measurements (Mediciones corporales)
- class_schedules (Horarios de clases)
- class_bookings (Reservas de clases)
- nutrition_plans (Planes nutricionales)
- notifications (Sistema de notificaciones)
```

### 2. Datos de Prueba Incluidos
✅ **6 planes de membresía**:
- Plan Básico Mensual ($29.99)
- Plan Premium Mensual ($49.99)
- Plan Elite Mensual ($79.99)
- Plan Trimestral ($127.49)
- Plan Anual ($449.99)
- Plan Día (Inactivo)

✅ **Membresías asignadas** a todos los clientes existentes
✅ **Pagos registrados** automáticamente
✅ **Números de membresía** generados

---

## 🎯 CASOS DE USO PRINCIPALES

### CASO 1: Vender una Membresía Nueva

**Como:** Admin o Trainer  
**Ruta:** `/memberships/create`

**Flujo:**
1. Seleccionar cliente (o crear nuevo)
2. Elegir plan de membresía
3. Ingresar monto pagado
4. Aplicar descuento (opcional)
5. Seleccionar método de pago
6. Guardar

**Resultado:**
- ✅ Membresía creada
- ✅ Pago registrado automáticamente
- ✅ Cliente actualizado con número de membresía
- ✅ Estado del cliente: "active"

---

### CASO 2: Registrar Check-in de Cliente

**Como:** Admin, Trainer o Recepcionista  
**Ruta:** `/check-ins`

**Flujo:**
1. Buscar cliente por nombre, email o número de membresía
2. Verificar membresía activa (automático)
3. Click en "Check-in"
4. Cliente registrado en el gimnasio

**Para Check-out:**
1. Buscar check-in activo
2. Click en "Check-out"
3. Duración calculada automáticamente

**Dashboard en vivo:** `/check-ins/dashboard`
- Ver quién está actualmente en el gimnasio
- Estadísticas del día
- Hora pico

---

### CASO 3: Tomar Mediciones Corporales

**Como:** Admin o Trainer  
**Ruta:** `/clients/{id}/body-measurements/create`

**Datos a registrar:**
- Peso y altura
- % grasa corporal
- Masa muscular
- 12 circunferencias diferentes
- 3 fotos (frontal, lateral, trasera)
- Notas

**Características:**
- ✅ BMI calculado automáticamente
- ✅ Comparación con medición anterior
- ✅ Gráficas de progreso
- ✅ Categorización de BMI

---

### CASO 4: Crear Horario de Clase Grupal

**Como:** Admin o Trainer  
**Ruta:** `/class-schedules/create`

**Ejemplo: Clase de Spinning**
```
Nombre: Spinning Matutino
Instructor: Juan Pérez
Día: Lunes
Hora inicio: 07:00
Hora fin: 08:00
Capacidad máxima: 20 personas
Nivel: Intermedio
Sala: Sala A
Requiere reserva: Sí
Cancelación mínima: 2 horas antes
```

**Calendario semanal:** `/class-schedules-calendar`

---

### CASO 5: Reservar Cliente a Clase

**Como:** Admin, Trainer o Recepcionista  
**Ruta:** `/class-bookings`

**Flujo:**
1. Seleccionar clase y fecha
2. Seleccionar cliente
3. Verificar membresía activa (automático)
4. Verificar límite de clases del plan (automático)
5. Confirmar reserva

**Si clase está llena:**
- Cliente entra a lista de espera
- Se le asigna posición
- Cuando alguien cancela, pasa automáticamente

**Cliente puede ver sus reservas:** `/my-class-bookings`

---

### CASO 6: Asignar Plan Nutricional

**Como:** Admin o Trainer  
**Ruta:** `/nutrition-plans/create`

**Ejemplo:**
```
Cliente: María González
Plan: Pérdida de peso
Calorías diarias: 1800
Proteínas: 120g
Carbohidratos: 180g
Grasas: 60g
Comidas por día: 5
Agua: 2.5 litros

Plan de comidas:
{
  "desayuno": "Avena con frutas y proteína",
  "snack_am": "Yogurt griego",
  "almuerzo": "Pollo con vegetales",
  "snack_pm": "Almendras",
  "cena": "Pescado con ensalada"
}

Suplementos:
["Proteína whey", "Omega 3", "Multivitamínico"]

Restricciones: Intolerancia a la lactosa
```

**Cliente puede ver su plan:** `/my-nutrition-plan`

---

### CASO 7: Ver Membresías por Vencer

**Como:** Admin o Trainer  
**Ruta:** `/memberships/expiring/list`

**Muestra:**
- Membresías que vencen en los próximos 7 días
- Información del cliente
- Días restantes
- Opción de renovar directamente

**Acciones disponibles:**
- 🔄 Renovar membresía
- ⏸️ Suspender temporalmente
- ❌ Cancelar
- 📧 Enviar recordatorio (futuro)

---

### CASO 8: Registrar Pago Manual

**Como:** Admin o Trainer  
**Ruta:** `/payments/create`

**Tipos de pago:**
- Membresía (ya se crea automático)
- Producto (venta de suplementos, ropa)
- Servicio (entrenamiento personal extra)
- Penalidad (cargo por daño)
- Otro

**Ejemplo: Venta de Producto**
```
Cliente: Carlos Ruiz
Tipo: Producto
Descripción: Proteína whey 2kg
Monto: $45.00
Método: Tarjeta
Referencia: TRX-12345
```

---

## 📊 REPORTES DISPONIBLES

### Reporte de Pagos
**Ruta:** `/payments-report`

**Filtros:**
- Rango de fechas
- Método de pago
- Tipo de pago
- Estado

**Muestra:**
- Total recaudado
- Cantidad de pagos
- Desglose por método
- Desglose por tipo
- Gráfica diaria

### Reporte de Asistencia a Clases
**Ruta:** `/class-bookings/attendance-report`

**Muestra:**
- Total de reservas
- Asistencias confirmadas
- No asistidos
- Cancelaciones
- Desglose por clase
- % de asistencia

---

## 🔐 PERMISOS NECESARIOS

### Para Staff (Admin/Trainer)
- ✅ view clients
- ✅ create clients
- ✅ edit clients

### Para Recepcionista
- ✅ view clients (solo lectura)
- ✅ Acceso a check-ins
- ✅ Acceso a reservas de clases

### Para Clientes
- ✅ view own client data
- ✅ Mis reservas de clases
- ✅ Mi plan nutricional
- ✅ Mis rutinas

---

## 🧪 PRUEBAS RECOMENDADAS

### Test 1: Flujo Completo de Cliente Nuevo
1. Crear cliente
2. Asignar membresía
3. Registrar pago
4. Hacer check-in
5. Reservar a clase
6. Tomar mediciones
7. Asignar plan nutricional

### Test 2: Vencimiento de Membresía
1. Ir a membresías por vencer
2. Renovar una membresía
3. Verificar que el cliente sigue activo
4. Verificar que se creó nuevo pago

### Test 3: Check-in sin Membresía
1. Buscar cliente sin membresía activa
2. Intentar hacer check-in
3. Debe mostrar error

### Test 4: Clase Llena
1. Crear clase con capacidad 2
2. Reservar 2 clientes
3. Intentar reservar un tercero
4. Debe ir a lista de espera
5. Cancelar una reserva
6. Verificar que el de lista de espera pasa automáticamente

---

## 📱 API ENDPOINTS DISPONIBLES

### Públicos (con autenticación)
```
GET  /api/membership-plans/active  - Planes activos
GET  /api/check-ins/search?search=  - Buscar cliente
GET  /api/clients/{id}/body-measurements-charts - Datos gráficas
```

---

## 🔧 TROUBLESHOOTING

### Problema: No aparecen los planes de membresía
**Solución:**
```bash
php artisan db:seed --class=MembershipSystemSeeder
```

### Problema: Error al crear membresía
**Verificar:**
1. Cliente existe
2. Plan existe y está activo
3. Usuario autenticado tiene permisos

### Problema: Check-in no funciona
**Verificar:**
1. Cliente tiene membresía activa
2. Membresía no está vencida
3. Cliente no tiene check-in activo

---

## 📈 MÉTRICAS CLAVE A MONITOREAR

### Diarias
- 📊 Check-ins del día
- 💰 Ingresos del día
- 👥 Personas actualmente en gimnasio
- 📅 Clases con más asistencia

### Mensuales
- 💵 Ingresos totales
- 📈 Nuevas membresías
- 🔄 Renovaciones
- ❌ Cancelaciones
- 📉 Tasa de retención
- 🏃 Asistencia promedio

---

## 🎯 PRÓXIMOS PASOS

1. **Crear vistas React** para todos los módulos
2. **Agregar notificaciones** (email/SMS) para:
   - Membresía por vencer
   - Pago recibido
   - Recordatorio de clase
   - Check-in registrado
3. **Implementar dashboard** con gráficas en tiempo real
4. **Agregar exportación** a PDF/Excel de reportes
5. **Integrar pasarela de pago** online

---

**¿Listo para empezar?** 🚀

Tu sistema ya tiene toda la funcionalidad backend lista. Solo necesitas las vistas frontend para empezar a usarlo en producción.

¡Tu gimnasio ahora es 10x más profesional! 💪
