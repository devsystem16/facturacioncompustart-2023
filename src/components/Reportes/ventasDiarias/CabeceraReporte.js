import React from 'react';
import date from 'date-and-time';
const CabeceraReporte = () => {
  const now = new Date();

  return (
    <>
      <center>
        <h1>Reporte de ventas</h1>
      </center>
      <strong>Fecha Reporte</strong>: {date.format(now, 'YYYY-MM-DD')}
      <div>
        <strong>Generado por: </strong> {localStorage.getItem('nombres')}
      </div>
    </>
  );
};

export default CabeceraReporte;
