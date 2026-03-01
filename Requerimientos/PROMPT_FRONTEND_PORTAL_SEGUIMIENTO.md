# Frontend — Portal de Seguimiento de Reparaciones

## Contexto del proyecto

Sistema de facturacion existente con:
- React 18 + Material-UI v4 (`@material-ui/core`) + React Router v6
- Axios para llamadas API (`src/Environment/config.js` exporta instancia `API`)
- Context API para estado global (patron: `src/context/XxxContext.js`)
- Alertas con `alertifyjs` y `sweetalert2`
- `Formik` + `Yup` para formularios con validacion
- Base URL en `REACT_APP_BASE_URL` (.env)
- Estructura de rutas: `/app/*` = DashboardLayout (requiere login), `/` = MainLayout (publico)

---

## Objetivo

Crear una pagina **publica** (sin login) donde el cliente pueda consultar el estado de su orden de reparacion ingresando su **cedula** y **numero de orden**. Ademas, integrar un boton de **cambiar estado** en la vista interna de ordenes (Ingreso) para que el admin/tecnico pueda cambiar el estado de reparacion.

---

## PARTE 1: Pagina Publica de Consulta (cliente)

### 1.1 Ruta

Agregar una nueva ruta **fuera del DashboardLayout**, accesible sin login:

```js
// src/routes.js
import ConsultaOrden from './views/consultaOrden';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [ /* rutas existentes... */ ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'consulta', element: <ConsultaOrden /> },  // <-- NUEVA
      { path: 'login', element: <LoginView /> },
      // ... resto
    ]
  }
];
```

**URL final:** `https://tudominio.com/consulta`

### 1.2 Endpoint

**POST** `/api/public/consulta-orden`

```js
const END_POINT = 'api/public/consulta-orden';
```

**Request:**
```json
{
  "cedula": "1207644996001",
  "orden_id": 11247
}
```

**Response 200 (exito):**
```json
{
  "codigo": 200,
  "orden": {
    "id": 11247,
    "fecha_ingreso": "2026-02-15 19:17:07",
    "estado": "en_proceso",
    "estado_label": "En Proceso",
    "equipo": {
      "tipo": "LAPTOP",
      "marca": "DELL",
      "modelo": "Inspiron 15",
      "serie": "SN-ABC123"
    },
    "falla": "No enciende, se apaga sola",
    "trabajo_realizado": "Se diagnostico problema en placa madre. Se realizo reballing del chip de video.",
    "observacion": "Cliente solicita respaldo de datos",
    "ultimo_tecnico": "Juan",
    "ultima_actualizacion": "2026-02-16 14:30:00",
    "financiero": {
      "total": 45.00,
      "abono": 20.00,
      "saldo": 25.00
    },
    "historial": [
      {
        "fecha": "2026-02-15 19:17:07",
        "evento": "Equipo recibido",
        "detalle": "Ingreso registrado en el sistema"
      },
      {
        "fecha": "2026-02-16 10:00:00",
        "evento": "Diagnostico iniciado",
        "detalle": "Se inicio revision electronica"
      },
      {
        "fecha": "2026-02-16 14:30:00",
        "evento": "Trabajo en progreso",
        "detalle": "Se realizo reballing del chip de video"
      }
    ]
  }
}
```

**Response 404 (no encontrada):**
```json
{
  "codigo": 404,
  "mensaje": "No se encontro ninguna orden con los datos proporcionados."
}
```

**Response 422 (validacion):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "cedula": ["The cedula field is required."],
    "orden_id": ["The orden id field is required."]
  }
}
```

**Response 429 (rate limit — 10 consultas/minuto por IP):**
```json
{
  "codigo": 429,
  "mensaje": "Demasiadas consultas. Intente nuevamente en unos minutos."
}
```

### 1.3 Estructura de archivos

```
src/views/consultaOrden/
  index.js                  ← Pagina principal (formulario + resultado)
