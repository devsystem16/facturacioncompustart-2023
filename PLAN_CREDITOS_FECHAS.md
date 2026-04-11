# Plan de Implementación: Gestión de Fechas de Vencimiento en Créditos

**Fecha:** 2026-03-11
**Versión:** 1.0
**Estado:** Pendiente de aprobación

---

## Resumen Ejecutivo

Se añade el campo `fecha_limite` a los créditos para controlar el plazo máximo de pago.
Esto habilita tres capacidades nuevas: (1) captura de la fecha al crear el crédito en el POS,
(2) tarjeta de "Créditos Vencidos" en el Dashboard, y (3) cabecera de resumen con filtros
en el módulo `/creditos`.

---

## 1. Cambios en el Backend (Laravel)

### 1.1 Migración de Base de Datos

Agregar columna `fecha_limite` a la tabla `creditos`:

```php
// database/migrations/xxxx_add_fecha_limite_to_creditos_table.php
Schema::table('creditos', function (Blueprint $table) {
    $table->date('fecha_limite')->nullable()->after('fecha');
});
```

- **Nullable** → los créditos existentes sin fecha quedan con `NULL`.
- Tipo `date` (no `datetime`), suficiente para comparar días.

---

### 1.2 Endpoint `POST /api/creditos`

Aceptar el campo opcional `fecha_limite`:

```php
// CreditoController@store
$validated = $request->validate([
    // ...campos existentes...
    'fecha_limite' => 'nullable|date|after_or_equal:today',
]);
// El modelo ya tomará fecha_limite del $fillable
```

---

### 1.3 Endpoint `GET /api/creditos/lista/listado`

- Retornar `fecha_limite` en cada registro.
- Aceptar parámetro de filtro `?estado=vencido|por_vencer|sin_fecha|todos` (default: `todos`).

```php
// Lógica de filtro sugerida:
$hoy = Carbon::today();
$proximosDias = $hoy->copy()->addDays(7); // "por vencer" = vence en ≤ 7 días

$query = Credito::where('saldo', '>', 0); // solo pendientes

if ($request->estado === 'vencido') {
    $query->whereNotNull('fecha_limite')->where('fecha_limite', '<', $hoy);
} elseif ($request->estado === 'por_vencer') {
    $query->whereNotNull('fecha_limite')
          ->whereBetween('fecha_limite', [$hoy, $proximosDias]);
} elseif ($request->estado === 'sin_fecha') {
    $query->whereNull('fecha_limite');
}
```

---

### 1.4 Endpoint `GET /api/dashboard/resumen`

Agregar al JSON de respuesta:

```json
{
  "creditos_vencidos": {
    "total_creditos": 5,
    "total_saldo": 1250.00
  }
}
```

```php
// DashboardController
$hoy = Carbon::today();
$creditosVencidos = Credito::where('saldo', '>', 0)
    ->whereNotNull('fecha_limite')
    ->where('fecha_limite', '<', $hoy)
    ->selectRaw('COUNT(*) as total_creditos, SUM(saldo) as total_saldo')
    ->first();
```

---

### 1.5 Endpoint `PUT /api/creditos/{id}` — Asignar fecha a créditos sin fecha

Permitir actualizar solo `fecha_limite` en créditos existentes:

```php
$validated = $request->validate([
    'fecha_limite' => 'nullable|date',
    'detalle'      => 'sometimes|string',
]);
```

Esto se usará desde el módulo de créditos para asignar fechas a los registros históricos.

---

## 2. Cambios en el Frontend

### 2.1 Punto de Venta — Captura de `fecha_limite`

**Archivo afectado:** `src/views/puntoVenta/factura/FormasPago.js`
(o el componente que muestra el diálogo de confirmación de crédito)

#### Flujo actual:
1. Usuario activa toggle "Crédito"
2. Si el cliente tiene créditos activos → SweetAlert de confirmación
3. Se guarda la factura como crédito

#### Flujo nuevo (después del paso 2):
3. Se muestra un **Modal / Dialog de Material-UI** con:
   - Mensaje informativo: *"Ingrese la fecha máxima de pago para este crédito"*
   - Campo `DatePicker` (usando `@material-ui/pickers` ya disponible o un `<input type="date">`)
   - Fecha mínima = hoy
   - Fecha sugerida por defecto = hoy + 30 días
   - Botón **Continuar** (guarda con fecha)
   - Botón **Omitir** (guarda sin fecha, `fecha_limite = null`)
   - Botón **Cancelar** (no guarda)
4. Se pasa `fecha_limite` al contexto y se incluye en el payload de la API.

