import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from '../../components/Page';
import KardexProvider from '../../context/KardexContext';
import FiltrosKardex from './FiltrosKardex';
import TablaKardex from './TablaKardex';
import ModalAjuste from './ModalAjuste';
import ModalEntrada from './ModalEntrada';
import ModalTransferencia from './ModalTransferencia';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const KardexView = () => {
  const classes = useStyles();

  return (
    <KardexProvider>
      <Page className={classes.root} title="Kardex">
        <Container maxWidth={false}>
          <h2>KARDEX</h2>
          <Box mt={2}>
            <FiltrosKardex />
          </Box>
          <Box mt={3}>
            <TablaKardex />
          </Box>
          <ModalAjuste />
          <ModalEntrada />
          <ModalTransferencia />
        </Container>
      </Page>
    </KardexProvider>
  );
};

export default KardexView;
