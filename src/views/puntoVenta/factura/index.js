import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import HeadFactura from './headFactura';
import RowFactura from './rowFactura';
import TotalesFactura from './TotalesFactura';
import { FacturaContext } from '../../../context/FacturaContext';

const Factura = ({ esProforma = false }) => {
  const location = useLocation();
  const [cli, setCLi] = useState([]);

  const { productosFactura, totales, setEsProforma, setDefaultDataInvoice } =
    useContext(FacturaContext);
  // setEsProforma(esProforma);

  useEffect(() => {
    const objeto = location.state?.proforma;
    if (objeto) {
      const cliente = setDefaultDataInvoice(objeto);

      setCLi({
        id: cliente.id,
        cedula: cliente.cedula,
        nombres: cliente.nombres,
        telefono: cliente.telefono
      });
    }

    setEsProforma(esProforma);
  }, []);

  return (
    <div>
      <HeadFactura defaultCliente={cli} />

      <div style={{ minHeight: '90px' }}>
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
