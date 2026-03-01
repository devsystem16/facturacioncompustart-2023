# API Kardex - Documentacion para Frontend

**Base URL:** `/api`

---

## 1. BODEGAS

### 1.1 Listar bodegas activas

```
GET /api/bodegas
```

**Respuesta exitosa (200):**

```json
[
  {
    "id": 1,
    "nombre": "Principal",
    "direccion": "Av. Principal 123",
    "estado": true,
    "created_at": "2026-02-14T10:00:00.000000Z",
    "updated_at": "2026-02-14T10:00:00.000000Z"
  }
]
```

> Usar para poblar el dropdown de filtro de bodega en el Kardex.

---

### 1.2 Crear bodega

```
POST /api/bodegas
```

**Body (JSON):**

| Campo      | Tipo   | Requerido | Descripcion                     |
|------------|--------|-----------|---------------------------------|
| nombre     | string | Si        | Nombre de la bodega (max 100)   |
| direccion  | string | No        | Direccion fisica                |

**Ejemplo:**

```json
{
  "nombre": "Sucursal Norte",
  "direccion": "Calle 10 y Av. Amazonas"
}
```

**Respuesta (200):**

```json
{
  "codigo": 200,
  "mensaje": "Bodega creada correctamente.",
  "bodega": {
    "id": 2,
    "nombre": "Sucursal Norte",
    "direccion": "Calle 10 y Av. Amazonas",
    "estado": true,
    "created_at": "2026-02-14T10:00:00.000000Z",
    "updated_at": "2026-02-14T10:00:00.000000Z"
  }
}
```

---

### 1.3 Editar bodega

```
PUT /api/bodegas/{id}
```

**Body (JSON):**

| Campo      | Tipo    | Requerido | Descripcion                        |
|------------|---------|-----------|------------------------------------|
| nombre     | string  | Si        | Nombre de la bodega (max 100)      |
| direccion  | string  | No        | Direccion fisica                   |
| estado     | boolean | No        | true = activa, false = inactiva    |

**Ejemplo:**

```json
{
  "nombre": "Sucursal Norte Actualizada",
  "direccion": "Calle 15 y Av. Amazonas",
  "estado": true
}
```

**Respuesta (200):**

```json
{
  "codigo": 200,
  "mensaje": "Bodega actualizada correctamente.",
  "bodega": { ... }
}
```

---

### 1.4 Eliminar bodega (soft delete)

```
DELETE /api/bodegas/{id}
```

**Respuesta (200):**

```json
{
  "codigo": 200,
  "mensaje": "Bodega eliminada correctamente."
}
```

---

## 2. KARDEX - CONSULTA Y FILTROS

### 2.1 Listar movimientos con filtros

```
GET /api/kardex
```

**Query Parameters:**

| Parametro    | Tipo    | Requerido | Default        | Descripcion                                              |
|--------------|---------|-----------|----------------|----------------------------------------------------------|
| fecha_inicio | date    | No        | 1er dia del mes| Fecha inicio del rango (YYYY-MM-DD)                      |
| fecha_fin    | date    | No        | Hoy            | Fecha fin del rango (YYYY-MM-DD)                         |
| tipo         | string  | No        | todos          | Valores: `todos`, `entradas`, `salidas`                  |
| bodega_id    | integer | No        | -              | ID de la bodega a filtrar                                |
| producto_id  | integer | No        | -              | ID del producto especifico                               |
| search       | string  | No        | -              | Busqueda en: codigo, producto, detalle, referencia, usuario |
| per_page     | integer | No        | 25             | Registros por pagina                                     |
| page         | integer | No        | 1              | Pagina actual                                            |

**Ejemplo de llamada:**

```
GET /api/kardex?fecha_inicio=2026-02-01&fecha_fin=2026-02-14&tipo=salidas&bodega_id=1&per_page=25&page=1
```

