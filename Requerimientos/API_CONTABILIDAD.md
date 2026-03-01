# API de Contabilidad - Asientos Contables

## Resumen de Endpoints

| # | Metodo | Endpoint | Descripcion |
|---|--------|----------|-------------|
| 1 | GET | `/api/cuenta-contables` | Plan de cuentas en arbol |
| 2 | GET | `/api/cuenta-contables/lista` | Cuentas de detalle (para selects) |
| 3 | POST | `/api/cuenta-contables` | Crear cuenta contable |
| 4 | GET | `/api/cuenta-contables/{id}` | Ver cuenta contable |
| 5 | PUT | `/api/cuenta-contables/{id}` | Editar cuenta contable |
| 6 | DELETE | `/api/cuenta-contables/{id}` | Eliminar cuenta contable |
| 7 | GET | `/api/asientos-contables` | Listar asientos (con filtros) |
| 8 | POST | `/api/asientos-contables` | Crear asiento manual |
| 9 | GET | `/api/asientos-contables/{id}` | Ver asiento con detalles |
| 10 | PUT | `/api/asientos-contables/{id}` | Editar asiento (solo borrador) |
| 11 | POST | `/api/asientos-contables/{id}/contabilizar` | Contabilizar asiento |
| 12 | POST | `/api/asientos-contables/{id}/anular` | Anular asiento |
| 13 | POST | `/api/asientos-contables/generar/desde-factura/{id}` | Generar desde factura |
| 14 | POST | `/api/asientos-contables/generar/desde-gasto/{id}` | Generar desde gasto |
| 15 | POST | `/api/asientos-contables/generar/desde-retiro/{id}` | Generar desde retiro |
| 16 | POST | `/api/contabilidad/libro-diario` | Reporte libro diario |
| 17 | POST | `/api/contabilidad/libro-mayor` | Reporte libro mayor |
| 18 | POST | `/api/contabilidad/balance-comprobacion` | Balance de comprobacion |
| 19 | POST | `/api/contabilidad/balance-general` | Balance general |
| 20 | POST | `/api/contabilidad/estado-resultados` | Estado de resultados |

---

## 1. Plan de Cuentas

### 1.1 Listar plan de cuentas (arbol)

**GET** `/api/cuenta-contables`

