import React, { useContext, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  makeStyles,
  Container,
  Typography,
  Box,
  colors
} from '@material-ui/core';
import Swal from 'sweetalert2';
import date from 'date-and-time';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import Factura from './factura';
import ListadoProductos from './listadoProductos';
import NuevoPeriodo from '../../components/Periodo/NuevoPeriodo/NuevoPeriodo';
import { ProductosContext } from '../../context/ProductosContext';
import { ClienteContext } from '../../context/ClienteContext';
import { PeriodoContext } from '../../context/PeriodoContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%'
  },
  headerCard: {
    background: 'linear-gradient(135deg, #3f51b5 0%, #1a237e 100%)',
    color: '#fff',
    marginBottom: theme.spacing(1)
  },
  productosCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  facturaCard: {
    height: '100%',
    borderTop: `3px solid ${colors.indigo[500]}`
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

const PuntoVenta = () => {
  const classes = useStyles();
  const { ObtenerProductos, setProductos, buscarProductos, productosTemp } =
    useContext(ProductosContext);
  const { setCurrentCliente } = useContext(ClienteContext);
  const { periodoActivo, verificarPeriodoActivo } = useContext(PeriodoContext);

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
      const fecha = date.format(
        new Date(periodo.periodo.fecha_apertura),
        'YYYY-MM-DD'
      );
      Swal.fire(`Está facturando con un periodo del: ${fecha}`);
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth={false} disableGutters>
        {/* Header */}
        <Card className={classes.headerCard}>
          <CardContent style={{ padding: '12px 20px' }}>
            <Box display="flex" alignItems="center">
              <ShoppingCartIcon style={{ marginRight: 10, fontSize: 28 }} />
              <Typography variant="h5" style={{ color: '#fff', fontWeight: 600 }}>
                Punto de Venta
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {periodoActivo ? (
          <Grid container spacing={1}>
            {/* Productos */}
            <Grid item xs={12} md={5}>
              <Card className={classes.productosCard}>
                <ListadoProductos
                  setProductos={setProductos}
                  buscarProductos={buscarProductos}
                  productos={productosTemp}
                  classes={classes}
                />
              </Card>
            </Grid>

            {/* Factura */}
            <Grid item xs={12} md={7}>
              <Card className={classes.facturaCard}>
                <CardContent>
                  <Factura esProforma={false} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card>
            <CardContent>
              <NuevoPeriodo />
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default PuntoVenta;
