import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CabeceraTabla from './cabeceraTabla';
import ProductosTabla from './productosTabla';
import BuscadorProducto from '../buscadorProducto';

import TipoPrecio from '../../../components/TipoPrecio';
const ListadoProductos = ({
  classes,
  productos,
  setProductos,
  buscarProductos
}) => {
  return (
    <>
      <BuscadorProducto
        buscarProductos={buscarProductos}
        productos={productos}
        classes={classes}
        setProductos={setProductos}
      />

      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <strong>Seleccione Productos</strong>
          <TipoPrecio></TipoPrecio>
        </Paper>
      </Grid>

      {/* <CabeceraTabla classes={classes} /> */}
      <ProductosTabla productos={productos} classes={classes} />
    </>
  );
};

export default ListadoProductos;