Retorna todas las cuentas en estructura de arbol jerarquico.

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "codigo": "1",
      "nombre": "ACTIVOS",
      "tipo": "activo",
      "naturaleza": "deudora",
      "parent_id": null,
      "nivel": 1,
      "es_detalle": false,
      "activo": true,
      "children_recursive": [
        {
          "id": 2,
          "codigo": "1.1",
          "nombre": "ACTIVO CORRIENTE",
          "tipo": "activo",
          "nivel": 2,
          "es_detalle": false,
          "children_recursive": [
            {
              "id": 3,
              "codigo": "1.1.01",
              "nombre": "Caja",
              "tipo": "activo",
              "nivel": 3,
              "es_detalle": true,
              "children_recursive": []
            }
          ]
        }
      ]
    }
  ]
}
```

### 1.2 Listar cuentas de detalle (para selects)

**GET** `/api/cuenta-contables/lista`

Retorna solo cuentas de detalle (es_detalle=true, activo=true). Ideal para dropdowns.

**Response 200:**
```json
{
  "data": [
    { "id": 3, "codigo": "1.1.01", "nombre": "Caja", "tipo": "activo", "naturaleza": "deudora" },
    { "id": 4, "codigo": "1.1.02", "nombre": "Bancos", "tipo": "activo", "naturaleza": "deudora" },
    { "id": 5, "codigo": "1.1.03", "nombre": "Cuentas por Cobrar", "tipo": "activo", "naturaleza": "deudora" },
    ...
  ]
}
```

### 1.3 Crear cuenta contable

**POST** `/api/cuenta-contables`

**Request Body:**
```json
{
  "codigo": "5.1.08",
  "nombre": "Publicidad y Marketing",
  "tipo": "gasto",
  "naturaleza": "deudora",
  "parent_id": 33,
  "nivel": 3,
  "es_detalle": true
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `codigo` | string(20) | Si | Codigo unico (ej: "1.1.01") |
| `nombre` | string(200) | Si | Nombre de la cuenta |
| `tipo` | enum | Si | `activo`, `pasivo`, `patrimonio`, `ingreso`, `gasto` |
| `naturaleza` | enum | Si | `deudora`, `acreedora` |
| `parent_id` | int/null | No | ID de la cuenta padre |
| `nivel` | int(1-5) | Si | Nivel jerarquico |
| `es_detalle` | boolean | Si | true = puede recibir movimientos |

**Response 201:**
```json
{
  "codigo": 201,
  "mensaje": "Cuenta contable creada correctamente",
  "data": { ... }
}
```

### 1.4 Ver cuenta contable

**GET** `/api/cuenta-contables/{id}`

**Response 200:**
```json
{
  "data": {
    "id": 3,
    "codigo": "1.1.01",
    "nombre": "Caja",
    "tipo": "activo",
    "naturaleza": "deudora",
    "parent_id": 2,
    "nivel": 3,
    "es_detalle": true,
    "activo": true,
    "parent": { "id": 2, "codigo": "1.1", "nombre": "ACTIVO CORRIENTE" },
    "children": []
  }
}
```

### 1.5 Editar cuenta contable

**PUT** `/api/cuenta-contables/{id}`

Acepta los mismos campos que crear (todos opcionales con `sometimes`).

### 1.6 Eliminar cuenta contable

**DELETE** `/api/cuenta-contables/{id}`

No permite eliminar si tiene movimientos contables o subcuentas.

**Response 422 (tiene movimientos):**
```json
{
  "codigo": 422,
  "mensaje": "No se puede eliminar: la cuenta tiene movimientos contables"
}
```

---

## 2. Asientos Contables

### 2.1 Listar asientos

**GET** `/api/asientos-contables`

**Query Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `fecha_desde` | date | Filtrar desde fecha |
| `fecha_hasta` | date | Filtrar hasta fecha |
| `tipo` | string | Filtrar por tipo: `manual`, `venta`, `gasto`, `retiro`, `credito`, `abono_credito`, `anulacion`, `ajuste`, `cierre` |
| `estado` | string | Filtrar por estado: `borrador`, `contabilizado`, `anulado` |
| `limite` | int | Registros por pagina (default: 50) |
| `page` | int | Pagina (paginacion Laravel) |

**Response 200:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "numero": 1,
      "fecha": "2026-02-15",
      "descripcion": "Venta - Factura #42",
      "tipo": "venta",
      "referencia_tipo": "factura",
      "referencia_id": 42,
      "estado": "contabilizado",
      "total_debe": "150.00",
      "total_haber": "150.00",
      "detalles_con_cuenta": [
        {
          "id": 1,
          "cuenta_contable_id": 3,
          "descripcion": "Cobro factura #42",
          "debe": "150.00",
          "haber": "0.00",
          "cuenta_contable": { "id": 3, "codigo": "1.1.01", "nombre": "Caja" }
        },
        {
          "id": 2,
          "cuenta_contable_id": 28,
          "descripcion": "Venta factura #42",
          "debe": "0.00",
          "haber": "133.93",
          "cuenta_contable": { "id": 28, "codigo": "4.1.01", "nombre": "Ventas de Productos" }
        },
        {
          "id": 3,
          "cuenta_contable_id": 15,
          "descripcion": "IVA factura #42",
          "debe": "0.00",
          "haber": "16.07",
          "cuenta_contable": { "id": 15, "codigo": "2.1.02", "nombre": "IVA en Ventas" }
        }
      ]
    }
  ],
  "total": 100,
  "per_page": 50,
  "last_page": 2
}
```

### 2.2 Crear asiento manual

**POST** `/api/asientos-contables`

**Request Body:**
```json
{
  "fecha": "2026-02-15",
  "descripcion": "Pago de arriendo del local - Febrero 2026",
  "usuario_id": 1,
  "lineas": [
    {
      "cuenta_contable_id": 38,
      "descripcion": "Arriendo febrero",
      "debe": 500.00,
      "haber": 0
    },
    {
      "cuenta_contable_id": 3,
      "descripcion": "Pago arriendo desde caja",
      "debe": 0,
      "haber": 500.00
    }
  ]
}
```

**Validaciones:**
- Minimo 2 lineas
- `total_debe` debe ser igual a `total_haber` (asiento cuadrado)
- Cada linea debe tener debe O haber, no ambos
- Cada linea debe tener al menos un valor > 0
- Las `cuenta_contable_id` deben existir en la tabla

**Response 201:**
```json
{
  "codigo": 201,
  "mensaje": "Asiento contable creado correctamente",
  "data": {
    "id": 5,
    "numero": 5,
    "fecha": "2026-02-15",
    "descripcion": "Pago de arriendo del local - Febrero 2026",
    "tipo": "manual",
    "estado": "borrador",
    "total_debe": "500.00",
    "total_haber": "500.00",
    "detalles_con_cuenta": [ ... ]
  }
}
```

**Response 422 (no cuadrado):**
```json
{
  "codigo": 422,
  "mensaje": "El asiento no esta cuadrado. Debe ($600.00) != Haber ($500.00)"
}
```

### 2.3 Ver asiento con detalles

**GET** `/api/asientos-contables/{id}`

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "numero": 1,
    "fecha": "2026-02-15",
    "descripcion": "Venta - Factura #42",
    "tipo": "venta",
    "referencia_tipo": "factura",
    "referencia_id": 42,
    "estado": "contabilizado",
    "usuario_id": 1,
    "total_debe": "150.00",
    "total_haber": "150.00",
    "detalles_con_cuenta": [ ... ]
  }
}
```

