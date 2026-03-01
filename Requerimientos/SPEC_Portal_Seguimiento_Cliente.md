# Portal de Seguimiento de Reparaciones - Especificacion Completa

**Proyecto:** CompuStar - Sistema de Facturacion
**Modulo:** Portal publico de consulta de estado de reparacion
**Fecha:** 2026-02-15

---

## 1. CONTEXTO Y PROBLEMA

### Proceso actual
1. El cliente entrega su equipo en CompuStar
2. Se crea un **Ingreso** (orden de servicio) en el sistema interno
3. Se imprime una hoja fisica con los datos basicos (ver imagen: `referencia de ingreso.png`)
4. El cliente debe **llamar por telefono** o **ir presencialmente** para preguntar por el estado de su equipo
5. El tecnico busca la orden manualmente y responde

### Datos que se imprimen actualmente (hoja fisica)
```
INGRESO N° 11247
Nombre:        SOLIS LOPEZ CINTHIA KATHERINE
Cedula:        1207644996001
Telefono:      +593997325372
Equipo:        [tipo]          N° Serie: [serie]
Marca:         [marca]         Fecha Ingreso: 2026-02-15 19:17:07
Modelo:        [modelo]
Falla:         [descripcion de la falla]
Observacion:   [notas]
Total: $0      Abono: $0       Saldo: $0

Nota: Estimado cliente, pasado los 60 dias no nos
responsabilizamos por el estado de su equipo.
Revision minima: $5 | Revision electronica: $10
```

### Problema
- El cliente no tiene forma digital de consultar el avance de su reparacion
- Los tecnicos pierden tiempo respondiendo consultas por telefono
- No hay transparencia en el proceso de reparacion

---

## 2. SOLUCION PROPUESTA

### Concepto
Una **pagina web publica** (sin login) donde el cliente ingresa:
- Su **numero de cedula**
- El **N° de ingreso** (que aparece en la hoja impresa)

Y obtiene en **tiempo real** el estado actualizado de su reparacion.

### Flujo del cliente
```
Cliente recibe hoja impresa con N° de ingreso
          |
          v
Abre la URL publica: compustar.com/consulta (o similar)
          |
          v
Ingresa: Cedula + N° Ingreso
          |
          v
    +---> Sistema valida ambos datos
    |              |
    |     NO encontrado --> "No se encontro la orden. Verifique sus datos."
    |              |
    |     SI encontrado
    |              |
    |              v
    |     Muestra panel con:
    |       - Datos del equipo
    |       - Estado actual (Pendiente / En Proceso / Completado)
    |       - Linea de tiempo del trabajo realizado
    |       - Valores: Total / Abono / Saldo
    |       - Fecha estimada (si aplica)
    |              |
    |              v
    |     Cliente puede consultar cuantas veces quiera
    +---- (refresca datos en cada consulta)
```

---

## 3. API BACKEND - ENDPOINTS REQUERIDOS

**Base URL:** `/api/public`

> **IMPORTANTE:** Estos endpoints son **publicos** (no requieren token JWT). La seguridad se basa en que el cliente debe conocer AMBOS datos (cedula + N° ingreso). Nunca exponer listados ni permitir busquedas sin ambos parametros.

---

### 3.1 Consultar estado de orden

```
POST /api/public/consulta-orden
```

> Se usa POST (no GET) para no exponer la cedula en la URL/logs del servidor.

**Body (JSON):**

| Campo      | Tipo   | Requerido | Descripcion                                  |
|------------|--------|-----------|----------------------------------------------|
| cedula     | string | Si        | Cedula o RUC del cliente (sin guiones)        |
| orden_id   | integer| Si        | Numero de ingreso (el que sale en la hoja)    |

**Ejemplo request:**

```json
{
  "cedula": "1207644996001",
  "orden_id": 11247
}
```

**Respuesta exitosa (200):**

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
    "ultimo_tecnico": "Juan Perez",
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

**Respuesta - No encontrado (404):**

```json
{
  "codigo": 404,
  "mensaje": "No se encontro ninguna orden con los datos proporcionados."
}
```

**Respuesta - Datos incompletos (422):**

```json
{
  "codigo": 422,
  "mensaje": "Debe ingresar su cedula y el numero de orden."
}
```

---

### 3.2 Rate limiting (proteccion anti-abuso)

> Implementar rate limiting por IP: maximo **10 consultas por minuto** por IP. Esto evita ataques de fuerza bruta para adivinar numeros de orden.

**Respuesta - Demasiadas peticiones (429):**

