import React, { createContext, useState } from 'react';
import alertify from 'alertifyjs';
import API from '../Environment/config';

const END_POINT = {
  kardex: 'api/kardex',
  exportExcel: 'api/kardex/export-excel',
  bodegas: 'api/bodegas',
  ajuste: 'api/kardex/ajuste',
  entrada: 'api/kardex/entrada',
  transferencia: 'api/kardex/transferencia'
};

export const KardexContext = createContext();

const KardexProvider = (props) => {
  const [movimientos, setMovimientos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginacion, setPaginacion] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0
  });
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    tipo: '',
    bodega_id: '',
    search: '',
    per_page: 25
  });

  // Modals
  const [modalAjuste, setModalAjuste] = useState(false);
  const [modalEntrada, setModalEntrada] = useState(false);
  const [modalTransferencia, setModalTransferencia] = useState(false);

  const obtenerMovimientos = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, per_page: filtros.per_page };
      if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio;
      if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin;
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.bodega_id) params.bodega_id = filtros.bodega_id;
      if (filtros.search) params.search = filtros.search;

      const response = await API.get(END_POINT.kardex, { params });
      setMovimientos(response.data.data);
      setPaginacion({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total
      });
    } catch (error) {
      alertify.error('Error al obtener movimientos', 2);
    }
    setLoading(false);
  };

  const obtenerBodegas = async () => {
    try {
      const response = await API.get(END_POINT.bodegas);
      setBodegas(response.data);
    } catch (error) {
      alertify.error('Error al obtener bodegas', 2);
    }
  };

  const exportarExcel = async () => {
    try {
      const params = {};
      if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio;
      if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin;
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.bodega_id) params.bodega_id = filtros.bodega_id;
      if (filtros.search) params.search = filtros.search;

      const response = await API.get(END_POINT.exportExcel, {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'kardex.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alertify.error('Error al exportar Excel', 2);
    }
  };

  const registrarAjuste = async (data) => {
    try {
      const response = await API.post(END_POINT.ajuste, data);
      alertify.success(response.data.mensaje || 'Ajuste registrado', 2);
      setModalAjuste(false);
      obtenerMovimientos(paginacion.current_page);
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al registrar ajuste';
      alertify.error(msg, 2);
      return false;
    }
  };

  const registrarEntrada = async (data) => {
    try {
      const response = await API.post(END_POINT.entrada, data);
      alertify.success(response.data.mensaje || 'Entrada registrada', 2);
      setModalEntrada(false);
      obtenerMovimientos(paginacion.current_page);
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al registrar entrada';
      alertify.error(msg, 2);
      return false;
    }
  };

  const registrarTransferencia = async (data) => {
    try {
      const response = await API.post(END_POINT.transferencia, data);
      alertify.success(response.data.mensaje || 'Transferencia registrada', 2);
      setModalTransferencia(false);
      obtenerMovimientos(paginacion.current_page);
      return true;
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al registrar transferencia';
      alertify.error(msg, 2);
      return false;
    }
  };

  return (
    <KardexContext.Provider
      value={{
        movimientos,
        bodegas,
        loading,
        paginacion,
        filtros,
        setFiltros,
        modalAjuste,
        setModalAjuste,
        modalEntrada,
        setModalEntrada,
        modalTransferencia,
        setModalTransferencia,
        obtenerMovimientos,
        obtenerBodegas,
        exportarExcel,
        registrarAjuste,
        registrarEntrada,
        registrarTransferencia
      }}
    >
      {props.children}
    </KardexContext.Provider>
  );
};

export default KardexProvider;
