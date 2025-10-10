import React, { useContext, useEffect } from 'react';
import { Grid, Paper, makeStyles, Container, Typography } from '@material-ui/core';
import Swal from 'sweetalert2';
import date from 'date-and-time';

import Factura from './factura';
import ListadoProductos from './listadoProductos';
import NuevoPeriodo from '../../components/Periodo/NuevoPeriodo/NuevoPeriodo';
import { ProductosContext } from '../../context/ProductosContext';
import { ClienteContext } from '../../context/ClienteContext';
import { PeriodoContext } from '../../context/PeriodoContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const PuntoVenta = () => {
  const classes = useStyles();
  const { ObtenerProductos, setProductos, buscarProductos, productosTemp } = useContext(ProductosContext);
  const { setCurrentCliente } = useContext(ClienteContext);
  const { periodoActivo, verificarPeriodoActivo } = useContext(PeriodoContext);

  // Inicializa el punto de venta
  useEffect(() => {
    inicializarPuntoVenta();
  }, []);

  const inicializarPuntoVenta = async () => {
    setCurrentCliente({ cedula: '', nombres: '-SELECCIONE-' });
    await ObtenerProductos();
    await mostrarAlertaSiPeriodoAnteriorActivo();
  };

  const mostrarAlertaSiPeriodoAnteriorActivo = async () => {
    const periodo = await verificarPeriodoActivo();
    if (periodo?.estado === 'periodo-anterior-activo') {
      const fecha = date.format(new Date(periodo.periodo.fecha_apertura), 'YYYY-MM-DD');
      Swal.fire(`Está facturando con un periodo del: ${fecha}`);
    }
  };

  return (
    <Container className={classes.root} maxWidth="lg">
      <Paper className={classes.paper}>
        <Typography variant="h5" color="textPrimary">
          Punto de Venta
        </Typography>
      </Paper>

      <Grid container spacing={2} style={{ marginTop: 8 }}>
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
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <NuevoPeriodo />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default PuntoVenta;
