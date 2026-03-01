# ESPECIFICACION TECNICA — Sistema de Permisos y Control de Acceso

**Proyecto:** CompuServices POS | **Fecha:** 15/02/2026 | **Version:** 1.0
**Estado:** Pendiente Backend + Refactor Frontend

---

## 1. Resumen

Implementar un sistema de permisos granular que controle:
- **Acceso a pantallas** (ya existe parcialmente via `pantalla_pos`)
- **Acceso a acciones** (botones: crear, editar, eliminar, exportar, imprimir, etc.)

Actualmente los permisos se manejan con un archivo JSON estatico (`src/Environment/Permisos.json`) y condicionales hardcodeados por `tipo_usuario` en el frontend. Se necesita migrar todo a un sistema dinamico administrado desde el backend.

---

## 2. Situacion Actual

### 2.1 Permisos actuales (Permisos.json)

```
Roles existentes: ADMINISTRADOR, ATENCION AL PUBLICO, TECNICO
```

| Permiso | ADMIN | ATENCION | TECNICO |
|---------|-------|----------|---------|
| anular factura | Si | No | No |
| reimprimir-factura | Si | Si | Si |
| anular-credito | Si | No | No |
| abonar-credito | Si | Si | Si |
| historialpagos-credito | Si | Si | Si |
| registrar-retiros | Si | Si | No |
| eliminar-retiros | Si | No | No |
| finalizar-periodo | Si | Si | No |

### 2.2 Permisos hardcodeados en codigo

- `IngresoEgreso/index.js` → `TablaHistorico` solo visible para ADMINISTRADOR
- `TablaIngresos.js` → Columnas del DataGrid cambian segun tipo_usuario
- `TablaIngresos.js` → Abonar ingreso bloqueado para TECNICO
- `TablaIngresos.js` → Editar total solo ADMINISTRADOR
- `BuscadorIngresos.js` → Botones eliminar/imprimir/nuevo deshabilitados segun rol
- `CustomerListView/Toolbar.js` → Boton eliminar deshabilitado para ATENCION AL PUBLICO

---

## 3. Inventario Completo de Pantallas y Acciones

### 3.1 DASHBOARD (`/app/dashboard`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `dashboard.ver` | pantalla | Acceder al dashboard | `DashboardView/index.js` |
| `dashboard.finalizar-periodo` | accion | Boton "Finalizar Dia" (cerrar periodo) | `DashboardView/index.js` |

---

### 3.2 PUNTO DE VENTA (`/app/puntoventa`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `puntoventa.ver` | pantalla | Acceder al punto de venta | `puntoVenta/index.js` |
| `puntoventa.facturar` | accion | Boton "Guardar Factura" | `BotonGuardarFactura.js` |
| `puntoventa.aplicar-descuento` | accion | Aplicar descuento a items | `factura/rowFactura.js` |
| `puntoventa.seleccionar-tipo-precio` | accion | Cambiar tipo precio (publico/tecnico/mayorista) | `TipoPrecio/index.js` |

---

### 3.3 CLIENTES (`/app/customers`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `clientes.ver` | pantalla | Acceder a listado de clientes | `CustomerListView/index.js` |
| `clientes.crear` | accion | Boton "Nuevo Cliente" | `CustomerListView/Toolbar.js` |
| `clientes.editar` | accion | Editar celdas en tabla (nombre, cedula, etc.) | `TablaClientes/TablaClientes.js` |
| `clientes.eliminar` | accion | Boton "Eliminar" cliente | `CustomerListView/Toolbar.js` |

---

### 3.4 PRODUCTOS Y SERVICIOS (`/app/products`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `productos.ver` | pantalla | Acceder a la pantalla de productos | `ProductListView/index.js` |
| `productos.crear` | accion | Boton "Nuevo Producto" | `ProductListView/BuscadorProducto.js` |
| `productos.editar` | accion | Editar celdas en tabla (nombre, precios, stock) | `TablaProductos/TablaProductos.js` |
| `productos.eliminar` | accion | Boton "Eliminar" producto | `ProductListView/BuscadorProducto.js` |
| `productos.utilidad-ver` | accion | Acceder a la pestaña "Utilidad" | `ProductListView/index.js` |
| `productos.utilidad-exportar` | accion | Boton "Exportar Excel" en Utilidad | `ProductListView/TabUtilidad.js` |

