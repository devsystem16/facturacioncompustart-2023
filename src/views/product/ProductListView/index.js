import React, { useState, useContext } from 'react';
import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import Page from '../../../components/Page';

import BuscadorProducto from './BuscadorProducto';
import ProductCard from './ProductCard';

import { ProductosContext } from '../../../context/ProductosContext';
import TablaProductos from '../../../components/TablaProductos/TablaProductos';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

const ProductList = () => {
  const classes = useStyles();

  const { productos } = useContext(ProductosContext);

  return (
    <Page className={classes.root} title="Clientes">
      <Container maxWidth={false}>
        <BuscadorProducto></BuscadorProducto>

        <Box mt={3}>
          <TablaProductos />
          {/* <Results customers={customers} /> */}
        </Box>
      </Container>
    </Page>
  );
};

export default ProductList;
