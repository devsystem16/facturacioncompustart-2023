# ESPECIFICACION TECNICA — Sub-modulo Utilidad de Productos

**Proyecto:** CompuServices POS | **Fecha:** 14/02/2026 | **Version:** 2.0
**Estado:** Implementado en Frontend (sub-modulo de Productos) — Pendiente Backend

---

## 1. Resumen del Modulo

El sub-modulo **Utilidad** vive como pestaña dentro de Productos (`/app/products`, Tab 1). Permite visualizar la rentabilidad de cada producto en inventario, calculando automaticamente la utilidad unitaria y total basandose en precios de venta, costos de compra y stock disponible. Incluye filtros por bodega, busqueda general, paginacion y exportacion a Excel.

---

## 2. Ruta y Acceso

| Concepto | Valor |
|----------|-------|
| **Ruta frontend** | `/app/products` (pestaña "Utilidad") |
| **Ubicacion** | Sub-modulo dentro de Productos, Tab index 1 |
| **Acceso controlado por** | Mismo acceso que Productos |

> **Nota:** La ruta standalone `/app/utilidad-productos` fue eliminada. El modulo ahora es una pestaña dentro de Productos.

---

## 3. Campos de Base de Datos

Los campos reales de la tabla `productos` en la BD son:

| Campo BD | Descripcion | Uso en el modulo |
|----------|-------------|------------------|
| `precio_publico` | Precio de venta principal | Columna "P. Publico" |
| `precio_tecnico` | Precio tecnico | Columna "P. Tecnico" |
| `precio_distribuidor` | Precio mayorista | Columna "P. Mayorista" |
| `precio_compra` | Costo de adquisicion | Columna "P. Compra" |
| `codigo_barra` | Codigo del producto | Columna "Codigo" |
| `stock` | Unidades en inventario | Columna "#Stock" |
| `nombre` | Nombre del producto | Columna "Nombre" |

---

## 4. Archivos Frontend

| Archivo | Descripcion |
|---------|-------------|
| `src/views/product/ProductListView/index.js` | Vista principal con Tabs (Productos / Utilidad) |
| `src/views/product/ProductListView/TabUtilidad.js` | Componente de utilidad con filtros, tabla paginada y totales |
| `src/context/UtilidadProductosContext.js` | Context provider con llamadas API (listar, exportar, bodegas) |
| `src/index.js` | Provider `UtilidadProductosProvider` registrado |

---

## 5. Endpoints API Requeridos (Backend Laravel)

### 5.1 GET `/api/utilidad-productos`

Retorna la lista paginada de productos con campos calculados de utilidad.

**Parametros Query:**

| Parametro | Tipo | Requerido | Default | Descripcion |
|-----------|------|-----------|---------|-------------|
| `bodega_id` | integer | No | null (todos) | Filtra por bodega especifica |
| `search` | string | No | null | Busqueda parcial en `codigo_barra` y `nombre` |
| `per_page` | integer | No | 25 | Registros por pagina |
| `page` | integer | No | 1 | Pagina actual |

**Respuesta esperada (JSON):**

```json
{
  "data": [
    {
      "id": 10098,
      "codigo_barra": "1555FERT",
      "nombre": "18-46-0 @",
      "precio_publico": 0.695652,
      "precio_tecnico": 0.80,
      "precio_distribuidor": 0.00,
      "stock": 82,
      "precio_compra": 0.40,
      "costo_total": 32.80,
      "utilidad_unitaria": 0.295652,
      "utilidad_total": 24.24
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 150
  },
  "totales": {
    "total_costo": 125890.50,
    "total_utilidad": 45230.75,
    "total_stock": 5420
  }
}
```

**Campos calculados (NO almacenados en BD, calculados en la query):**

| Campo | Formula | Descripcion |
|-------|---------|-------------|
| `costo_total` | `precio_compra * stock` | Costo total del inventario |
| `utilidad_unitaria` | `precio_publico - precio_compra` | Ganancia por unidad |
| `utilidad_total` | `(precio_publico - precio_compra) * stock` | Ganancia potencial total |

**Query sugerida (Eloquent):**

```php
$productos = Producto::query()
    ->select([
        'id', 'codigo_barra', 'nombre',
        'precio_publico', 'precio_tecnico', 'precio_distribuidor',
        'stock', 'precio_compra',
        DB::raw('precio_compra * stock as costo_total'),
        DB::raw('(precio_publico - precio_compra) as utilidad_unitaria'),
        DB::raw('(precio_publico - precio_compra) * stock as utilidad_total'),
    ])
    ->when($request->bodega_id, fn($q, $bodegaId) => $q->where('bodega_id', $bodegaId))
    ->when($request->search, fn($q, $search) => $q->where(function($q) use ($search) {
        $q->where('codigo_barra', 'LIKE', "%{$search}%")
          ->orWhere('nombre', 'LIKE', "%{$search}%");
    }))
    ->whereNull('deleted_at')
    ->paginate($request->per_page ?? 25);
```

**Respuesta con totales generales:**