```

No se necesita Context ni Provider. Es una pagina autocontenida con estado local (`useState`).

### 1.4 Componente: `ConsultaOrden` (index.js)

Vista completa con 2 secciones:
1. **Formulario de consulta** (siempre visible)
2. **Resultado** (se muestra solo cuando hay respuesta exitosa)

#### Formulario

- Campo `cedula`: TextField, validacion min 10, max 13 caracteres, solo numeros
- Campo `orden_id`: TextField type="number", validacion min 1
- Boton "Consultar": llama al endpoint
- Validar con Yup + Formik (patron existente del proyecto)
- Manejar los 4 posibles estados de respuesta:
  - **200**: mostrar resultado
  - **404**: alertify.error con el mensaje
  - **422**: mostrar errores de validacion en los campos
  - **429**: alertify.warning "Demasiadas consultas. Intente en unos minutos."

```js
// Ejemplo de llamada
const consultarOrden = async (values) => {
  try {
    setLoading(true);
    setOrden(null);
    setError(null);
    const response = await API.post('api/public/consulta-orden', {
      cedula: values.cedula,
      orden_id: parseInt(values.orden_id)
    });
    if (response.data.codigo === 200) {
      setOrden(response.data.orden);
    }
  } catch (err) {
    if (err.response?.status === 404) {
      setError('No se encontro ninguna orden con los datos proporcionados.');
    } else if (err.response?.status === 429) {
      setError('Demasiadas consultas. Intente nuevamente en unos minutos.');
    } else if (err.response?.status === 422) {
      // Formik maneja los errores de validacion
    } else {
      setError('Error de conexion. Intente mas tarde.');
    }
  } finally {
    setLoading(false);
  }
};
```

#### Resultado (cuando `orden` != null)

Mostrar la informacion en secciones:

**a) Header con estado:**
```
Orden #11247 — En Proceso
Fecha de ingreso: 15/02/2026 19:17
```

El badge de estado debe usar estos colores:

| Estado | estado_label | Color texto | Color fondo |
|--------|-------------|-------------|-------------|
| `pendiente` | Pendiente | #E65100 | #FFF3E0 |
| `en_proceso` | En Proceso | #1565C0 | #E3F2FD |
| `completado` | Completado | #2E7D32 | #E8F5E9 |
| `entregado` | Entregado | #7B1FA2 | #F3E5F5 |

Usar un `Chip` de MUI con estilos personalizados:
```jsx
const estadoColores = {
  pendiente:  { color: '#E65100', bg: '#FFF3E0' },
  en_proceso: { color: '#1565C0', bg: '#E3F2FD' },
  completado: { color: '#2E7D32', bg: '#E8F5E9' },
  entregado:  { color: '#7B1FA2', bg: '#F3E5F5' },
};

<Chip
  label={orden.estado_label}
  style={{
    backgroundColor: estadoColores[orden.estado]?.bg,
    color: estadoColores[orden.estado]?.color,
    fontWeight: 600
  }}
/>
```

**b) Informacion del equipo (Card):**
```
Tipo: LAPTOP
Marca: DELL
Modelo: Inspiron 15
Serie: SN-ABC123
```

**c) Detalle de la reparacion (Card):**
```
Falla reportada: No enciende, se apaga sola
Trabajo realizado: Se diagnostico problema en placa madre...
Observacion: Cliente solicita respaldo de datos
Ultimo tecnico: Juan
```

**d) Resumen financiero (Card con Grid de 3 columnas):**
```
Total: $45.00     Abonado: $20.00     Saldo: $25.00
```
- Si `saldo === 0`: mostrar "Pagado" en verde
- Si `saldo > 0`: mostrar saldo en rojo/naranja

**e) Linea de tiempo / Historial (Timeline vertical):**

Mostrar cada evento del array `historial` como un punto en una linea vertical:
```
● Equipo recibido                    15/02/2026 19:17
  Ingreso registrado en el sistema

● Diagnostico iniciado               16/02/2026 10:00
  Se inicio revision electronica

● Trabajo en progreso                 16/02/2026 14:30
  Se realizo reballing del chip de video
