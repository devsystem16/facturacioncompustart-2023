# API de Permisos y Control de Acceso

## Endpoints

### 1. Listar todos los permisos

**GET** `/api/permisos`

Retorna todos los permisos del sistema agrupados por modulo.

**Response 200:**
```json
{
  "data": {
    "dashboard": [
      { "id": 1, "codigo": "dashboard.ver", "modulo": "dashboard", "tipo": "pantalla", "descripcion": "Ver pantalla de dashboard" },
      { "id": 2, "codigo": "dashboard.ver-estadisticas", "modulo": "dashboard", "tipo": "accion", "descripcion": "Ver estadisticas y graficos del dashboard" }
    ],
    "clientes": [
      { "id": 3, "codigo": "clientes.ver", "modulo": "clientes", "tipo": "pantalla", "descripcion": "Ver pantalla de clientes" },
      ...
    ],
    ...
  }
}
```

---

### 2. Permisos por tipo de usuario

**GET** `/api/tipo-usuarios/{id}/permisos`

Retorna el tipo de usuario y sus permisos activos.

**Parametros URL:**
- `id` — ID del tipo de usuario (1=Admin, 2=Tecnico, 3=Atencion, 4=Super Usuario)

**Response 200:**
```json
{
  "tipo_usuario": {
    "id": 1,
    "tipo": "ADMINISTRADOR"
  },
  "permisos": [
    "dashboard.ver",
    "dashboard.ver-estadisticas",
    "clientes.ver",
    "clientes.crear",
    ...
  ]
}
```

**Response 404:**
```json
{
  "codigo": 404,
  "mensaje": "Tipo de usuario no encontrado"
}
```

---

### 3. Asignar permisos a tipo de usuario

**POST** `/api/tipo-usuarios/{id}/permisos`

Sincroniza los permisos para un tipo de usuario. Los permisos enviados quedan activos, los no enviados se eliminan.

**Parametros URL:**
- `id` — ID del tipo de usuario

**Request Body:**
```json
{
  "permisos": [
    "dashboard.ver",
    "clientes.ver",
    "clientes.crear",
    "facturacion.ver",
    "facturacion.crear"
  ]
}
```

**Response 200:**
```json
{
  "codigo": 200,
  "mensaje": "Permisos actualizados correctamente",
  "total_asignados": 5
}
```

