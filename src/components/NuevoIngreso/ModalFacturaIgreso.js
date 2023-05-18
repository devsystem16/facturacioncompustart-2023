import React, { useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import alertify from 'alertifyjs';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';

import PuntoVenta from '../../../src/views/puntoVentaIngreso/index';

import { FacturaContext } from '../../context/FacturaContext';
import { ClienteContext } from '../../context/ClienteContext';
import { IngresoContext } from '../../context/IngresoContext';
import { EstadisticasContext } from '../../context/EstadisticasContext';
import { useReactToPrint } from 'react-to-print';
import Factura_imp from '../ComponentesImpresion/Factura_imp'; //'components/ComponentesImpresion/Factura_imp';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content'
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120
  },
  formControlLabel: {
    marginTop: theme.spacing(1)
  }
}));

export default function MaxWidthDialog({ IsguardarFactura = false }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');

  const { guardarFactura, totales, setProductosFactura, setCredito } =
    useContext(FacturaContext);
  const { actualizarIngreso, setReload } = React.useContext(IngresoContext);
  const { setCurrentCliente, currentCliente } = useContext(ClienteContext);
  const { setIsReload } = useContext(EstadisticasContext);
  const EventoImprimirReact = () => {
    print();
  };

  const componentRef = useRef();
  const print = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setProductosFactura([]);

      setCredito(false);
      setCurrentCliente({
        cedula: '',
        nombres: '-SELECCIONE-'
      });
    }
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const SolohandleClose = async () => {
    setOpen(false);
  };
  const handleClose = async () => {
    if (IsguardarFactura) {
      var responseFactura = -1;
      const estado = await guardarFactura();

      if (estado.status === 500) {
        alertify.error('[ERROR EN FACTURA] ' + estado.mensaje, 2);
        // setIsLoading(false);
        return;
      }

      EventoImprimirReact();
      if (estado.status == 200) {
        responseFactura = estado.codigoFac;
        let ingreso = {
          id: localStorage.getItem('idIngreso'),
          factura_relacionada: responseFactura,
          total: totales.total
        };

        const result = await actualizarIngreso(ingreso);

        if (result.code !== 200) {
          alertify.error(result.mensaje, 2);
          return;
        }
        setReload(true); // Ingresos recargar
        setIsReload(true); // EStadisticas recargar.
      }
    }
    setOpen(false);
  };
  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: 'none'
        }}
      >
        <Factura_imp ref={componentRef}></Factura_imp>
      </div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Definir Factura
      </Button>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Ingresar Factura</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <PuntoVenta></PuntoVenta>
              {/* <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                inputProps={{
                  name: 'max-width',
                  id: 'max-width'
                }}
              >
                <MenuItem value={false}>false</MenuItem>
                <MenuItem value="xs">xs</MenuItem>
                <MenuItem value="sm">sm</MenuItem>
                <MenuItem value="md">md</MenuItem>
                <MenuItem value="lg">lg</MenuItem>
                <MenuItem value="xl">xl</MenuItem>
              </Select> */}
            </FormControl>
            {/* <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Switch checked={fullWidth} onChange={handleFullWidthChange} />
              }
              label="Full width"
            /> */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={SolohandleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleClose} color="primary">
            {IsguardarFactura ? 'Guardar' : 'Aceptar'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
