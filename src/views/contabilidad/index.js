import React, { useState, useContext } from 'react';
import { Box, Container, Tabs, Tab, makeStyles } from '@material-ui/core';
import Page from '../../components/Page';
import ContabilidadProvider from '../../context/ContabilidadContext';
import { LoginContext } from '../../context/LoginContext';
import PlanDeCuentas from './PlanDeCuentas';
import AsientosContables from './AsientosContables';
import ReportesContables from './ReportesContables';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ContabilidadView = () => {
  const classes = useStyles();
  const { tienePermiso } = useContext(LoginContext);
  const [tabActual, setTabActual] = useState(0);

  if (!tienePermiso('contabilidad.ver')) {
    return (
      <Page className={classes.root} title="Contabilidad">
        <Container maxWidth={false}>
          <h2>No tiene permisos para acceder a este modulo</h2>
        </Container>
      </Page>
    );
  }

  return (
    <ContabilidadProvider>
      <Page className={classes.root} title="Contabilidad">
        <Container maxWidth={false}>
          <h2>CONTABILIDAD</h2>
          <Box mt={2}>
            <Tabs
              value={tabActual}
              onChange={(e, newVal) => setTabActual(newVal)}
              indicatorColor="primary"
              textColor="primary"
            >
              {tienePermiso('contabilidad.plan-cuentas-ver') && (
                <Tab label="Plan de Cuentas" />
              )}
              {tienePermiso('contabilidad.asientos-ver') && (
                <Tab label="Asientos Contables" />
              )}
              {tienePermiso('contabilidad.reportes-ver') && (
                <Tab label="Reportes Contables" />
              )}
            </Tabs>
          </Box>
          <Box mt={2}>
            {tabActual === 0 && tienePermiso('contabilidad.plan-cuentas-ver') && <PlanDeCuentas />}
            {tabActual === 1 && tienePermiso('contabilidad.asientos-ver') && <AsientosContables />}
            {tabActual === 2 && tienePermiso('contabilidad.reportes-ver') && <ReportesContables />}
          </Box>
        </Container>
      </Page>
    </ContabilidadProvider>
  );
};

export default ContabilidadView;