```php
// Calcular totales con los mismos filtros (sin paginar)
$query = Producto::query()
    ->when($request->bodega_id, fn($q, $bodegaId) => $q->where('bodega_id', $bodegaId))
    ->when($request->search, fn($q, $search) => $q->where(function($q) use ($search) {
        $q->where('codigo_barra', 'LIKE', "%{$search}%")
          ->orWhere('nombre', 'LIKE', "%{$search}%");
    }))
    ->whereNull('deleted_at');

$totales = [
    'total_stock' => $query->sum('stock'),
    'total_costo' => $query->sum(DB::raw('precio_compra * stock')),
    'total_utilidad' => $query->sum(DB::raw('(precio_publico - precio_compra) * stock')),
];

return response()->json([
    'data' => $productos->items(),
    'meta' => [
        'current_page' => $productos->currentPage(),
        'per_page' => $productos->perPage(),
        'total' => $productos->total(),
    ],
    'totales' => $totales,
]);
```

---

### 5.2 GET `/api/utilidad-productos/export-excel`

Descarga un archivo `.xlsx` con los datos filtrados.

**Parametros Query:**

| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| `bodega_id` | integer | No | Filtra por bodega |
| `search` | string | No | Busqueda parcial en codigo_barra/nombre |

**Respuesta:** Archivo binario `.xlsx` con headers:
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="utilidad_productos.xlsx"
```

**Contenido del Excel:**

| Fila | Contenido |
|------|-----------|
| 1 | Titulo: "Utilidad de Productos" |
| 2 | Bodega: "[nombre bodega o Todas]" — Fecha: "[fecha generacion]" |
| 3 | Fila vacia |
| 4 | Encabezados: Id, Codigo, Nombre, P. Publico, P. Tecnico, P. Mayorista, Stock, P. Compra, Costo Total, Utilidad Unitaria, Utilidad Total |
| 5..N | Datos de productos |
| N+1 | **Fila de totales:** Suma de Stock, Costo Total, Utilidad Total |

**Formato condicional:**
- Utilidades negativas en rojo
- Paquete recomendado: `maatwebsite/excel`

---

### 5.3 GET `/api/bodegas`

Retorna la lista de bodegas activas para el dropdown de filtro.

**Respuesta esperada:**

```json
{
  "data": [
    { "id": 1, "nombre": "Bodega Principal" },
    { "id": 2, "nombre": "Bodega Secundaria" }
  ]
}
```

---

## 6. Estructura Visual del Frontend

```
+----------------------------------------------------------------+
| [Tab: Productos] [Tab: Utilidad]                                |
+----------------------------------------------------------------+
| [Buscar por codigo o nombre...] [Bodega: Todos v] [Exportar]   |
+----------------------------------------------------------------+
| Total Stock    | Total Costo Inventario | Total Utilidad        |
| 5,420          | $125,890.50            | $45,230.75            |
+----------------------------------------------------------------+
| Id | Codigo | Nombre | P.Pub | P.Tec | P.May | Stock | P.Com | CT | UU | UT |
|----|--------|--------|-------|-------|-------|-------|-------|----|----|----|
| 01 | ABC123 | Prod1  | $1.50 | $2.00 | $0.00 | 100   | 0.80  | 80 |0.70| 70 |
| 02 | DEF456 | Prod2  | $0.50 | $1.00 | $0.00 |  50   | 0.70  | 35 |-0.2|-10 |  <- ROJO
+----------------------------------------------------------------+
|           < Pagina 1 de 6 (150 registros) >                    |
+----------------------------------------------------------------+
```

### Comportamiento visual:

- **Encabezado tabla:** Fondo azul oscuro (#1a237e) con texto blanco
- **Filas alternadas:** Blanco / gris claro (#f5f6fa)
- **Utilidad positiva:** Color verde (#388e3c), negrita
- **Utilidad negativa:** Color rojo (#d32f2f), negrita
- **Boton Exportar:** Fondo verde (#43a047)
- **Columnas numericas:** Alineadas a la derecha
- **Columnas texto:** Alineadas a la izquierda
- **Ordenamiento:** Click en encabezado para ordenar ASC/DESC

### Tarjetas de resumen:

| Tarjeta | Color |
|---------|-------|
| Total Stock | Azul (#1e88e5) |
| Total Costo Inventario | Indigo (#3949ab) |
| Total Utilidad | Verde (#43a047) si positivo, Rojo (#e53935) si negativo |

---

## 7. Checklist de Implementacion Backend

- [ ] Verificar campos `precio_publico`, `precio_tecnico`, `precio_distribuidor`, `precio_compra`, `codigo_barra` en tabla `productos`
- [ ] Crear endpoint `GET /api/bodegas` si no existe
- [ ] Crear `UtilidadProductoController` con metodos `index()` y `exportExcel()`
- [ ] Crear `UtilidadProductosExport` para exportacion Excel
- [ ] Registrar rutas en `routes/api.php`
- [ ] Instalar `maatwebsite/excel` si no esta instalado
- [ ] Probar endpoints con Postman/Insomnia

---

*CompuServices — Sistema POS — compustar.top*
