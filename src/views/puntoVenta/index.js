import React, { useContext, useState } from 'react';
import date from 'date-and-time';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Factura from './factura';
import Swal from 'sweetalert2';
import VerificarAperturaPeriodo from '../../Global/Funciones';

import ListadoProductos from './listadoProductos';
import { ProductosContext } from '../../context/ProductosContext';
import { ClienteContext } from '../../context/ClienteContext';
import { PeriodoContext } from '../../context/PeriodoContext';
import { Button, makeStyles } from '@material-ui/core';

import NuevoPeriodo from '.././../components/Periodo/NuevoPeriodo/NuevoPeriodo';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  paper2: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    height: '35px'
  }
}));

const PuntoVenta = () => {
  const classes = useStyles();
  // Obtener los productos del context
  const { ObtenerProductos, setProductos, buscarProductos, productosTemp } =
    useContext(ProductosContext);
  const { setCurrentCliente } = useContext(ClienteContext);
  const { periodoActivo, verificarPeriodoActivo } = useContext(PeriodoContext);

  React.useEffect(() => {
    // verificarAperturaPeriodo();
    setCurrentCliente({
      cedula: '',
      nombres: '-SELECCIONE-'
    });
    ObtenerProductos();
  }, []);

  const verificarAperturaPeriodo = async () => {
    const periodo = await verificarPeriodoActivo();

    const now = new Date(periodo.periodo.fecha_apertura);
    if (periodo.estado === 'periodo-anterior-activo') {
      Swal.fire(
        'Está facturando con un periodo del: ' + date.format(now, 'YYYY-MM-DD')
      );
    }
  };
  return (
    <div className={classes.root}>
      <VerificarAperturaPeriodo></VerificarAperturaPeriodo>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <strong>Punto de venta</strong>
          </Paper>
        </Grid>

        {periodoActivo ? (
          <>
            <Grid item xs={12} sm={5}>
              <ListadoProductos
                setProductos={setProductos}
                buscarProductos={buscarProductos}
                productos={productosTemp}
                classes={classes}
              />
            </Grid>

            <Grid item xs={12} sm={7}>
              <Paper className={classes.paper}>
                <Factura esProforma={false} />
              </Paper>
            </Grid>
          </>
        ) : (
          <IniciarDia></IniciarDia>
        )}
      </Grid>
    </div>
  );
};
export default PuntoVenta;

const IniciarDia = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <NuevoPeriodo></NuevoPeriodo>
              {/* <center>
                <h1>INICIAR PERIODO</h1>
                <Button variant="contained" color="secondary">
                  CREAR PERIODO
                </Button>
              </center> */}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
