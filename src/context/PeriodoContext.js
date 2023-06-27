import React, { createContext, useState, useEffect } from 'react';
import API from '../Environment/config';

export const PeriodoContext = createContext();

const END_POINT = {
  crearPeriodo: 'api/periodo',
  verificarPeriodoAbierto: 'api/periodo/verificar-periodo/apertura',
  obtenerRetiros: 'api/periodo/verificar-periodo/retiros/obtenerRetiros',

  cerrarPeriodo: 'api/periodo/cerrar-periodo/cierre/'
};

const PeriodoProvider = (props) => {
  const [isReload, setIsReload] = useState(true);
  const [periodoActivo, setPeriodoActivo] = useState(false);
  const [periodo, setPeriodo] = useState([]);
  const [totalRetiros, setTotalRetiros] = useState(0);
  useEffect(() => {
    if (isReload) {
      verificarPeriodoActivo();
      setIsReload(false);
      obtenerRetirosBD();
    }
  }, [isReload, periodoActivo, totalRetiros]);

  const crearPeriodo = async (periodo) => {
    try {
      const response = await API.post(END_POINT.crearPeriodo, periodo);
      setPeriodo(response.data.data);
      localStorage.setItem('periodo_id', response.data.data.id);
      return {
        codigo: 201,
        message: response.data.message,
        periodo: response.data.data
      };
    } catch (error) {
      return {
        codigo: 401,
        message: 'Error al crear el periodo.',
        periodo: {}
      };
    }
  };

  const cerrarPeriodo = async (periodo) => {
    try {
      const response = await API.post(END_POINT.cerrarPeriodo + periodo.id);

      setPeriodo([]);
      setPeriodoActivo(false);
      return {
        codigo: 201,
        message: response.data.message
      };
    } catch (error) {
      return {
        codigo: 401,
        message: 'Error al crear el periodo.'
      };
    }
  };

  const verificarPeriodoActivo = async () => {
    try {
      const response = await API.get(END_POINT.verificarPeriodoAbierto);
      setPeriodoActivo(response.data.isOpen);

      setPeriodo(response.data.periodo);
      localStorage.setItem('periodo_id', response.data.periodo.id);
      return {
        codigo: 200,
        open: response.data.isOpen,
        message: response.data.message,
        periodo: response.data.periodo,
        estado: response.data.estado
      };
    } catch (error) {
      setPeriodoActivo(false);
      return {
        codigo: 401,
        open: false,
        message: 'Ocurrió un Error',
        periodo: [],
        estado: 'error'
      };
    }
  };

  const obtenerRetirosBD = async () => {
    try {
      const response = await API.get(END_POINT.obtenerRetiros);

      setTotalRetiros(response.data.totalRetiros);
      return {
        codigo: 201,
        message: response.data.message
      };
    } catch (error) {
      return {
        codigo: 401,
        message: 'Error al crear el periodo.'
      };
    }
  };
  const objetoReturn = {
    crearPeriodo,
    cerrarPeriodo,
    periodoActivo,
    setPeriodoActivo,
    verificarPeriodoActivo,
    periodo,
    setPeriodo,
    totalRetiros,
    setTotalRetiros,
    obtenerRetirosBD
  };

  return (
    <>
      <PeriodoContext.Provider value={objetoReturn}>
        {props.children}
      </PeriodoContext.Provider>
    </>
  );
};

export default PeriodoProvider;
