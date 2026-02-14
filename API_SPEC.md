# API Specification - CompuServices Facturación

## Módulo 1: Dashboard (6 endpoints)

### 1. GET `/api/dashboard/resumen`
Resumen del período activo.

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "periodo": { "id": 1, "estado": "Abierto", "fecha_apertura": "2026-02-13", ... },
    "ventas": {
      "total_facturas": 45,
      "total_ventas": 3250.50
    },
    "creditos_pendientes": {
      "total_creditos": 8,
      "total_saldo": 1200.00
    },
    "productos_stock_bajo": 12
  }
}
```

---

### 2. GET `/api/dashboard/ventas-periodo`
Ventas agrupadas por día/semana/mes para gráficas.

**Query params:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `tipo` | string | `diario` | `diario`, `semanal`, `mensual` |
| `fecha_desde` | date | null | Formato `YYYY-MM-DD` |
| `fecha_hasta` | date | null | Formato `YYYY-MM-DD` |

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": [
    { "periodo": "2026-02-10", "total_facturas": 5, "total_ventas": 450.00 },
    { "periodo": "2026-02-11", "total_facturas": 8, "total_ventas": 720.50 }
  ]
}
```

---

### 3. GET `/api/dashboard/top-productos`
Top 10 productos más vendidos por cantidad.

**Query params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `fecha_desde` | date | Opcional. Formato `YYYY-MM-DD` |
| `fecha_hasta` | date | Opcional. Formato `YYYY-MM-DD` |

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": [
    {
      "producto_id": 5,
      "nombre": "Cable HDMI",
      "codigo_barra": "123456",
      "total_cantidad": 50,
      "total_ventas": 750.00
    }
  ]
}
```

---

### 4. GET `/api/dashboard/top-clientes`
Top 10 clientes por monto de compras.

**Query params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `fecha_desde` | date | Opcional. Formato `YYYY-MM-DD` |
| `fecha_hasta` | date | Opcional. Formato `YYYY-MM-DD` |

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": [
    {
      "cliente_id": 3,
      "nombres": "Juan Pérez",
      "cedula": "0102030405",
      "total_facturas": 15,
      "total_compras": 2500.00
    }
  ]
}
```

---

### 5. GET `/api/dashboard/stock-bajo`
Productos con stock bajo.

**Query params:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `umbral` | int | `5` | Stock máximo a filtrar |

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": [
    {
      "id": 10,
      "nombre": "Mouse Logitech",
      "descripcion": "Mouse inalámbrico",
      "codigo_barra": "789012",
      "stock": 2,
      "precio_compra": 8.50,
      "precio_publico": 15.00
    }
  ]
}
```

---

### 6. GET `/api/dashboard/creditos-pendientes`
Lista de créditos con saldo > 0.

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "creditos": [
      {
        "id": 1,
        "cliente_id": 3,
        "fecha": "2026-01-15",
        "detalle": "Compra de equipos",
        "saldo": 350.00,
        "total": 500.00,
        "cliente": { "id": 3, "nombres": "Juan Pérez", "cedula": "0102030405" }
      }
    ],
    "total_pendiente": 1200.00,
    "total_creditos": 8
  }
}
```

---

## Módulo 2: Reportes Avanzados (8 endpoints)

### 1. POST `/api/reportes/utilidades`
Utilidad bruta: ventas - costo.

**Body:**
```json
{ "fecha_desde": "2026-01-01", "fecha_hasta": "2026-02-13" }
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "detalle": [
      {
        "producto_id": 5,
        "nombre": "Cable HDMI",
        "codigo_barra": "123456",
        "total_cantidad": 50,
        "total_venta": 750.00,
        "total_costo": 425.00,
        "utilidad": 325.00
      }
    ],
    "resumen": {
      "total_venta": 3250.50,
      "total_costo": 1800.00,
      "utilidad_bruta": 1450.50
    }
  }
}
```

---