### 2.4 Editar asiento (solo borrador)

**PUT** `/api/asientos-contables/{id}`

Solo permite editar asientos en estado `borrador`. Si se envian `lineas`, se reemplazan todas las lineas existentes.

**Request Body:**
```json
{
  "fecha": "2026-02-16",
  "descripcion": "Descripcion actualizada",
  "lineas": [
    { "cuenta_contable_id": 38, "descripcion": "Linea 1", "debe": 300, "haber": 0 },
    { "cuenta_contable_id": 3, "descripcion": "Linea 2", "debe": 0, "haber": 300 }
  ]
}
```

**Response 422 (no es borrador):**
```json
{
  "codigo": 422,
  "mensaje": "Solo se pueden editar asientos en estado borrador"
}
```

### 2.5 Contabilizar asiento

**POST** `/api/asientos-contables/{id}/contabilizar`

Cambia el estado de `borrador` a `contabilizado`. Verifica que el asiento este cuadrado.

**Response 200:**
```json
{
  "codigo": 200,
  "mensaje": "Asiento contabilizado correctamente",
  "data": { ... }
}
```

### 2.6 Anular asiento

**POST** `/api/asientos-contables/{id}/anular`

Cambia el estado a `anulado`. Funciona desde `borrador` o `contabilizado`.

**Response 200:**
```json
{
  "codigo": 200,
  "mensaje": "Asiento anulado correctamente",
  "data": { ... }
}
```

---

## 3. Generacion Automatica de Asientos

Estos endpoints generan asientos contables a partir de documentos existentes en el sistema. Se crean en estado `contabilizado` automaticamente.

### 3.1 Desde factura

**POST** `/api/asientos-contables/generar/desde-factura/{id}`

Genera el asiento de venta. Detecta automaticamente si es venta de contado o a credito:

**Venta de contado:**
```
DEBE: 1.1.01 Caja              $total
HABER: 4.1.01 Ventas           $subtotal
HABER: 2.1.02 IVA en Ventas    $iva
```

**Venta a credito:**
```
DEBE: 1.1.03 Cuentas por Cobrar  $total
HABER: 4.1.01 Ventas             $subtotal
HABER: 2.1.02 IVA en Ventas      $iva
```

**Response 422 (ya existe):**
```json
{
  "codigo": 422,
  "mensaje": "Ya existe un asiento contable para esta factura (Asiento #3)"
}
```

### 3.2 Desde gasto

**POST** `/api/asientos-contables/generar/desde-gasto/{id}`

