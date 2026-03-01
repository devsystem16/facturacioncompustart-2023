# DOCUMENTO DE REQUERIMIENTO
## Módulo Utilidad de Productos — Sistema POS CompuServices

**Proyecto:** compuservices-facturacion-back | **Fecha:** 14/02/2026 | **Versión:** 1.0

---

## 1. Objetivo

Implementar un módulo de **Utilidad de Productos** dentro del sistema POS de CompuServices que permita visualizar la rentabilidad de cada producto en inventario, calculando automáticamente la utilidad unitaria y total basándose en los precios de venta, costos unitarios y stock disponible, con filtros por bodega y búsqueda general, y exportación a Excel.

---

## 2. Alcance

- **Backend:** API REST en Laravel (compuservices-facturacion-back)
- **Frontend:** Vista de consulta con filtros y tabla de utilidad
- **Base de datos:** Consultas sobre tablas existentes de productos y bodegas (no se requieren nuevas tablas, solo posibles campos adicionales)
- **Exportación:** Descarga de datos filtrados en formato Excel (.xlsx)

---

## 3. Estructura de Datos

### 3.1 Campos requeridos en la tabla `productos` (verificar/agregar si no existen)

| # | Campo | Tipo | Descripción |
|---|-------|------|-------------|
| 1 | id | INT (autoincrement) | Identificador único del producto |
| 2 | codigo | VARCHAR | Código interno del producto |
| 3 | nombre | VARCHAR | Nombre o descripción del producto |
| 4 | precio | DECIMAL(10,2) | Precio de venta principal (PVP) |
| 5 | precio2 | DECIMAL(10,2) | Precio de venta secundario (mayorista, etc.) |
| 6 | precio3 | DECIMAL(10,2) | Precio de venta terciario (especial, etc.) |
| 7 | stock | INT | Cantidad disponible en inventario |
| 8 | costo_unitario | DECIMAL(10,4) | Costo de adquisición por unidad |
| 9 | bodega_id | INT (FK) | Bodega a la que pertenece el stock |

### 3.2 Campos calculados (NO se almacenan, se calculan en la consulta)

| Campo | Fórmula | Descripción |
|-------|---------|-------------|
| **Costo Total** | `costo_unitario × stock` | Costo total del inventario de ese producto |
| **Utilidad Unitaria** | `precio - costo_unitario` | Ganancia por cada unidad vendida |
| **Utilidad Total** | `utilidad_unitaria × stock` | Ganancia potencial total del stock disponible |

---

## 4. Filtros y Búsqueda

La vista debe incluir los siguientes controles de filtrado en la parte superior:

| Filtro | Tipo de Control | Comportamiento |
|--------|----------------|----------------|
| Búsqueda General | Text Input + Botón buscar | Busca en: código, nombre del producto |
| Bodega | Select/Dropdown | Opciones: "Todos" (default) + lista dinámica de bodegas activas |
| Exportar | Botón | Descarga Excel con los filtros aplicados |

### Reglas de filtrado:

- Todos los filtros son opcionales y combinables entre sí.
- Si se selecciona "Todos" en bodega, se muestran productos de todas las bodegas.
- La búsqueda general busca por coincidencia parcial en: código y nombre.
- Los resultados deben estar paginados (ej: 25 registros por página).
- Los productos con stock 0 pueden mostrarse opcionalmente (considerar un toggle o incluirlos por defecto).

---

## 5. Columnas de la Tabla (Vista Frontend)

La tabla debe mostrar las siguientes columnas en este orden:

| # | Columna | Origen | Formato |
|---|---------|--------|---------|
| 1 | **Id** | productos.id | Numérico |
| 2 | **Código** | productos.codigo | Texto |
| 3 | **Nombre** | productos.nombre | Texto |
| 4 | **Precio** | productos.precio | Moneda ($X.XX) |
| 5 | **Precio2** | productos.precio2 | Moneda ($X.XX) |
| 6 | **Precio3** | productos.precio3 | Moneda ($X.XX) |
| 7 | **#Stock** | productos.stock | Numérico entero |
| 8 | **Costo Unitario** | productos.costo_unitario | Decimal (2 decimales) |
| 9 | **Costo Total** | `costo_unitario × stock` | Decimal (2 decimales) |
| 10 | **Utilidad Unitaria** | `precio - costo_unitario` | Decimal (2 decimales, puede ser negativo) |
| 11 | **Utilidad Total** | `(precio - costo_unitario) × stock` | Decimal (2 decimales, puede ser negativo) |

### Consideraciones de la tabla:

- **Utilidad negativa:** Si el costo unitario es mayor al precio de venta, la utilidad debe mostrarse en **rojo** (valor negativo), indicando pérdida.
- **Utilidad positiva:** Mostrar en color normal o **verde**.
- **Ordenamiento:** Permitir ordenar por cualquier columna haciendo clic en el encabezado.