**Cambios en FacturaContext:**
```javascript
// Estado nuevo
const [fechaLimiteCredito, setFechaLimiteCredito] = useState(null);

// En guardarComoCredito()
const payload = {
  // ...campos existentes...
  fecha_limite: fechaLimiteCredito, // null si no se especificó
};
```

**Componente nuevo sugerido:** `src/views/puntoVenta/factura/ModalFechaCredito.js`
- Dialog de Material-UI
- DatePicker nativo (`<input type="date">`) para no añadir dependencias
- Props: `open`, `onConfirm(fecha)`, `onSkip`, `onCancel`

---

### 2.2 Dashboard — Tarjeta "Créditos Vencidos"

**Archivo afectado:** `src/views/reports/DashboardView/index.js`

#### Cambio visual:
Añadir una 5ª tarjeta de resumen junto a "CRÉDITOS PENDIENTES":

```
┌─────────────────────┐  ┌─────────────────────┐
│  CRÉDITOS           │  │  CRÉDITOS           │
│  PENDIENTES         │  │  VENCIDOS           │
│                     │  │                     │
│  $ 5,200.00         │  │  $ 1,250.00         │
│  12 créditos        │  │  5 créditos  🔴     │
└─────────────────────┘  └─────────────────────┘
                (clickeable → /creditos?estado=vencido)
```

**Cambios en DashboardContext:**
```javascript
// cargarResumen() ya devuelve el resumen;
// solo hay que leer creditos_vencidos del mismo endpoint
const { creditos_pendientes, creditos_vencidos } = data.resumen;
```

**En el componente Dashboard:**
```jsx
<Card
  onClick={() => navigate('/creditos?estado=vencido')}
  style={{ cursor: 'pointer', borderLeft: '4px solid red' }}
>
  <CardContent>
    <Typography variant="overline">CRÉDITOS VENCIDOS</Typography>
    <Typography variant="h4">{formatCurrency(creditosVencidos.total_saldo)}</Typography>
    <Typography variant="body2">{creditosVencidos.total_creditos} crédito(s)</Typography>
  </CardContent>
</Card>
```

---

### 2.3 Módulo Créditos — Cabecera de Resumen con Filtros

**Archivo afectado:** `src/views/creditos/index.js` y/o `Results.js`

#### Nuevo componente: `ResumenCreditos` (cabecera)

```
┌──────────────────────────────────────────────────────────────────┐
│  RESUMEN DE CRÉDITOS                                             │
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ 🔴 VENCIDOS   │  │ 🟡 POR VENCER │  │ ⚪ SIN FECHA  │        │
│  │   5 créditos  │  │   3 créditos  │  │  8 créditos   │        │
│  │ $ 1,250.00    │  │ $   780.00    │  │ $ 2,100.00    │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
│       [activo]                                                   │
│                                            [Ver todos]           │
└──────────────────────────────────────────────────────────────────┘
```

- Cada tarjeta es clickeable y activa un filtro sobre la tabla.
- El filtro activo se resalta visualmente (borde o fondo coloreado).
- "Ver todos" limpia el filtro y muestra todos los créditos pendientes.

**Cambios en CreditoContext:**
```javascript
// Estado nuevo
const [filtroEstado, setFiltroEstado] = useState('todos');
// 'todos' | 'vencido' | 'por_vencer' | 'sin_fecha'

// obtenerCreditos() pasa el filtro al endpoint
const obtenerCreditos = async () => {
  const res = await axios.get(`/api/creditos/lista/listado?estado=${filtroEstado}`);
  setCreditos(res.data);
};

// Resumen separado (llamada adicional o incluida en listado)
const [resumenCreditos, setResumenCreditos] = useState({
  vencidos: { total: 0, saldo: 0 },
  por_vencer: { total: 0, saldo: 0 },
  sin_fecha: { total: 0, saldo: 0 },
});
```

**Leer query param al entrar desde el Dashboard:**
```javascript
// En index.js del módulo /creditos
import { useSearchParams } from 'react-router-dom';

const [searchParams] = useSearchParams();
const estadoInicial = searchParams.get('estado') || 'todos';
// Pasar estadoInicial al contexto al montar
```

---

### 2.4 Módulo Créditos — Columna `Fecha Límite` en la tabla

**Archivo afectado:** `src/components/CreditosTable/index.js` (o columns)

- Agregar columna **"Fecha Límite"** que muestre:
  - Fecha formateada `DD/MM/YYYY` si existe
  - Chip rojo **"VENCIDO"** si `fecha_limite < hoy`
  - Chip amarillo **"Vence pronto"** si `fecha_limite` está dentro de 7 días
  - Texto gris *"Sin fecha"* si es `null`

