import React, { useContext, useState, useEffect } from 'react';
import { makeStyles, Grid, Box, IconButton, Typography, colors } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import alertify from 'alertifyjs';

import { FacturaContext } from '../../../context/FacturaContext';
import { formatCurrencySimple } from '../../../Environment/utileria';

const useStyles = makeStyles((theme) => ({
  row: {
    borderBottom: '1px solid #f0f0f0',
    padding: '4px 0',
    '&:hover': {
      backgroundColor: '#fafbff'
    }
  },
  '@keyframes flashGreen': {
    '0%': { backgroundColor: '#c8e6c9' },
    '100%': { backgroundColor: 'transparent' }
  },
  rowFlash: {
    animation: '$flashGreen 0.6s ease-out'
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    minHeight: 32
  },
  cantidadInput: {
    width: 50,
    height: 26,
    fontSize: 12,
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: 4,
    outline: 'none',
    '&:focus': {
      borderColor: '#3f51b5'
    }
  },
  nombreProducto: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.grey[800],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  precioCell: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.grey[700],
    textAlign: 'center',
    backgroundColor: '#f0faf5',
    borderRadius: 4,
    padding: '4px 6px'
  },
  totalCell: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.grey[900],
    textAlign: 'center'
  }
}));

function trunc(x, posiciones = 0) {
  var s = x.toString();
  var decimalLength = s.indexOf('.') + 1;
  var numStr = s.substr(0, decimalLength + posiciones);
  return Number(numStr);
}

const obtienePrecioBruto = (precioNeto) => {
  return formatCurrencySimple(trunc(precioNeto / 1.15, 4));
};

export default function RowFactura({ producto }) {
  const classes = useStyles();

  const {
    eliminarProductoFactura,
    sumarStockProductoFactura,
    restarStockProductoFactura,
    SetNumeroItems,
    actualizarStockProductosCantidad,
    productosFactura,
    calcularTotalesFactura,
    actualizarProductosFactura,
    esProforma
  } = useContext(FacturaContext);

  const [cantidad, setCantidad] = useState(producto.cantidad);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setCantidad(producto.cantidad);
  }, [producto.cantidad]);

  // Flash animation when quantity changes
  useEffect(() => {
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 600);
    return () => clearTimeout(timer);
  }, [producto.cantidad]);

  const fn_onBlur = (producto, cantidad) => {
    var cont = 0;
    productosFactura.map((items) => {
      if (producto.tipoPrecio !== items.tipoPrecio) {
        cont = parseInt(cont) + parseInt(items.cantidad);
      }
    });
    cont = parseInt(cont) + parseInt(cantidad);

    actualizarProductosFactura(producto, cantidad);
    actualizarStockProductosCantidad(producto, cont);
    calcularTotalesFactura(productosFactura);
  };

  const cambiarCantidad = (cantidad, e, producto) => {
    const esValido = e.target.validity.valid;
    if (!esValido) return;
    if (cantidad == 0) {
      alertify.error('La cantidad no puede ser 0', 2);
      return;
    }
    if (!esProforma && cantidad > producto.stock) {
      alertify.error('La cantidad supera el Stock del producto', 2);
      return;
    }
    setCantidad(cantidad);
    fn_onBlur(producto, cantidad);
    SetNumeroItems(cantidad);
  };

  const eliminar = (producto) => {
    var cont = 0;
    productosFactura.map((items) => {
      if (producto.tipoPrecio !== items.tipoPrecio) {
        cont = parseInt(cont) + parseInt(items.cantidad);
      }
    });
    eliminarProductoFactura(producto, cont);
  };

  const handleKeyDown = (e) => {
    if (e.key === '+') {
      e.preventDefault();
      sumarStockProductoFactura(producto);
    } else if (e.key === '-') {
      e.preventDefault();
      restarStockProductoFactura(producto);
    }
  };

  return (
    <div
      className={`${classes.row} ${flash ? classes.rowFlash : ''}`}
      key={producto.id + producto.tipoPrecio}
    >
      <Grid container spacing={0} alignItems="center">
        {/* Delete */}
        <Grid item xs={1}>
          <Box className={classes.cell}>
            <IconButton
              size="small"
              onClick={() => eliminar(producto)}
              style={{ padding: 4 }}
            >
              <DeleteIcon fontSize="small" style={{ color: colors.red[400] }} />
            </IconButton>
          </Box>
        </Grid>

        {/* Cantidad */}
        <Grid item xs={2}>
          <Box className={classes.cell}>
            <input
              type="text"
              onBlur={(e) => fn_onBlur(producto, e.target.value)}
              onChange={(e) => cambiarCantidad(e.target.value, e, producto)}
              onKeyDown={handleKeyDown}
              value={cantidad}
              pattern="[0-9]{0,13}"
              className={classes.cantidadInput}
            />
          </Box>
        </Grid>

        {/* Nombre */}
        <Grid item xs={5}>
          <Box pl={1} title={producto.nombre}>
            <Typography className={classes.nombreProducto}>
              {producto.nombre}
            </Typography>
          </Box>
        </Grid>

        {/* Precio unitario */}
        <Grid item xs={2}>
          <Box className={classes.cell}>
            <span className={classes.precioCell}>
              {producto.tipoPrecio === 'publico'
                ? obtienePrecioBruto(producto.precio_publico)
                : ''}
              {producto.tipoPrecio === 'tecnico'
                ? obtienePrecioBruto(producto.precio_tecnico)
                : ''}
              {producto.tipoPrecio === 'mayorista'
                ? obtienePrecioBruto(producto.precio_distribuidor)
                : ''}
            </span>
          </Box>
        </Grid>

        {/* Total */}
        <Grid item xs={2}>
          <Box className={classes.cell}>
            <span className={classes.totalCell}>
              ${formatCurrencySimple(producto.total)}
            </span>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
