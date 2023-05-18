import React, { useState, useContext, useEffect } from 'react';
import HeadFactura from './headFactura';
import RowFactura from './rowFactura';
import TotalesFactura from './TotalesFactura';
import { FacturaContext } from '../../../context/FacturaContext';

const Factura = () => {
  const { productosFactura, totales } = useContext(FacturaContext);

  return (
    <div>
      <HeadFactura />
      <div style={{ minHeight: '90px' }}>
        {/* <div style={{ height: '130px', overflow: 'auto' }}> */}
        {productosFactura.map((producto) => {
          return (
            <RowFactura
              key={producto.id + producto.tipoPrecio}
              producto={producto}
            />
          );
        })}
      </div>

      <TotalesFactura key={1} totales={totales} />
    </div>
  );
};

export default Factura;