---

### 2.5 Módulo Créditos — Asignar Fecha a Créditos Existentes

Para los créditos históricos sin `fecha_limite`:

**Opción A — Edición individual (recomendada como inicio):**
- En el menú de acciones de cada fila (icono ✏️ o similar), añadir la opción "Asignar fecha límite".
- Abre un pequeño popover/dialog con un DatePicker.
- Llama a `PUT /api/creditos/{id}` con `{ fecha_limite }`.

**Opción B — Acción masiva (para el futuro):**
- Checkbox multi-selección + botón "Asignar fecha a seleccionados".
- Abre un único dialog, aplica la misma fecha a todos.

**Recomendación:** Implementar la Opción A primero; la Opción B puede añadirse después si hay volumen alto de créditos históricos.

---

## 3. Definición de "Por Vencer"

| Estado       | Criterio                                        | Color  |
|--------------|-------------------------------------------------|--------|
| Vencido      | `fecha_limite < hoy` y `saldo > 0`             | Rojo   |
| Por vencer   | `fecha_limite` entre hoy y hoy+7 días           | Amarillo |
| Sin fecha    | `fecha_limite IS NULL` y `saldo > 0`            | Gris   |
| Al día       | `fecha_limite >= hoy+8 días` o pagado           | Verde / normal |

> El rango "por vencer" de 7 días es configurable; se puede ajustar a 15 o 30 días según preferencia.

---

## 4. Orden de Implementación Sugerido

```
Fase 1 — Backend (base de datos y API)
  ├── 1.1 Migración: agregar fecha_limite (nullable)
  ├── 1.2 Actualizar POST /api/creditos
  ├── 1.3 Actualizar GET /api/creditos/lista/listado (filtros)
  ├── 1.4 Actualizar GET /api/dashboard/resumen
  └── 1.5 Actualizar PUT /api/creditos/{id}

Fase 2 — POS: captura de fecha al crear crédito
  ├── 2.1 Crear ModalFechaCredito.js
  └── 2.2 Actualizar FacturaContext y FormasPago.js

Fase 3 — Dashboard: tarjeta de vencidos
  ├── 3.1 Actualizar DashboardContext (leer creditos_vencidos)
  └── 3.2 Agregar tarjeta en DashboardView/index.js

Fase 4 — Módulo /creditos: cabecera + filtros + columna
  ├── 4.1 Crear componente ResumenCreditos
  ├── 4.2 Actualizar CreditoContext (filtroEstado, resumenCreditos)
  ├── 4.3 Leer query param ?estado= al cargar la vista
  ├── 4.4 Agregar columna "Fecha Límite" con chips de estado
  └── 4.5 Agregar acción "Asignar fecha límite" por fila
```

---

## 5. Consideraciones y Riesgos

| Item | Descripción |
|------|-------------|
| Retrocompatibilidad | `fecha_limite nullable` → no rompe créditos existentes |
| Créditos sin fecha | Se muestran en su propio filtro "Sin fecha"; no aparecen como vencidos |
| Permisos | Las acciones de editar fecha deben respetar el sistema de permisos existente (`tienePermiso`) |
| Zona horaria | Usar siempre la fecha del servidor (Laravel/Carbon) para comparaciones, no la del cliente |
| Paginación | Si hay muchos créditos, los conteos del resumen deben venir de queries de agregación, no de contar el array en frontend |

---

## 6. Archivos a Crear / Modificar

### Nuevos archivos
| Archivo | Propósito |
|---------|-----------|
| `src/views/puntoVenta/factura/ModalFechaCredito.js` | Dialog de captura de fecha en POS |
| `src/views/creditos/ResumenCreditos.js` | Cabecera con tarjetas de filtro |

### Archivos a modificar
| Archivo | Cambio |
|---------|--------|
| `src/context/FacturaContext.js` | Estado `fechaLimiteCredito`, incluirlo en payload |
| `src/context/CreditoContext.js` | Estado `filtroEstado` y `resumenCreditos`, filtrar llamada API |
| `src/context/DashboardContext.js` | Leer `creditos_vencidos` del resumen |
| `src/views/puntoVenta/factura/FormasPago.js` | Disparar `ModalFechaCredito` al activar crédito |
| `src/views/reports/DashboardView/index.js` | Añadir tarjeta "Créditos Vencidos" |
| `src/views/creditos/index.js` | Integrar `ResumenCreditos`, leer `?estado=` |
| `src/components/CreditosTable/index.js` | Columna "Fecha Límite" con chips de estado |

---

*Plan generado para revisión. Una vez aprobado, se procede con la implementación fase por fase.*