### 2. GET `/api/reportes/inventario-valorizado`
Stock actual × precio de compra.

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "productos": [
      {
        "id": 1,
        "nombre": "Teclado USB",
        "codigo_barra": "111222",
        "stock": 25,
        "precio_compra": 5.00,
        "precio_publico": 12.00,
        "valor_inventario": 125.00
      }
    ],
    "resumen": {
      "total_productos": 50,
      "total_unidades": 450,
      "total_valorizado": 8500.00
    }
  }
}
```

---

### 3. POST `/api/reportes/cuentas-por-cobrar`
Créditos pendientes con antigüedad.

**Body:** `{}` (sin parámetros requeridos)

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "creditos": [
      {
        "id": 1,
        "cliente_id": 3,
        "fecha": "2025-12-01",
        "detalle": "Compra equipos",
        "saldo": 200.00,
        "total": 500.00,
        "dias_atraso": 74,
        "rango_antiguedad": "61-90",
        "cliente": { "id": 3, "nombres": "Juan Pérez", "cedula": "0102030405" }
      }
    ],
    "resumen_rangos": {
      "0-30": 500.00,
      "31-60": 300.00,
      "61-90": 200.00,
      "90+": 150.00
    },
    "total_por_cobrar": 1150.00
  }
}
```

---

### 4. POST `/api/reportes/ventas-por-producto`
Ingresos agrupados por producto.

**Body:**
```json
{ "fecha_desde": "2026-01-01", "fecha_hasta": "2026-02-13" }
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "productos": [
      {
        "id": 5,
        "nombre": "Cable HDMI",
        "codigo_barra": "123456",
        "total_cantidad": 50,
        "total_ventas": 750.00
      }
    ],
    "total_ventas": 3250.50
  }
}
```

---

### 5. POST `/api/reportes/ventas-por-cliente`
Ingresos agrupados por cliente.

**Body:**
```json
{ "fecha_desde": "2026-01-01", "fecha_hasta": "2026-02-13" }
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "clientes": [
      {
        "id": 3,
        "nombres": "Juan Pérez",
        "cedula": "0102030405",
        "total_facturas": 15,
        "total_compras": 2500.00
      }
    ],
    "total_ventas": 5200.00
  }
}
```

---

### 6. POST `/api/reportes/comparativo-mensual`
Ventas mensuales por año.

**Body (opción A):**
```json
{ "anio": 2026 }
```

**Body (opción B):**
```json
{ "anio_desde": 2025, "anio_hasta": 2026 }
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": [
    { "anio": 2026, "mes": 1, "total_facturas": 120, "total_ventas": 8500.00 },
    { "anio": 2026, "mes": 2, "total_facturas": 85, "total_ventas": 6200.00 }
  ]
}
```

---

### 7. POST `/api/reportes/exportar-excel`
Descarga archivo Excel de cualquier reporte.

**Body:**
```json
{
  "tipo_reporte": "utilidades",
  "fecha_desde": "2026-01-01",
  "fecha_hasta": "2026-02-13"
}
```

**`tipo_reporte` válidos:** `utilidades`, `inventario_valorizado`, `cuentas_por_cobrar`, `ventas_por_producto`, `ventas_por_cliente`, `comparativo_mensual`

**Response:** Archivo `.xlsx` (binary download)

---

### 8. POST `/api/reportes/exportar-pdf`
Descarga archivo PDF de cualquier reporte.

**Body:** Mismo formato que `exportar-excel`.

**Response:** Archivo `.pdf` (binary download)

---

## Módulo 3: Caja Chica / Gastos

### Categoría Gastos (4 endpoints)

