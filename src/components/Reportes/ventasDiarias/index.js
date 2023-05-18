import React from 'react';
import RptVentasDiarias from './RptVentasDiarias';
import BotonImprimir from '../BotonImpresion/BotonImprimir';
import ConfiguracionVentasDiarias from '../configuracion/ConfiguracionVentasDiarias';

const ContainerRptVentasDiarias = () => {
  return (
    <>
      <ConfiguracionVentasDiarias></ConfiguracionVentasDiarias>
      <BotonImprimir ComponentToPrint={RptVentasDiarias} />
      <RptVentasDiarias></RptVentasDiarias>
    </>
  );
};

export default ContainerRptVentasDiarias;
