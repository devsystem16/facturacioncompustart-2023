import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../Environment/config';
import { PeriodoContext } from './PeriodoContext';

export const GastosContext = createContext();

const END_POINT = {
  categorias: 'api/categoria-gastos',
  gastos: 'api/gastos',
  gastosPorCategoria: 'api/gastos/por-categoria',
  balanceCaja: 'api/gastos/balance-caja'
};

const GastosProvider = (props) => {
  const { periodo, periodoActivo } = useContext(PeriodoContext);

  const [categorias, setCategorias] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [gastosPorCategoria, setGastosPorCategoria] = useState(null);
  const [balanceCaja, setBalanceCaja] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recargarGastos, setRecargarGastos] = useState(true);
  const [recargarCategorias, setRecargarCategorias] = useState(true);

  useEffect(() => {
    if (recargarCategorias) {
      cargarCategorias();
      setRecargarCategorias(false);
    }
  }, [recargarCategorias]);

  useEffect(() => {
    if (recargarGastos && periodoActivo) {
      cargarGastos();
      setRecargarGastos(false);
    }
  }, [recargarGastos, periodoActivo]);

  const cargarCategorias = async () => {
    try {
      const response = await API.get(END_POINT.categorias);
      setCategorias(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const crearCategoria = async (categoria) => {
    const response = await API.post(END_POINT.categorias, categoria);
    return response.data;
  };

  const actualizarCategoria = async (id, categoria) => {
    const response = await API.put(END_POINT.categorias + '/' + id, categoria);
    return response.data;
  };

  const eliminarCategoria = async (id) => {
    const response = await API.delete(END_POINT.categorias + '/' + id);
    return response.data;
  };

  const cargarGastos = async () => {
    try {
      const response = await API.get(END_POINT.gastos);
      const data = response.data.data || {};
      setGastos(data.gastos || []);
      setTotalGastos(data.total_gastos || 0);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    }
  };

  const crearGasto = async (gasto) => {
    const response = await API.post(END_POINT.gastos, gasto);
    return response.data;
  };

  const actualizarGasto = async (id, gasto) => {
    const response = await API.put(END_POINT.gastos + '/' + id, gasto);
    return response.data;
  };

  const eliminarGasto = async (id) => {
    const response = await API.delete(END_POINT.gastos + '/' + id);
    return response.data;
  };

  const cargarGastosPorCategoria = async (fechaDesde, fechaHasta) => {
    try {
      const response = await API.post(END_POINT.gastosPorCategoria, {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta
      });
      setGastosPorCategoria(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar gastos por categoría:', error);
    }
  };

  const cargarBalanceCaja = async (fechaDesde, fechaHasta) => {
    try {
      const response = await API.post(END_POINT.balanceCaja, {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta
      });
      setBalanceCaja(response.data.data || null);
      return response.data.data;
    } catch (error) {
      console.error('Error al cargar balance de caja:', error);
    }
  };

  return (
    <GastosContext.Provider
      value={{
        categorias,
        gastos,
        totalGastos,
        gastosPorCategoria,
        balanceCaja,
        isLoading,
        setIsLoading,
        recargarGastos,
        setRecargarGastos,
        recargarCategorias,
        setRecargarCategorias,
        cargarCategorias,
        crearCategoria,
        actualizarCategoria,
        eliminarCategoria,
        cargarGastos,
        crearGasto,
        actualizarGasto,
        eliminarGasto,
        cargarGastosPorCategoria,
        cargarBalanceCaja
      }}
    >
      {props.children}
    </GastosContext.Provider>
  );
};

export default GastosProvider;
