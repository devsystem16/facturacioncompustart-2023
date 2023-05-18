import React, { useContext, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import date from 'date-and-time';
import Button from '@material-ui/core/Button';
import { ReportesContext } from '../../../context/ReportesContext';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  button: {
    margin: theme.spacing(1)
  },
  table: {
    minWidth: 650
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField1: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '36ch'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch'
  },
  textFieldFecha: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
    width: '25ch'
  },
  btn: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const ConfiguracionVentasDiarias = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const { getReporteVentasDiaras } = useContext(ReportesContext);

  const now = new Date();

  const [fechaInicio, setFechaInicio] = useState(
    date.format(now, 'YYYY-MM-DD')
  );

  const [fechaFin, setFechaFin] = useState(date.format(now, 'YYYY-MM-DD'));

  const classes = useStyles();

  const cargarReporte = async () => {
    handleToggle();
    await getReporteVentasDiaras(fechaInicio, fechaFin);
    setOpen(false);
  };
  return (
    <>
      <TextField
        id="date"
        label="Desde"
        type="date"
        onChange={(e) => setFechaInicio(e.target.value)}
        defaultValue={fechaInicio}
        className={classes.textFieldFecha}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        id="date"
        label="Hasta"
        type="date"
        onChange={(e) => setFechaFin(e.target.value)}
        defaultValue={fechaFin}
        className={classes.textFieldFecha}
        InputLabelProps={{
          shrink: true
        }}
      />

      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        // endIcon={<Icon>send</Icon>}
        loading={true}
        onClick={cargarReporte}
      >
        Cargar
      </Button>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ConfiguracionVentasDiarias;
