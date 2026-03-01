# Frontend — Integracion de Pantallas en Modulo de Permisos

## Contexto

Actualmente el modulo de permisos permite activar/desactivar **acciones** (botones, funciones) por tipo de usuario, pero **no permite asignar pantallas** (menu de navegacion). Las pantallas se controlan en la tabla `pantallapos` y hasta ahora solo se modificaban directamente en la base de datos.

Se agregaron 3 endpoints nuevos para que desde el mismo panel de permisos se pueda gestionar que pantallas ve cada tipo de usuario en el menu lateral.

---

## Endpoints nuevos

### 1. GET `/api/pantallas/catalogo`

Retorna la lista completa de pantallas disponibles (las del Administrador). Es el "master list" de todas las pantallas que existen en el sistema.

**Response 200:**
```json
{
  "catalogo": [
    {
      "id": 1,
      "href": "/app/dashboard",
      "icon": "BarChartIcon",
      "title": "Dashboard",
      "parent_id": null,
      "children": []
    },
    {
      "id": 2,
      "href": "/app/puntoventa",
      "icon": "Billing",
      "title": "Punto de Venta",
      "parent_id": null,
      "children": []
    },
    {
      "id": 3,
      "href": "/app/ingreso",
      "icon": "Smartphone",
      "title": "Ingreso",
      "parent_id": null,
      "children": []
    },
    {
      "id": 4,
      "href": "/app/customers",
      "icon": "UsersIcon",
      "title": "Clientes",
      "parent_id": null,
      "children": []
    },
    {
      "id": 5,
      "href": null,
      "icon": "ShoppingBagIcon",
      "title": "Productos y Servicios",
      "parent_id": null,
      "children": [
        {
          "id": 25,
          "href": "/app/products",
          "icon": "ShoppingBagIcon",
          "title": "Productos",
          "parent_id": 5
        },
        {
          "id": 26,
          "href": "/app/kardex",
          "icon": "ClipboardIcon",
          "title": "Kardex",
          "parent_id": 5
        }
      ]
    },
    {
      "id": 6,
      "href": "/app/creditos",
      "icon": "EditIconF",
      "title": "Creditos",
      "parent_id": null,
      "children": []
    },
    {
      "id": 7,
      "href": "/app/facturas",
      "icon": "iconoFacturas",
      "title": "Facturas",
      "parent_id": null,
      "children": []
    },
    {
      "id": 15,
      "href": "/app/reportes",
      "icon": "...",
      "title": "Reportes",
      "parent_id": null,
      "children": []
    },
    {
      "id": 16,
      "href": "/app/proformas",
      "icon": "...",
      "title": "Proformas",
      "parent_id": null,
      "children": []
    },
    {
      "id": 19,
      "href": "/app/ingresoEgreso",
      "icon": "...",
      "title": "Gastos",
      "parent_id": null,
      "children": []
    },
    {
      "id": 23,
      "href": "/app/reportes-avanzados",
      "icon": "...",
      "title": "Reportes Avanzados",
      "parent_id": null,
      "children": []
    },
    {
      "id": 24,
      "href": "/app/usuarios",
      "icon": "...",
      "title": "Usuarios",
      "parent_id": null,
      "children": []
    },
    {
      "id": 28,
      "href": "/app/contabilidad",
      "icon": "...",
      "title": "Contabilidad",
      "parent_id": null,
      "children": []
    }
  ]
}
```

**Notas:**
- Los items con `href: null` son **padres contenedores** (ej: "Productos y Servicios"). No se muestran como checkbox individual; sus hijos si.
- Los items dentro de `children` son sub-pantallas que van anidadas en el menu.

---

### 2. GET `/api/pantallas/tipo-usuario/{id}`

Retorna los hrefs de las pantallas actualmente asignadas a un tipo de usuario.

**Ejemplo:** `GET /api/pantallas/tipo-usuario/2` (TECNICO)

**Response 200:**
```json
{
  "tipo_usuario_id": 2,
  "pantallas": [
    "/app/ingreso",
    "/app/proformas"
  ]
}
```

---

### 3. POST `/api/pantallas/tipo-usuario/{id}/asignar`

Sincroniza las pantallas de un tipo de usuario. Envia el array completo de hrefs que debe tener.

