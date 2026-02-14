import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';

import HeadFactura from './headFactura';
import RowFactura from './rowFactura';
import TotalesFactura from './TotalesFactura';
import { FacturaContext } from '../../../context/FacturaContext';

const Factura = ({ esProforma = false }) => {
  const location = useLocation();
  const [cli, setCLi] = useState([]);

  const { productosFactura, totales, setEsProforma, setDefaultDataInvoice } =
    useContext(FacturaContext);

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

      <Box
        style={{
          minHeight: 100,
          maxHeight: 320,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {productosFactura.map((producto) => (
          <RowFactura
            key={producto.id + producto.tipoPrecio}
            producto={producto}
          />
        ))}
      </Box>

      <TotalesFactura key={1} totales={totales} />
    </div>
  );
};

export default Factura;
