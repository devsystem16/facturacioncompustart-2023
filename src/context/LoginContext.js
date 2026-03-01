import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';

import API from '../Environment/config';
import PERMISOS_FALLBACK from '../Environment/Permisos.json';

export const LoginContext = createContext();

const END_POINT = {
  login: 'api/usuarios/acceso/login',
  obtenerAccesos: 'api/pantallapos/acceso/obtener-acceso',
  misPermisos: 'api/mis-permisos'
};

/**
 * Genera permisos desde el JSON estático como fallback
 * cuando el endpoint /api/mis-permisos no está disponible.
 */
const generarPermisosFallback = (tipoUsuario) => {
  const permisosMapa = PERMISOS_FALLBACK[tipoUsuario];
  if (!permisosMapa) return [];

  const mapeo = {
    'anular factura': 'facturas.anular',
    'reimprimir-factura': 'facturas.reimprimir',
    'anular-credito': 'creditos.anular',
    'abonar-credito': 'creditos.abonar',
    'historialpagos-credito': 'creditos.ver-pagos',
    'registrar-retiros': 'retiros.crear',
    'eliminar-retiros': 'retiros.eliminar',
    'finalizar-periodo': 'dashboard.finalizar-periodo'
  };

  // Permisos base desde el JSON
  const lista = [];
  Object.entries(permisosMapa).forEach(([key, activo]) => {
    if (activo && mapeo[key]) {
      lista.push(mapeo[key]);
    }
  });

  // Para SUPER USUARIO, otorgar todos los permisos
  if (tipoUsuario === 'SUPER USUARIO') {
    return [
      'dashboard.ver', 'dashboard.finalizar-periodo',
      'dashboard.ver-ventas-periodo', 'dashboard.ver-top-productos',
      'dashboard.ver-top-clientes', 'dashboard.ver-detalles-ventas',
      'puntoventa.ver', 'puntoventa.facturar', 'puntoventa.aplicar-descuento', 'puntoventa.seleccionar-tipo-precio',
      'clientes.ver', 'clientes.crear', 'clientes.editar', 'clientes.eliminar',
      'productos.ver', 'productos.crear', 'productos.editar', 'productos.eliminar',
      'productos.utilidad-ver', 'productos.utilidad-exportar',
      'ingresos.ver', 'ingresos.crear', 'ingresos.editar-equipo', 'ingresos.editar-trabajo',
      'ingresos.editar-total', 'ingresos.editar-observacion', 'ingresos.abonar',
      'ingresos.eliminar', 'ingresos.imprimir', 'ingresos.ver-detalle', 'ingresos.facturar-ingreso',
      'facturas.ver', 'facturas.reimprimir', 'facturas.anular',
      'creditos.ver', 'creditos.abonar', 'creditos.ver-pagos', 'creditos.anular',
      'proformas.ver', 'proformas.crear', 'proformas.eliminar',
      'retiros.ver', 'retiros.ver-historico', 'retiros.crear', 'retiros.eliminar',
      'gastos.ver', 'gastos.crear', 'gastos.editar', 'gastos.eliminar',
      'gastos.categorias-ver', 'gastos.categorias-crear', 'gastos.categorias-editar', 'gastos.categorias-eliminar',
      'gastos.resumen-ver',
      'reportes.ver', 'reportes.ventas-diarias', 'reportes.ingresos-empleado',
      'reportes-avanzados.ver', 'reportes-avanzados.utilidades', 'reportes-avanzados.inventario',
      'reportes-avanzados.cuentas-cobrar', 'reportes-avanzados.ventas-producto',
      'reportes-avanzados.ventas-cliente', 'reportes-avanzados.comparativo',
      'reportes-avanzados.exportar-excel', 'reportes-avanzados.exportar-pdf',
      'kardex.ver', 'kardex.ajuste', 'kardex.entrada', 'kardex.transferencia', 'kardex.exportar-excel',
      'usuarios.ver', 'usuarios.crear', 'usuarios.editar', 'usuarios.eliminar', 'usuarios.cambiar-password',
      'periodo.crear', 'periodo.finalizar',
      'contabilidad.ver', 'contabilidad.plan-cuentas-ver', 'contabilidad.plan-cuentas-crear',
      'contabilidad.plan-cuentas-editar', 'contabilidad.plan-cuentas-eliminar',
      'contabilidad.asientos-ver', 'contabilidad.asientos-crear', 'contabilidad.asientos-editar',
      'contabilidad.asientos-contabilizar', 'contabilidad.asientos-anular',
      'contabilidad.asientos-generar',
      'contabilidad.reportes-ver', 'contabilidad.reportes-libro-diario',
      'contabilidad.reportes-libro-mayor', 'contabilidad.reportes-balance-comprobacion',
      'contabilidad.reportes-balance-general', 'contabilidad.reportes-estado-resultados'
    ];
  }

  // Permisos por defecto para otros roles
  const permisosBase = [
    'dashboard.ver', 'puntoventa.ver', 'puntoventa.facturar',
    'clientes.ver', 'productos.ver', 'ingresos.ver',
    'facturas.ver', 'creditos.ver', 'proformas.ver',
    'retiros.ver', 'gastos.ver', 'reportes.ver'
  ];

  if (tipoUsuario === 'ATENCION AL PUBLICO') {
    return [
      ...permisosBase,
      'dashboard.ver-ventas-periodo', 'dashboard.ver-top-productos',
      'dashboard.ver-top-clientes', 'dashboard.ver-detalles-ventas',
      'clientes.crear', 'clientes.editar',
      'productos.crear', 'productos.editar',
      'ingresos.crear', 'ingresos.editar-trabajo', 'ingresos.editar-observacion',
      'ingresos.ver-detalle',
      'proformas.crear',
      'periodo.crear',
      ...lista
    ];
  }

  if (tipoUsuario === 'TECNICO') {
    return [
      ...permisosBase,
      'ingresos.editar-trabajo', 'ingresos.editar-observacion',
      'ingresos.ver-detalle',
      ...lista
    ];
  }

  return [...permisosBase, ...lista];
};