```
DEBE: 5.1.07 Gastos Generales  $monto
HABER: 1.1.01 Caja             $monto
```

### 3.3 Desde retiro

**POST** `/api/asientos-contables/generar/desde-retiro/{id}`

```
DEBE: 5.1.07 Gastos Generales  $valorRetiro
HABER: 1.1.01 Caja             $valorRetiro
```

---

## 4. Reportes Contables

### 4.1 Libro Diario

**POST** `/api/contabilidad/libro-diario`

Muestra todos los asientos contabilizados en un rango de fechas, con sus lineas de detalle.

**Request Body:**
```json
{
  "fecha_desde": "2026-02-01",
  "fecha_hasta": "2026-02-28"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "numero": 1,
      "fecha": "2026-02-15",
      "descripcion": "Venta - Factura #42",
      "tipo": "venta",
      "estado": "contabilizado",
      "total_debe": "150.00",
      "total_haber": "150.00",
      "detalles_con_cuenta": [ ... ]
    }
  ],
  "totales": {
    "total_debe": 5250.00,
    "total_haber": 5250.00
  },
  "periodo": {
    "desde": "2026-02-01",
    "hasta": "2026-02-28"
  }
}
```

### 4.2 Libro Mayor

**POST** `/api/contabilidad/libro-mayor`

Sin `cuenta_contable_id`: resumen de todas las cuentas con movimientos.
Con `cuenta_contable_id`: detalle de movimientos de esa cuenta.

**Request Body (resumen):**
```json
{
  "fecha_desde": "2026-02-01",
  "fecha_hasta": "2026-02-28"
}
```

**Response 200 (resumen):**
```json
{
  "data": [
    {
      "cuenta_contable_id": 3,
      "codigo": "1.1.01",
      "nombre": "Caja",
      "naturaleza": "deudora",
      "total_debe": 3500.00,
      "total_haber": 1200.00,
      "saldo": 2300.00
    },
    {
      "cuenta_contable_id": 28,
      "codigo": "4.1.01",
      "nombre": "Ventas de Productos",
      "naturaleza": "acreedora",
      "total_debe": 0,
      "total_haber": 3125.00,
      "saldo": 3125.00
    }
  ],
  "periodo": { "desde": "2026-02-01", "hasta": "2026-02-28" }
}
```

**Request Body (detalle por cuenta):**
```json
{
  "fecha_desde": "2026-02-01",
  "fecha_hasta": "2026-02-28",
  "cuenta_contable_id": 3
}
```

**Response 200 (detalle):**
```json
{
  "cuenta": {
    "cuenta_contable_id": 3,
    "codigo": "1.1.01",
    "nombre": "Caja",
    "naturaleza": "deudora",
    "total_debe": 3500.00,
    "total_haber": 1200.00,
    "saldo": 2300.00
  },
  "movimientos": [
    {
      "id": 1,
      "asiento_contable_id": 1,
      "descripcion": "Cobro factura #42",
      "debe": "150.00",
      "haber": "0.00",
      "numero": 1,
      "fecha": "2026-02-15",
      "asiento_descripcion": "Venta - Factura #42"
    }
  ],
  "periodo": { "desde": "2026-02-01", "hasta": "2026-02-28" }
}
```

### 4.3 Balance de Comprobacion

**POST** `/api/contabilidad/balance-comprobacion`

Muestra sumas y saldos de todas las cuentas con movimientos.

**Request Body:**
```json
{
  "fecha_desde": "2026-01-01",
  "fecha_hasta": "2026-02-28"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "cuenta_contable_id": 3,
      "codigo": "1.1.01",
      "nombre": "Caja",
      "tipo": "activo",
      "naturaleza": "deudora",
      "total_debe": 5000.00,
      "total_haber": 2000.00,
      "saldo": 3000.00,
      "saldo_debe": 3000.00,
      "saldo_haber": 0
    },
    {
      "cuenta_contable_id": 28,
      "codigo": "4.1.01",
      "nombre": "Ventas de Productos",
      "tipo": "ingreso",
      "naturaleza": "acreedora",
      "total_debe": 100.00,
      "total_haber": 4500.00,
      "saldo": 4400.00,
      "saldo_debe": 0,
      "saldo_haber": 4400.00
    }
  ],
  "totales": {
    "total_debe": 10000.00,
    "total_haber": 10000.00,
    "saldo_debe": 5000.00,
    "saldo_haber": 5000.00
  },
  "periodo": { "desde": "2026-01-01", "hasta": "2026-02-28" }
}
```

