# Sistema de Facturación y Gestión Empresarial — Compuservices

> Documento técnico completo para comprensión del sistema por cualquier IA o desarrollador.

---

## Índice

1. [Visión General](#1-visión-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Frontend (React)](#3-frontend-react)
4. [Backend (Laravel)](#4-backend-laravel)
5. [Base de Datos](#5-base-de-datos)
6. [API — Endpoints Completos](#6-api--endpoints-completos)
7. [Módulos del Negocio](#7-módulos-del-negocio)
8. [Flujos Clave](#8-flujos-clave)
9. [Reglas de Negocio](#9-reglas-de-negocio)
10. [Seguridad y Permisos](#10-seguridad-y-permisos)
11. [Integración SRI (Ecuador)](#11-integración-sri-ecuador)
12. [Variables de Entorno](#12-variables-de-entorno)

---

## 1. Visión General

Sistema ERP orientado a PYMES ecuatorianas que cubre:

- **Punto de Venta (POS)** con facturación electrónica
- **Gestión de créditos** con seguimiento de abonos y vencimientos
- **Órdenes de servicio técnico** con portal público de consulta
- **Inventario multi-bodega** con kardex
- **Contabilidad de partida doble** (plan de cuentas, asientos, balances)
- **Reportes avanzados** con exportación a Excel/PDF
- **Control de usuarios** con roles y permisos granulares

### Repositorios

| Parte | Ruta local | Tecnología |
|---|---|---|
| Frontend | `C:\laragon\www\facturacioncompustart-2023` | React 18 |
| Backend | `C:\laragon\www\compuservices-facturacion-back` | Laravel 8 |

### URL de producción

```
https://facturacion.grupocompustar.com
```

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                  │
│                    React SPA (Material-UI v4)               │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST (Axios)
                           │ Base URL: REACT_APP_BASE_URL
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Laravel 8 — API REST                     │
│          123+ endpoints · Token Auth · MySQL                │
│                                                             │
│  Controllers → Services → Models → DB                       │
│                                                             │
│  Servicios internos:                                        │
│   · KardexService      (movimientos de inventario)          │
│   · AsientoContableService (contabilidad automática)        │
│   · SriService         (facturación electrónica Ecuador)    │
│   · ProcessSriInvoice  (Job asíncrono para SRI)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   MySQL DB  │
                    │  26+ tablas │
                    └─────────────┘
```

### Despliegue

El build del frontend se copia automáticamente a la carpeta `public/` del backend mediante un script Windows. El backend sirve el `index.html` de React en cualquier ruta no-api (catch-all en `web.php`). Todo es una sola aplicación servida por Laravel.

---

## 3. Frontend (React)

### Stack

| Paquete | Versión | Uso |
|---|---|---|
| react | 18.2.0 | Framework principal |
| @material-ui/core | 4.12.4 | Componentes UI |
| react-router-dom | 6.0 (beta) | Enrutamiento |
| axios | 0.21.4 | Cliente HTTP |
| formik + yup | 2.1.5 / 0.29.3 | Formularios y validación |
| chart.js + react-chartjs-2 | 2.9.4 | Gráficas |
| jspdf + jspdf-autotable | 2.5.2 / 3.8.4 | Exportar PDF |
| react-to-print | 2.12.6 | Impresión directa |
| alertifyjs + sweetalert2 | 1.13.1 / 11.0.18 | Notificaciones |
| @material-ui/data-grid | 4.0.0-alpha.37 | Tablas con paginación |
| react-virtualized | 9.22.3 | Listas largas optimizadas |
| date-and-time + moment | — | Manejo de fechas |

### Estructura de directorios

```
src/
├── App.js                    # Punto de entrada, validación de auth por horario
├── index.js                  # Anida los 17 Context Providers
├── routes.js                 # Definición de rutas (DashboardLayout / MainLayout)
│
├── context/                  # Estado global (17 providers)
│   ├── LoginContext.js        # Auth, sesión, permisos
│   ├── FacturaContext.js      # Facturación
│   ├── CreditoContext.js      # Créditos
│   ├── ProductosContext.js    # Catálogo de productos
│   ├── ClienteContext.js      # Clientes
│   ├── IngresoContext.js      # Órdenes de servicio
│   ├── DashboardContext.js    # Datos del dashboard
│   ├── EstadisticasContext.js # Estadísticas
│   ├── PeriodoContext.js      # Período contable
│   ├── TecnicoContext.js      # Técnicos
│   ├── GastosContext.js       # Gastos
│   ├── UtilidadProductosContext.js
│   ├── UsuariosContext.js
│   ├── ReportesContext.js
│   ├── KardexContext.js
│   ├── ContabilidadContext.js
│   └── ReportesAvanzadosContext.js
│
├── views/                    # Páginas
│   ├── auth/LoginView.js
│   ├── reports/DashboardView/
│   ├── puntoVenta/           # POS completo
│   ├── creditos/             # Gestión de créditos
│   ├── Ingreso/              # Órdenes de servicio
│   ├── proformas/            # Cotizaciones
│   ├── gastos/               # Egresos
│   ├── kardex/               # Inventario
│   ├── contabilidad/         # Contabilidad
│   └── usuarios/             # Gestión de usuarios
│
├── components/               # Componentes reutilizables (36+ directorios)
│   ├── Creditos/
│   ├── CreditosTable/
│   ├── TablaProductos/
│   ├── ComponentesImpresion/ # Plantillas de impresión
│   ├── LayoutReportesAvanzados/
│   └── PagoPendienteBanner.js
│
├── layouts/
│   ├── DashboardLayout/      # Layout principal con sidebar
│   └── MainLayout/           # Layout para login
│
└── Environment/
    ├── config.js             # Instancia Axios con BASE_URL
    ├── utileria.js           # Funciones utilitarias
    ├── payment.js            # Toggle de banner de pago pendiente
    └── Permisos.json         # Permisos por defecto (fallback offline)
```

### Gestión de estado

Los 17 Context Providers están anidados en `index.js` en este orden:

```
LoginProvider → PeriodoProvider → EstadisticasProvider → TecnicoProvider
→ ProductosProvider → ClienteProvider → IngresoProvider → CreditoProvider
→ GastosProvider → FacturaProvider → UtilidadProductosProvider → App
```

### LocalStorage — claves de sesión

| Clave | Contenido |
|---|---|
| `login` | `"true"` si hay sesión activa |
| `user_id` | ID del usuario |
| `usuario` | Nombre de usuario |
| `nombres` | Nombre completo |
| `tipo_usuario` | Nombre del tipo de usuario |
| `tipousuario_id` | ID del tipo de usuario |
| `hora_inicio` | Hora de inicio de jornada (HH:MM) |
| `hora_fin` | Hora de fin de jornada (HH:MM) |
| `periodo_id` | ID del período contable activo |
| `permisos` | JSON con permisos del usuario |

### Rutas del frontend

**DashboardLayout (requieren auth)** — prefijo `/app`:

| Ruta | Módulo |
|---|---|
| `/app/dashboard` | Dashboard |
| `/app/puntoventa` | Punto de venta |
| `/app/facturas` | Listado de facturas |
| `/app/creditos` | Créditos |
| `/app/ingreso` | Órdenes de servicio |
| `/app/proformas` | Proformas/cotizaciones |
| `/app/products` | Catálogo de productos |
| `/app/customers` | Clientes |
| `/app/usuarios` | Gestión de usuarios |
| `/app/kardex` | Inventario (kardex) |
| `/app/gastos` | Gastos |
| `/app/contabilidad` | Contabilidad |
| `/app/reportes` | Reportes |
| `/app/reportes-avanzados` | Reportes avanzados |
| `/app/ingresoEgreso` | Reporte ingresos/egresos |

**MainLayout (públicas)**:

| Ruta | Descripción |
|---|---|
| `/login` | Login |
| `/consulta` | Portal público consulta de orden |
| `/404` | Página no encontrada |

---

## 4. Backend (Laravel)

### Stack

| Paquete | Versión | Uso |
|---|---|---|
| laravel/framework | ^8.12 | Framework |
| barryvdh/laravel-dompdf | ^2.0 | Generación PDF |
| maatwebsite/excel | ^3.1 | Excel import/export |
| guzzlehttp/guzzle | ^7.0.1 | Cliente HTTP (SRI) |
| robrichards/xmlseclibs | ^3.1 | Firma XML (facturas SRI) |
| fruitcake/laravel-cors | ^2.0 | CORS |

### Estructura de directorios

```
app/
├── Http/
│   ├── Controllers/          # 34 controladores
│   └── Middleware/           # Middlewares estándar + throttle público
├── Jobs/
│   └── ProcessSriInvoice.php # Job asíncrono para envío a SRI
├── Models/                   # 34 modelos Eloquent
├── Services/
│   ├── AsientoContableService.php  # Generación automática de asientos
│   ├── KardexService.php           # Movimientos de inventario
│   └── Sri/SriService.php          # Integración SRI Ecuador
└── Exports/
    └── ReporteExport.php     # Exportación Excel

database/
├── migrations/               # 38 migraciones (26+ tablas)
└── backupSQL/                # Respaldos SQL

routes/
├── api.php                   # 123+ endpoints REST
└── web.php                   # Catch-all → React SPA

public/                       # Build del frontend copiado aquí
```

### Autenticación

- **Mecanismo:** Token driver nativo de Laravel (`auth:api`)
- **NO usa** Sanctum ni Passport
- **Tabla:** `usuarios` (no la tabla `users` de Laravel)
- **Contraseña:** columna `pass`
- **Login:** `POST /api/usuarios/acceso/login` → retorna token
- **Ruta pública:** `POST /api/public/consulta-orden` (throttle: 10 req/min)

### Servicios internos

#### KardexService

Registra automáticamente cada movimiento de inventario:

```
registrarSalida(producto_id, bodega_id, cantidad, costo, detalle, tipo, referencia, usuario)
registrarEntrada(producto_id, bodega_id, cantidad, costo, detalle, tipo, referencia, usuario)
```

- Actualiza `productos.stock`
- Crea registro en `kardex_movimientos`
- Calcula saldo corriente y costo total
- Se invoca desde FacturasController al guardar una factura

#### AsientoContableService

Genera asientos de partida doble automáticamente:

```
crearAsiento(cabecera[], lineas[])  # Crea asiento con líneas debe/haber
desdeFactura(Facturas $factura)     # Asiento de venta
desdeGasto(Gasto $gasto)            # Asiento de egreso
desdeRetiro(Retiros $retiro)        # Asiento de retiro
```

#### SriService + ProcessSriInvoice

- Genera XML firmado digitalmente para el SRI
- Envía al web service del SRI (ambiente pruebas/producción)
- El Job `ProcessSriInvoice` lo ejecuta de forma asíncrona (queue)
- Guarda `acceso_key`, `sri_estado`, `sri_response`, `sri_error_message` en la factura

---

## 5. Base de Datos

### Diagrama de relaciones principales

```
clientes ─┬── facturas ──── detalles ──── productos
          │       │
          │       └── forma_pago_facturas ── forma_pagos
          │       └── credito_id ──┐
          │                       │
          └── creditos ────────────┘
                  └── detalle_creditos ── forma_pagos

ordenes ── abono_ordenes
       └── orden_historial

periodos ── control_estacions ── estacions
        └── retiros
        └── gastos ── categoria_gastos

productos ── kardex_movimientos ── bodegas
          └── proveedor_id ── proveedores

asientos_contables ── detalle_asientos ── cuenta_contables (jerárquico)

tipo_usuarios ─── tipo_usuario_permisos ─── permisos
             └─── usuarios
             └─── pantallapos (jerárquico)

emisors  (configuración SRI por empresa)
```

### Tablas completas

#### `clientes`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| cedula | string | Cédula/RUC |
| nombres | string | Nombre completo |
| telefono | string | |
| direccion | string | |
| correo | string | |
| observacion | text | |
| deleted_at | timestamp | Soft delete |

#### `productos`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| nombre | string | |
| descripcion | text | |
| codigo_barra | string | |
| precio_publico | decimal | Precio al público |
| precio_tecnico | decimal | Precio para técnicos |
| precio_compra | decimal | Costo de compra |
| precio_distribuidor | decimal | Precio mayorista |
| stock | integer | Stock actual |
| proveedor_id | FK | |

#### `facturas`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| cliente_id | FK | |
| fecha | date | |
| subtotal | decimal | Sin IVA |
| iva | decimal | 15% |
| total | decimal | Con IVA |
| observacion | text | |
| estado | string | activo / anulado |
| es_credito | boolean | Si es venta a crédito |
| credito_id | FK nullable | Enlace al crédito |
| periodo_id | FK | |
| acceso_key | string | Clave de acceso SRI |
| sri_estado | string | Estado respuesta SRI |
| sri_response | text | Respuesta XML SRI |
| sri_error_message | text | Errores SRI |
| deleted_at | timestamp | |

#### `detalles` (líneas de factura)
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| factura_id | FK | |
| producto_id | FK | |
| cantidad | integer | |
| subtotal | decimal | |
| precio_tipo | string | publico / tecnico / distribuidor |

#### `creditos`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| cliente_id | FK | |
| fecha | date | Fecha de creación |
| fecha_limite | date | Fecha de vencimiento |
| detalle | text | |
| saldo | decimal | Saldo pendiente |
| total | decimal | Monto original |

#### `detalle_creditos` (abonos)
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| credito_id | FK | |
| forma_pago_id | FK | |
| abono | decimal | Monto abonado |
| fecha | date | |
| comentario | text | |
| periodo_id | FK | |

#### `ordenes` (servicio técnico)
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| cliente_id | FK | |
| usuario_id | FK | |
| fecha | date | |
| equipo | string | Tipo de equipo |
| marca | string | |
| modelo | string | |
| serie | string | |
| falla | text | Falla reportada |
| trabajo | text | Trabajo realizado |
| total | decimal | |
| saldo | decimal | |
| abono | decimal | |
| estado | string | pendiente/en_proceso/completado/entregado |
| estadoOrden | string | |
| estado_reparacion | string | |
| visible_cliente | boolean | Visible en portal público |
| fecha_completado | datetime | |
| fecha_entregado | datetime | |
| periodo_id | FK | |

#### `periodos`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| fecha_apertura | date | |
| fecha_cierre | date | |
| usuario_id_apertura | FK | |
| usuario_id_cierre | FK | |
| estado | string | abierto / cerrado |
| fondo_asignado | decimal | |
| observaciones | text | |

#### `kardex_movimientos`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| fecha | date | |
| codigo | string | Código del producto |
| producto | string | Nombre snapshot |
| bodega_id | FK | |
| producto_id | FK | |
| detalle | text | |
| tipo | string | Ventas/Compras/Ajuste/Transferencia |
| entrada | decimal | |
| salida | decimal | |
| saldo | decimal | Saldo corriente |
| costo_unitario | decimal | |
| costo_total | decimal | |
| usuario | string | |
| referencia | string | ID de documento origen |

#### `cuenta_contables`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| codigo | string unique | Ej: "1.1.01" |
| nombre | string | |
| tipo | enum | activo/pasivo/patrimonio/ingreso/gasto |
| naturaleza | enum | deudora/acreedora |
| parent_id | FK nullable | Cuenta padre (jerárquico) |
| nivel | integer | Nivel en el árbol |
| es_detalle | boolean | Si acepta movimientos |
| activo | boolean | |

#### `asientos_contables`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| numero | string | Número secuencial |
| fecha | date | |
| descripcion | text | |
| tipo | enum | manual/venta/gasto/retiro/credito/abono_credito/anulacion/ajuste/cierre |
| referencia_tipo | string | Modelo origen (Facturas, Gasto, etc.) |
| referencia_id | integer | ID del documento origen |
| estado | enum | borrador/contabilizado/anulado |
| usuario_id | FK | |
| total_debe | decimal | |
| total_haber | decimal | |

#### `detalle_asientos`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| asiento_contable_id | FK | |
| cuenta_contable_id | FK | |
| descripcion | text | |
| debe | decimal | |
| haber | decimal | |

#### `usuarios`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| tipo_usuarios_id | FK | |
| nombres | string | |
| usuario | string unique | Username |
| pass | string | Contraseña |
| hora_inicio | time | Inicio de jornada |
| hora_fin | time | Fin de jornada |

#### `permisos`
| Columna | Tipo | Descripción |
|---|---|---|
| id | bigint PK | |
| codigo | string unique | Ej: "facturas.anular" |
| modulo | string | Ej: "facturas" |
| tipo | enum | pantalla/accion |
| descripcion | string | |

#### `tipo_usuario_permisos` (pivot)
| Columna | Tipo |
|---|---|
| tipo_usuario_id | FK |
| permiso_id | FK |
| activo | boolean |

#### `emisors` (configuración SRI)
| Columna | Tipo | Descripción |
|---|---|---|
| ruc | string | RUC del emisor |
| razon_social | string | |
| nombre_comercial | string | |
| direccion_matriz | string | |
| cod_establecimiento | string | Ej: "001" |
| cod_punto_emision | string | Ej: "001" |
| obligado_contabilidad | boolean | |
| path_firma | string | Ruta al archivo .p12 |
| pass_firma | string | Contraseña de la firma |
| ambiente | string | pruebas/produccion |
| is_active | boolean | |

---

## 6. API — Endpoints Completos

**Base:** `https://facturacion.grupocompustar.com/api`

Todos los endpoints requieren header `Authorization: Bearer {token}` excepto los marcados con 🌐.

### Autenticación y Usuarios

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/usuarios/acceso/login` 🌐 | Login — retorna token |
| GET | `/usuarios` | Listar usuarios |
| POST | `/usuarios` | Crear usuario |
| GET | `/usuarios/{id}` | Ver usuario |
| PUT | `/usuarios/{id}` | Actualizar usuario |
| DELETE | `/usuarios/{id}` | Eliminar usuario |
| PUT | `/usuarios/{id}/cambiar-password` | Cambiar contraseña |
| GET | `/usuarios/tipos/listado` | Tipos de usuario |

### Clientes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/clientes` | Listar todos |
| POST | `/clientes` | Crear |
| GET | `/clientes/{id}` | Ver |
| PUT | `/clientes/{id}` | Actualizar |
| DELETE | `/clientes/{id}` | Eliminar |
| GET | `/clientes/listado/{limite}` | Paginado |

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/productos` | Listar |
| POST | `/productos` | Crear |
| PUT | `/productos/{id}` | Actualizar |
| DELETE | `/productos/{id}` | Eliminar |
| GET | `/productos/listado/{limite}` | Paginado |
| GET | `/productos/listadoStock/{limite}` | Con stock |
| GET | `/productos/buscarProducto/{texto?}` | Búsqueda |
| GET | `/productos/next-id/codigo-barra` | Próximo código de barra |

### Facturas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/facturas` | Listar |
| POST | `/facturas` | Crear factura (deduce stock, genera kardex, puede generar asiento) |
| GET | `/facturas/{id}` | Ver |
| PUT | `/facturas/{id}` | Actualizar |
| DELETE | `/facturas/{id}` | Eliminar |
| POST | `/facturas/anulacion/nota-credito` | Anular con nota de crédito |
| PUT | `/facturas/{id}/formas-pago` | Actualizar formas de pago |
| GET | `/facturas/impresion/reimpresion/{id}` | Datos para reimpresión |
| GET | `/reporte/ventas` | Reporte ventas del día |
| GET | `/reporte/historicofacturas/{limite}` | Historial paginado |
| POST | `/reporte/historicofacturas-filter` | Historial filtrado |

### Créditos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/creditos` | Listar |
| POST | `/creditos` | Crear |
| GET | `/creditos/{id}` | Ver |
| PUT | `/creditos/{id}` | Actualizar |
| DELETE | `/creditos/{id}` | Eliminar |
| POST | `/creditos/abonar` | Registrar abono |
| GET | `/creditos/lista/listado` | Listado simple |
| GET | `/creditos/pendientes/cliente/{clienteId}` | Pendientes por cliente |
| POST | `/creditos/anular/factura/{idFactura}` | Anular crédito por factura |
| POST | `/creditos/eliminar/{idCredito}` | Eliminar crédito |
| PUT | `/detalle-creditos/{id}/forma-pago` | Actualizar forma de pago de un abono |

### Proformas (Cotizaciones)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/proformas` | Listar |
| POST | `/proformas` | Crear |
| GET | `/proformas/{id}` | Ver |
| PUT | `/proformas/{id}` | Actualizar |
| DELETE | `/proformas/{id}` | Eliminar |
| POST | `/proformas/eliminar/{idProforma}` | Eliminar alternativo |
| POST | `/proformas/obtener` | Obtener por criterio |

### Órdenes de Servicio

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/ordenes` | Listar |
| POST | `/ordenes` | Crear |
| GET | `/ordenes/{id}` | Ver |
| PUT | `/ordenes/{id}` | Actualizar |
| DELETE | `/ordenes/{id}` | Eliminar |
| GET | `/ordenes/listado/{limite}` | Paginado |
| POST | `/ordenes/abonos/nuevoabono` | Agregar abono |
| POST | `/ordenes/total/actualizar` | Actualizar total |
| POST | `/ordenes/cambiar-estado` | Cambiar estado |
| POST | `/public/consulta-orden` 🌐 | Consulta pública (throttle 10/min) |

### Formas de Pago

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/forma-pagos` | Listar |
| POST | `/forma-pagos` | Crear |
| GET | `/forma-pagos/{id}` | Ver |
| PUT | `/forma-pagos/{id}` | Actualizar |
| DELETE | `/forma-pagos/{id}` | Eliminar |

### Período Contable

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/periodo` | Listar |
| POST | `/periodo` | Crear nuevo período |
| GET | `/periodo/{id}` | Ver |
| PUT | `/periodo/{id}` | Actualizar |
| DELETE | `/periodo/{id}` | Eliminar |
| GET | `/periodo/verificar-periodo/apertura` | Verificar si hay período abierto |
| POST | `/periodo/cerrar-periodo/cierre/{id}` | Cerrar período |
| GET | `/periodo/verificar-periodo/retiros/obtenerRetiros` | Obtener retiros del período |

### Retiros (Caja)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/retiros` | Listar |
| POST | `/retiros` | Crear retiro |
| GET | `/retiros/{id}` | Ver |
| PUT | `/retiros/{id}` | Actualizar |
| DELETE | `/retiros/{id}` | Eliminar |
| GET | `/retiros/ultimos-30-dias` | Últimos 30 días |
| POST | `/retiros/eliminar/retiro/{idRetiro}` | Eliminar alternativo |

### Dashboard

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/dashboard/resumen` | KPIs del día |
| GET | `/dashboard/ventas-periodo` | Ventas por período |
| GET | `/dashboard/top-productos` | Top productos vendidos |
| GET | `/dashboard/top-clientes` | Top clientes |
| GET | `/dashboard/stock-bajo` | Productos con stock bajo |
| GET | `/dashboard/creditos-pendientes` | Créditos pendientes |

### Reportes Avanzados

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/reportes/utilidades` | Utilidades por período |
| POST | `/reportes/abonos-creditos` | Abonos de créditos |
| GET | `/reportes/inventario-valorizado` | Inventario valorizado |
| POST | `/reportes/cuentas-por-cobrar` | Cuentas por cobrar |
| POST | `/reportes/ventas-por-producto` | Ventas por producto |
| POST | `/reportes/ventas-por-cliente` | Ventas por cliente |
| POST | `/reportes/comparativo-mensual` | Comparativo mensual |
| POST | `/reportes/exportar-excel` | Exportar Excel |
| POST | `/reportes/exportar-pdf` | Exportar PDF |
| POST | `/reportes/ventas-diarias` | Ventas diarias |
| GET | `/reportes/ventas-diarias/forma-pago` | Total por forma de pago |
| POST | `/reportes/ingresos-empleado` | Ingresos por empleado |

### Gastos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/categoria-gastos` | Listar categorías |
| POST | `/categoria-gastos` | Crear categoría |
| PUT | `/categoria-gastos/{id}` | Actualizar categoría |
| DELETE | `/categoria-gastos/{id}` | Eliminar categoría |
| GET | `/gastos` | Listar gastos |
| POST | `/gastos` | Crear gasto |
| PUT | `/gastos/{id}` | Actualizar gasto |
| DELETE | `/gastos/{id}` | Eliminar gasto |
| POST | `/gastos/por-categoria` | Gastos por categoría |
| POST | `/gastos/balance-caja` | Balance de caja |

### Kardex / Inventario

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/kardex` | Listar movimientos |
| GET | `/kardex/{id}` | Ver movimiento |
| GET | `/kardex/export-excel` | Exportar Excel |
| POST | `/kardex/ajuste` | Ajuste manual de stock |
| POST | `/kardex/entrada` | Entrada manual |
| POST | `/kardex/transferencia` | Transferencia entre bodegas |
| GET | `/bodegas` | Listar bodegas |
| POST | `/bodegas` | Crear bodega |
| PUT | `/bodegas/{id}` | Actualizar bodega |
| DELETE | `/bodegas/{id}` | Eliminar bodega |

### Contabilidad

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/cuenta-contables` | Listar cuentas |
| GET | `/cuenta-contables/lista` | Lista completa |
| POST | `/cuenta-contables` | Crear cuenta |
| GET | `/cuenta-contables/{id}` | Ver cuenta |
| PUT | `/cuenta-contables/{id}` | Actualizar cuenta |
| DELETE | `/cuenta-contables/{id}` | Eliminar cuenta |
| GET | `/asientos-contables` | Listar asientos |
| POST | `/asientos-contables` | Crear asiento |
| GET | `/asientos-contables/{id}` | Ver asiento |
| PUT | `/asientos-contables/{id}` | Actualizar asiento |
| POST | `/asientos-contables/{id}/contabilizar` | Contabilizar (borrador → contabilizado) |
| POST | `/asientos-contables/{id}/anular` | Anular asiento |
| POST | `/asientos-contables/generar/desde-factura/{id}` | Generar desde factura |
| POST | `/asientos-contables/generar/desde-gasto/{id}` | Generar desde gasto |
| POST | `/asientos-contables/generar/desde-retiro/{id}` | Generar desde retiro |
| POST | `/contabilidad/libro-diario` | Libro diario |
| POST | `/contabilidad/libro-mayor` | Libro mayor |
| POST | `/contabilidad/balance-comprobacion` | Balance de comprobación |
| POST | `/contabilidad/balance-general` | Balance general |
| POST | `/contabilidad/estado-resultados` | Estado de resultados |

### Permisos y Pantallas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/permisos` | Listar todos los permisos |
| GET | `/tipo-usuarios/{id}/permisos` | Permisos por tipo de usuario |
| POST | `/tipo-usuarios/{id}/permisos` | Asignar permisos |
| GET | `/mis-permisos/{tipoUsuarioId}` | Mis permisos |
| GET | `/pantallas/catalogo` | Catálogo de pantallas/menú |
| GET | `/pantallas/tipo-usuario/{id}` | Pantallas por tipo de usuario |
| POST | `/pantallas/tipo-usuario/{id}/asignar` | Asignar pantallas |
| GET | `/pantallapos/acceso/obtener-acceso/{tipoUsuario}` | Acceso a pantallas del POS |

### Otros

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/tecnicos` | Listar técnicos (CRUD completo) |
| GET | `/proveedores` | Listar proveedores (CRUD completo) |
| GET | `/utilidad-productos` | Utilidad por producto |
| GET | `/utilidad-productos/export-excel` | Exportar utilidades |

---

## 7. Módulos del Negocio

### 7.1 Punto de Venta (POS)

**Archivo principal:** `src/views/puntoVenta/`

- Selección de cliente (o "Consumidor Final")
- Búsqueda de productos con atajos de teclado (F2=guardar, F3=buscar, F4=limpiar)
- 3 tipos de precio por producto: `publico`, `tecnico`, `distribuidor`
- Descuentos por línea
- Cálculo automático de IVA (15%)
- Selección de formas de pago (puede ser múltiple)
- Opción de guardar como **proforma** (sin número, sin stock) o **factura** (con número, deduce stock)
- Opción de marcar como **crédito** (crea registro en `creditos`)
- Modal para definir fecha límite del crédito

### 7.2 Créditos

**Archivos:** `src/views/creditos/`, `src/components/Creditos/`, `src/context/CreditoContext.js`

Estados de créditos:
- **Vencido:** fecha_limite < hoy
- **Por vencer:** fecha_limite dentro de los próximos días
- **Sin fecha:** sin fecha_limite definida

Operaciones:
- Abonar (parcial o total)
- Registrar forma de pago del abono
- Cancelar/anular crédito
- Resumen de saldos por estado

### 7.3 Órdenes de Servicio

**Archivos:** `src/views/Ingreso/`, `src/context/IngresoContext.js`

Ciclo de vida de una orden:
```
ingreso_registrado → diagnostico_iniciado → trabajo_actualizado
→ total_definido → abono_registrado → completado → entregado
```

Cada cambio queda en `orden_historial` con usuario y timestamp.

Portal público: el cliente puede consultar el estado de su orden en `/consulta` sin necesidad de login.

### 7.4 Período Contable

- El sistema **requiere** un período abierto para operar
- `App.js` y `PeriodoContext` verifican esto al iniciar
- Si no hay período activo, muestra pantalla para crear uno
- Al cerrar un período se reconcilian retiros y se calculan saldos
- Todas las transacciones llevan `periodo_id`

### 7.5 Contabilidad

Flujo de contabilización:

```
Venta (factura) ──→ AsientoContableService.desdeFactura()
Gasto ────────────→ AsientoContableService.desdeGasto()
Retiro de caja ───→ AsientoContableService.desdeRetiro()
```

Los asientos pasan por: `borrador` → `contabilizado` → (opcional) `anulado`

### 7.6 Inventario (Kardex)

Cada movimiento de stock se registra automáticamente:

```
Crear factura ──→ KardexService.registrarSalida() → tipo: "Ventas"
Ajuste manual ──→ KardexService.registrarEntrada/Salida() → tipo: "Ajuste"
Transferencia ──→ Salida bodega origen + Entrada bodega destino
```

---

## 8. Flujos Clave

### Crear una factura de venta

```
1. [Frontend] Usuario selecciona cliente y productos en POS
2. [Frontend] Calcula subtotal, IVA (15%), total
3. [Frontend] POST /api/facturas con {cliente_id, detalles[], formas_pago[], es_credito, ...}
4. [Backend] FacturasController@store:
   a. Crea registro en `facturas`
   b. Crea registros en `detalles`
   c. Crea registros en `forma_pago_facturas`
   d. Si es_credito=true: crea registro en `creditos`
   e. Por cada detalle: KardexService.registrarSalida() → actualiza stock
   f. Opcional: AsientoContableService.desdeFactura() → crea asiento
   g. Opcional: dispatch(ProcessSriInvoice) → envía a SRI
5. [Frontend] Muestra comprobante para impresión
```

### Registrar un abono a crédito

```
1. [Frontend] POST /api/creditos/abonar con {credito_id, monto, forma_pago_id, fecha}
2. [Backend] Crea registro en `detalle_creditos`
3. [Backend] Actualiza `creditos.saldo` (resta abono)
4. [Backend] Si saldo=0: marca crédito como saldado
```

### Cambiar estado de una orden de servicio

```
1. [Frontend] POST /api/ordenes/cambiar-estado con {orden_id, estado, detalle}
2. [Backend] Actualiza `ordenes.estadoOrden`
3. [Backend] Crea registro en `orden_historial`
```

---

## 9. Reglas de Negocio

| Regla | Descripción |
|---|---|
| **IVA** | 15% fijo. Cálculo inverso: `subtotal = total / 1.15` |
| **Período activo** | Se requiere período abierto para crear facturas, gastos, créditos o retiros |
| **Stock** | Solo se deduce al crear facturas reales. Las proformas NO deducen stock |
| **Proforma** | No genera número de factura, no deduce stock, no crea crédito |
| **Tipos de precio** | Cada producto tiene 3 precios: público, técnico, distribuidor |
| **Crédito** | Una factura marcada como crédito crea automáticamente un registro en `creditos` |
| **Kardex automático** | Toda venta crea un movimiento en `kardex_movimientos` tipo "Ventas" |
| **Asientos automáticos** | Facturas, gastos y retiros pueden generar asientos de contabilidad automáticamente |
| **Control de horario** | Cada usuario tiene `hora_inicio` y `hora_fin`. Fuera de ese rango el sistema redirige al login |
| **IVA Ecuador** | 15% (desde 2024, antes era 12%). Integración con SRI para factura electrónica |
| **Nota de crédito** | Para anular una factura se genera una nota de crédito en el SRI |
| **Banner de pago** | `src/Environment/payment.js` controla si se muestra el aviso de pago pendiente (toggle) |

---

## 10. Seguridad y Permisos

### Roles predefinidos

| Rol | Acceso |
|---|---|
| SUPER USUARIO | Todos los permisos automáticamente |
| ATENCION AL PUBLICO | Ventas, clientes, proformas |
| TECNICO | Órdenes de servicio, consultas |

### Permisos granulares

Los permisos tienen la forma `modulo.accion`, por ejemplo:

```
facturas.crear        facturas.anular       facturas.ver
creditos.abonar       creditos.eliminar     creditos.ver
productos.editar      productos.eliminar
usuarios.gestionar
kardex.ajuste
contabilidad.contabilizar
```

Tipo `pantalla`: controla qué ítems del menú son visibles.
Tipo `accion`: controla qué botones/operaciones están disponibles.

### Flujo de permisos en el frontend

```
1. Login → backend retorna token
2. Frontend llama GET /api/mis-permisos/{tipousuario_id}
3. Guarda permisos en localStorage como JSON
4. Si el endpoint falla → usa Permisos.json como fallback
5. Componentes verifican permiso antes de renderizar botones o rutas
```

---

## 11. Integración SRI (Ecuador)

El SRI (Servicio de Rentas Internas) es la autoridad tributaria de Ecuador. El sistema implementa facturación electrónica.

### Componentes

| Componente | Archivo | Función |
|---|---|---|
| Configuración del emisor | `Emisors` model | RUC, firma digital, ambiente |
| Generación XML | `SriService` | Crea XML con los datos de la factura |
| Firma digital | `xmlseclibs` | Firma el XML con certificado .p12 |
| Envío asíncrono | `ProcessSriInvoice` job | Envía XML al web service del SRI |
| Tracking | Columnas en `facturas` | acceso_key, sri_estado, sri_response, sri_error_message |

### Ambientes

```
pruebas    → Certificación con datos de prueba
produccion → Facturas con validez legal
```

### Campos de la factura electrónica

- `acceso_key`: Clave de acceso de 49 dígitos (identificador único SRI)
- `sri_estado`: RECIBIDA / AUTORIZADA / RECHAZADA
- `sri_response`: XML de respuesta completo del SRI
- `sri_error_message`: Mensaje de error si fue rechazada

---

## 12. Variables de Entorno

### Frontend (`.env.production`)

```env
REACT_APP_BASE_URL=https://facturacion.grupocompustar.com/api
```

### Backend (`.env`)

```env
APP_NAME=Laravel
APP_ENV=production
APP_URL=https://facturacion.grupocompustar.com
APP_TIMEZONE=America/Guayaquil

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=<nombre_base_datos>
DB_USERNAME=<usuario>
DB_PASSWORD=<contraseña>

QUEUE_CONNECTION=sync     # Cambiar a 'database' para async real

# SRI se configura desde la tabla 'emisors' en la BD, no en .env
```

---

*Documento generado el 22/03/2026. Versión del sistema: 3.1.0*
