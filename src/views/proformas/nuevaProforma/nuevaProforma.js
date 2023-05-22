import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// import date from 'date-and-time';
import { ClienteContext } from '../../../context/ClienteContext';
import { ProductosContext } from '../../../context/ProductosContext';
import { FacturaContext } from '../../../context/FacturaContext';

import Factura from '../../puntoVenta/factura/index';
import ListadoProductos from '../../puntoVenta/listadoProductos/index';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  textFieldFecha: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
    width: '25ch'
  }
}));
const NuevaProforma = () => {
  const {
    ObtenerProductos,
    productos,
    setProductos,
    buscarProductos,
    productosTemp
  } = useContext(ProductosContext);
  const { setCurrentCliente } = useContext(ClienteContext);
  const {
    fechaEmision,
    setFechaEmision,
    fechaVencimiento,
    setFechaVencimiento
  } = useContext(FacturaContext);

  const classes = useStyles();

  // const [fechaEmision, setFechaEmision] = useState(
  //   date.format(now, 'YYYY-MM-DD')
  // );
  // const [fechaVencimiento, setFechaVencimiento] = useState(
  //   date.format(now, 'YYYY-MM-DD')
  // );
  return (
    <Grid item xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={5}>
          <Paper className={classes.paper}>
            <ListadoProductos
              setProductos={setProductos}
              buscarProductos={buscarProductos}
              productos={productosTemp}
              classes={classes}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={7}>
          <Paper className={classes.paper}>
            <InpuFecha
              label="Fecha Emisión"
              value={fechaEmision}
              setValue={setFechaEmision}
            ></InpuFecha>

            <InpuFecha
              label="Fecha Vencimiento"
              value={fechaVencimiento}
              setValue={setFechaVencimiento}
            ></InpuFecha>
          </Paper>

          <Paper className={classes.paper}>
            <Factura esProforma={true} />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NuevaProforma;

const InpuFecha = ({ label, value, setValue }) => {
  const classes = useStyles();
  return (
    <TextField
      id="date"
      label={label}
      type="date"
      onChange={(e) => setValue(e.target.value)}
      defaultValue={value}
      className={classes.textFieldFecha}
      InputLabelProps={{
        shrink: true
      }}
    />
  );
};