```json
{
  "codigo": 429,
  "mensaje": "Demasiadas consultas. Intente nuevamente en unos minutos."
}
```

---

## 4. MODELO DE DATOS - CAMBIOS REQUERIDOS

### 4.1 Tabla `ordenes` (cambios sugeridos)

Actualmente la tabla `ordenes` ya contiene casi toda la informacion necesaria. Cambios opcionales:

| Campo              | Tipo     | Nuevo | Descripcion                                         |
|--------------------|----------|-------|-----------------------------------------------------|
| estado_reparacion  | string   | SI    | Estado explicito: `pendiente`, `en_proceso`, `completado`, `entregado` |
| fecha_completado   | datetime | SI    | Fecha en que se marco como completado               |
| fecha_entregado    | datetime | SI    | Fecha en que se entrego al cliente                   |
| visible_cliente    | boolean  | SI    | Si la orden es visible en el portal (default: true)  |

> **Nota sobre `estado_reparacion`:** Actualmente el estado se deriva del campo `trabajo` y `factura_relacionada` en el frontend. Con este campo explícito el backend controla el flujo de estados y el portal lo muestra directamente.

### 4.2 Nueva tabla: `orden_historial` (para linea de tiempo)

```sql
CREATE TABLE orden_historial (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    orden_id    BIGINT UNSIGNED NOT NULL,
    usuario_id  BIGINT UNSIGNED NULL,
    evento      VARCHAR(100) NOT NULL,
    detalle     TEXT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Eventos sugeridos:**

| Evento                  | Descripcion                         | Se crea cuando...                        |
|-------------------------|-------------------------------------|------------------------------------------|
| `ingreso_registrado`    | Equipo recibido                     | Se crea la orden                         |
| `diagnostico_iniciado`  | Se inicio el diagnostico            | Tecnico actualiza campo `trabajo` por 1ra vez |
| `trabajo_actualizado`   | Progreso en la reparacion           | Tecnico actualiza campo `trabajo`        |
| `total_definido`        | Se definio costo de reparacion      | Se actualiza el campo `total`            |
| `abono_registrado`      | Pago parcial registrado             | Se registra un abono                     |
| `completado`            | Reparacion completada               | Se cambia estado a `completado`          |
| `entregado`             | Equipo entregado al cliente         | Se cambia estado a `entregado`           |

> El historial se genera **automaticamente** en el backend cuando ocurre cada evento. Los tecnicos no escriben manualmente en esta tabla.

### 4.3 Logica de creacion automatica de historial

Implementar en el backend (middleware o observers):

```
Al crear orden:
  → INSERT orden_historial (evento: 'ingreso_registrado')

Al actualizar campo 'trabajo' (cuando antes estaba vacio):
  → INSERT orden_historial (evento: 'diagnostico_iniciado', detalle: valor de trabajo)

Al actualizar campo 'trabajo' (cuando ya tenia contenido):
  → INSERT orden_historial (evento: 'trabajo_actualizado', detalle: valor nuevo de trabajo)

Al registrar abono:
  → INSERT orden_historial (evento: 'abono_registrado', detalle: "Abono de $X.XX")

Al actualizar total:
  → INSERT orden_historial (evento: 'total_definido', detalle: "Total: $X.XX")

Al cambiar estado_reparacion a 'completado':
  → INSERT orden_historial (evento: 'completado')

Al cambiar estado_reparacion a 'entregado':
  → INSERT orden_historial (evento: 'entregado')
```

---

## 5. IMPLEMENTACION BACKEND - ENDPOINT DETALLADO

### 5.1 Controller: `ConsultaPublicaController`

```
Archivo: app/Http/Controllers/Api/ConsultaPublicaController.php
```

**Logica del metodo `consultarOrden`:**

```
1. Validar que cedula y orden_id esten presentes (422 si faltan)
2. Buscar en tabla `ordenes` WHERE id = orden_id AND estado != 0
3. Buscar en tabla `clientes` WHERE id = ordenes.cliente_id AND cedula = cedula_enviada
4. Si no hay match → 404
5. Si visible_cliente = false → 404 (tratar como no encontrada)
6. Cargar historial: SELECT * FROM orden_historial WHERE orden_id = X ORDER BY created_at ASC
7. Obtener nombre del ultimo tecnico que actualizo (de users via last_user_update)
8. Armar respuesta JSON con estructura del punto 3.1
9. Retornar 200
```

### 5.2 Ruta

```php
// routes/api.php
Route::post('/public/consulta-orden', [ConsultaPublicaController::class, 'consultarOrden'])
    ->middleware('throttle:10,1'); // 10 peticiones por minuto