**Response 422 (validacion):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "permisos": ["The permisos field is required."],
    "permisos.0": ["The selected permisos.0 is invalid."]
  }
}
```

---

### 4. Mis permisos (para frontend)

**GET** `/api/mis-permisos/{tipoUsuarioId}`

Retorna un array plano de codigos de permisos activos para el tipo de usuario. Este endpoint reemplaza al `Permisos.json` estatico del frontend.

**Parametros URL:**
- `tipoUsuarioId` — ID del tipo de usuario (obtenido del login)

**Response 200:**
```json
{
  "permisos": [
    "dashboard.ver",
    "dashboard.ver-estadisticas",
    "clientes.ver",
    "clientes.crear",
    "clientes.editar",
    "clientes.eliminar",
    "clientes.buscar",
    "facturacion.ver",
    "facturacion.crear",
    "facturacion.reimprimir",
    ...
  ]
}
```

---

## Catalogo de Permisos (68 total)

### Dashboard (2)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `dashboard.ver` | pantalla | Ver pantalla de dashboard |
| `dashboard.ver-estadisticas` | accion | Ver estadisticas y graficos |

### Clientes (5)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `clientes.ver` | pantalla | Ver pantalla de clientes |
| `clientes.crear` | accion | Crear nuevos clientes |
| `clientes.editar` | accion | Editar clientes existentes |
| `clientes.eliminar` | accion | Eliminar clientes |
| `clientes.buscar` | accion | Buscar clientes |

### Productos (5)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `productos.ver` | pantalla | Ver pantalla de productos |
| `productos.crear` | accion | Crear nuevos productos |
| `productos.editar` | accion | Editar productos existentes |
| `productos.eliminar` | accion | Eliminar productos |
| `productos.buscar` | accion | Buscar productos |

### Ingresos/Ordenes (16)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `ingresos.ver` | pantalla | Ver pantalla de ingresos |
| `ingresos.crear` | accion | Crear nuevos ingresos |
| `ingresos.editar-cliente` | accion | Editar campo cliente |
| `ingresos.editar-fecha` | accion | Editar campo fecha |
| `ingresos.editar-serie` | accion | Editar campo serie |
| `ingresos.editar-equipo` | accion | Editar campo equipo |
| `ingresos.editar-marca` | accion | Editar campo marca |
| `ingresos.editar-modelo` | accion | Editar campo modelo |
| `ingresos.editar-falla` | accion | Editar campo falla |
| `ingresos.editar-trabajo` | accion | Editar campo trabajo |
| `ingresos.editar-abono` | accion | Editar campo abono |
| `ingresos.editar-total` | accion | Editar campo total |
| `ingresos.editar-estado` | accion | Editar estado del equipo |
| `ingresos.editar-observacion` | accion | Editar campo observacion |
| `ingresos.imprimir` | accion | Imprimir comprobante |
| `ingresos.ver-detalle` | accion | Ver detalle de ingreso |

### Facturacion (6)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `facturacion.ver` | pantalla | Ver pantalla de facturacion |
| `facturacion.crear` | accion | Crear nuevas facturas |
| `facturacion.anular` | accion | Anular facturas |
| `facturacion.reimprimir` | accion | Reimprimir facturas |
| `facturacion.ver-historial` | accion | Ver historial de facturas |
| `facturacion.ver-detalle` | accion | Ver detalle de factura |

### Creditos (5)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `creditos.ver` | pantalla | Ver pantalla de creditos |
| `creditos.abonar` | accion | Registrar abonos |
| `creditos.anular` | accion | Anular creditos |
| `creditos.ver-historial` | accion | Ver historial de pagos |
| `creditos.ver-detalle` | accion | Ver detalle de credito |

### Proformas (5)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `proformas.ver` | pantalla | Ver pantalla de proformas |
| `proformas.crear` | accion | Crear nuevas proformas |
| `proformas.editar` | accion | Editar proformas |
| `proformas.eliminar` | accion | Eliminar proformas |
| `proformas.imprimir` | accion | Imprimir proformas |

### Retiros (4)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `retiros.ver` | pantalla | Ver pantalla de retiros |
| `retiros.crear` | accion | Registrar retiros |
| `retiros.eliminar` | accion | Eliminar retiros |
| `retiros.ver-historial` | accion | Ver historial de retiros |

### Periodo/Caja (3)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `periodo.ver` | pantalla | Ver pantalla de periodo |
| `periodo.abrir` | accion | Abrir periodo de caja |
| `periodo.cerrar` | accion | Cerrar periodo de caja |

### Reportes (5)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `reportes.ver` | pantalla | Ver pantalla de reportes |
| `reportes.ventas-diarias` | accion | Ver reporte ventas diarias |
| `reportes.avanzados` | accion | Ver reportes avanzados |
| `reportes.exportar-excel` | accion | Exportar a Excel |
| `reportes.exportar-pdf` | accion | Exportar a PDF |

### Usuarios (5)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `usuarios.ver` | pantalla | Ver gestion de usuarios |
| `usuarios.crear` | accion | Crear usuarios |
| `usuarios.editar` | accion | Editar usuarios |
| `usuarios.eliminar` | accion | Eliminar usuarios |
| `usuarios.cambiar-password` | accion | Cambiar contrasena |

### Gastos (5)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `gastos.ver` | pantalla | Ver pantalla de gastos |
| `gastos.crear` | accion | Registrar gastos |
| `gastos.editar` | accion | Editar gastos |
| `gastos.eliminar` | accion | Eliminar gastos |
| `gastos.ver-balance` | accion | Ver balance de caja |

### Kardex (5)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `kardex.ver` | pantalla | Ver pantalla de kardex |
| `kardex.ajuste` | accion | Ajustes manuales |
| `kardex.entrada` | accion | Entradas manuales |
| `kardex.transferencia` | accion | Transferencias entre bodegas |
| `kardex.exportar` | accion | Exportar a Excel |

### Permisos (2)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `permisos.ver` | pantalla | Ver gestion de permisos |
| `permisos.asignar` | accion | Asignar permisos |

### Utilidad Productos (3)
| Codigo | Tipo | Descripcion |
|--------|------|-------------|
| `utilidad-productos.ver` | pantalla | Ver utilidad por productos |
| `utilidad-productos.ver-detalle` | accion | Ver detalle de utilidad |
| `utilidad-productos.exportar` | accion | Exportar a Excel |

---

## Integracion Frontend

### Reemplazar Permisos.json

El frontend debe llamar a `GET /api/mis-permisos/{tipoUsuarioId}` despues del login y guardar el array de permisos en el estado/contexto de la aplicacion.

```javascript
// Despues del login exitoso
const response = await fetch(`/api/mis-permisos/${tipousuario_id}`);
const { permisos } = await response.json();
// Guardar en contexto/localStorage
```

### Verificar permisos

```javascript
// Verificar si tiene permiso de pantalla
const puedeVerClientes = permisos.includes('clientes.ver');

// Verificar si tiene permiso de accion
const puedeAnularFactura = permisos.includes('facturacion.anular');
```

### Asignacion por defecto

| Tipo Usuario | Permisos |
|-------------|----------|
| ADMINISTRADOR (1) | Todos (68) |
| TECNICO (2) | 12 permisos (ingresos basicos + facturacion/creditos limitados) |
| ATENCION AL PUBLICO (3) | ~48 permisos (todo excepto anular, eliminar retiros, usuarios, permisos, campos restringidos de ingresos) |
| SUPER USUARIO (4) | Todos (68) |