#### 1. GET `/api/categoria-gastos`
Listar categorías activas.

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": [
    { "id": 1, "nombre": "Suministros", "descripcion": "Material de oficina", "color": "#FF5733", "activo": true }
  ]
}
```

---

#### 2. POST `/api/categoria-gastos`
Crear categoría.

**Body:**
```json
{
  "nombre": "Suministros",
  "descripcion": "Material de oficina",
  "color": "#FF5733"
}
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "Categoría creada correctamente.",
  "data": { "id": 1, "nombre": "Suministros", ... }
}
```

---

#### 3. PUT `/api/categoria-gastos/{id}`
Actualizar categoría.

**Body:**
```json
{ "nombre": "Suministros de oficina", "color": "#3366FF" }
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "Categoría actualizada correctamente.",
  "data": { "id": 1, "nombre": "Suministros de oficina", ... }
}
```

---

#### 4. DELETE `/api/categoria-gastos/{id}`
Eliminar categoría (soft delete).

**Response:**
```json
{ "codigo": 200, "Message": "Categoría eliminada correctamente.", "data": [] }
```

---

### Gastos (6 endpoints)

#### 5. GET `/api/gastos`
Gastos del período activo.

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "gastos": [
      {
        "id": 1,
        "categoria_gasto_id": 1,
        "periodo_id": 5,
        "concepto": "Compra de papel bond",
        "monto": 15.50,
        "fecha": "2026-02-13",
        "observacion": null,
        "usuario_id": 1,
        "categoria_gasto": { "id": 1, "nombre": "Suministros", "color": "#FF5733" },
        "usuario": { "id": 1, "nombres": "Admin" }
      }
    ],
    "total_gastos": 250.75,
    "periodo": { "id": 5, "estado": "Abierto", ... }
  }
}
```

---

#### 6. POST `/api/gastos`
Registrar gasto (el `periodo_id` se asigna automáticamente al período activo).

**Body:**
```json
{
  "categoria_gasto_id": 1,
  "concepto": "Compra de papel bond",
  "monto": 15.50,
  "fecha": "2026-02-13",
  "observacion": "Resma de papel A4",
  "usuario_id": 1
}
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "Gasto registrado correctamente.",
  "data": { "id": 1, "concepto": "Compra de papel bond", ... }
}
```

---

#### 7. PUT `/api/gastos/{id}`
Actualizar gasto.

**Body:**
```json
{ "concepto": "Compra de papel bond A4", "monto": 16.00 }
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "Gasto actualizado correctamente.",
  "data": { "id": 1, ... }
}
```

---

#### 8. DELETE `/api/gastos/{id}`
Eliminar gasto (soft delete).

**Response:**
```json
{ "codigo": 200, "Message": "Gasto eliminado correctamente.", "data": [] }
```

---

#### 9. POST `/api/gastos/por-categoria`
Gastos agrupados por categoría.

**Body:**
```json
{ "fecha_desde": "2026-02-01", "fecha_hasta": "2026-02-13" }
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "categorias": [
      { "id": 1, "nombre": "Suministros", "color": "#FF5733", "total_gastos": 5, "total_monto": 150.00 },
      { "id": 2, "nombre": "Transporte", "color": "#33FF57", "total_gastos": 3, "total_monto": 45.00 }
    ],
    "total": 195.00
  }
}
```

---

#### 10. POST `/api/gastos/balance-caja`
Balance de caja: ingresos - egresos.

**Body (opción A - por fechas):**
```json
{ "fecha_desde": "2026-02-01", "fecha_hasta": "2026-02-13" }
```

**Body (opción B - por período):**
```json
{ "periodo_id": 5 }
```

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "ingresos": {
      "facturas": 3250.50,
      "ordenes": 800.00,
      "creditos": 450.00,
      "total": 4500.50
    },
    "egresos": {
      "gastos": 195.00,
      "retiros": 300.00,
      "total": 495.00
    },
    "balance": 4005.50,
    "fecha_desde": "2026-02-01",
    "fecha_hasta": "2026-02-13"
  }
}
```

---

## Notas

- Todas las respuestas siguen el formato `{ "codigo": 200, "Message": "", "data": ... }`
- Los errores retornan `{ "codigo": 400, "Message": "Descripción del error", "data": [] }` con HTTP 200
- Las fechas usan formato `YYYY-MM-DD`
- Los endpoints de exportación (`exportar-excel`, `exportar-pdf`) retornan archivos binarios para descarga
- No se requiere autenticación (consistente con el resto del proyecto)
- Los gastos se asocian automáticamente al período activo en el `store`
- Soft delete en todas las operaciones de eliminación
