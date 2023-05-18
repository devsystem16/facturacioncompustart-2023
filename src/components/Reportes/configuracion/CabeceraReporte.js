import React from 'react';
import date from 'date-and-time';
const CabeceraReporte = ({ title = 'Reporte de ventas' }) => {
  const now = new Date();

  return (
    <>
      <center>
        <h1> {title}</h1>
      </center>
      <strong>Fecha Reporte</strong>: {date.format(now, 'YYYY-MM-DD')}
      <div>
        <strong>Generado por: </strong> {localStorage.getItem('nombres')}
      </div>
    </>
  );
};

export default CabeceraReporte;
