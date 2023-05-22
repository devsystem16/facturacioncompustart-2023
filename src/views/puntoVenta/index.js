import React, { useContext, useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Factura from './factura';

import ListadoProductos from './listadoProductos';
import { ProductosContext } from '../../context/ProductosContext';
import { ClienteContext } from '../../context/ClienteContext';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  paper2: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    height: '35px'
  }
}));

const PuntoVenta = () => {
  const classes = useStyles();
  // Obtener los productos del context
  const {
    ObtenerProductos,
    productos,
    setProductos,
    buscarProductos,
    productosTemp
  } = useContext(ProductosContext);
  const { setCurrentCliente } = useContext(ClienteContext);

  React.useEffect(() => {
    setCurrentCliente({
      cedula: '',
      nombres: '-SELECCIONE-'
    });
    ObtenerProductos();
  }, []);
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <strong>Punto de venta</strong>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={5}>
          <ListadoProductos
            setProductos={setProductos}
            buscarProductos={buscarProductos}
            productos={productosTemp}
            classes={classes}
          />
        </Grid>

        <Grid item xs={12} sm={7}>
          <Paper className={classes.paper}>
            <Factura esProforma={false} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default PuntoVenta;