---

## 6. Endpoints API (Backend Laravel)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/utilidad-productos` | Listar productos con cálculos de utilidad (filtros: bodega_id, search, paginado) |
| GET | `/api/utilidad-productos/export-excel` | Exportar productos filtrados a Excel (.xlsx) |

### 6.1 Parámetros del endpoint GET /api/utilidad-productos:

- **bodega_id** (integer, opcional): ID de la bodega a filtrar. Si no se envía o es "todos", retorna todas las bodegas.
- **search** (string, opcional): Búsqueda libre en código y nombre del producto.
- **per_page** (integer, opcional, default 25): Registros por página.
- **page** (integer, opcional, default 1): Página actual.

### 6.2 Ejemplo de respuesta JSON:

```json
{
  "data": [
    {
      "id": 10098,
      "codigo": "1555FERT",
      "nombre": "18-46-0 @",
      "precio": 0.695652,
      "precio2": 0.80,
      "precio3": 0.00,
      "stock": 82,
      "costo_unitario": 0.40,
      "costo_total": 32.80,
      "utilidad_unitaria": 0.30,
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

---

## 7. Lógica de Cálculo en el Backend

### Query sugerida (Eloquent / Query Builder):

```php
$productos = Producto::query()
    ->select([
        'id', 'codigo', 'nombre', 
        'precio', 'precio2', 'precio3',
        'stock', 'costo_unitario',
        DB::raw('costo_unitario * stock as costo_total'),
        DB::raw('(precio - costo_unitario) as utilidad_unitaria'),
        DB::raw('(precio - costo_unitario) * stock as utilidad_total'),
    ])
    ->when($request->bodega_id, fn($q, $bodegaId) => $q->where('bodega_id', $bodegaId))
    ->when($request->search, fn($q, $search) => $q->where(function($q) use ($search) {
        $q->where('codigo', 'LIKE', "%{$search}%")
          ->orWhere('nombre', 'LIKE', "%{$search}%");
    }))
    ->whereNull('deleted_at')
    ->paginate($request->per_page ?? 25);
```

---

## 8. Exportación a Excel

Al hacer clic en el botón **"Exportar"**, el sistema debe generar un archivo .xlsx con:

- **Encabezado:** Nombre del reporte ("Utilidad de Productos"), bodega seleccionada, fecha de generación.
- **Todas las columnas** visibles en la tabla (Id, Código, Nombre, Precio, Precio2, Precio3, Stock, Costo Unitario, Costo Total, Utilidad Unitaria, Utilidad Total).
- **Fila de totales al final:** Suma de Stock, Costo Total, Utilidad Total.
- **Formato condicional:** Utilidades negativas en rojo.
- **Paquete recomendado:** `maatwebsite/excel`.

---

## 9. Vista Frontend (Referencia Visual)

La vista debe replicar el diseño de la imagen de referencia proporcionada:

1. **Barra de filtros superior** con:
   - Campo de búsqueda con botón de lupa (buscar)
   - Selector de Bodega (dropdown con "Todos" como default)
   - Botón "Exportar" en color verde

2. **Tabla de datos** con:
   - Encabezado azul oscuro con texto blanco
   - Filas alternadas (blanco/gris claro)
   - Columnas alineadas: textos a la izquierda, números a la derecha
   - Valores negativos visualmente diferenciados (rojo)

3. **Paginación** en la parte inferior

---

## 10. Consideraciones Técnicas

1. Los campos calculados (`costo_total`, `utilidad_unitaria`, `utilidad_total`) **no se almacenan** en la base de datos; se calculan en tiempo de consulta con `DB::raw()`.
2. Si los campos `precio2` y `precio3` no existen actualmente en la tabla productos, se deben crear con una migración.
3. Si el campo `costo_unitario` no existe, se debe crear con una migración.
4. El módulo debe estar protegido por autenticación y permisos (middleware `auth:sanctum` o el que use el proyecto).
5. Los precios deben mostrarse con el símbolo `$` en el frontend.
6. Repositorio: `https://github.com/devsystem16/compuservices-facturacion-back.git` (rama master).
7. Deploy automático con webhook de Hostinger + `php artisan migrate --force`.

---

## 11. Archivos a Crear/Modificar (Estimación)

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `app/Http/Controllers/UtilidadProductoController.php` | Crear | Controller con index() y exportExcel() |
| `app/Exports/UtilidadProductosExport.php` | Crear | Clase de exportación Excel |
| `routes/api.php` | Modificar | Agregar rutas del módulo |
| `database/migrations/xxxx_add_precios_to_productos.php` | Crear (si aplica) | Migración para precio2, precio3, costo_unitario |

---

*CompuServices — Sistema POS — compustar.top*
