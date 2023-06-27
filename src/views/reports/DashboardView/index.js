import React, { useContext } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';

import Page from '../../../components/Page';
import { Button } from '@material-ui/core';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
// import LatestProducts from './LatestProducts';
// import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';

import Permisos from '../../../Environment/Permisos.json';
// import TrafficByDevice from './TrafficByDevice';
import { PeriodoContext } from '../../../context/PeriodoContext';
import { EstadisticasContext } from '../../../context/EstadisticasContext';
import { ComponentIniciarPeriodo } from '../../../Environment/utileria';
import Swal from 'sweetalert2';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const { periodo, cerrarPeriodo, periodoActivo } = useContext(PeriodoContext);
  const { setIsReload } = useContext(EstadisticasContext);

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
      } else if (result.isDenied) {
        // Swal.fire('Se seguirá facturando en este periodo', '', 'info');
      }
    });
  };

  if (!periodoActivo)
    return <ComponentIniciarPeriodo></ComponentIniciarPeriodo>;
  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item lg={3} sm={6} xl={3} xs={12} style={{ height: '200px' }}>
            <Budget />
            {periodoActivo &&
              Permisos[localStorage.getItem('tipo_usuario')][
                'finalizar-periodo'
              ] && (
                <Button
                  onClick={cerrarPeriodoVentas}
                  variant="contained"
                  color="primary"
                >
                  Finalizar Día
                </Button>
              )}
          </Grid>

          <Grid item lg={3} sm={6} xl={3} xs={12} style={{ height: '200px' }}>
            <TotalCustomers />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12} style={{ height: '200px' }}>
            <TasksProgress />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            {/* <Sales /> */}
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            {/* <TrafficByDevice /> */}
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            {/* <LatestProducts /> */}
          </Grid>
          <Grid item lg={12} md={12} xl={9} xs={12}>
            <br></br>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