```

Implementar con divs estilizados (no necesita libreria externa):

```jsx
{orden.historial.map((h, i) => (
  <Box key={i} display="flex" mb={2}>
    <Box mr={2} display="flex" flexDirection="column" alignItems="center">
      <Box
        style={{
          width: 12, height: 12, borderRadius: '50%',
          backgroundColor: i === orden.historial.length - 1 ? '#1565C0' : '#9e9e9e'
        }}
      />
      {i < orden.historial.length - 1 && (
        <Box style={{ width: 2, flex: 1, backgroundColor: '#e0e0e0', marginTop: 4 }} />
      )}
    </Box>
    <Box flex={1}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
          {h.evento}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {formatearFecha(h.fecha)}
        </Typography>
      </Box>
      {h.detalle && (
        <Typography variant="body2" color="textSecondary">
          {h.detalle}
        </Typography>
      )}
    </Box>
  </Box>
))}
```

### 1.5 Diseno UI

**IMPORTANTE: Esta pagina es publica y la ven los CLIENTES. Debe verse profesional y limpia.**

- Fondo gris claro (`#f4f6f8`) como el login
- Centrado vertical/horizontal en pantalla completa
- Ancho maximo: 600px para el formulario, 800px para el resultado
- Mobile-first: debe verse bien en celular (los clientes consultaran desde el telefono)
- Logo de la empresa arriba del formulario (usar `LogoIngreso.PNG` de `src/assets/`)
- Titulo: "Consulta tu Orden de Reparacion"
- Subtitulo: "Ingresa tu cedula y numero de orden para ver el estado"

**Layout sugerido:**
```
┌─────────────────────────────────┐
│         [Logo empresa]          │
│                                 │
│  Consulta tu Orden de Reparacion│
│  Ingresa tu cedula y numero ... │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Cedula: [____________]  │    │
│  │ N° Orden: [__________]  │    │
│  │                         │    │
│  │     [  Consultar  ]     │    │
│  └─────────────────────────┘    │
│                                 │
│  ═══════════════════════════    │  ← Solo si hay resultado
│                                 │
│  Orden #11247  [En Proceso]     │
│  Ingreso: 15/02/2026            │
│                                 │
│  ┌── Equipo ──────────────┐    │
│  │ LAPTOP DELL Inspiron 15│    │
│  └────────────────────────┘    │
│                                 │
│  ┌── Reparacion ──────────┐    │
│  │ Falla: ...             │    │
│  │ Trabajo: ...           │    │
│  └────────────────────────┘    │
│                                 │
│  ┌── Financiero ──────────┐    │
│  │ $45.00  $20.00  $25.00 │    │
│  └────────────────────────┘    │
│                                 │
│  ┌── Historial ───────────┐    │
│  │ ● Equipo recibido      │    │
│  │ │                      │    │
│  │ ● Diagnostico iniciado │    │
│  │ │                      │    │
│  │ ● Trabajo en progreso  │    │
│  └────────────────────────┘    │
│                                 │
│  [← Realizar otra consulta]    │
└─────────────────────────────────┘
```

### 1.6 Formateo de fechas

```js
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-EC', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
```

---

## PARTE 2: Cambio de Estado desde Panel Admin (interno)

### 2.1 Endpoint

**POST** `/api/ordenes/cambiar-estado`

```js
const END_POINT_CAMBIAR_ESTADO = 'api/ordenes/cambiar-estado';
```

**Request:**
```json
{
  "orden_id": 11247,
  "estado_reparacion": "completado",
  "usuario_id": 1
}
```

| Campo | Tipo | Requerido | Valores permitidos |
|-------|------|-----------|--------------------|
| `orden_id` | integer | Si | ID de la orden |
| `estado_reparacion` | string | Si | `pendiente`, `en_proceso`, `completado`, `entregado` |
| `usuario_id` | integer | No | `localStorage.getItem('user_id')` |

**Response 200:**
```json
{
  "codigo": 200,
  "mensaje": "Estado actualizado a: Completado",
  "orden": { "id": 11247, "estado_reparacion": "completado", ... }
}
```

**Response 422 (validacion):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "estado_reparacion": ["The selected estado reparacion is invalid."]
  }
}
```

### 2.2 Integracion en vista de Ingresos

En la vista existente de ordenes (Ingreso / `ProductCard.js` o donde se muestra el detalle de la orden), agregar un **selector de estado de reparacion** (Select o botones).

#### Opcion A: Select en el detalle de la orden

Dentro del modal/card de detalle de orden, agregar:

```jsx
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