```

> Sin middleware `auth:sanctum` — es ruta publica.

### 5.3 Modificaciones en controllers existentes

Los controllers que ya manejan ordenes deben **insertar registros en `orden_historial`** cuando ocurran eventos relevantes:

**OrdenController (al crear):**
```
Despues de crear la orden → INSERT orden_historial (evento: ingreso_registrado)
```

**OrdenController (al actualizar):**
```
Si el campo 'trabajo' cambio → INSERT orden_historial (evento: trabajo_actualizado)
Si el campo 'total' cambio → INSERT orden_historial (evento: total_definido)
```

**AbonoController (al registrar abono):**
```
Despues de guardar abono → INSERT orden_historial (evento: abono_registrado)
```

---

## 6. FRONTEND - PAGINA PUBLICA DE CONSULTA

### 6.1 Ubicacion

Se implementara como una **ruta publica** dentro de la aplicacion React existente, accesible sin autenticacion:

```
URL: /consulta
Ruta React: { path: '/consulta', element: <ConsultaOrden /> }
```

> Esta ruta NO esta dentro del layout `/app/` ni requiere login.

### 6.2 Vista: Formulario de consulta

```
+-----------------------------------------------+
|         COMPUSTAR                              |
|         Consulta de Estado de Reparacion       |
|                                                |
|   +---------------------------------------+   |
|   |  Cedula:     [__________________]     |   |
|   |  N° Ingreso: [__________________]     |   |
|   |                                       |   |
|   |         [ CONSULTAR ]                 |   |
|   +---------------------------------------+   |
|                                                |
+-----------------------------------------------+
```

### 6.3 Vista: Resultado de consulta

```
+-----------------------------------------------+
|  COMPUSTAR - Estado de Reparacion              |
|                                                |
|  Orden #11247            Estado: [EN PROCESO]  |
|  Fecha ingreso: 2026-02-15                     |
|                                                |
|  DATOS DEL EQUIPO                              |
|  +-------------------------------------------+|
|  | Equipo:  LAPTOP     Marca:  DELL          ||
|  | Modelo:  Inspiron   Serie:  SN-ABC123     ||
|  | Falla:   No enciende, se apaga sola       ||
|  +-------------------------------------------+|
|                                                |
|  LINEA DE TIEMPO                               |
|  +-------------------------------------------+|
|  | o 15 Feb 19:17 - Equipo recibido          ||
|  | |                                         ||
|  | o 16 Feb 10:00 - Diagnostico iniciado     ||
|  | |   Se inicio revision electronica        ||
|  | |                                         ||
|  | o 16 Feb 14:30 - Trabajo en progreso      ||
|  |     Se realizo reballing chip de video     ||
|  +-------------------------------------------+|
|                                                |
|  RESUMEN FINANCIERO                            |
|  +-------------------------------------------+|
|  | Total: $45.00  Abonado: $20.00            ||
|  | Saldo pendiente: $25.00                   ||
|  +-------------------------------------------+|
|                                                |
|  [ NUEVA CONSULTA ]                            |
+-----------------------------------------------+
```

### 6.4 Componentes React a crear

```
src/views/consultaPublica/
  ├── index.js              (pagina principal con formulario + resultado)
  ├── FormularioConsulta.js  (formulario cedula + N° orden)
  ├── ResultadoConsulta.js   (panel con toda la info)
  ├── LineaTiempo.js         (componente visual del timeline)
  └── ResumenFinanciero.js   (card de Total/Abono/Saldo)