### 4.4 Balance General

**POST** `/api/contabilidad/balance-general`

Muestra activos, pasivos y patrimonio al corte de una fecha.

**Request Body:**
```json
{
  "fecha_hasta": "2026-02-28"
}
```

**Response 200:**
```json
{
  "activos": [
    { "codigo": "1.1.01", "nombre": "Caja", "saldo": 3000.00 },
    { "codigo": "1.1.03", "nombre": "Cuentas por Cobrar", "saldo": 500.00 },
    { "codigo": "1.1.04", "nombre": "Inventario de Mercaderias", "saldo": 8000.00 }
  ],
  "pasivos": [
    { "codigo": "2.1.02", "nombre": "IVA en Ventas", "saldo": 600.00 }
  ],
  "patrimonio": [
    { "codigo": "3.1.01", "nombre": "Capital Social", "saldo": 10000.00 }
  ],
  "totales": {
    "activos": 11500.00,
    "pasivos": 600.00,
    "patrimonio": 10000.00,
    "pasivos_patrimonio": 10600.00
  },
  "fecha_corte": "2026-02-28"
}
```

### 4.5 Estado de Resultados

**POST** `/api/contabilidad/estado-resultados`

Muestra ingresos, gastos y utilidad neta en un periodo.

**Request Body:**
```json
{
  "fecha_desde": "2026-02-01",
  "fecha_hasta": "2026-02-28"
}
```

**Response 200:**
```json
{
  "ingresos": [
    { "codigo": "4.1.01", "nombre": "Ventas de Productos", "saldo": 4500.00 },
    { "codigo": "4.1.02", "nombre": "Ingresos por Servicios Tecnicos", "saldo": 800.00 }
  ],
  "gastos": [
    { "codigo": "5.1.01", "nombre": "Costo de Ventas", "saldo": 2000.00 },
    { "codigo": "5.1.04", "nombre": "Arriendo", "saldo": 500.00 },
    { "codigo": "5.1.07", "nombre": "Gastos Generales", "saldo": 300.00 }
  ],
  "totales": {
    "ingresos": 5300.00,
    "gastos": 2800.00,
    "utilidad_neta": 2500.00
  },
  "periodo": { "desde": "2026-02-01", "hasta": "2026-02-28" }
}
```

---

## Plan de Cuentas Predeterminado

El seeder `CuentaContableSeeder` crea las siguientes cuentas:

| Codigo | Nombre | Tipo | Naturaleza | Detalle |
|--------|--------|------|------------|---------|
| **1** | **ACTIVOS** | activo | deudora | No |
| 1.1 | ACTIVO CORRIENTE | activo | deudora | No |
| 1.1.01 | Caja | activo | deudora | Si |
| 1.1.02 | Bancos | activo | deudora | Si |
| 1.1.03 | Cuentas por Cobrar | activo | deudora | Si |
| 1.1.04 | Inventario de Mercaderias | activo | deudora | Si |
| 1.1.05 | IVA en Compras (Credito Tributario) | activo | deudora | Si |
| 1.2 | ACTIVO NO CORRIENTE | activo | deudora | No |
| 1.2.01 | Equipos y Maquinaria | activo | deudora | Si |
| 1.2.02 | Muebles y Enseres | activo | deudora | Si |
| 1.2.03 | (-) Depreciacion Acumulada | activo | acreedora | Si |
| **2** | **PASIVOS** | pasivo | acreedora | No |
| 2.1 | PASIVO CORRIENTE | pasivo | acreedora | No |
| 2.1.01 | Cuentas por Pagar | pasivo | acreedora | Si |
| 2.1.02 | IVA en Ventas | pasivo | acreedora | Si |
| 2.1.03 | Retenciones por Pagar | pasivo | acreedora | Si |
| 2.1.04 | Sueldos por Pagar | pasivo | acreedora | Si |
| 2.2 | PASIVO NO CORRIENTE | pasivo | acreedora | No |
| 2.2.01 | Prestamos Bancarios | pasivo | acreedora | Si |
| **3** | **PATRIMONIO** | patrimonio | acreedora | No |
| 3.1 | CAPITAL | patrimonio | acreedora | No |
| 3.1.01 | Capital Social | patrimonio | acreedora | Si |
| 3.1.02 | Resultados del Ejercicio | patrimonio | acreedora | Si |
| 3.1.03 | Resultados Acumulados | patrimonio | acreedora | Si |
| **4** | **INGRESOS** | ingreso | acreedora | No |
| 4.1 | INGRESOS OPERACIONALES | ingreso | acreedora | No |
| 4.1.01 | Ventas de Productos | ingreso | acreedora | Si |
| 4.1.02 | Ingresos por Servicios Tecnicos | ingreso | acreedora | Si |
| 4.2 | INGRESOS NO OPERACIONALES | ingreso | acreedora | No |
| 4.2.01 | Otros Ingresos | ingreso | acreedora | Si |
| **5** | **GASTOS** | gasto | deudora | No |
| 5.1 | GASTOS OPERACIONALES | gasto | deudora | No |
| 5.1.01 | Costo de Ventas | gasto | deudora | Si |
| 5.1.02 | Sueldos y Salarios | gasto | deudora | Si |
| 5.1.03 | Servicios Basicos | gasto | deudora | Si |
| 5.1.04 | Arriendo | gasto | deudora | Si |
| 5.1.05 | Suministros de Oficina | gasto | deudora | Si |
| 5.1.06 | Depreciaciones | gasto | deudora | Si |
| 5.1.07 | Gastos Generales | gasto | deudora | Si |
| 5.2 | GASTOS NO OPERACIONALES | gasto | deudora | No |
| 5.2.01 | Gastos Financieros | gasto | deudora | Si |
| 5.2.02 | Otros Gastos | gasto | deudora | Si |

---

## Flujo de Trabajo Frontend

### 1. Pantalla Plan de Cuentas
- Cargar arbol: `GET /api/cuenta-contables`
- CRUD de cuentas con los endpoints 3, 4, 5, 6

### 2. Pantalla Asientos Contables
- Listar: `GET /api/asientos-contables?fecha_desde=...&fecha_hasta=...`
- Crear manual: formulario con fecha, descripcion, y tabla de lineas (cuenta, descripcion, debe, haber)
- Ver detalle: `GET /api/asientos-contables/{id}`
- Contabilizar/Anular con los botones de accion

### 3. Generacion automatica (botones en otras pantallas)
- En historial de facturas: boton "Generar asiento" → `POST /api/asientos-contables/generar/desde-factura/{id}`
- En gastos: boton "Generar asiento" → `POST /api/asientos-contables/generar/desde-gasto/{id}`
- En retiros: boton "Generar asiento" → `POST /api/asientos-contables/generar/desde-retiro/{id}`

### 4. Pantalla Reportes Contables
- Seleccionar tipo de reporte y rango de fechas
- Libro diario, Libro mayor, Balance de comprobacion, Balance general, Estado de resultados

### Tipos de asiento (para filtros)
| Valor | Descripcion |
|-------|-------------|
| `manual` | Creado manualmente |
| `venta` | Generado desde factura (contado) |
| `credito` | Generado desde factura (credito) |
| `abono_credito` | Generado desde abono a credito |
| `gasto` | Generado desde gasto |
| `retiro` | Generado desde retiro de caja |
| `anulacion` | Generado desde anulacion de factura |
| `ajuste` | Asiento de ajuste |
| `cierre` | Asiento de cierre de periodo |

### Estados de asiento
| Estado | Descripcion | Editable |
|--------|-------------|----------|
| `borrador` | Recien creado, pendiente de revision | Si |
| `contabilizado` | Aprobado, afecta reportes | No |
| `anulado` | Cancelado, no afecta reportes | No |