const estadoOpciones = [
  { value: 'pendiente', label: 'Pendiente', color: '#E65100' },
  { value: 'en_proceso', label: 'En Proceso', color: '#1565C0' },
  { value: 'completado', label: 'Completado', color: '#2E7D32' },
  { value: 'entregado', label: 'Entregado', color: '#7B1FA2' },
];

const cambiarEstado = async (ordenId, nuevoEstado) => {
  const result = await Swal.fire({
    title: '¿Cambiar estado?',
    text: `¿Desea cambiar el estado a "${estadoOpciones.find(e => e.value === nuevoEstado)?.label}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si, cambiar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      const response = await API.post('api/ordenes/cambiar-estado', {
        orden_id: ordenId,
        estado_reparacion: nuevoEstado,
        usuario_id: parseInt(localStorage.getItem('user_id'))
      });

      if (response.data.codigo === 200) {
        alertify.success(response.data.mensaje);
        setReload(true); // Recargar lista
      }
    } catch (err) {
      alertify.error('Error al cambiar estado');
    }
  }
};
```

```jsx
<FormControl variant="outlined" size="small" style={{ minWidth: 160 }}>
  <InputLabel>Estado</InputLabel>
  <Select
    value={orden.estado_reparacion || 'pendiente'}
    onChange={(e) => cambiarEstado(orden.id, e.target.value)}
    label="Estado"
  >
    {estadoOpciones.map(opt => (
      <MenuItem key={opt.value} value={opt.value}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box style={{
            width: 10, height: 10, borderRadius: '50%',
            backgroundColor: opt.color, marginRight: 8
          }} />
          {opt.label}
        </Box>
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

#### Opcion B: Chips clickeables (mas visual)

```jsx
{estadoOpciones.map(opt => (
  <Chip
    key={opt.value}
    label={opt.label}
    onClick={() => cambiarEstado(orden.id, opt.value)}
    style={{
      margin: '0 4px',
      backgroundColor: orden.estado_reparacion === opt.value ? opt.color : 'transparent',
      color: orden.estado_reparacion === opt.value ? '#fff' : opt.color,
      border: `1px solid ${opt.color}`,
      fontWeight: orden.estado_reparacion === opt.value ? 600 : 400,
      cursor: 'pointer'
    }}
    size="small"
  />
))}
```

### 2.3 Mostrar `estado_reparacion` en la tabla de ordenes

El campo `estado_reparacion` ahora viene del backend en cada orden. Reemplazar la logica actual de `derivarEstado()` en `IngresoContext.js`:

**Antes (derivado en frontend):**
```js
const derivarEstado = (orden) => {
  if (orden.factura_relacionada && orden.factura_relacionada > 0) return 'Facturado';
  if (orden.trabajo && orden.trabajo.trim() !== '') return 'En Proceso';
  return 'Pendiente';
};
```

**Ahora (viene del backend):**
```js
// Ya no se necesita derivarEstado(). Usar directamente:
// orden.estado_reparacion → 'pendiente' | 'en_proceso' | 'completado' | 'entregado'

const estadoLabels = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  completado: 'Completado',
  entregado: 'Entregado',
};

// Mapeo de colores
const estadoColores = {
  pendiente:  { color: '#E65100', bg: '#FFF3E0' },
  en_proceso: { color: '#1565C0', bg: '#E3F2FD' },
  completado: { color: '#2E7D32', bg: '#E8F5E9' },
  entregado:  { color: '#7B1FA2', bg: '#F3E5F5' },
};
```

**NOTA:** El campo `estado_reparacion` ya se retorna en `GET /api/ordenes` para cada orden. No necesitas hacer llamadas adicionales.

### 2.4 Actualizar contadores del dashboard de Ingresos

Actualizar `contadorEstados()` en `IngresoContext.js`:

```js
const contadorEstados = () => {
  const pendientes = ordenes.filter(o => o.estado_reparacion === 'pendiente').length;
  const enProceso = ordenes.filter(o => o.estado_reparacion === 'en_proceso').length;
  const completados = ordenes.filter(o => o.estado_reparacion === 'completado').length;
  const entregados = ordenes.filter(o => o.estado_reparacion === 'entregado').length;
  return { pendientes, enProceso, completados, entregados, total: ordenes.length };
};
```

Y actualizar las summary cards en `src/views/Ingreso/ProductListView/index.js`:

```js
const summaryCards = [
  { label: 'Total',       value: conteo.total,       color: '#616161', bg: '#f5f5f5',   filter: 'todos' },
  { label: 'Pendientes',  value: conteo.pendientes,  color: '#E65100', bg: '#FFF3E0',   filter: 'pendiente' },
  { label: 'En Proceso',  value: conteo.enProceso,   color: '#1565C0', bg: '#E3F2FD',   filter: 'en_proceso' },
  { label: 'Completados', value: conteo.completados,  color: '#2E7D32', bg: '#E8F5E9',   filter: 'completado' },
  { label: 'Entregados',  value: conteo.entregados,  color: '#7B1FA2', bg: '#F3E5F5',   filter: 'entregado' },
];
```

### 2.5 Actualizar filtros

Actualizar los chips de filtro:

```js
{['todos', 'pendiente', 'en_proceso', 'completado', 'entregado'].map((estado) => (
  <Chip
    key={estado}
    label={estado === 'todos' ? 'Todos' : estadoLabels[estado]}
    color={filtroEstado === estado ? 'primary' : 'default'}
    onClick={() => setFiltroEstado(estado)}
    variant={filtroEstado === estado ? 'default' : 'outlined'}
    size="small"
    style={{ margin: '0 4px', fontWeight: 600 }}
  />
))}
```

Y actualizar el filtro en la tabla para usar `estado_reparacion` en lugar de `estado_derivado`:

```js
const ordenesFiltradas = filtroEstado === 'todos'
  ? ordenes
  : ordenes.filter(o => o.estado_reparacion === filtroEstado);
```

---

## PARTE 3: Enlace desde panel admin al portal publico (opcional)

Agregar un boton en el detalle de la orden para copiar el enlace de consulta publica:

```jsx
import FileCopyIcon from '@material-ui/icons/FileCopy';

const copiarEnlaceConsulta = (ordenId) => {
  const url = `${window.location.origin}/consulta`;
  navigator.clipboard.writeText(url);
  alertify.success('Enlace copiado. Comparta con el cliente.');
};

<Button
  size="small"
  startIcon={<FileCopyIcon />}
  onClick={() => copiarEnlaceConsulta(orden.id)}
>
  Copiar enlace de seguimiento
</Button>
```

---

## Resumen de cambios

| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| `src/routes.js` | Modificar | Agregar ruta `/consulta` con `ConsultaOrden` |
| `src/views/consultaOrden/index.js` | Crear | Pagina publica de consulta de orden |
| `src/context/IngresoContext.js` | Modificar | Reemplazar `derivarEstado` por `estado_reparacion`, agregar `cambiarEstado`, actualizar `contadorEstados` |
| `src/views/Ingreso/ProductListView/index.js` | Modificar | Actualizar summary cards y filtros (4 estados + entregado) |
| Componente detalle de orden | Modificar | Agregar selector/chips de cambio de estado |

---

## Permisos

El endpoint `POST /api/ordenes/cambiar-estado` no tiene restriccion en backend. Si se desea controlar desde frontend:
- El permiso `ingresos.editar-estado` se puede agregar al catálogo de permisos si se necesita granularidad
- Por ahora, cualquier usuario logueado puede cambiar el estado

El endpoint `POST /api/public/consulta-orden` es **totalmente publico**, no requiere login ni permisos.

---

## Notas importantes

1. **Rate limiting**: El endpoint publico tiene limite de 10 consultas por minuto por IP. Si el cliente excede el limite, mostrar mensaje amigable.
2. **Sin listados**: No existe endpoint para listar ordenes publicamente. El cliente DEBE conocer su cedula Y su numero de orden.
3. **Seguridad**: El backend solo muestra el primer nombre del tecnico, nunca datos internos completos.
4. **Historial automatico**: El historial se genera automaticamente desde el backend. No necesitas enviarlo manualmente. Solo se consume para mostrar.
5. **Campo `estado_reparacion`**: Ya viene incluido en la respuesta de `GET /api/ordenes`. El campo se retorna como string: `pendiente`, `en_proceso`, `completado`, `entregado`.
