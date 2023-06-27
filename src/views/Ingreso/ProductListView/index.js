import React, { useEffect, useContext } from 'react';
import { Box, Container, makeStyles, Paper, Grid } from '@material-ui/core';
// import { Pagination } from '@material-ui/lab';

import Page from '../../../components/Page';

import BuscadorIngresos from './BuscadorIngresos';
// import ProductCard from './ProductCard';

// import { ProductosContext } from '../../../context/ProductosContext';
import { PeriodoContext } from '../../../context/PeriodoContext';
import TablaIngresos from '../../../components/TablaIngresos/TablaIngresos';

import { ComponentIniciarPeriodo } from '../../../Environment/utileria';
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

const Ingreso = () => {
  const classes = useStyles();
  const { periodoActivo } = useContext(PeriodoContext);

  // useEffect(() => {}, []);

  if (!periodoActivo)
    return <ComponentIniciarPeriodo></ComponentIniciarPeriodo>;
  return (
    <Page className={classes.root} title="Clientes">
      <Container maxWidth={false}>
        <BuscadorIngresos />

        <Box mt={3}>
          <TablaIngresos />
        </Box>
      </Container>
    </Page>
  );
};

export default Ingreso;
