import React, { createContext, useState } from 'react';
import API from '../Environment/config';

export const DashboardContext = createContext();

const END_POINT = {
  resumen: 'api/dashboard/resumen',
  ventasPeriodo: 'api/dashboard/ventas-periodo',
  topProductos: 'api/dashboard/top-productos',
  topClientes: 'api/dashboard/top-clientes',
  stockBajo: 'api/dashboard/stock-bajo',
  creditosPendientes: 'api/dashboard/creditos-pendientes'
};

const DashboardProvider = (props) => {
  const [resumen, setResumen] = useState(null);
  const [ventasPeriodo, setVentasPeriodo] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [creditosPendientes, setCreditosPendientes] = useState(null);
  const [creditosVencidos, setCreditosVencidos] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cargarResumen = async () => {
    try {
      const response = await API.get(END_POINT.resumen);
      setResumen(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
  };

  const cargarVentasPeriodo = async (tipo = 'diario', fechaDesde, fechaHasta) => {
    try {
      let url = END_POINT.ventasPeriodo + '?tipo=' + tipo;
      if (fechaDesde) url += '&fecha_desde=' + fechaDesde;
      if (fechaHasta) url += '&fecha_hasta=' + fechaHasta;
      const response = await API.get(url);
      setVentasPeriodo(response.data.data || []);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar ventas por período:', error);
    }
  };

  const cargarTopProductos = async (fechaDesde, fechaHasta) => {
    try {
      let url = END_POINT.topProductos;
      const params = [];
      if (fechaDesde) params.push('fecha_desde=' + fechaDesde);
      if (fechaHasta) params.push('fecha_hasta=' + fechaHasta);
      if (params.length > 0) url += '?' + params.join('&');
      const response = await API.get(url);
      setTopProductos(response.data.data || []);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar top productos:', error);
    }
  };

  const cargarTopClientes = async (fechaDesde, fechaHasta) => {
    try {
      let url = END_POINT.topClientes;
      const params = [];
      if (fechaDesde) params.push('fecha_desde=' + fechaDesde);
      if (fechaHasta) params.push('fecha_hasta=' + fechaHasta);
      if (params.length > 0) url += '?' + params.join('&');
      const response = await API.get(url);
      setTopClientes(response.data.data || []);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar top clientes:', error);
    }
  };

  const cargarStockBajo = async (umbral = 5) => {
    try {
      const response = await API.get(END_POINT.stockBajo + '?umbral=' + umbral);
      setProductosStockBajo(response.data.data || []);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar stock bajo:', error);
    }
  };

  const cargarCreditosPendientes = async () => {
    try {
      const response = await API.get(END_POINT.creditosPendientes);
      setCreditosPendientes(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar créditos pendientes:', error);
    }
  };

  const cargarCreditosVencidos = async () => {
    try {
      const response = await API.get('api/dashboard/creditos-vencidos');
      setCreditosVencidos(response.data.data || null);
      return response.data.data;
    } catch (error) {
      // Endpoint puede no existir aún en el backend
      console.warn('Endpoint creditos-vencidos no disponible:', error?.response?.status);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        resumen,
        ventasPeriodo,
        topProductos,
        topClientes,
        productosStockBajo,
        creditosPendientes,
        creditosVencidos,
        isLoading,
        setIsLoading,
        cargarResumen,
        cargarVentasPeriodo,
        cargarTopProductos,
        cargarTopClientes,
        cargarStockBajo,
        cargarCreditosPendientes,
        cargarCreditosVencidos
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