---

### 3.5 INGRESOS / ORDENES DE SERVICIO (`/app/ingreso`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `ingresos.ver` | pantalla | Acceder a listado de ingresos | `Ingreso/ProductListView/index.js` |
| `ingresos.crear` | accion | Boton "Nuevo Ingreso" | `BuscadorIngresos.js` |
| `ingresos.editar-equipo` | accion | Editar campos: equipo, marca, modelo, serie | `TablaIngresos.js` |
| `ingresos.editar-trabajo` | accion | Editar campo trabajo | `TablaIngresos.js` |
| `ingresos.editar-total` | accion | Editar total de la orden | `TablaIngresos.js` |
| `ingresos.editar-observacion` | accion | Editar campo observacion | `TablaIngresos.js` |
| `ingresos.abonar` | accion | Registrar abono a orden | `TablaIngresos/ModalAbonoIngreso.js` |
| `ingresos.eliminar` | accion | Boton "Eliminar" orden | `BuscadorIngresos.js` |
| `ingresos.imprimir` | accion | Boton "Imprimir" orden | `BuscadorIngresos.js` |
| `ingresos.ver-detalle` | accion | Boton "Ver" detalle orden | `BuscadorIngresos.js` |
| `ingresos.facturar-ingreso` | accion | Switch "Ingreso facturado" al crear | `NuevoIngreso.js` |

---

### 3.6 FACTURAS (`/app/facturas`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `facturas.ver` | pantalla | Acceder al historico de facturas | `ListadoFacturas.js` |
| `facturas.reimprimir` | accion | Boton reimprimir factura | `ListadoFacturas.js` |
| `facturas.anular` | accion | Boton anular factura | `ListadoFacturas.js` |

---

### 3.7 CREDITOS (`/app/creditos`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `creditos.ver` | pantalla | Acceder al listado de creditos | `creditos/index.js` |
| `creditos.abonar` | accion | Boton abonar a un credito | `Creditos/GridCreditos.js` |
| `creditos.ver-pagos` | accion | Boton ver historial de pagos | `Creditos/GridCreditos.js` |
| `creditos.anular` | accion | Boton anular credito | `Creditos/GridCreditos.js` |

---

### 3.8 PROFORMAS (`/app/proformas`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `proformas.ver` | pantalla | Acceder a proformas | `proformas/index.js` |
| `proformas.crear` | accion | Formulario nueva proforma | `nuevaProforma.js` |

---

### 3.9 INGRESO/EGRESO - RETIROS (`/app/ingresoEgreso`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `retiros.ver` | pantalla | Acceder a la pantalla de retiros/gastos | `IngresoEgreso/index.js` |
| `retiros.ver-historico` | accion | Ver tabla historico (actualmente solo ADMIN) | `IngresoEgreso/index.js` |
| `retiros.crear` | accion | Boton "Añadir gasto" (registrar retiro) | `IngresoEgreso/Formulario.js` |
| `retiros.eliminar` | accion | Boton eliminar retiro | `IngresoEgreso/Tabla.js` |

---

### 3.10 CAJA CHICA / GASTOS (`/app/gastos`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `gastos.ver` | pantalla | Acceder a caja chica | `gastos/index.js` |
| `gastos.crear` | accion | Formulario registrar gasto | `gastos/FormularioGasto.js` |
| `gastos.editar` | accion | Boton editar gasto | `gastos/TablaGastos.js` |
| `gastos.eliminar` | accion | Boton eliminar gasto | `gastos/TablaGastos.js` |
| `gastos.categorias-ver` | accion | Acceder a pestaña Categorias | `gastos/index.js` |
| `gastos.categorias-crear` | accion | Formulario nueva categoria | `gastos/FormularioCategoria.js` |
| `gastos.categorias-editar` | accion | Boton editar categoria | `gastos/TablaCategorias.js` |
| `gastos.categorias-eliminar` | accion | Boton eliminar categoria | `gastos/TablaCategorias.js` |
| `gastos.resumen-ver` | accion | Acceder a pestaña Resumen/Reporte | `gastos/ReporteGastos.js` |

