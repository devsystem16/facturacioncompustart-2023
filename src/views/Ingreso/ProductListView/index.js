import React, { useContext } from 'react';
import {
  Box,
  Container,
  makeStyles,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  colors
} from '@material-ui/core';

import Page from '../../../components/Page';
import BuscadorIngresos from './BuscadorIngresos';
import { PeriodoContext } from '../../../context/PeriodoContext';
import { IngresoContext } from '../../../context/IngresoContext';
import TablaIngresos from '../../../components/TablaIngresos/TablaIngresos';
import { ComponentIniciarPeriodo } from '../../../Environment/utileria';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  summaryCard: {
    textAlign: 'center',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.2
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 4
  },
  filterChip: {
    margin: '0 4px',
    fontWeight: 600
  }
}));

const Ingreso = () => {
  const classes = useStyles();
  const { periodoActivo } = useContext(PeriodoContext);
  const { contadorEstados, filtroEstado, setFiltroEstado } =
    useContext(IngresoContext);

  if (!periodoActivo)
    return <ComponentIniciarPeriodo></ComponentIniciarPeriodo>;

  const conteo = contadorEstados();

  const summaryCards = [
    { label: 'Total', value: conteo.total, color: '#616161', bg: '#f5f5f5', filter: 'todos' },
    { label: 'Pendientes', value: conteo.pendientes, color: '#E65100', bg: '#FFF3E0', filter: 'pendiente' },
    { label: 'En Proceso', value: conteo.enProceso, color: '#1565C0', bg: '#E3F2FD', filter: 'en_proceso' },
    { label: 'Completados', value: conteo.completados, color: '#2E7D32', bg: '#E8F5E9', filter: 'completado' },
    { label: 'Entregados', value: conteo.entregados, color: '#7B1FA2', bg: '#F3E5F5', filter: 'entregado' }
  ];

  return (
    <Page className={classes.root} title="Ingresos">
      <Container maxWidth={false}>
        {/* Dashboard resumen */}
        <Grid container spacing={2} style={{ marginBottom: 16 }}>
          {summaryCards.map((card) => (
            <Grid item xs={6} sm={true} key={card.filter}>
              <Card
                className={classes.summaryCard}
                onClick={() => setFiltroEstado(card.filter)}
                style={{
                  borderBottom: `3px solid ${card.color}`,
                  backgroundColor:
                    filtroEstado === card.filter ? card.bg : '#fff'
                }}
              >
                <CardContent style={{ padding: '16px 12px' }}>
                  <Typography
                    className={classes.summaryValue}
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    className={classes.summaryLabel}
                    style={{ color: card.color }}
                  >
                    {card.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filtros chips */}
        <Box mb={2}>
          {[
            { value: 'todos', label: 'Todos' },
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'en_proceso', label: 'En Proceso' },
            { value: 'completado', label: 'Completado' },
            { value: 'entregado', label: 'Entregado' }
          ].map((estado) => (
            <Chip
              key={estado.value}
              label={estado.label}
              className={classes.filterChip}
              color={filtroEstado === estado.value ? 'primary' : 'default'}
              onClick={() => setFiltroEstado(estado.value)}
              variant={filtroEstado === estado.value ? 'default' : 'outlined'}
              size="small"
            />
          ))}
        </Box>

        <BuscadorIngresos />

        <Box mt={3}>
          <TablaIngresos />
        </Box>
      </Container>
    </Page>
  );
};

export default Ingreso;
