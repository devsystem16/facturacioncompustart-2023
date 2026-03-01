import React, { createContext, useState } from 'react';
import API from '../Environment/config';

export const UtilidadProductosContext = createContext();

const END_POINT = {
  listar: 'api/utilidad-productos',
  exportarExcel: 'api/utilidad-productos/export-excel',
  bodegas: 'api/bodegas'
};

const UtilidadProductosProvider = (props) => {
  const [productos, setProductos] = useState([]);
  const [totales, setTotales] = useState({
    total_costo: 0,
    total_utilidad: 0,
    total_stock: 0
  });
  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 25,
    total: 0
  });
  const [bodegas, setBodegas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const cargarBodegas = async () => {
    try {
      const response = await API.get(END_POINT.bodegas);
      setBodegas(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error al cargar bodegas:', error);
    }
  };

  const cargarProductos = async (params = {}) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      if (params.bodega_id && params.bodega_id !== 'todos') {
        queryParams.append('bodega_id', params.bodega_id);
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }
      queryParams.append('per_page', params.per_page || 25);
      queryParams.append('page', params.page || 1);

      const response = await API.get(
        END_POINT.listar + '?' + queryParams.toString()
      );

      setProductos(response.data.data || []);
      setMeta(response.data.meta || { current_page: 1, per_page: 25, total: 0 });
      setTotales(response.data.totales || { total_costo: 0, total_utilidad: 0, total_stock: 0 });
    } catch (error) {
      console.error('Error al cargar utilidad de productos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportarExcel = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.bodega_id && params.bodega_id !== 'todos') {
        queryParams.append('bodega_id', params.bodega_id);
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }

      const response = await API.get(
        END_POINT.exportarExcel + '?' + queryParams.toString(),
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'utilidad_productos.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
    }
  };

  return (
    <UtilidadProductosContext.Provider
      value={{
        productos,
        totales,
        meta,
        bodegas,
        isLoading,
        cargarBodegas,
        cargarProductos,
        exportarExcel
      }}
    >
      {props.children}
    </UtilidadProductosContext.Provider>
  );
};

export default UtilidadProductosProvider;
