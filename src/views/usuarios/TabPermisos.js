import React, { useState, useContext, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  Button,
  Box,
  Chip,
  CircularProgress,
  FormControlLabel,
  Divider,
  Grid,
  colors
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import alertify from 'alertifyjs';
import { UsuariosContext } from '../../context/UsuariosContext';
import API from '../../Environment/config';

const CATALOGO_PERMISOS = [
  { codigo: 'dashboard.ver', modulo: 'Dashboard', descripcion: 'Acceder al dashboard' },
  { codigo: 'dashboard.finalizar-periodo', modulo: 'Dashboard', descripcion: 'Finalizar el periodo/día' },
  { codigo: 'dashboard.ver-ventas-periodo', modulo: 'Dashboard', descripcion: 'Ver gráfico Ventas por Período' },
  { codigo: 'dashboard.ver-top-productos', modulo: 'Dashboard', descripcion: 'Ver gráfico Top 10 Productos' },
  { codigo: 'dashboard.ver-top-clientes', modulo: 'Dashboard', descripcion: 'Ver gráfico Top 10 Clientes' },
  { codigo: 'dashboard.ver-detalles-ventas', modulo: 'Dashboard', descripcion: 'Ver tabla Detalles de Ventas' },

  { codigo: 'puntoventa.ver', modulo: 'Punto de Venta', descripcion: 'Acceder al punto de venta' },
  { codigo: 'puntoventa.facturar', modulo: 'Punto de Venta', descripcion: 'Guardar/emitir factura' },
  { codigo: 'puntoventa.aplicar-descuento', modulo: 'Punto de Venta', descripcion: 'Aplicar descuento a items' },
  { codigo: 'puntoventa.seleccionar-tipo-precio', modulo: 'Punto de Venta', descripcion: 'Cambiar tipo de precio' },

  { codigo: 'clientes.ver', modulo: 'Clientes', descripcion: 'Acceder al listado de clientes' },
  { codigo: 'clientes.crear', modulo: 'Clientes', descripcion: 'Crear nuevo cliente' },
  { codigo: 'clientes.editar', modulo: 'Clientes', descripcion: 'Editar datos de cliente' },
  { codigo: 'clientes.eliminar', modulo: 'Clientes', descripcion: 'Eliminar cliente' },

  { codigo: 'productos.ver', modulo: 'Productos', descripcion: 'Acceder a productos' },
  { codigo: 'productos.crear', modulo: 'Productos', descripcion: 'Crear nuevo producto' },
  { codigo: 'productos.editar', modulo: 'Productos', descripcion: 'Editar datos de producto' },
  { codigo: 'productos.eliminar', modulo: 'Productos', descripcion: 'Eliminar producto' },
  { codigo: 'productos.utilidad-ver', modulo: 'Productos', descripcion: 'Ver pestaña Utilidad' },
  { codigo: 'productos.utilidad-exportar', modulo: 'Productos', descripcion: 'Exportar utilidad a Excel' },
  { codigo: 'productos.editar-proveedor', modulo: 'Productos', descripcion: 'Modificar proveedor en tabla' },

  { codigo: 'ingresos.ver', modulo: 'Ingresos', descripcion: 'Acceder a órdenes de servicio' },
  { codigo: 'ingresos.crear', modulo: 'Ingresos', descripcion: 'Crear nueva orden de ingreso' },
  { codigo: 'ingresos.editar-equipo', modulo: 'Ingresos', descripcion: 'Editar equipo/marca/modelo/serie' },
  { codigo: 'ingresos.editar-trabajo', modulo: 'Ingresos', descripcion: 'Editar campo trabajo' },
  { codigo: 'ingresos.editar-total', modulo: 'Ingresos', descripcion: 'Editar total de la orden' },
  { codigo: 'ingresos.editar-observacion', modulo: 'Ingresos', descripcion: 'Editar observación de orden' },
  { codigo: 'ingresos.abonar', modulo: 'Ingresos', descripcion: 'Registrar abono a orden' },
  { codigo: 'ingresos.eliminar', modulo: 'Ingresos', descripcion: 'Eliminar orden de ingreso' },
  { codigo: 'ingresos.imprimir', modulo: 'Ingresos', descripcion: 'Imprimir orden de ingreso' },
  { codigo: 'ingresos.ver-detalle', modulo: 'Ingresos', descripcion: 'Ver detalle de orden' },
  { codigo: 'ingresos.facturar-ingreso', modulo: 'Ingresos', descripcion: 'Facturar desde ingreso' },

  { codigo: 'facturas.ver', modulo: 'Facturas', descripcion: 'Acceder al histórico de facturas' },
  { codigo: 'facturas.reimprimir', modulo: 'Facturas', descripcion: 'Reimprimir factura' },
  { codigo: 'facturas.anular', modulo: 'Facturas', descripcion: 'Anular factura' },
  { codigo: 'facturas.editar-forma-pago', modulo: 'Facturas', descripcion: 'Editar forma de pago' },

  { codigo: 'creditos.ver', modulo: 'Créditos', descripcion: 'Acceder al listado de créditos' },
  { codigo: 'creditos.abonar', modulo: 'Créditos', descripcion: 'Registrar abono a crédito' },
  { codigo: 'creditos.ver-pagos', modulo: 'Créditos', descripcion: 'Ver historial de pagos' },
  { codigo: 'creditos.anular', modulo: 'Créditos', descripcion: 'Anular crédito' },

  { codigo: 'proformas.ver', modulo: 'Proformas', descripcion: 'Acceder a proformas' },
  { codigo: 'proformas.crear', modulo: 'Proformas', descripcion: 'Crear nueva proforma' },
  { codigo: 'proformas.eliminar', modulo: 'Proformas', descripcion: 'Eliminar proforma' },

  { codigo: 'retiros.ver', modulo: 'Retiros', descripcion: 'Acceder a retiros/egresos' },
  { codigo: 'retiros.ver-historico', modulo: 'Retiros', descripcion: 'Ver tabla histórico de retiros' },
  { codigo: 'retiros.crear', modulo: 'Retiros', descripcion: 'Registrar nuevo retiro/gasto' },
  { codigo: 'retiros.eliminar', modulo: 'Retiros', descripcion: 'Eliminar retiro' },

  { codigo: 'gastos.ver', modulo: 'Gastos', descripcion: 'Acceder a caja chica' },
  { codigo: 'gastos.crear', modulo: 'Gastos', descripcion: 'Registrar nuevo gasto' },
  { codigo: 'gastos.editar', modulo: 'Gastos', descripcion: 'Editar gasto existente' },
  { codigo: 'gastos.eliminar', modulo: 'Gastos', descripcion: 'Eliminar gasto' },
  { codigo: 'gastos.categorias-ver', modulo: 'Gastos', descripcion: 'Acceder a categorías de gastos' },
  { codigo: 'gastos.categorias-crear', modulo: 'Gastos', descripcion: 'Crear categoría de gasto' },
  { codigo: 'gastos.categorias-editar', modulo: 'Gastos', descripcion: 'Editar categoría de gasto' },
  { codigo: 'gastos.categorias-eliminar', modulo: 'Gastos', descripcion: 'Eliminar categoría de gasto' },
  { codigo: 'gastos.resumen-ver', modulo: 'Gastos', descripcion: 'Ver reporte/resumen de gastos' },

  { codigo: 'reportes.ver', modulo: 'Reportes', descripcion: 'Acceder a reportes básicos' },
  { codigo: 'reportes.ventas-diarias', modulo: 'Reportes', descripcion: 'Ver reporte ventas diarias' },
  { codigo: 'reportes.ingresos-empleado', modulo: 'Reportes', descripcion: 'Ver reporte ingresos por empleado' },

  { codigo: 'reportes-avanzados.ver', modulo: 'Reportes Avanzados', descripcion: 'Acceder a reportes avanzados' },
  { codigo: 'reportes-avanzados.utilidades', modulo: 'Reportes Avanzados', descripcion: 'Ver reporte utilidades' },
  { codigo: 'reportes-avanzados.inventario', modulo: 'Reportes Avanzados', descripcion: 'Ver inventario valorizado' },
  { codigo: 'reportes-avanzados.cuentas-cobrar', modulo: 'Reportes Avanzados', descripcion: 'Ver cuentas por cobrar' },
  { codigo: 'reportes-avanzados.ventas-producto', modulo: 'Reportes Avanzados', descripcion: 'Ver ventas por producto' },
  { codigo: 'reportes-avanzados.ventas-cliente', modulo: 'Reportes Avanzados', descripcion: 'Ver ventas por cliente' },
  { codigo: 'reportes-avanzados.comparativo', modulo: 'Reportes Avanzados', descripcion: 'Ver comparativo mensual' },
  { codigo: 'reportes-avanzados.exportar-excel', modulo: 'Reportes Avanzados', descripcion: 'Exportar reporte a Excel' },
  { codigo: 'reportes-avanzados.exportar-pdf', modulo: 'Reportes Avanzados', descripcion: 'Exportar reporte a PDF' },

  { codigo: 'kardex.ver', modulo: 'Kardex', descripcion: 'Acceder al kardex' },
  { codigo: 'kardex.ajuste', modulo: 'Kardex', descripcion: 'Realizar ajuste de stock' },
  { codigo: 'kardex.entrada', modulo: 'Kardex', descripcion: 'Registrar entrada de productos' },
  { codigo: 'kardex.transferencia', modulo: 'Kardex', descripcion: 'Transferir entre bodegas' },
  { codigo: 'kardex.exportar-excel', modulo: 'Kardex', descripcion: 'Exportar kardex a Excel' },

  { codigo: 'usuarios.ver', modulo: 'Usuarios', descripcion: 'Acceder a gestión de usuarios' },
  { codigo: 'usuarios.crear', modulo: 'Usuarios', descripcion: 'Crear nuevo usuario' },
  { codigo: 'usuarios.editar', modulo: 'Usuarios', descripcion: 'Editar usuario existente' },
  { codigo: 'usuarios.eliminar', modulo: 'Usuarios', descripcion: 'Eliminar usuario' },
  { codigo: 'usuarios.cambiar-password', modulo: 'Usuarios', descripcion: 'Cambiar contraseña de usuario' },

  { codigo: 'periodo.crear', modulo: 'Periodo', descripcion: 'Crear/abrir nuevo periodo' },
  { codigo: 'periodo.finalizar', modulo: 'Periodo', descripcion: 'Finalizar/cerrar periodo' }
];

const agruparPorModulo = (permisos) => {
  const grupos = {};
  permisos.forEach((p) => {
    if (!grupos[p.modulo]) grupos[p.modulo] = [];
    grupos[p.modulo].push(p);
  });
  return grupos;
};

const MODULO_COLORS = {
  'Dashboard': colors.indigo[600],
  'Punto de Venta': colors.blue[600],
  'Clientes': colors.teal[600],
  'Productos': colors.green[600],
  'Ingresos': colors.orange[700],
  'Facturas': colors.purple[600],
  'Créditos': colors.amber[800],
  'Proformas': colors.cyan[700],
  'Retiros': colors.red[400],
  'Gastos': colors.pink[600],
  'Reportes': colors.lightBlue[700],
  'Reportes Avanzados': colors.deepPurple[500],
  'Kardex': colors.brown[500],
  'Usuarios': colors.blueGrey[600],
  'Periodo': colors.grey[700]
};

const PANTALLA_HREF_TO_MODULO = {
  '/app/dashboard': 'Dashboard',
  '/app/puntoventa': 'Punto de Venta',
  '/app/ingreso': 'Ingresos',
  '/app/customers': 'Clientes',
  '/app/products': 'Productos',
  '/app/kardex': 'Kardex',
  '/app/creditos': 'Créditos',
  '/app/facturas': 'Facturas',
  '/app/reportes': 'Reportes',
  '/app/proformas': 'Proformas',
  '/app/ingresoEgreso': 'Retiros',
  '/app/gastos': 'Gastos',
  '/app/reportes-avanzados': 'Reportes Avanzados',
  '/app/usuarios': 'Usuarios',
  '/app/contabilidad': 'Contabilidad'
};

const MODULO_TO_HREF = Object.entries(PANTALLA_HREF_TO_MODULO).reduce((acc, [href, modulo]) => {
  acc[modulo] = href;
  return acc;
}, {});

const ORDEN_MODULOS = [
  'Dashboard', 'Punto de Venta', 'Ingresos', 'Clientes',
  'Productos', 'Kardex',
  'Créditos', 'Facturas', 'Proformas', 'Retiros', 'Gastos',
  'Reportes', 'Reportes Avanzados', 'Usuarios', 'Contabilidad', 'Periodo'
];

const PARENT_GROUPS = { 'Productos y Servicios': ['Productos', 'Kardex'] };

const flattenCatalogo = (catalogoPantallas) => {
  const result = [];
  catalogoPantallas.forEach((item) => {
    if (item.href) {
      result.push({ href: item.href, title: item.title, parentTitle: null });
    }
    if (item.children && item.children.length > 0) {
      item.children.forEach((hijo) => {
        if (hijo.href) {
          result.push({ href: hijo.href, title: hijo.title, parentTitle: item.title });
        }
      });
    }
  });
  return result;
};

const TabPermisos = () => {
  const { tiposUsuario } = useContext(UsuariosContext);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [permisosActivos, setPermisosActivos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [catalogo, setCatalogo] = useState(CATALOGO_PERMISOS);

  const [catalogoPantallas, setCatalogoPantallas] = useState([]);
  const [pantallasAsignadas, setPantallasAsignadas] = useState([]);

  useEffect(() => {
    cargarCatalogoAPI();
    cargarCatalogoPantallas();
  }, []);

  useEffect(() => {
    if (tipoSeleccionado) {
      cargarPermisosDelTipo(tipoSeleccionado);
      cargarPantallasDelTipo(tipoSeleccionado);
    }
  }, [tipoSeleccionado]);

  // Mapa para normalizar nombres de módulos desde la API al nombre canónico con tildes
  const MODULO_NORMALIZE = {
    'Creditos': 'Créditos',
    'creditos': 'Créditos',
    'Proformas': 'Proformas',
    'Reportes avanzados': 'Reportes Avanzados'
  };

  const cargarCatalogoAPI = async () => {
    try {
      const response = await API.get('api/permisos');
      const data = response.data.data || response.data;
      if (data && typeof data === 'object') {
        const lista = [];
        Object.entries(data).forEach(([modulo, permisos]) => {
          let nombreModulo = modulo.charAt(0).toUpperCase() + modulo.slice(1).replace(/-/g, ' ');
          // Normalizar nombre del módulo para que coincida con ORDEN_MODULOS
          if (MODULO_NORMALIZE[nombreModulo]) {
            nombreModulo = MODULO_NORMALIZE[nombreModulo];
          }
          permisos.forEach((p) => {
            lista.push({
              codigo: p.codigo,
              modulo: nombreModulo,
              descripcion: p.descripcion
            });
          });
        });
        if (lista.length > 0) setCatalogo(lista);
      }
    } catch {
      // Usar catálogo estático como fallback
    }
  };

  const cargarPermisosDelTipo = async (tipoId) => {
    setIsLoading(true);
    try {
      const response = await API.get(`api/tipo-usuarios/${tipoId}/permisos`);
      const permisos = response.data.permisos || response.data || [];
      setPermisosActivos(permisos);
    } catch {
      setPermisosActivos([]);
      alertify.warning('No se pudieron cargar los permisos. El endpoint aún no está disponible.', 3);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermiso = (codigo) => {
    setPermisosActivos((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  const togglePantalla = (href) => {
    setPantallasAsignadas((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const toggleModuloCompleto = (modulo, permisos) => {
    const codigos = permisos.map((p) => p.codigo);
    const href = MODULO_TO_HREF[modulo];
    const tienePantalla = href && allHrefs.includes(href);

    const permisosActual = codigos.every((c) => permisosActivos.includes(c));
    const pantallaActual = tienePantalla ? pantallasAsignadas.includes(href) : true;
    const todosActivos = permisosActual && pantallaActual;

    if (todosActivos) {
      setPermisosActivos((prev) => prev.filter((c) => !codigos.includes(c)));
      if (tienePantalla) {
        setPantallasAsignadas((prev) => prev.filter((h) => h !== href));
      }
    } else {
      setPermisosActivos((prev) => [...new Set([...prev, ...codigos])]);
      if (tienePantalla && !pantallasAsignadas.includes(href)) {
        setPantallasAsignadas((prev) => [...prev, href]);
      }
    }
  };

  const cargarCatalogoPantallas = async () => {
    try {
      const response = await API.get('api/pantallas/catalogo');
      const data = response.data.catalogo || response.data.data || response.data;
      if (Array.isArray(data)) setCatalogoPantallas(data);
    } catch {
      // Silenciar error
    }
  };

  const cargarPantallasDelTipo = async (tipoId) => {
    try {
      const response = await API.get(`api/pantallas/tipo-usuario/${tipoId}`);
      const data = response.data.pantallas || response.data.data || response.data;
      setPantallasAsignadas(Array.isArray(data) ? data : []);
    } catch (err) {
      setPantallasAsignadas([]);
      if (err.response && err.response.status === 403) {
        alertify.error('No tiene permiso para ver las pantallas de este tipo de usuario', 3);
      }
    }
  };

  const guardarTodo = async () => {
    if (!tipoSeleccionado) return alertify.error('Seleccione un tipo de usuario', 2);
    setIsSavingAll(true);
    try {
      const results = await Promise.allSettled([
        API.post(`api/tipo-usuarios/${tipoSeleccionado}/permisos`, { permisos: permisosActivos }),
        API.post(`api/pantallas/tipo-usuario/${tipoSeleccionado}/asignar`, { pantallas: pantallasAsignadas })
      ]);

      const permisoResult = results[0];
      const pantallaResult = results[1];
      const permisoOk = permisoResult.status === 'fulfilled' && permisoResult.value.data.codigo === 200;
      const pantallaOk = pantallaResult.status === 'fulfilled' && pantallaResult.value.data.codigo === 200;

      if (permisoOk && pantallaOk) {
        alertify.success('Permisos y pantallas actualizados correctamente', 2);
      } else if (permisoOk && !pantallaOk) {
        alertify.warning('Permisos guardados, pero hubo un error al guardar pantallas', 3);
      } else if (!permisoOk && pantallaOk) {
        alertify.warning('Pantallas guardadas, pero hubo un error al guardar permisos', 3);
      } else {
        alertify.error('Error al guardar permisos y pantallas', 3);
      }
    } catch {
      alertify.error('Error al guardar. Verifique que los endpoints estén disponibles.', 3);
    } finally {
      setIsSavingAll(false);
    }
  };

  const tipoObj = tiposUsuario.find((t) => String(t.id) === String(tipoSeleccionado));
  const esSuperUsuario = tipoObj && tipoObj.tipo.toUpperCase() === 'SUPER USUARIO';

  const pantallasPlanas = flattenCatalogo(catalogoPantallas);
  const allHrefs = pantallasPlanas.map((p) => p.href);

  const grupos = agruparPorModulo(catalogo);
  const totalPermisos = catalogo.length;
  const totalActivos = permisosActivos.length;
  const totalPantallas = allHrefs.length;
  const totalPantallasActivas = allHrefs.filter((h) => pantallasAsignadas.includes(h)).length;

  // Build parent group lookup: modulo → parent group name
  const moduloToParent = {};
  Object.entries(PARENT_GROUPS).forEach(([parent, hijos]) => {
    hijos.forEach((hijo) => { moduloToParent[hijo] = parent; });
  });

  // Track which parent group labels have been rendered
  const parentGroupRendered = {};

  const renderModuloCard = (modulo) => {
    const permisos = grupos[modulo] || [];
    const href = MODULO_TO_HREF[modulo];
    const tienePantalla = href && allHrefs.includes(href);

    if (permisos.length === 0 && !tienePantalla) return null;

    const codigos = permisos.map((p) => p.codigo);
    const permisosDelModuloActivos = codigos.filter((c) => permisosActivos.includes(c)).length;
    const todosPermisosActivos = codigos.length > 0 && codigos.every((c) => permisosActivos.includes(c));
    const pantallaActiva = tienePantalla ? pantallasAsignadas.includes(href) : true;

    const totalItems = codigos.length + (tienePantalla ? 1 : 0);
    const totalItemsActivos = permisosDelModuloActivos + (tienePantalla && pantallasAsignadas.includes(href) ? 1 : 0);
    const todosActivos = totalItems > 0 && totalItemsActivos === totalItems;
    const algunoActivo = totalItemsActivos > 0;

    const colorModulo = MODULO_COLORS[modulo] || colors.grey[500];

    return (
      <Grid item xs={12} md={6} key={modulo}>
        <Card variant="outlined" style={{ height: '100%' }}>
          <CardContent style={{ paddingBottom: 16 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Chip
                label={modulo}
                size="small"
                style={{
                  backgroundColor: colorModulo,
                  color: '#fff',
                  fontWeight: 600
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={todosActivos}
                    indeterminate={algunoActivo && !todosActivos}
                    onChange={() => toggleModuloCompleto(modulo, permisos)}
                    color="primary"
                    size="small"
                    disabled={esSuperUsuario}
                  />
                }
                label={<Typography variant="caption" style={{ fontWeight: 600 }}>Todo</Typography>}
                labelPlacement="start"
                style={{ marginRight: 0 }}
              />
            </Box>

            {tienePantalla && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={pantallasAsignadas.includes(href)}
                    onChange={() => togglePantalla(href)}
                    color="primary"
                    size="small"
                    disabled={esSuperUsuario}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" style={{ gap: 6 }}>
                    <MenuIcon style={{ fontSize: 16, color: colors.grey[600] }} />
                    <Typography variant="body2">Mostrar en menú</Typography>
                  </Box>
                }
              />
            )}

            {tienePantalla && permisos.length > 0 && (
              <Divider style={{ margin: '6px 0' }} />
            )}

            {permisos.map((permiso) => (
              <Box key={permiso.codigo}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permisosActivos.includes(permiso.codigo)}
                      onChange={() => togglePermiso(permiso.codigo)}
                      color="primary"
                      size="small"
                      disabled={esSuperUsuario}
                    />
                  }
                  label={<Typography variant="body2">{permiso.descripcion}</Typography>}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Administración de Permisos
        </Typography>

        <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" style={{ gap: 12 }}>
          <TextField
            select
            variant="outlined"
            size="small"
            label="Tipo de usuario"
            value={tipoSeleccionado}
            onChange={(e) => setTipoSeleccionado(e.target.value)}
            style={{ minWidth: 250 }}
          >
            <MenuItem value="">Seleccione...</MenuItem>
            {tiposUsuario.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>
                {tipo.tipo}
              </MenuItem>
            ))}
          </TextField>

          {tipoSeleccionado && (
            <Chip
              label={`${totalActivos}/${totalPermisos} permisos | ${totalPantallasActivas}/${totalPantallas} pantallas`}
              style={{
                backgroundColor:
                  totalActivos === totalPermisos && totalPantallasActivas === totalPantallas
                    ? colors.green[100]
                    : colors.blue[50],
                color:
                  totalActivos === totalPermisos && totalPantallasActivas === totalPantallas
                    ? colors.green[800]
                    : colors.blue[800],
                fontWeight: 600
              }}
            />
          )}
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : tipoSeleccionado ? (
          <>
            {esSuperUsuario && (
              <Box mb={2} p={1.5} style={{ backgroundColor: colors.orange[50], borderRadius: 4 }}>
                <Typography variant="body2" style={{ color: colors.orange[800] }}>
                  El Super Usuario tiene acceso completo por defecto. Los cambios aquí no tendrán efecto.
                </Typography>
              </Box>
            )}

            <Grid container spacing={2}>
              {ORDEN_MODULOS.map((modulo) => {
                const elements = [];

                // Check if this modulo belongs to a parent group
                const parentName = moduloToParent[modulo];
                if (parentName && !parentGroupRendered[parentName]) {
                  parentGroupRendered[parentName] = true;
                  elements.push(
                    <Grid item xs={12} key={`group-${parentName}`}>
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: colors.grey[600],
                          fontWeight: 700,
                          marginTop: 8,
                          marginBottom: -4,
                          paddingLeft: 4
                        }}
                      >
                        ▸ {parentName}
                      </Typography>
                    </Grid>
                  );
                }

                const card = renderModuloCard(modulo);
                if (card) elements.push(card);

                return elements;
              })}
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={guardarTodo}
                disabled={isSavingAll || esSuperUsuario}
                style={{ minWidth: 200 }}
              >
                {isSavingAll ? 'Guardando...' : 'Guardar Todo'}
              </Button>
            </Box>
          </>
        ) : (
          <Box p={4} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              Seleccione un tipo de usuario para administrar sus permisos
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TabPermisos;