---

### 3.11 REPORTES (`/app/reportes`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `reportes.ver` | pantalla | Acceder a reportes basicos | `LayoutReportes/index.js` |
| `reportes.ventas-diarias` | accion | Ver reporte ventas diarias | `Reportes/ventasDiarias` |
| `reportes.ingresos-empleado` | accion | Ver reporte ingresos por empleado | `Reportes/ingresosEmpleado` |

---

### 3.12 REPORTES AVANZADOS (`/app/reportes-avanzados`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `reportes-avanzados.ver` | pantalla | Acceder a reportes avanzados | `LayoutReportesAvanzados/index.js` |
| `reportes-avanzados.utilidades` | accion | Ver reporte de utilidades | `ReporteUtilidades.js` |
| `reportes-avanzados.inventario` | accion | Ver inventario valorizado | `ReporteInventarioValorizado.js` |
| `reportes-avanzados.cuentas-cobrar` | accion | Ver cuentas por cobrar | `ReporteCuentasPorCobrar.js` |
| `reportes-avanzados.ventas-producto` | accion | Ver ventas por producto | `ReporteVentasPorProducto.js` |
| `reportes-avanzados.ventas-cliente` | accion | Ver ventas por cliente | `ReporteVentasPorCliente.js` |
| `reportes-avanzados.comparativo` | accion | Ver comparativo mensual | `ReporteComparativoMensual.js` |
| `reportes-avanzados.exportar-excel` | accion | Exportar reporte a Excel | `ExportButtons.js` |
| `reportes-avanzados.exportar-pdf` | accion | Exportar reporte a PDF | `ExportButtons.js` |

---

### 3.13 KARDEX (`/app/kardex`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `kardex.ver` | pantalla | Acceder al kardex | `kardex/index.js` |
| `kardex.ajuste` | accion | Boton "Ajuste" (ajustar stock) | `kardex/FiltrosKardex.js` |
| `kardex.entrada` | accion | Boton "Entrada" (registrar entrada) | `kardex/FiltrosKardex.js` |
| `kardex.transferencia` | accion | Boton "Transferencia" (entre bodegas) | `kardex/FiltrosKardex.js` |
| `kardex.exportar-excel` | accion | Boton "Excel" (exportar movimientos) | `kardex/FiltrosKardex.js` |

---

### 3.14 USUARIOS (`/app/usuarios`)

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `usuarios.ver` | pantalla | Acceder a gestion de usuarios | `usuarios/index.js` |
| `usuarios.crear` | accion | Formulario crear usuario | `usuarios/FormularioUsuario.js` |
| `usuarios.editar` | accion | Boton editar usuario | `usuarios/TablaUsuarios.js` |
| `usuarios.eliminar` | accion | Boton eliminar usuario | `usuarios/TablaUsuarios.js` |
| `usuarios.cambiar-password` | accion | Pestaña cambiar contraseña | `usuarios/CambiarPassword.js` |

---

### 3.15 PERIODO

| Codigo Permiso | Tipo | Descripcion | Componente |
|----------------|------|-------------|------------|
| `periodo.crear` | accion | Formulario crear/abrir nuevo periodo | `Periodo/NuevoPeriodo.js` |
| `periodo.finalizar` | accion | Boton finalizar periodo (= dashboard.finalizar-periodo) | `DashboardView/index.js` |

---

## 4. Modelo de Base de Datos Propuesto

### 4.1 Tabla `permisos`

Catalogo maestro de todos los permisos del sistema.