**Request:**
```json
{
  "pantallas": [
    "/app/dashboard",
    "/app/puntoventa",
    "/app/ingreso",
    "/app/customers",
    "/app/products",
    "/app/kardex",
    "/app/creditos",
    "/app/facturas"
  ]
}
```

**Response 200:**
```json
{
  "codigo": 200,
  "mensaje": "Pantallas actualizadas correctamente",
  "total_asignadas": 10
}
```

**Response 403 (intentar modificar admin):**
```json
{
  "codigo": 403,
  "mensaje": "No se pueden modificar las pantallas del Administrador."
}
```

**Comportamiento:**
- Envia solo los hrefs de pantallas con enlace (no los padres contenedores).
- El backend crea automaticamente los padres contenedores si un hijo esta seleccionado. Por ejemplo: si envias `/app/products` y `/app/kardex`, el backend crea automaticamente el grupo padre "Productos y Servicios".
- Si no envias ningun hijo de un grupo, el padre no se crea.
- Las pantallas del ADMINISTRADOR (tipo_usuario_id=1) no se pueden modificar (son el catalogo maestro).

---

## Integracion en la pantalla de Permisos

Actualmente la pantalla de permisos tiene una seccion para activar/desactivar acciones (permisos). Se debe agregar una **seccion adicional** arriba o como tab para gestionar las pantallas.

### Flujo sugerido

La pantalla de permisos tiene un **selector de tipo de usuario** (Select/Dropdown). Al seleccionar un tipo:

1. Llamar en paralelo:
   - `GET /api/pantallas/catalogo` (solo la primera vez, cachear en state)
   - `GET /api/pantallas/tipo-usuario/{id}` (las pantallas actuales del tipo)
   - `GET /api/tipo-usuarios/{id}/permisos` (los permisos actuales — ya existe)

2. Mostrar dos secciones:
   - **Seccion 1: Pantallas (menu)** — checkboxes con las pantallas del catalogo
   - **Seccion 2: Permisos (acciones)** — checkboxes agrupados por modulo (ya existe)

### UI de la seccion de Pantallas

```
┌─────────────────────────────────────────────────────┐
│  Pantallas del menu                                 │
│                                                     │
│  ☑ Dashboard                                       │
│  ☑ Punto de Venta                                  │
│  ☑ Ingreso                                         │
│  ☑ Clientes                                        │
│  ▼ Productos y Servicios                           │
│     ☑ Productos                                    │
│     ☐ Kardex                                       │
│  ☑ Creditos                                        │
│  ☑ Facturas                                        │
│  ☐ Reportes                                        │
│  ☐ Proformas                                       │
│  ☐ Gastos                                          │
│  ☐ Reportes Avanzados                              │
│  ☐ Usuarios                                        │
│  ☐ Contabilidad                                    │
│                                                     │
│             [ Guardar Pantallas ]                   │
└─────────────────────────────────────────────────────┘
```

### Codigo de referencia

```js
// Estado
const [catalogo, setCatalogo] = useState([]);
const [pantallasAsignadas, setPantallasAsignadas] = useState([]);
const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

// Cargar catalogo (una sola vez)
useEffect(() => {
  const cargarCatalogo = async () => {
    const res = await API.get('api/pantallas/catalogo');
    setCatalogo(res.data.catalogo);
  };
  cargarCatalogo();
}, []);

// Cargar pantallas al cambiar tipo de usuario
useEffect(() => {
  if (!tipoSeleccionado) return;
  const cargar = async () => {
    const res = await API.get(`api/pantallas/tipo-usuario/${tipoSeleccionado}`);
    setPantallasAsignadas(res.data.pantallas);
  };
  cargar();
}, [tipoSeleccionado]);

// Extraer todos los hrefs del catalogo (excluyendo padres sin href)
const todosLosHrefs = () => {
  const hrefs = [];
  catalogo.forEach(item => {
    if (item.href) hrefs.push(item.href);
    if (item.children) {
      item.children.forEach(child => {
        if (child.href) hrefs.push(child.href);
      });
    }
  });
  return hrefs;
};

// Toggle un href
const togglePantalla = (href) => {
  setPantallasAsignadas(prev =>
    prev.includes(href)
      ? prev.filter(h => h !== href)
      : [...prev, href]
  );
};

// Guardar
const guardarPantallas = async () => {
  try {
    const res = await API.post(
      `api/pantallas/tipo-usuario/${tipoSeleccionado}/asignar`,
      { pantallas: pantallasAsignadas }
    );
    if (res.data.codigo === 200) {
      alertify.success(res.data.mensaje);
    }
  } catch (err) {
    if (err.response?.status === 403) {
      alertify.error(err.response.data.mensaje);
    } else {
      alertify.error('Error al guardar pantallas');
    }
  }
};
```

