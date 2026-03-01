import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Chip, colors } from '@material-ui/core';

import HeadFactura from './headFactura';
import RowFactura from './rowFactura';
import TotalesFactura from './TotalesFactura';
import { FacturaContext } from '../../../context/FacturaContext';

const Factura = ({ esProforma = false }) => {
  const location = useLocation();
  const [cli, setCLi] = useState([]);
  const scrollRef = useRef(null);

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

  // Auto-scroll al último producto agregado
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [productosFactura.length]);

  const totalItems = productosFactura.reduce(
    (sum, p) => sum + parseInt(p.cantidad),
    0
  );

  return (
    <div>
      <HeadFactura defaultCliente={cli} />

      {/* Contador de items */}
      {productosFactura.length > 0 && (
        <Box display="flex" alignItems="center" justifyContent="flex-end" mb={0.5}>
          <Chip
            label={`${productosFactura.length} producto${productosFactura.length !== 1 ? 's' : ''} / ${totalItems} unidad${totalItems !== 1 ? 'es' : ''}`}
            size="small"
            style={{
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: colors.indigo[50],
              color: colors.indigo[700]
            }}
          />
        </Box>
      )}

      <Box
        ref={scrollRef}
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