```sql
CREATE TABLE permisos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(100) NOT NULL UNIQUE,       -- Ej: 'clientes.crear'
    modulo VARCHAR(50) NOT NULL,               -- Ej: 'clientes'
    tipo ENUM('pantalla', 'accion') NOT NULL,  -- Tipo de permiso
    descripcion VARCHAR(255) NOT NULL,         -- Ej: 'Crear nuevo cliente'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4.2 Tabla `tipo_usuario_permisos`

Relacion entre tipo de usuario y permisos asignados.

```sql
CREATE TABLE tipo_usuario_permisos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario_id BIGINT UNSIGNED NOT NULL,
    permiso_id BIGINT UNSIGNED NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuarios(id),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id),
    UNIQUE KEY unique_tipo_permiso (tipo_usuario_id, permiso_id)
);
```

---

## 5. Seeder — Carga Inicial de Permisos

```sql
INSERT INTO permisos (codigo, modulo, tipo, descripcion) VALUES
-- DASHBOARD
('dashboard.ver', 'dashboard', 'pantalla', 'Acceder al dashboard'),
('dashboard.finalizar-periodo', 'dashboard', 'accion', 'Finalizar el periodo/dia'),

-- PUNTO DE VENTA
('puntoventa.ver', 'puntoventa', 'pantalla', 'Acceder al punto de venta'),
('puntoventa.facturar', 'puntoventa', 'accion', 'Guardar/emitir factura'),
('puntoventa.aplicar-descuento', 'puntoventa', 'accion', 'Aplicar descuento a items'),
('puntoventa.seleccionar-tipo-precio', 'puntoventa', 'accion', 'Cambiar tipo de precio'),

-- CLIENTES
('clientes.ver', 'clientes', 'pantalla', 'Acceder al listado de clientes'),
('clientes.crear', 'clientes', 'accion', 'Crear nuevo cliente'),
('clientes.editar', 'clientes', 'accion', 'Editar datos de cliente'),
('clientes.eliminar', 'clientes', 'accion', 'Eliminar cliente'),

-- PRODUCTOS
('productos.ver', 'productos', 'pantalla', 'Acceder a productos'),
('productos.crear', 'productos', 'accion', 'Crear nuevo producto'),
('productos.editar', 'productos', 'accion', 'Editar datos de producto'),
('productos.eliminar', 'productos', 'accion', 'Eliminar producto'),
('productos.utilidad-ver', 'productos', 'accion', 'Ver pestaña Utilidad'),
('productos.utilidad-exportar', 'productos', 'accion', 'Exportar utilidad a Excel'),

-- INGRESOS
('ingresos.ver', 'ingresos', 'pantalla', 'Acceder a ordenes de servicio'),
('ingresos.crear', 'ingresos', 'accion', 'Crear nueva orden de ingreso'),
('ingresos.editar-equipo', 'ingresos', 'accion', 'Editar equipo/marca/modelo/serie'),
('ingresos.editar-trabajo', 'ingresos', 'accion', 'Editar campo trabajo'),
('ingresos.editar-total', 'ingresos', 'accion', 'Editar total de la orden'),
('ingresos.editar-observacion', 'ingresos', 'accion', 'Editar observacion de orden'),
('ingresos.abonar', 'ingresos', 'accion', 'Registrar abono a orden'),
('ingresos.eliminar', 'ingresos', 'accion', 'Eliminar orden de ingreso'),
('ingresos.imprimir', 'ingresos', 'accion', 'Imprimir orden de ingreso'),
('ingresos.ver-detalle', 'ingresos', 'accion', 'Ver detalle de orden'),
('ingresos.facturar-ingreso', 'ingresos', 'accion', 'Facturar desde ingreso'),

-- FACTURAS
('facturas.ver', 'facturas', 'pantalla', 'Acceder al historico de facturas'),
('facturas.reimprimir', 'facturas', 'accion', 'Reimprimir factura'),
('facturas.anular', 'facturas', 'accion', 'Anular factura'),