### Renderizado de checkboxes

```jsx
import { Checkbox, FormControlLabel, Typography, Box, Collapse } from '@material-ui/core';

{catalogo.map(item => (
  <Box key={item.id} ml={0}>
    {/* Item raiz */}
    {item.href ? (
      // Pantalla directa (con href) → checkbox
      <FormControlLabel
        control={
          <Checkbox
            checked={pantallasAsignadas.includes(item.href)}
            onChange={() => togglePantalla(item.href)}
            color="primary"
            disabled={tipoSeleccionado === 1}
          />
        }
        label={item.title}
      />
    ) : (
      // Padre contenedor (sin href) → solo label + hijos
      <>
        <Typography variant="subtitle2" style={{ fontWeight: 600, marginTop: 8 }}>
          {item.title}
        </Typography>
        <Box ml={3}>
          {item.children?.map(child => (
            <FormControlLabel
              key={child.id}
              control={
                <Checkbox
                  checked={pantallasAsignadas.includes(child.href)}
                  onChange={() => togglePantalla(child.href)}
                  color="primary"
                  disabled={tipoSeleccionado === 1}
                />
              }
              label={child.title}
            />
          ))}
        </Box>
      </>
    )}
  </Box>
))}

<Button
  variant="contained"
  color="primary"
  onClick={guardarPantallas}
  disabled={tipoSeleccionado === 1}
  style={{ marginTop: 16 }}
>
  Guardar Pantallas
</Button>
```

### Notas de comportamiento

- **Administrador (id=1)**: Los checkboxes aparecen **deshabilitados** (todos marcados). No se puede modificar porque es el catalogo maestro. Mostrar tooltip o texto: "Las pantallas del Administrador no se pueden modificar".
- **Otros tipos**: Todos los checkboxes son editables.
- **Padres contenedores**: No se envian en el request. Si marcas "Productos" y/o "Kardex", el backend automaticamente crea el grupo padre "Productos y Servicios". Si desmarcas ambos, el padre desaparece.
- **Seleccionar/Deseleccionar todo**: Opcional pero util — un checkbox "Seleccionar todo" que marque/desmarque todos los hrefs.

---

## Endpoint existente que se usa para el menu lateral

El frontend ya usa este endpoint para cargar el menu de navegacion al hacer login:

```
GET /api/pantallapos/acceso/obtener-acceso/{tipoUsuarioId}
```

Este endpoint sigue funcionando exactamente igual. Los cambios hechos con el nuevo endpoint `asignarPantallas` se reflejan automaticamente aqui, porque ambos leen/escriben la misma tabla `pantallapos`.

**Importante:** Despues de que un admin cambie las pantallas de un tipo de usuario, los usuarios de ese tipo veran los cambios la proxima vez que inicien sesion (o si el frontend recarga el menu).

---

## Resumen de endpoints

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/pantallas/catalogo` | Catalogo completo de pantallas disponibles |
| GET | `/api/pantallas/tipo-usuario/{id}` | Pantallas asignadas a un tipo (lista de hrefs) |
| POST | `/api/pantallas/tipo-usuario/{id}/asignar` | Sincronizar pantallas de un tipo de usuario |
| GET | `/api/pantallapos/acceso/obtener-acceso/{id}` | (existente) Menu de navegacion con estructura arbol |

## Resumen de cambios frontend

| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| Pantalla de Permisos | Modificar | Agregar seccion "Pantallas del menu" con checkboxes arriba de la seccion de permisos/acciones |
| Context de Permisos (si existe) | Modificar | Agregar funciones para cargar catalogo, pantallas por tipo, y guardar pantallas |
