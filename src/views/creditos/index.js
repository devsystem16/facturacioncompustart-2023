import React, { useState, useContext } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';

import Page from '../../components/Page';

import Results from './Results';
import Toolbar from './Toolbar';

import NuevoCredito from '../../components/NuevoCredito';
import { ClienteContext } from '../../context/ClienteContext';
import TablaCliente from '../../components/TablaClientes/TablaClientes';
import CreditosTable from '../../components/CreditosTable';
import CreditoProvider from '../../context/CreditoContext';

import GridCreditos from '../../components/Creditos/GridCreditos';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Creditos = () => {
  const { isNewClient, clientes, setClientes } = useContext(ClienteContext);
  const classes = useStyles();

  return (
    // <CreditoProvider>
    <Page className={classes.root} title="Clientes">
      <Container maxWidth={false}>
        <h2>CREDITOS</h2>
        {/* <NuevoCredito /> */}

        <Box mt={3}>
          <GridCreditos></GridCreditos>
          {/* <CreditosTable></CreditosTable> */}
        </Box>
      </Container>
    </Page>
  );
};

export default Creditos;