**Respuesta exitosa (200):**

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 15,
      "fecha": "2026-02-14 14:30:00",
      "codigo": "7501234567890",
      "producto": "Mouse Logitech G203",
      "bodega_id": 1,
      "detalle": "Factura #45",
      "tipo": "Ventas",
      "entrada": "0.00",
      "salida": "2.00",
      "saldo": "8.00",
      "costo_unitario": "12.5000",
      "costo_total": "25.0000",
      "usuario": "admin",
      "referencia": "FAC-45",
      "producto_id": 3,
      "created_at": "2026-02-14T14:30:00.000000Z",
      "updated_at": "2026-02-14T14:30:00.000000Z",
      "bodega": {
        "id": 1,
        "nombre": "Principal"
      }
    }
  ],
  "first_page_url": "/api/kardex?page=1",
  "from": 1,
  "last_page": 3,
  "last_page_url": "/api/kardex?page=3",
  "next_page_url": "/api/kardex?page=2",
  "path": "/api/kardex",
  "per_page": 25,
  "prev_page_url": null,
  "to": 25,
  "total": 62
}
```

**Notas para el frontend:**
- Si no se envian fechas, el backend retorna movimientos del **mes actual**.
- La paginacion sigue el formato estandar de Laravel (`current_page`, `last_page`, `total`, `data`, etc.).
- Los campos `entrada` y `salida` son strings decimales (formatear a numero en frontend).

---

### 2.2 Detalle de un movimiento

```
GET /api/kardex/{id}
```

**Respuesta (200):**

```json
{
  "id": 15,
  "fecha": "2026-02-14 14:30:00",
  "codigo": "7501234567890",
  "producto": "Mouse Logitech G203",
  "bodega_id": 1,
  "detalle": "Factura #45",
  "tipo": "Ventas",
  "entrada": "0.00",
  "salida": "2.00",
  "saldo": "8.00",
  "costo_unitario": "12.5000",
  "costo_total": "25.0000",
  "usuario": "admin",
  "referencia": "FAC-45",
  "producto_id": 3,
  "bodega": {
    "id": 1,
    "nombre": "Principal"
  },
  "producto_relacion": {
    "id": 3,
    "nombre": "Mouse Logitech G203",
    "codigo_barra": "7501234567890",
    "stock": 8
  }
}
```

---

### 2.3 Exportar a Excel

```
GET /api/kardex/export-excel
```

**Query Parameters:** Los mismos filtros que el listado (2.1) **excepto** `per_page` y `page` (exporta todos los registros filtrados).

**Ejemplo:**

```
GET /api/kardex/export-excel?fecha_inicio=2026-02-01&fecha_fin=2026-02-14&tipo=todos&bodega_id=1
```

**Respuesta:** Descarga directa de archivo `.xlsx`

**Implementacion en frontend:**

```javascript
// Ejemplo con axios
const params = new URLSearchParams({
  fecha_inicio: '2026-02-01',
  fecha_fin: '2026-02-14',
  tipo: 'todos',
  bodega_id: 1
});

const response = await axios.get(`/api/kardex/export-excel?${params}`, {
  responseType: 'blob'
});

