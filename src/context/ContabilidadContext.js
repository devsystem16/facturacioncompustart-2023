import React, { createContext, useState } from 'react';
import alertify from 'alertifyjs';
import API from '../Environment/config';

const END_POINT = {
  cuentas: 'api/cuenta-contables',
  cuentasLista: 'api/cuenta-contables/lista',
  asientos: 'api/asientos-contables',
  libroDiario: 'api/contabilidad/libro-diario',
  libroMayor: 'api/contabilidad/libro-mayor',
  balanceComprobacion: 'api/contabilidad/balance-comprobacion',
  balanceGeneral: 'api/contabilidad/balance-general',
  estadoResultados: 'api/contabilidad/estado-resultados'
};

export const ContabilidadContext = createContext();

const ContabilidadProvider = (props) => {
  // Plan de cuentas
  const [cuentasArbol, setCuentasArbol] = useState([]);
  const [cuentasDetalle, setCuentasDetalle] = useState([]);
  const [loadingCuentas, setLoadingCuentas] = useState(false);

  // Asientos
  const [asientos, setAsientos] = useState([]);
  const [loadingAsientos, setLoadingAsientos] = useState(false);
  const [paginacionAsientos, setPaginacionAsientos] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0
  });
  const [filtrosAsientos, setFiltrosAsientos] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    tipo: '',
    estado: '',
    limite: 50
  });

  // Reportes
  const [loadingReporte, setLoadingReporte] = useState(false);

  // ─── PLAN DE CUENTAS ───

  const obtenerCuentasArbol = async () => {
    setLoadingCuentas(true);
    try {
      const response = await API.get(END_POINT.cuentas);
      setCuentasArbol(response.data.data || response.data);
    } catch (error) {
      alertify.error('Error al obtener plan de cuentas', 2);
    }
    setLoadingCuentas(false);
  };

  const obtenerCuentasDetalle = async () => {
    try {
      const response = await API.get(END_POINT.cuentasLista);
      setCuentasDetalle(response.data.data || response.data);
    } catch (error) {
      alertify.error('Error al obtener cuentas de detalle', 2);
    }
  };

  const crearCuenta = async (data) => {
    try {
      const response = await API.post(END_POINT.cuentas, data);
      alertify.success(response.data.mensaje || 'Cuenta creada', 2);
      obtenerCuentasArbol();
      obtenerCuentasDetalle();
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al crear cuenta';
      alertify.error(msg, 2);
      return false;
    }
  };

  const editarCuenta = async (id, data) => {
    try {
      const response = await API.put(`${END_POINT.cuentas}/${id}`, data);
      alertify.success(response.data.mensaje || 'Cuenta actualizada', 2);
      obtenerCuentasArbol();
      obtenerCuentasDetalle();
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al editar cuenta';
      alertify.error(msg, 2);
      return false;
    }
  };

  const eliminarCuenta = async (id) => {
    try {
      const response = await API.delete(`${END_POINT.cuentas}/${id}`);
      alertify.success(response.data.mensaje || 'Cuenta eliminada', 2);
      obtenerCuentasArbol();
      obtenerCuentasDetalle();
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al eliminar cuenta';
      alertify.error(msg, 2);
      return false;
    }
  };

  // ─── ASIENTOS CONTABLES ───

  const obtenerAsientos = async (page = 1) => {
    setLoadingAsientos(true);
    try {
      const params = { page, limite: filtrosAsientos.limite };
      if (filtrosAsientos.fecha_desde) params.fecha_desde = filtrosAsientos.fecha_desde;
      if (filtrosAsientos.fecha_hasta) params.fecha_hasta = filtrosAsientos.fecha_hasta;
      if (filtrosAsientos.tipo) params.tipo = filtrosAsientos.tipo;
      if (filtrosAsientos.estado) params.estado = filtrosAsientos.estado;

      const response = await API.get(END_POINT.asientos, { params });
      setAsientos(response.data.data || []);
      setPaginacionAsientos({
        current_page: response.data.current_page || 1,
        last_page: response.data.last_page || 1,
        per_page: response.data.per_page || 50,
        total: response.data.total || 0
      });
    } catch (error) {
      alertify.error('Error al obtener asientos', 2);
    }
    setLoadingAsientos(false);
  };

  const crearAsiento = async (data) => {
    try {
      const response = await API.post(END_POINT.asientos, data);
      alertify.success(response.data.mensaje || 'Asiento creado', 2);
      obtenerAsientos(paginacionAsientos.current_page);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al crear asiento';
      alertify.error(msg, 2);
      return false;
    }
  };

  const obtenerAsientoDetalle = async (id) => {
    try {
      const response = await API.get(`${END_POINT.asientos}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      alertify.error('Error al obtener detalle del asiento', 2);
      return null;
    }
  };

  const editarAsiento = async (id, data) => {
    try {
      const response = await API.put(`${END_POINT.asientos}/${id}`, data);
      alertify.success(response.data.mensaje || 'Asiento actualizado', 2);
      obtenerAsientos(paginacionAsientos.current_page);
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al editar asiento';
      alertify.error(msg, 2);
      return false;
    }
  };

  const contabilizarAsiento = async (id) => {
    try {
      const response = await API.post(`${END_POINT.asientos}/${id}/contabilizar`);
      alertify.success(response.data.mensaje || 'Asiento contabilizado', 2);
      obtenerAsientos(paginacionAsientos.current_page);
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al contabilizar';
      alertify.error(msg, 2);
      return false;
    }
  };

  const anularAsiento = async (id) => {
    try {
      const response = await API.post(`${END_POINT.asientos}/${id}/anular`);
      alertify.success(response.data.mensaje || 'Asiento anulado', 2);
      obtenerAsientos(paginacionAsientos.current_page);
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al anular asiento';
      alertify.error(msg, 2);
      return false;
    }
  };

  // ─── REPORTES ───

  const obtenerLibroDiario = async (fechas) => {
    setLoadingReporte(true);
    try {
      const response = await API.post(END_POINT.libroDiario, fechas);
      setLoadingReporte(false);
      return response.data;
    } catch (error) {
      alertify.error('Error al obtener libro diario', 2);
      setLoadingReporte(false);
      return null;
    }
  };

  const obtenerLibroMayor = async (params) => {
    setLoadingReporte(true);
    try {
      const response = await API.post(END_POINT.libroMayor, params);
      setLoadingReporte(false);
      return response.data;
    } catch (error) {
      alertify.error('Error al obtener libro mayor', 2);
      setLoadingReporte(false);
      return null;
    }
  };

  const obtenerBalanceComprobacion = async (fechas) => {
    setLoadingReporte(true);
    try {
      const response = await API.post(END_POINT.balanceComprobacion, fechas);
      setLoadingReporte(false);
      return response.data;
    } catch (error) {
      alertify.error('Error al obtener balance de comprobacion', 2);
      setLoadingReporte(false);
      return null;
    }
  };

  const obtenerBalanceGeneral = async (params) => {
    setLoadingReporte(true);
    try {
      const response = await API.post(END_POINT.balanceGeneral, params);
      setLoadingReporte(false);
      return response.data;
    } catch (error) {
      alertify.error('Error al obtener balance general', 2);
      setLoadingReporte(false);
      return null;
    }
  };

  const obtenerEstadoResultados = async (fechas) => {
    setLoadingReporte(true);
    try {
      const response = await API.post(END_POINT.estadoResultados, fechas);
      setLoadingReporte(false);
      return response.data;
    } catch (error) {
      alertify.error('Error al obtener estado de resultados', 2);
      setLoadingReporte(false);
      return null;
    }
  };

  return (
    <ContabilidadContext.Provider
      value={{
        // Plan de cuentas
        cuentasArbol,
        cuentasDetalle,
        loadingCuentas,
        obtenerCuentasArbol,
        obtenerCuentasDetalle,
        crearCuenta,
        editarCuenta,
        eliminarCuenta,
        // Asientos
        asientos,
        loadingAsientos,
        paginacionAsientos,
        filtrosAsientos,
        setFiltrosAsientos,
        obtenerAsientos,
        crearAsiento,
        obtenerAsientoDetalle,
        editarAsiento,
        contabilizarAsiento,
        anularAsiento,
        // Reportes
        loadingReporte,
        obtenerLibroDiario,
        obtenerLibroMayor,
        obtenerBalanceComprobacion,
        obtenerBalanceGeneral,
        obtenerEstadoResultados
      }}
    >
      {props.children}
    </ContabilidadContext.Provider>
  );
};

export default ContabilidadProvider;
