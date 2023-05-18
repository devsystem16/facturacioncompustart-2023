import React, { useContext, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';

import { FacturaContext } from '../context/FacturaContext';
import { ClienteContext } from '../context/ClienteContext';
import { ProductosContext } from '../context/ProductosContext';

import Swal from 'sweetalert2';
import alertify from 'alertifyjs';

import Factura_imp from '../components/ComponentesImpresion/Factura_imp';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

export default function CircularIntegration() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();

  const { guardarFactura, setProductosFactura, setObservacion, setCredito } =
    useContext(FacturaContext);
  const { setCurrentCliente } = useContext(ClienteContext);
  const { productos, setProductosTemp2 } = useContext(ProductosContext);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  React.useEffect(() => {
    console.log('Se esta renderizando el born guardar');
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = async () => {
    setLoading(true);
    const estado = await guardarFactura();
    setLoading(false);

    if (estado.status !== 200) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: estado.mensaje
      });
      return;
    }

    EventoImprimirReact();

    alertify.success(estado.mensaje, 2);

    // setProductosFactura([]);
    // setObservacion('');

    // setSuccess(true);

    // setLoading(true);
    // setSuccess(true);
    // if (!loading) {
    //   setSuccess(false);
    //   setLoading(true);
    //   timer.current = window.setTimeout(() => {
    //     setSuccess(true);
    //     setLoading(false);
    //   }, 2000);
    // }
  };

  const componentRef = useRef();
  const EventoImprimirReact = () => {
    print();
  };
  const print = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setProductosFactura([]);
      setObservacion('');
      setCredito(false);
      setProductosTemp2(productos); // Actualizar la lista de productos inmutable al momento de ya guardar la factura par que surjan efecto los cambios de las cantidades
      setCurrentCliente({
        cedula: '',
        nombres: '-SELECCIONE-'
      });
    }
  });

  return (
    <div className={classes.root}>
      <div
        style={{
          display: 'none'
        }}
      >
        <Factura_imp ref={componentRef}></Factura_imp>
      </div>
      <div className={classes.wrapper}>
        <Fab
          aria-label="save"
          color="primary"
          className={buttonClassname}
          onClick={handleButtonClick}
        >
          {success ? <CheckIcon /> : <SaveIcon />}
        </Fab>
        {loading && (
          <CircularProgress size={68} className={classes.fabProgress} />
        )}
      </div>
    </div>
  );
}
