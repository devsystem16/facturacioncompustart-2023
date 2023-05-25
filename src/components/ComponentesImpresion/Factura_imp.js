import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { FacturaContext } from '../../context/FacturaContext';
import { ClienteContext } from '../../context/ClienteContext';
import RowFactura from './FacturaRow_imp';
import TotalesFac from './TotalesFac';
import logo from '../../assets/Factura.PNG';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(0)
  },
  divider: {
    margin: theme.spacing(1, 0)
  }
}));

const Factura_imp = React.forwardRef((props, ref) => {
  const {
    productosFactura,
    totales,
    factura_id,
    fechaFactura,
    credito,
    esProforma
  } = useContext(FacturaContext);
  const { currentCliente } = useContext(ClienteContext);

  const classes = useStyles();

  return (
    <div
      ref={ref}
      style={{ width: '50%', marginLeft: '19px', fontFamily: 'Arial' }}
    >
      <img className="imagenImpresion" src={logo} />
      <Typography variant="subtitle1" gutterBottom>
        <center>
          N° Control {factura_id} {credito && ' (Crédito)'}
          {esProforma && ' (Proforma)'}
        </center>
      </Typography>

      <Grid container spacing={0} style={{ fontSize: '12px' }}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <div>
              <strong> CI:</strong> {currentCliente.cedula}
            </div>
            <div>
              <strong> Cliente:</strong> {currentCliente.nombres}
            </div>
            <div>
              <strong> Telf.:</strong> {currentCliente.telefono}
            </div>
            <div>
              <strong> Dir.:</strong> {currentCliente.direccion}
            </div>
            <div>
              <strong> Fecha:</strong> {fechaFactura}
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ fontSize: '12px' }}>
        <Grid item xs={1}>
          <Paper className={classes.paper}>Cant.</Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper className={classes.paper}>Nombre producto</Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>Precio U.</Paper>
        </Grid>

        <Grid item xs={2}>
          <Paper className={classes.paper}>Total</Paper>
        </Grid>
      </Grid>

      <div>
        {productosFactura.map((producto) => {
          return (
            <RowFactura
              key={producto.id + producto.tipoPrecio}
              producto={producto}
            />
          );
        })}
      </div>

      <TotalesFac key={1} totales={totales} />
    </div>
  );
});

export default Factura_imp;