```

### 6.5 Diseño visual

- **Tema:** Limpio, profesional, confianza
- **Colores:** Primario azul (#3f51b5) consistente con el sistema interno
- **Responsive:** Debe funcionar perfecto en celular (los clientes consultaran desde su telefono)
- **Sin menu lateral** ni elementos del dashboard — es una pagina independiente
- **Logo de CompuStar** visible en el header

### 6.6 Estados visuales del chip de estado

| Estado       | Color fondo | Color texto | Icono sugerido |
|--------------|-------------|-------------|----------------|
| Pendiente    | #FFF3E0     | #E65100     | Reloj          |
| En Proceso   | #E3F2FD     | #1565C0     | Herramienta    |
| Completado   | #E8F5E9     | #2E7D32     | Check          |
| Entregado    | #F3E5F5     | #7B1FA2     | Entrega        |

---

## 7. SEGURIDAD

### 7.1 Reglas de acceso

| Regla | Detalle |
|-------|---------|
| Sin autenticacion | La ruta es publica, no requiere JWT |
| Doble verificacion | Se requiere cedula + N° orden correctos |
| Rate limiting | 10 consultas/minuto por IP |
| No listados | No existe endpoint para listar ordenes |
| Datos limitados | No exponer: nombre completo del tecnico, datos internos del negocio |
| Orden eliminada | Si estado = 0 (eliminada), responder 404 como si no existiera |
| visible_cliente | Permite ocultar ordenes especificas del portal |

### 7.2 Datos que NO se exponen al cliente

- Nombre completo del tecnico (solo primer nombre o alias)
- Otros ingresos del mismo cliente
- Datos de otros clientes
- Costos internos vs precio al publico
- Notas internas (campo `observacion` evaluarlo segun el negocio)

### 7.3 Validaciones

```
cedula: required | string | min:10 | max:13
orden_id: required | integer | min:1
```

---

## 8. HOJA IMPRESA - AGREGAR URL Y QR

### 8.1 Modificacion del recibo impreso

Agregar al final de la hoja impresa actual:

```
----------------------------------------------------
Consulte el estado de su reparacion en linea:
compustar.com/consulta
Ingrese su cedula y el N° de ingreso: 11247
----------------------------------------------------
```

> **Opcional:** Generar un codigo QR con la URL pre-armada: `compustar.com/consulta?orden=11247`. Esto permite que el cliente escanee con su celular y solo ingrese la cedula.

### 8.2 Cambio en frontend (ImpresionOrden.js)

Agregar una fila al final de la tabla de impresion con la URL del portal y el N° de ingreso.

---

## 9. PLAN DE IMPLEMENTACION

### Fase 1: Backend (Prioridad alta)
1. Crear migracion para campo `estado_reparacion` en tabla `ordenes`
2. Crear migracion para campo `visible_cliente` en tabla `ordenes`
3. Crear migracion para campos `fecha_completado` y `fecha_entregado`
4. Crear tabla `orden_historial`
5. Crear `ConsultaPublicaController` con endpoint POST
6. Agregar ruta publica con throttle
7. Modificar controllers existentes para insertar en `orden_historial` automaticamente
8. Crear migration seed para generar historial de ordenes existentes (basado en datos actuales)

### Fase 2: Frontend - Portal publico (Prioridad alta)
1. Crear ruta `/consulta` fuera del layout autenticado
2. Implementar `FormularioConsulta` (cedula + N° orden)
3. Implementar `ResultadoConsulta` con timeline visual
4. Diseño responsive (mobile-first)
5. Manejo de errores y estados de carga

### Fase 3: Integracion (Prioridad media)
1. Modificar `ImpresionOrden.js` para incluir URL del portal
2. Agregar selector de `estado_reparacion` en el formulario de edicion de ingreso
3. Agregar boton "Marcar como completado" / "Marcar como entregado" en el panel interno

### Fase 4: Mejoras opcionales (Prioridad baja)
1. Codigo QR en la hoja impresa
2. Notificacion por WhatsApp al cambiar estado (usando la API de WhatsApp Business)
3. Valoracion del servicio por parte del cliente al finalizar

---

## 10. RESUMEN DE ENDPOINTS

| Metodo | Endpoint                      | Auth | Descripcion                      |
|--------|-------------------------------|------|----------------------------------|
| POST   | `/api/public/consulta-orden`  | No   | Consultar estado de una orden    |

### Endpoints internos modificados (agregan historial):

| Endpoint existente        | Cambio                                          |
|---------------------------|------------------------------------------------|
| POST `/api/ordenes`       | Al crear → INSERT en `orden_historial`          |
| PATCH `/api/ordenes/:id`  | Al actualizar trabajo/total → INSERT historial  |
| POST `/api/ordenes/abonos/nuevoabono` | Al abonar → INSERT historial     |

---

## 11. PREGUNTAS PARA DEFINIR

1. **Observacion visible?** — El campo `observacion` se muestra al cliente o es solo interno?
2. **Nombre del tecnico** — Se muestra al cliente? Solo primer nombre? O se oculta?
3. **URL del portal** — Sera subdominio (`consulta.compustar.com`), ruta (`compustar.com/consulta`), o dominio separado?
4. **WhatsApp futuro** — Se planea enviar notificaciones automaticas por WhatsApp al cambiar estado?
5. **Multi-sucursal** — El sistema soportara multiples sucursales en el futuro?
