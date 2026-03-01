import React, { useContext } from 'react';
import { Box, Typography, Divider, colors } from '@material-ui/core';
import BuscadorProducto from '../buscadorProducto';
import ProductosTabla from './productosTabla';
import TipoPrecio from '../../../components/TipoPrecio';
import { FacturaContext } from '../../../context/FacturaContext';

const ListadoProductos = ({ productos }) => {
  const { esProforma } = useContext(FacturaContext);
  const productosAMostrar = esProforma ? productos : productos.filter((p) => p.stock > 0);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Header */}
      <Box p={2} pb={1}>
        <Typography
          variant="subtitle1"
          style={{ fontWeight: 600, color: colors.grey[800], marginBottom: 8 }}
        >
          Productos Disponibles
        </Typography>
        <BuscadorProducto />
      </Box>

      {/* Tipo precio */}
      <Box px={2} pb={1}>
        <TipoPrecio />
      </Box>

      <Divider />

      {/* Lista virtualizada o mensaje vacío */}
      <Box flexGrow={1} px={1} pt={1}>
        {productosAMostrar.length > 0 ? (
          <ProductosTabla productos={productosAMostrar} esProforma={esProforma} />
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={6}
          >
            <Typography
              style={{
                fontSize: 14,
                color: colors.grey[400],
                fontWeight: 500
              }}
            >
              No se encontraron productos
            </Typography>
            <Typography
              style={{
                fontSize: 12,
                color: colors.grey[300],
                marginTop: 4
              }}
            >
              Intente con otro término de búsqueda
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ListadoProductos;