-- CREDITOS
('creditos.ver', 'creditos', 'pantalla', 'Acceder al listado de creditos'),
('creditos.abonar', 'creditos', 'accion', 'Registrar abono a credito'),
('creditos.ver-pagos', 'creditos', 'accion', 'Ver historial de pagos'),
('creditos.anular', 'creditos', 'accion', 'Anular credito'),

-- PROFORMAS
('proformas.ver', 'proformas', 'pantalla', 'Acceder a proformas'),
('proformas.crear', 'proformas', 'accion', 'Crear nueva proforma'),

-- RETIROS
('retiros.ver', 'retiros', 'pantalla', 'Acceder a retiros/egresos'),
('retiros.ver-historico', 'retiros', 'accion', 'Ver tabla historico de retiros'),
('retiros.crear', 'retiros', 'accion', 'Registrar nuevo retiro/gasto'),
('retiros.eliminar', 'retiros', 'accion', 'Eliminar retiro'),

-- GASTOS (CAJA CHICA)
('gastos.ver', 'gastos', 'pantalla', 'Acceder a caja chica'),
('gastos.crear', 'gastos', 'accion', 'Registrar nuevo gasto'),
('gastos.editar', 'gastos', 'accion', 'Editar gasto existente'),
('gastos.eliminar', 'gastos', 'accion', 'Eliminar gasto'),
('gastos.categorias-ver', 'gastos', 'accion', 'Acceder a categorias de gastos'),
('gastos.categorias-crear', 'gastos', 'accion', 'Crear categoria de gasto'),
('gastos.categorias-editar', 'gastos', 'accion', 'Editar categoria de gasto'),
('gastos.categorias-eliminar', 'gastos', 'accion', 'Eliminar categoria de gasto'),
('gastos.resumen-ver', 'gastos', 'accion', 'Ver reporte/resumen de gastos'),

-- REPORTES
('reportes.ver', 'reportes', 'pantalla', 'Acceder a reportes basicos'),
('reportes.ventas-diarias', 'reportes', 'accion', 'Ver reporte ventas diarias'),
('reportes.ingresos-empleado', 'reportes', 'accion', 'Ver reporte ingresos por empleado'),

-- REPORTES AVANZADOS
('reportes-avanzados.ver', 'reportes-avanzados', 'pantalla', 'Acceder a reportes avanzados'),
('reportes-avanzados.utilidades', 'reportes-avanzados', 'accion', 'Ver reporte utilidades'),
('reportes-avanzados.inventario', 'reportes-avanzados', 'accion', 'Ver inventario valorizado'),
('reportes-avanzados.cuentas-cobrar', 'reportes-avanzados', 'accion', 'Ver cuentas por cobrar'),
('reportes-avanzados.ventas-producto', 'reportes-avanzados', 'accion', 'Ver ventas por producto'),
('reportes-avanzados.ventas-cliente', 'reportes-avanzados', 'accion', 'Ver ventas por cliente'),
('reportes-avanzados.comparativo', 'reportes-avanzados', 'accion', 'Ver comparativo mensual'),
('reportes-avanzados.exportar-excel', 'reportes-avanzados', 'accion', 'Exportar reporte a Excel'),
('reportes-avanzados.exportar-pdf', 'reportes-avanzados', 'accion', 'Exportar reporte a PDF'),

-- KARDEX
('kardex.ver', 'kardex', 'pantalla', 'Acceder al kardex'),
('kardex.ajuste', 'kardex', 'accion', 'Realizar ajuste de stock'),
('kardex.entrada', 'kardex', 'accion', 'Registrar entrada de productos'),
('kardex.transferencia', 'kardex', 'accion', 'Transferir entre bodegas'),
('kardex.exportar-excel', 'kardex', 'accion', 'Exportar kardex a Excel'),