const LoginProvider = (props) => {
  const [isReload, setIsReload] = useState(true);
  const [edicionActiva, setEdicionActiva] = useState(false);
  const [pestaniaActiva, setPestaniaActiva] = useState('Dashboard');
  const [permisos, setPermisos] = useState([]);
  const [items, setItems] = useState([]);

  const [credenciales, setCredenciales] = useState({
    login: 0,
    usuario: '',
    nombres: '',
    tipo: ''
  });
  const [userloggin, setUserloggin] = useState({
    avatar: '/static/images/avatars/avatar_6.png',
    jobTitle: 'Facturacion',
    name: 'Facturacion'
  });

  useEffect(() => {
    if (localStorage.getItem('tipousuario_id') !== null) {
      obtenerAccesos(localStorage.getItem('tipousuario_id'));
      // Cargar permisos frescos desde la BD
      cargarPermisos();
    } else {
      // Sin sesión activa, usar fallback
      const tipo = localStorage.getItem('tipo_usuario');
      if (tipo) setPermisos(generarPermisosFallback(tipo));
    }
  }, [isReload]);

  const obtenerAccesos = async (tipoUsuario) => {
    const response = await API.get(
      END_POINT.obtenerAccesos + '/' + tipoUsuario
    );
    setItems([...response.data]);
  };

  const cargarPermisos = async () => {
    try {
      const tipoUsuarioId = localStorage.getItem('tipousuario_id');
      if (!tipoUsuarioId) throw new Error('No tipousuario_id');
      const response = await API.get(`${END_POINT.misPermisos}/${tipoUsuarioId}`);
      const lista = response.data.permisos || response.data || [];
      setPermisos(lista);
      localStorage.setItem('permisos', JSON.stringify(lista));
      return lista;
    } catch (error) {
      console.warn('Endpoint /api/mis-permisos no disponible, usando fallback');
      const tipo = localStorage.getItem('tipo_usuario');
      const fallback = generarPermisosFallback(tipo);
      setPermisos(fallback);
      localStorage.setItem('permisos', JSON.stringify(fallback));
      return fallback;
    }
  };

  const tienePermiso = (codigo) => {
    const tipo = localStorage.getItem('tipo_usuario');
    if (tipo === 'SUPER USUARIO') return true;
    return permisos.includes(codigo);
  };

  const login = async (usuario) => {
    const response = await API.post(END_POINT.login, usuario);

    if (response.data.login === 1) {
      await obtenerAccesos(response.data.tipousuario_id);
    }

    return response.data;
  };

  return (
    <>
      <LoginContext.Provider
        value={{
          isReload,
          setIsReload,
          login,
          credenciales,
          setCredenciales,
          userloggin,
          setUserloggin,
          items,
          edicionActiva, setEdicionActiva,
          pestaniaActiva, setPestaniaActiva,
          permisos,
          setPermisos,
          cargarPermisos,
          tienePermiso
        }}
      >
        {props.children}
      </LoginContext.Provider>
    </>
  );
};

export default LoginProvider;
