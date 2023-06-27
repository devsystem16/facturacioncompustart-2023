import React, { createContext, useState, useEffect } from 'react';

import API from '../Environment/config';

export const ReportesContext = createContext();

const END_POINT = {
  reporteVentasDiarias: 'api/reportes/ventas-diarias',
  reporteIngresosXempleado: 'api/reportes/ingresos-empleado',
  guardarFactura: 'api/facturas'
};

const ReportesProvider = (props) => {
  const [ventasDiarias, setVentasDiarias] = useState({
    total_ventas: 0,
    facturas: [],
    ordenes: [],
    creditos: []
  });

  const [ingresosXepleado, setIngresosXepleado] = useState({
    total_ventas: 0,
    ventasEmpleados: []
  });

  // Reporte para ventas diarias.
  const getReporteVentasDiaras = async (fechaInicio, fechaFin) => {
    const response = await API.post(END_POINT.reporteVentasDiarias, {
      fecha_desde: fechaInicio,
      fecha_hasta: fechaFin
    });
    setVentasDiarias(response.data);
  };

  // Reporte para ventas diarias.
  const getReporteIngresosXempleado = async (fechaInicio, fechaFin) => {
    const response = await API.post(END_POINT.reporteIngresosXempleado, {
      fecha_desde: fechaInicio,
      fecha_hasta: fechaFin
    });

    setIngresosXepleado(response.data);
  };

  useEffect(() => {}, [ventasDiarias, ingresosXepleado]);

  return (
    <>
      <ReportesContext.Provider
        value={{
          ventasDiarias,
          getReporteVentasDiaras,
          ingresosXepleado,
          getReporteIngresosXempleado
        }}
      >
        {props.children}
      </ReportesContext.Provider>
    </>
  );
};

export default ReportesProvider;
