import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { ClienteContext } from '../../../context/ClienteContext';
import { FacturaContext } from '../../../context/FacturaContext';
import SelectCliente from '../../../components/SelectCliente/SelectCliente';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1)
  },
  divider: {
    margin: theme.spacing(2, 0)
  }
}));

export default function HeadFactura({ defaultCliente }) {
  const { currentCliente, setCurrentCliente } = useContext(ClienteContext);
  const { credito, setCredito, permitirBotonCredito, esProforma } =
    useContext(FacturaContext);

  //
  const handleChange = (event) => {
    if (!permitirBotonCredito) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        // text: 'Las formas de pago declaradas incluyen el PAGO COMPLETO de la factura. No se ofrece la opción de guardar como crédito ante pagos completos. '
        text: 'Revise las formas de pago declaradas.'
      });
      return;
    }

    setCredito(event.target.checked);
  };

  const classes = useStyles();
  var today = new Date(),
    date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();

  useEffect(() => {
    // alert(JSON.stringify(defaultCliente?.cedula));

    if (defaultCliente?.cedula !== undefined) {
      setCurrentCliente(defaultCliente);
    }
  }, [defaultCliente]);

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        {esProforma ? 'Proforma' : 'Facturación'}
      </Typography>

      {!esProforma ? (
        <FormControlLabel
          style={{ float: 'right', marginTop: '-40px' }}
          control={
            <Switch
              checked={credito}
              onChange={handleChange}
              name="credito"
              color="primary"
            />
          }
          label=" ¿Es crédito?"
        />
      ) : null}

      <Grid container spacing={0} style={{ fontSize: '12px' }}>
        <Grid item xs={6}>
          {/* <SelectCliente concatenarCedula={true}></SelectCliente> */}

          {defaultCliente?.cedula !== undefined ? (
            <SelectCliente
              defaultCliete={defaultCliente}
              concatenarCedula={true}
            ></SelectCliente>
          ) : (
            <SelectCliente concatenarCedula={true}></SelectCliente>
          )}

          {/* <Paper className={classes.paper}> Cliente: Mychael Castro <br /> 
          Direccion: Quito- Cofavy 
          </Paper> */}
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <strong>Fecha:</strong> {date}
            <br />
            <strong>CI. :</strong> {currentCliente.cedula}
            <br />
            <strong>Telf. :</strong> {currentCliente.telefono}
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ fontSize: '12px' }}>
        <Grid item xs={1}>
          <Paper className={classes.paper}>*</Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>Cant.</Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper className={classes.paper}>Nombre producto</Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>Precio U.</Paper>
        </Grid>
        {/* <Grid item xs={2}>
          <Paper className={classes.paper}>P. Técnico</Paper>
        </Grid> */}
        <Grid item xs={2}>
          <Paper className={classes.paper}>Total</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
