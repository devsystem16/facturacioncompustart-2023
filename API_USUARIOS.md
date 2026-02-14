# API Usuarios - CompuServices Facturación

## Endpoints (6 nuevos + login existente)

| # | Método | Ruta | Descripción |
|---|--------|------|-------------|
| 1 | GET | `/api/usuarios` | Listar todos los usuarios |
| 2 | GET | `/api/usuarios/{id}` | Obtener un usuario por ID |
| 3 | POST | `/api/usuarios` | Crear usuario |
| 4 | PUT | `/api/usuarios/{id}` | Actualizar usuario |
| 5 | DELETE | `/api/usuarios/{id}` | Eliminar usuario (soft delete) |
| 6 | PUT | `/api/usuarios/{id}/cambiar-password` | Cambiar contraseña |
| 7 | POST | `/api/usuarios/acceso/login` | Login (ya existía) |

---

### 1. GET `/api/usuarios`
Listar todos los usuarios activos con su tipo de usuario.

**Response:**
```json
{
  "codigo": 200,
  "Message": "",
  "data": [
    {
      "id": 1,
      "nombres": "Admin Principal",
      "usuario": "admin",
      "tipo_usuarios_id": 1,
      "tipo": "Administrador",
      "hora_inicio": "08:00:00",
      "hora_fin": "22:00:00",
      "created_at": "2026-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "nombres": "Juan Vendedor",
      "usuario": "jvendedor",
      "tipo_usuarios_id": 2,
      "tipo": "Vendedor",
      "hora_inicio": "09:00:00",
      "hora_fin": "18:00:00",
      "created_at": "2026-01-15T00:00:00.000000Z"
    }
  ]
}
```

> **Nota:** El campo `pass` NO se incluye en la respuesta por seguridad.

---

### 2. GET `/api/usuarios/{id}`
Obtener un usuario específico por ID.

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | int | ID del usuario (en URL) |

**Response (200):**
```json
{
  "codigo": 200,
  "Message": "",
  "data": {
    "id": 1,
    "nombres": "Admin Principal",
    "usuario": "admin",
    "tipo_usuarios_id": 1,
    "tipo": "Administrador",
    "hora_inicio": "08:00:00",
    "hora_fin": "22:00:00",
    "created_at": "2026-01-01T00:00:00.000000Z"
  }
}
```

**Response (404 - no encontrado):**
```json
{
  "codigo": 404,
  "Message": "Usuario no encontrado.",
  "data": []
}
```

---

### 3. POST `/api/usuarios`
Crear un nuevo usuario.

**Body:**
```json
{
  "nombres": "María López",
  "usuario": "mlopez",
  "pass": "contraseña123",
  "tipo_usuarios_id": 2
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombres` | string | Si | Nombre completo del usuario |
| `usuario` | string | Si | Nombre de usuario para login (debe ser único) |
| `pass` | string | Si | Contraseña |
| `tipo_usuarios_id` | int | Si | ID del tipo de usuario (FK a `tipo_usuarios`) |

**Response (200 - éxito):**
```json
{
  "codigo": 200,
  "Message": "Usuario creado correctamente.",
  "data": {
    "id": 3,
    "nombres": "María López",
    "usuario": "mlopez",
    "tipo_usuarios_id": 2,
    "created_at": "2026-02-13T15:30:00.000000Z",
    "updated_at": "2026-02-13T15:30:00.000000Z"
  }
}
```

**Response (400 - usuario duplicado):**
```json
{
  "codigo": 400,
  "Message": "El nombre de usuario ya existe.",
  "data": []
}
```

---

### 4. PUT `/api/usuarios/{id}`
Actualizar datos de un usuario. Se puede actualizar nombre, usuario, tipo, y opcionalmente la contraseña.

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | int | ID del usuario (en URL) |

**Body:**
```json
{
  "nombres": "María López Actualizada",
  "usuario": "mlopez2",
  "tipo_usuarios_id": 1,
  "pass": "nuevaContraseña456"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombres` | string | No | Nuevo nombre completo |
| `usuario` | string | No | Nuevo nombre de usuario (se valida unicidad) |
| `tipo_usuarios_id` | int | No | Nuevo tipo de usuario |
| `pass` | string | No | Nueva contraseña. Si se omite o es vacío, **no se cambia** la contraseña |

