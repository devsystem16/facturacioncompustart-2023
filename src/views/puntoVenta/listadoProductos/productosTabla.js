import React from 'react';
import { Box, Typography, Chip, colors } from '@material-ui/core';
import { useContext } from 'react';
import { FacturaContext } from '../../../context/FacturaContext';
import { makeStyles } from '@material-ui/core/styles';
import './listadoProductos.css';

import { FixedSizeList } from 'react-window';

const useStyles = makeStyles((theme) => ({
  rowCard: {
    margin: '4px 8px',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #e8e8e8',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#f0f2ff',
      borderColor: '#3f51b5',
      boxShadow: '0 2px 8px rgba(63, 81, 181, 0.12)'
    },
    '&:active': {
      backgroundColor: '#e0e3ff'
    }
  },
  stockChip: {
    fontWeight: 700,
    fontSize: 12,
    minWidth: 36,
    height: 28
  },
  productName: {
    fontWeight: 600,
    fontSize: 13,
    color: colors.grey[900],
    lineHeight: 1.3
  },
  productDesc: {
    fontSize: 11,
    color: colors.grey[600],
    lineHeight: 1.2,
    marginTop: 2
  },
  priceLabel: {
    fontSize: 10,
    color: colors.grey[500]
  },
  priceValue: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.grey[800]
  },
  codeText: {
    fontSize: 10,
    color: colors.grey[400],
    marginTop: 4
  }
}));

const ProductosTabla = ({ productos, esProforma }) => {
  return (
    <FixedSizeList
      height={520}
      width={'100%'}
      itemCount={productos.length}
      itemSize={90}
      itemData={productos}
    >
      {Row}
    </FixedSizeList>
  );
};

export default ProductosTabla;

function Row(props) {
  const { agregarProductoFactura } = useContext(FacturaContext);
  const classes = useStyles();
  const { index, style, data } = props;
  const item = data[index];

  const stockColor =
    item?.stock <= 0
      ? colors.grey[500]
      : item?.stock <= 3
      ? colors.red[500]
      : item?.stock <= 10
      ? colors.orange[500]
      : colors.green[500];

  return (
    <div style={{ ...style, padding: 0 }}>
      <div
        className={classes.rowCard}
        onClick={() => agregarProductoFactura(item)}
      >
        <Box display="flex" alignItems="flex-start">
          {/* Stock */}
          <Box mr={1.5} pt={0.5}>
            <Chip
              label={item?.stock}
              className={classes.stockChip}
              style={{ backgroundColor: stockColor, color: '#fff' }}
              size="small"
            />
          </Box>

          {/* Nombre y descripción */}
          <Box flexGrow={1} overflow="hidden" mr={1}>
            <Typography className={classes.productName} noWrap>
              {item?.nombre}
            </Typography>
            <Typography className={classes.productDesc} noWrap>
              {item?.descripcion}
            </Typography>
            <Typography className={classes.codeText}>
              {item?.codigo_barra}
            </Typography>
          </Box>

          {/* Precios */}
          <Box textAlign="right" flexShrink={0} minWidth={90}>
            <div>
              <span className={classes.priceLabel}>PVP </span>
              <span className={classes.priceValue}>${item?.precio_publico}</span>
            </div>
            <div>
              <span className={classes.priceLabel}>TEC </span>
              <span className={classes.priceValue}>${item?.precio_tecnico}</span>
            </div>
            <div>
              <span className={classes.priceLabel}>MAY </span>
              <span className={classes.priceValue}>
                ${item?.precio_distribuidor}
              </span>
            </div>
          </Box>
        </Box>
      </div>
    </div>
  );
}
