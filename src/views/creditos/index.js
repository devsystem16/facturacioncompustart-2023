import React, { useContext, useEffect } from 'react';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import { useSearchParams } from 'react-router-dom';

import Page from '../../components/Page';
import { ComponentIniciarPeriodo } from '../../Environment/utileria';
import { PeriodoContext } from '../../context/PeriodoContext';
import { CreditoContext } from '../../context/CreditoContext';
import GridCreditos from '../../components/Creditos/GridCreditos';
import ResumenCreditos from './ResumenCreditos';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Creditos = () => {
  const { periodoActivo } = useContext(PeriodoContext);
  const { resumenCreditos, filtroEstado, setFiltroEstado } = useContext(CreditoContext);
  const classes = useStyles();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const estadoParam = searchParams.get('estado');
    if (estadoParam) {
      setFiltroEstado(estadoParam);
    }
  }, []);

  if (!periodoActivo)
    return <ComponentIniciarPeriodo></ComponentIniciarPeriodo>;

  return (
    <Page className={classes.root} title="Créditos">
      <Container maxWidth={false}>
        <Typography variant="h4" style={{ marginBottom: 16, fontWeight: 700 }}>
          Créditos
        </Typography>

        <ResumenCreditos
          resumen={resumenCreditos}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
        />

        <Box mt={1}>
          <GridCreditos />
        </Box>
      </Container>
    </Page>
  );
};

export default Creditos;
