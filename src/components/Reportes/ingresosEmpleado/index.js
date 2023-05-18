import React from 'react';
import RptIngresosXempleado from './RptIngresosXempleado';
import BotonImprimir from '../BotonImpresion/BotonImprimir';
import ConfiguracionIngresosXempleado from '../configuracion/ConfiguracionIngresosXempleado';
const IngresosEmpleado = () => {
  return (
    <>
      <ConfiguracionIngresosXempleado></ConfiguracionIngresosXempleado>
      <BotonImprimir ComponentToPrint={RptIngresosXempleado} />
      <RptIngresosXempleado></RptIngresosXempleado>
    </>
  );
};

export default IngresosEmpleado;
