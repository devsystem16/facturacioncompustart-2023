import React, { createContext, useState } from 'react';
import API from '../Environment/config';

export const ReportesAvanzadosContext = createContext();

const END_POINT = {
  utilidades: 'api/reportes/utilidades',
  abonosCreditos: 'api/reportes/abonos-creditos',
  inventarioValorizado: 'api/reportes/inventario-valorizado',
  cuentasPorCobrar: 'api/reportes/cuentas-por-cobrar',
  ventasPorProducto: 'api/reportes/ventas-por-producto',
  ventasPorCliente: 'api/reportes/ventas-por-cliente',
  comparativoMensual: 'api/reportes/comparativo-mensual',
  exportarExcel: 'api/reportes/exportar-excel',
  exportarPdf: 'api/reportes/exportar-pdf'
};

const ReportesAvanzadosProvider = (props) => {
  const [utilidades, setUtilidades] = useState(null);
  const [abonosCreditos, setAbonosCreditos] = useState(null);
  const [inventarioValorizado, setInventarioValorizado] = useState(null);
  const [cuentasPorCobrar, setCuentasPorCobrar] = useState(null);
  const [ventasPorProducto, setVentasPorProducto] = useState(null);
  const [ventasPorCliente, setVentasPorCliente] = useState(null);
  const [comparativoMensual, setComparativoMensual] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cargarUtilidades = async (fechaDesde, fechaHasta) => {
    try {
      setIsLoading(true);
      const [responseUtilidades, responseAbonos] = await Promise.all([
        API.post(END_POINT.utilidades, {
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta
        }),
        API.post(END_POINT.abonosCreditos, {
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta
        }).catch(() => ({ data: { data: { total_abonos: 0, detalle: [] } } }))
      ]);
      setUtilidades(responseUtilidades.data.data || null);
      setAbonosCreditos(responseAbonos.data.data || null);
      return responseUtilidades.data.data;
    } catch (error) {
      console.error('Error al cargar utilidades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarInventarioValorizado = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(END_POINT.inventarioValorizado);
      setInventarioValorizado(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar inventario valorizado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarCuentasPorCobrar = async () => {
    try {
      setIsLoading(true);
      const response = await API.post(END_POINT.cuentasPorCobrar, {});
      setCuentasPorCobrar(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar cuentas por cobrar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarVentasPorProducto = async (fechaDesde, fechaHasta) => {
    try {
      setIsLoading(true);
      const response = await API.post(END_POINT.ventasPorProducto, {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta
      });
      setVentasPorProducto(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar ventas por producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarVentasPorCliente = async (fechaDesde, fechaHasta) => {
    try {
      setIsLoading(true);
      const response = await API.post(END_POINT.ventasPorCliente, {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta
      });
      setVentasPorCliente(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar ventas por cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarComparativoMensual = async (anioDesde, anioHasta) => {
    try {
      setIsLoading(true);
      const body = anioHasta
        ? { anio_desde: anioDesde, anio_hasta: anioHasta }
        : { anio: anioDesde };
      const response = await API.post(END_POINT.comparativoMensual, body);
      setComparativoMensual(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar comparativo mensual:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportarExcel = async (tipoReporte, fechaDesde, fechaHasta) => {
    try {
      const response = await API.post(
        END_POINT.exportarExcel,
        { tipo_reporte: tipoReporte, fecha_desde: fechaDesde, fecha_hasta: fechaHasta },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', tipoReporte + '.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
    }
  };

  const exportarPdf = async (tipoReporte, fechaDesde, fechaHasta) => {
    try {
      const response = await API.post(
        END_POINT.exportarPdf,
        { tipo_reporte: tipoReporte, fecha_desde: fechaDesde, fecha_hasta: fechaHasta },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', tipoReporte + '.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    }
  };

  return (
    <ReportesAvanzadosContext.Provider
      value={{
        utilidades,
        abonosCreditos,
        inventarioValorizado,
        cuentasPorCobrar,
        ventasPorProducto,
        ventasPorCliente,
        comparativoMensual,
        isLoading,
        setIsLoading,
        cargarUtilidades,
        cargarInventarioValorizado,
        cargarCuentasPorCobrar,
        cargarVentasPorProducto,
        cargarVentasPorCliente,
        cargarComparativoMensual,
        exportarExcel,
        exportarPdf
      }}
    >
      {props.children}
    </ReportesAvanzadosContext.Provider>
  );
};

export default ReportesAvanzadosProvider;
