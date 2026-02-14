import React from 'react';
import { Box, Typography, Divider, colors } from '@material-ui/core';
import BuscadorProducto from '../buscadorProducto';
import ProductosTabla from './productosTabla';
import TipoPrecio from '../../../components/TipoPrecio';

const ListadoProductos = ({ productos }) => {
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

      {/* Lista virtualizada */}
      <Box flexGrow={1} px={1} pt={1}>
        <ProductosTabla productos={productos} />
      </Box>
    </Box>
  );
};

export default ListadoProductos;