> **Nota:** Si envías `pass` en el body, se actualiza la contraseña. Si no lo envías, la contraseña actual se mantiene. Esto permite al admin actualizar datos sin tocar la contraseña.

**Response (200 - éxito):**
```json
{
  "codigo": 200,
  "Message": "Usuario actualizado correctamente.",
  "data": {
    "id": 3,
    "nombres": "María López Actualizada",
    "usuario": "mlopez2",
    "tipo_usuarios_id": 1,
    "updated_at": "2026-02-13T16:00:00.000000Z"
  }
}
```

**Response (400 - usuario duplicado):**
```json
{
  "codigo": 400,
  "Message": "El nombre de usuario ya existe.",
  "data": []
}
```

---

### 5. DELETE `/api/usuarios/{id}`
Eliminar un usuario (soft delete).

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | int | ID del usuario (en URL) |

**Response (200):**
```json
{
  "codigo": 200,
  "Message": "Usuario eliminado correctamente.",
  "data": []
}
```

---

### 6. PUT `/api/usuarios/{id}/cambiar-password`
Cambiar la contraseña de un usuario. Permite validar la contraseña actual antes de cambiarla.

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | int | ID del usuario (en URL) |

**Body (con verificación de contraseña actual):**
```json
{
  "pass_actual": "contraseñaVieja",
  "pass_nueva": "contraseñaNueva123"
}
```

**Body (sin verificación - para reset de admin):**
```json
{
  "pass_nueva": "contraseñaNueva123"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `pass_actual` | string | No | Contraseña actual. Si se envía, se valida antes de cambiar |
| `pass_nueva` | string | Si | Nueva contraseña |

> **Uso en frontend:**
> - **Usuario cambia su propia contraseña:** enviar `pass_actual` + `pass_nueva` (se valida que la actual sea correcta)
> - **Admin resetea contraseña de otro usuario:** enviar solo `pass_nueva` (no se valida la actual)

**Response (200 - éxito):**
```json
{
  "codigo": 200,
  "Message": "Contraseña actualizada correctamente.",
  "data": []
}
```

**Response (400 - contraseña incorrecta):**
```json
{
  "codigo": 400,
  "Message": "La contraseña actual es incorrecta.",
  "data": []
}
```

---

### 7. POST `/api/usuarios/acceso/login` (existente)
Login de usuario.

**Body:**
```json
{
  "user": "admin",
  "pass": "contraseña123"
}
```

**Response (login exitoso):**
```json
{
  "login": 1,
  "user_id": 1,
  "usuario": "admin",
  "nombres": "Admin Principal",
  "tipousuario_id": 1,
  "tipo": "Administrador",
  "hora_inicio": "08:00:00",
  "hora_fin": "22:00:00",
  "mensaje": "Login Correcto"
}
```

**Response (fuera de horario):**
```json
{
  "login": 0,
  "user_id": 1,
  "usuario": "admin",
  "nombres": "Admin Principal",
  "tipousuario_id": 1,
  "tipo": "Administrador",
  "hora_inicio": "08:00:00",
  "hora_fin": "22:00:00",
  "mensaje": "Usuario Fuera de Horario, Su horario de atención es desde [ 08:00:00 a 22:00:00 ]"
}
```

**Response (usuario no encontrado):**
```json
{
  "login": 0,
  "user_id": 0,
  "usuario": "no registrado",
  "tipousuario_id": 0,
  "tipo": "no registrado",
  "hora_inicio": "00:00:00",
  "hora_fin": "00:00:00",
  "mensaje": "Usuario no encontrado."
}
```

---

## Notas para el frontend

- Los errores retornan HTTP 200 con `"codigo": 400` o `"codigo": 404` dentro del JSON.
- El campo `pass` nunca se retorna en las respuestas de listado/detalle.
- Al actualizar con PUT `/api/usuarios/{id}`, si no se desea cambiar la contraseña, simplemente no incluir `pass` en el body.
- El endpoint `cambiar-password` tiene doble uso: validación con `pass_actual` para el propio usuario, o reset directo con solo `pass_nueva` para uso administrativo.
- `tipo_usuarios_id` referencia la tabla `tipo_usuarios` (Administrador, Vendedor, etc.).