-- USUARIOS
('usuarios.ver', 'usuarios', 'pantalla', 'Acceder a gestion de usuarios'),
('usuarios.crear', 'usuarios', 'accion', 'Crear nuevo usuario'),
('usuarios.editar', 'usuarios', 'accion', 'Editar usuario existente'),
('usuarios.eliminar', 'usuarios', 'accion', 'Eliminar usuario'),
('usuarios.cambiar-password', 'usuarios', 'accion', 'Cambiar contraseña de usuario'),

-- PERIODO
('periodo.crear', 'periodo', 'accion', 'Crear/abrir nuevo periodo'),
('periodo.finalizar', 'periodo', 'accion', 'Finalizar/cerrar periodo');
```

**Total: 68 permisos** (15 de pantalla + 53 de accion)

---

## 6. Endpoints API Requeridos

### 6.1 GET `/api/permisos`

Lista todos los permisos del catalogo agrupados por modulo.

**Respuesta:**

```json
{
  "data": {
    "dashboard": [
      { "id": 1, "codigo": "dashboard.ver", "tipo": "pantalla", "descripcion": "Acceder al dashboard" },
      { "id": 2, "codigo": "dashboard.finalizar-periodo", "tipo": "accion", "descripcion": "Finalizar el periodo" }
    ],
    "clientes": [...]
  }
}
```

### 6.2 GET `/api/tipo-usuarios/{id}/permisos`

Obtiene los permisos asignados a un tipo de usuario.

**Respuesta:**

```json
{
  "tipo_usuario": { "id": 1, "tipo": "ADMINISTRADOR" },
  "permisos": ["dashboard.ver", "dashboard.finalizar-periodo", "clientes.ver", "clientes.crear", ...]
}
```

### 6.3 POST `/api/tipo-usuarios/{id}/permisos`

Asigna/actualiza los permisos de un tipo de usuario. Recibe la lista completa de codigos de permisos activos (los que no esten en la lista se desactivan).

**Body:**

```json
{
  "permisos": ["dashboard.ver", "clientes.ver", "clientes.crear", "facturas.ver", "facturas.reimprimir"]
}
```

**Respuesta:**

```json
{
  "codigo": 200,
  "mensaje": "Permisos actualizados correctamente",
  "total_asignados": 5
}
```

### 6.4 GET `/api/mis-permisos`

Retorna los permisos del usuario autenticado (para uso del frontend al iniciar sesion). Este endpoint reemplaza al archivo `Permisos.json`.

**Respuesta:**

```json
{
  "permisos": [
    "dashboard.ver",
    "dashboard.finalizar-periodo",
    "puntoventa.ver",
    "puntoventa.facturar",
    "clientes.ver",
    "clientes.crear",
    "clientes.editar",
    "facturas.ver",
    "facturas.reimprimir"
  ]
}
```

---

## 7. Implementacion Backend Sugerida

### 7.1 Migraciones

```php
// database/migrations/xxxx_create_permisos_table.php
Schema::create('permisos', function (Blueprint $table) {
    $table->id();
    $table->string('codigo', 100)->unique();
    $table->string('modulo', 50);
    $table->enum('tipo', ['pantalla', 'accion']);
    $table->string('descripcion', 255);
    $table->timestamps();
});

// database/migrations/xxxx_create_tipo_usuario_permisos_table.php
Schema::create('tipo_usuario_permisos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tipo_usuario_id')->constrained('tipo_usuarios');
    $table->foreignId('permiso_id')->constrained('permisos');
    $table->boolean('activo')->default(true);
    $table->timestamps();
    $table->unique(['tipo_usuario_id', 'permiso_id']);
});
```

### 7.2 Seeder

```php
// database/seeders/PermisosSeeder.php
// Insertar los 68 permisos del SQL de la seccion 5
// Asignar todos los permisos al ADMINISTRADOR
// Asignar permisos limitados a ATENCION AL PUBLICO y TECNICO
```

### 7.3 Controller

```php
// app/Http/Controllers/PermisoController.php
class PermisoController extends Controller
{
    public function index(); // GET /api/permisos
    public function permisosPorTipo($tipoId); // GET /api/tipo-usuarios/{id}/permisos
    public function asignarPermisos(Request $request, $tipoId); // POST /api/tipo-usuarios/{id}/permisos
    public function misPermisos(Request $request); // GET /api/mis-permisos
}
```

### 7.4 Rutas

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/permisos', [PermisoController::class, 'index']);
    Route::get('/tipo-usuarios/{id}/permisos', [PermisoController::class, 'permisosPorTipo']);
    Route::post('/tipo-usuarios/{id}/permisos', [PermisoController::class, 'asignarPermisos']);
    Route::get('/mis-permisos', [PermisoController::class, 'misPermisos']);
});
```