const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'kardex.xlsx');
document.body.appendChild(link);
link.click();
link.remove();
```

---

## 3. KARDEX - REGISTRO DE MOVIMIENTOS

### 3.1 Ajuste manual de inventario

```
POST /api/kardex/ajuste
```

**Body (JSON):**

| Campo       | Tipo    | Requerido | Descripcion                               |
|-------------|---------|-----------|-------------------------------------------|
| producto_id | integer | Si        | ID del producto                           |
| cantidad    | number  | Si        | Cantidad a ajustar (min 0.01)             |
| tipo_ajuste | string  | Si        | `positivo` (suma) o `negativo` (resta)    |
| detalle     | string  | No        | Motivo del ajuste                         |
| usuario     | string  | No        | Nombre del usuario que realiza el ajuste  |
| bodega_id   | integer | No        | ID de la bodega (default: Principal)      |

**Ejemplo:**

```json
{
  "producto_id": 3,
  "cantidad": 5,
  "tipo_ajuste": "positivo",
  "detalle": "Conteo fisico - diferencia encontrada",
  "usuario": "admin",
  "bodega_id": 1
}
```

**Respuesta (200):**

```json
{
  "codigo": 200,
  "mensaje": "Ajuste registrado correctamente.",
  "movimiento": {
    "id": 20,
    "fecha": "2026-02-14 15:00:00",
    "codigo": "7501234567890",
    "producto": "Mouse Logitech G203",
    "bodega_id": 1,
    "detalle": "Conteo fisico - diferencia encontrada",
    "tipo": "Ajuste",
    "entrada": 5,
    "salida": 0,
    "saldo": 13,
    "costo_unitario": 12.5,
    "costo_total": 62.5,
    "usuario": "admin",
    "referencia": null,
    "producto_id": 3
  }
}
```

---

### 3.2 Entrada manual (Compras, Fabricacion, Devolucion)

```
POST /api/kardex/entrada
```

**Body (JSON):**

| Campo       | Tipo    | Requerido | Descripcion                                            |
|-------------|---------|-----------|--------------------------------------------------------|
| producto_id | integer | Si        | ID del producto                                        |
| cantidad    | number  | Si        | Cantidad que ingresa (min 0.01)                        |
| tipo        | string  | Si        | `Compras`, `Fabricacion` o `Devolucion`                |
| detalle     | string  | No        | Descripcion del movimiento                             |
| referencia  | string  | No        | Numero de documento (orden de compra, nota, etc.)      |
| usuario     | string  | No        | Nombre del usuario                                     |
| bodega_id   | integer | No        | ID de la bodega (default: Principal)                   |

**Ejemplo:**

```json
{
  "producto_id": 3,
  "cantidad": 20,
  "tipo": "Compras",
  "detalle": "Compra a proveedor TechDistributor",
  "referencia": "OC-2026-001",
  "usuario": "admin",
  "bodega_id": 1
}
```

**Respuesta (200):**

```json
{
  "codigo": 200,
  "mensaje": "Entrada registrada correctamente.",
  "movimiento": {
    "id": 21,
    "fecha": "2026-02-14 15:30:00",
    "codigo": "7501234567890",
    "producto": "Mouse Logitech G203",
    "bodega_id": 1,
    "detalle": "Compra a proveedor TechDistributor",
    "tipo": "Compras",
    "entrada": 20,
    "salida": 0,
    "saldo": 33,
    "costo_unitario": 12.5,
    "costo_total": 250,
    "usuario": "admin",
    "referencia": "OC-2026-001",
    "producto_id": 3
  }
}
```

---

### 3.3 Transferencia entre bodegas

```
POST /api/kardex/transferencia
```

**Body (JSON):**

| Campo             | Tipo    | Requerido | Descripcion                           |
|-------------------|---------|-----------|---------------------------------------|
| producto_id       | integer | Si        | ID del producto                       |
| cantidad          | number  | Si        | Cantidad a transferir (min 0.01)      |
| bodega_origen_id  | integer | Si        | ID de bodega origen                   |
| bodega_destino_id | integer | Si        | ID de bodega destino (diferente a origen) |
| detalle           | string  | No        | Descripcion                           |
| usuario           | string  | No        | Nombre del usuario                    |

**Ejemplo:**

```json
{
  "producto_id": 3,
  "cantidad": 5,
  "bodega_origen_id": 1,
  "bodega_destino_id": 2,
  "detalle": "Reabastecimiento sucursal norte",
  "usuario": "admin"
}
```

**Respuesta (200):**

```json
{
  "codigo": 200,
  "mensaje": "Transferencia registrada correctamente.",
  "movimientos": {
    "salida": {
      "id": 22,
      "tipo": "Transferencia",
      "bodega_id": 1,
      "salida": 5,
      "entrada": 0,
      "detalle": "Transferencia a Sucursal Norte"
    },
    "entrada": {
      "id": 23,
      "tipo": "Transferencia",
      "bodega_id": 2,
      "salida": 0,
      "entrada": 5,
      "detalle": "Transferencia desde Principal"
    }
  }
}
```

---

## 4. MOVIMIENTOS AUTOMATICOS

Estos movimientos se generan automaticamente desde el POS y **no requieren llamadas adicionales** del frontend:

| Evento                    | Tipo en Kardex | Direccion | Referencia        |
|---------------------------|----------------|-----------|--------------------|
| Crear factura (venta)     | Ventas         | Salida    | `FAC-{id}`        |
| Anular factura            | Ventas         | Entrada   | `ANUL-FAC-{id}`   |
| Eliminar credito          | Ventas         | Entrada   | `ANUL-CRED-{id}`  |

> Al crear una factura, el frontend puede enviar opcionalmente `usuario` (string) y `bodega_id` (integer) en el body del POST `/api/facturas` para que queden registrados en el Kardex. Si no se envian, se usara la bodega Principal y usuario null.

**Campos opcionales adicionales en POST /api/facturas:**

```json
{
  "cabecera": { ... },
  "detalle": [ ... ],
  "formasPago": [ ... ],
  "usuario": "cajero1",
  "bodega_id": 1
}
```

---

## 5. TIPOS DE MOVIMIENTO (Referencia)

| Tipo          | Descripcion                        | Direccion         |
|---------------|------------------------------------|--------------------|
| Ventas        | Venta desde POS / Anulacion        | Salida / Entrada  |
| Compras       | Ingreso por compra                 | Entrada           |
| Fabricacion   | Produccion interna                 | Entrada           |
| Ajuste        | Ajuste manual (+/-)                | Entrada o Salida  |
| Transferencia | Movimiento entre bodegas           | Salida + Entrada  |
| Devolucion    | Devolucion de cliente              | Entrada           |

---

## 6. COLUMNAS DE LA TABLA KARDEX (Vista Frontend)

| # | Columna        | Campo JSON       | Descripcion                              |
|---|----------------|------------------|------------------------------------------|
| 1 | ID             | `id`             | Identificador del movimiento             |
| 2 | Fecha          | `fecha`          | Fecha y hora del movimiento              |
| 3 | Codigo         | `codigo`         | Codigo de barras o ID del producto       |
| 4 | Producto       | `producto`       | Nombre del producto                      |
| 5 | Bodega         | `bodega.nombre`  | Nombre de la bodega                      |
| 6 | Detalle        | `detalle`        | Descripcion del movimiento               |
| 7 | Tipo           | `tipo`           | Tipo de movimiento                       |
| 8 | Entrada        | `entrada`        | Cantidad que ingreso                     |
| 9 | Salida         | `salida`         | Cantidad que salio                       |
| 10| Saldo          | `saldo`          | Stock resultante despues del movimiento  |
| 11| Costo Unit.    | `costo_unitario` | Costo unitario al momento               |
| 12| Costo Total    | `costo_total`    | Costo total del movimiento              |
| 13| Usuario        | `usuario`        | Quien registro el movimiento            |
| 14| Referencia     | `referencia`     | Documento de referencia                  |

---

## 7. FILTROS DEL FRONTEND (Referencia de controles)

| Filtro            | Control          | Comportamiento                                          |
|-------------------|------------------|---------------------------------------------------------|
| Fecha Inicio      | Date Picker      | Filtra desde esta fecha (inclusive). Default: 1er dia del mes |
| Fecha Fin         | Date Picker      | Filtra hasta esta fecha (inclusive). Default: hoy       |
| Ver (Tipo)        | Select/Dropdown  | Opciones: `todos`, `entradas`, `salidas`                |
| Bodega            | Select/Dropdown  | Cargar de `GET /api/bodegas`                            |
| Producto          | Autocomplete     | Usar `GET /api/productos/buscarProducto/{texto}`        |
| Busqueda General  | Text Input       | Enviar como parametro `search`                          |
| Registros/pagina  | Select           | Enviar como `per_page` (ej: 10, 25, 50)                |

---

## 8. CODIGOS DE RESPUESTA

| Codigo | Significado                    |
|--------|--------------------------------|
| 200    | Operacion exitosa              |
| 400    | Error de validacion o proceso  |
| 404    | Recurso no encontrado          |
| 422    | Error de validacion Laravel    |

Cuando hay error de validacion (422), Laravel retorna:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "producto_id": ["The producto id field is required."],
    "cantidad": ["The cantidad must be at least 0.01."]
  }
}
```

---

## 9. RESUMEN DE ENDPOINTS

| Metodo | Endpoint                    | Descripcion                                |
|--------|-----------------------------|--------------------------------------------|
| GET    | `/api/bodegas`              | Listar bodegas activas (dropdown)          |
| POST   | `/api/bodegas`              | Crear nueva bodega                         |
| PUT    | `/api/bodegas/{id}`         | Editar bodega                              |
| DELETE | `/api/bodegas/{id}`         | Eliminar bodega (soft delete)              |
| GET    | `/api/kardex`               | Listar movimientos con filtros + paginacion|
| GET    | `/api/kardex/export-excel`  | Exportar movimientos filtrados a .xlsx     |
| GET    | `/api/kardex/{id}`          | Detalle de un movimiento                   |
| POST   | `/api/kardex/ajuste`        | Registrar ajuste manual                    |
| POST   | `/api/kardex/entrada`       | Registrar entrada (compra/fab/devolucion)  |
| POST   | `/api/kardex/transferencia` | Transferencia entre bodegas                |
