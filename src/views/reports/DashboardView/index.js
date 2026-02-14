import React, { useContext, useState, useEffect } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import moment from 'moment';

import Page from '../../../components/Page';
import { Button } from '@material-ui/core';
import LatestOrders from './LatestOrders';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';

import DashboardDateFilter from './DashboardDateFilter';
import ResumenCards from './ResumenCards';
import VentasPeriodoChart from './VentasPeriodoChart';
import TopProductosChart from './TopProductosChart';
import TopClientesChart from './TopClientesChart';

import Permisos from '../../../Environment/Permisos.json';
import { PeriodoContext } from '../../../context/PeriodoContext';
import { EstadisticasContext } from '../../../context/EstadisticasContext';
import { ComponentIniciarPeriodo } from '../../../Environment/utileria';
import DashboardProvider from '../../../context/DashboardContext';
import { DashboardContext } from '../../../context/DashboardContext';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const DashboardContent = () => {
  const classes = useStyles();
  const { periodo, cerrarPeriodo, periodoActivo } = useContext(PeriodoContext);
  const { setIsReload } = useContext(EstadisticasContext);
  const {
    resumen,
    ventasPeriodo,
    topProductos,
    topClientes,
    cargarResumen,
    cargarVentasPeriodo,
    cargarTopProductos,
    cargarTopClientes
  } = useContext(DashboardContext);

  const [fechaDesde, setFechaDesde] = useState(
    moment().startOf('month').format('YYYY-MM-DD')
  );
  const [fechaHasta, setFechaHasta] = useState(moment().format('YYYY-MM-DD'));
  const [tipoPeriodo, setTipoPeriodo] = useState('diario');

  useEffect(() => {
    if (periodoActivo) {
      cargarResumen();
      cargarVentasPeriodo(tipoPeriodo, fechaDesde, fechaHasta);
      cargarTopProductos(fechaDesde, fechaHasta);
      cargarTopClientes(fechaDesde, fechaHasta);
    }
  }, [periodoActivo]);

  const actualizarDashboard = () => {
    cargarResumen();
    cargarVentasPeriodo(tipoPeriodo, fechaDesde, fechaHasta);
    cargarTopProductos(fechaDesde, fechaHasta);
    cargarTopClientes(fechaDesde, fechaHasta);
  };

  const cerrarPeriodoVentas = async () => {
    Swal.fire({
      title: 'Finalizar el día',
      showDenyButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: 'Si, Finalizar el periodo',
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await cerrarPeriodo(periodo);
        console.log(response);
        setIsReload(true);
        Swal.fire('Periodo Cerrado!', '', 'success');
      }
    });
  };

  if (!periodoActivo)
    return <ComponentIniciarPeriodo></ComponentIniciarPeriodo>;
  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          {/* Row 1: Resumen + cards existentes */}
          <ResumenCards resumen={resumen} />
          <Grid item lg={3} sm={6} xl={3} xs={12} style={{ height: '200px' }}>
            <TotalCustomers />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12} style={{ height: '200px' }}>
            <TasksProgress />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit />
            {periodoActivo &&
              Permisos[localStorage.getItem('tipo_usuario')][
                'finalizar-periodo'
              ] && (
                <Button
                  onClick={cerrarPeriodoVentas}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 8 }}
                >
                  Finalizar Día
                </Button>
              )}
          </Grid>

          {/* Row 3: Date Filter */}
          <Grid item xs={12}>
            <DashboardDateFilter
              fechaDesde={fechaDesde}
              setFechaDesde={setFechaDesde}
              fechaHasta={fechaHasta}
              setFechaHasta={setFechaHasta}
              tipoPeriodo={tipoPeriodo}
              setTipoPeriodo={setTipoPeriodo}
              onActualizar={actualizarDashboard}
            />
          </Grid>

          {/* Row 4: Charts */}
          <Grid item lg={8} md={12} xs={12}>
            <VentasPeriodoChart ventasPeriodo={ventasPeriodo} />
          </Grid>
          <Grid item lg={4} md={12} xs={12}>
            <TopProductosChart topProductos={topProductos} />
          </Grid>

          {/* Row 5: Top Clientes + LatestOrders */}
          <Grid item lg={6} md={12} xs={12}>
            <TopClientesChart topClientes={topClientes} />
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
