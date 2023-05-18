import React, { useState, useContext } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';

import Page from '../../../components/Page';

import Results from './Results';
import Toolbar from './Toolbar';
import data from './data';
import NuevoCliente from '../../../components/NuevoCliente';
import { ClienteContext } from '../../../context/ClienteContext';
import TablaCliente from '../../../components/TablaClientes/TablaClientes';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const { isNewClient, clientes, clientesFiltro, setClientes } =
    useContext(ClienteContext);
  const classes = useStyles();
  const [customers] = useState(data);

  return (
    <Page className={classes.root} title="Clientes">
      <Container maxWidth={false}>
        {isNewClient ? <NuevoCliente /> : <Toolbar />}

        <Box mt={3}>
          <TablaCliente />
          {/* <Results customers={customers} /> */}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