---

## 8. Uso en el Frontend

### 8.1 Al iniciar sesion

Llamar `GET /api/mis-permisos` y guardar el array en el `LoginContext` (reemplaza `Permisos.json`).

```javascript
// LoginContext.js — al hacer login:
const response = await API.get('api/mis-permisos');
setPermisos(response.data.permisos); // ['dashboard.ver', 'clientes.crear', ...]
```

### 8.2 Funcion helper para verificar permisos

```javascript
// Environment/utileria.js o un hook usePermisos
export const tienePermiso = (permisos, codigo) => {
  return permisos.includes(codigo);
};
```

### 8.3 Ejemplo de uso en componentes

```jsx
// Antes (hardcodeado):
{Permisos[localStorage.getItem('tipo_usuario')]['anular factura'] && (
  <Button onClick={anularFactura}>Anular</Button>
)}

// Despues (dinamico):
{tienePermiso(permisos, 'facturas.anular') && (
  <Button onClick={anularFactura}>Anular</Button>
)}
```

---

## 9. Pantalla de Administracion de Permisos (Frontend)

Se sugiere agregar una pestaña "Permisos" dentro del modulo Usuarios (`/app/usuarios`), con:

- Selector de tipo de usuario
- Tabla con checkboxes agrupados por modulo
- Boton "Guardar" que llama `POST /api/tipo-usuarios/{id}/permisos`

```
+----------------------------------------------------------------+
| [Tab: Usuarios] [Tab: Cambiar Contraseña] [Tab: Permisos]      |
+----------------------------------------------------------------+
| Tipo de usuario: [ADMINISTRADOR v]                              |
+----------------------------------------------------------------+
| Modulo          | Permiso              | Activado              |
|-----------------|----------------------|-----------------------|
| DASHBOARD       |                      |                       |
|                 | Acceder al dashboard | [x]                   |
|                 | Finalizar periodo    | [x]                   |
| CLIENTES        |                      |                       |
|                 | Acceder a clientes   | [x]                   |
|                 | Crear cliente        | [x]                   |
|                 | Editar cliente       | [x]                   |
|                 | Eliminar cliente     | [ ]                   |
| ...             | ...                  | ...                   |
+----------------------------------------------------------------+
| [Guardar Permisos]                                              |
+----------------------------------------------------------------+
```

---

## 10. Checklist de Implementacion

### Backend
- [ ] Crear migracion tabla `permisos`
- [ ] Crear migracion tabla `tipo_usuario_permisos`
- [ ] Crear seeder con los 68 permisos
- [ ] Crear seeder con permisos por defecto para cada rol
- [ ] Crear `PermisoController` con 4 endpoints
- [ ] Registrar rutas en `routes/api.php`
- [ ] Ejecutar `php artisan migrate && php artisan db:seed`
- [ ] Probar endpoints con Postman

### Frontend (despues del backend)
- [ ] Agregar `permisos` al `LoginContext` (cargar desde `/api/mis-permisos`)
- [ ] Crear helper `tienePermiso()`
- [ ] Reemplazar `Permisos.json` por permisos dinamicos en cada componente
- [ ] Reemplazar condicionales hardcodeadas `tipo_usuario === 'ADMINISTRADOR'`
- [ ] Crear pestaña "Permisos" en modulo Usuarios
- [ ] Eliminar archivo `src/Environment/Permisos.json`

---

*CompuServices — Sistema POS — compustar.top*
