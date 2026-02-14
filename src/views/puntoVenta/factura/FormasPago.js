import React, { useContext, useState, useEffect } from 'react';
import {
  makeStyles,
  Drawer,
  Button,
  Box,
  Typography,
  Divider,
  TextField,
  IconButton,
  colors
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import NumberFormatCustom from '../../../components/ValidationCurrency/ValidationCurrency';
import API from '../../../Environment/config';
import { FacturaContext } from '../../../context/FacturaContext';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 360,
    padding: 0
  },
  header: {
    padding: '20px 24px 16px',
    background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
    color: '#fff'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2
  },
  summaryBox: {
    margin: '16px 20px',
    padding: '14px 16px',
    borderRadius: 8,
    border: '1px solid #e8e8e8',
    backgroundColor: '#f8f9fc'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0'
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.grey[600],
    fontWeight: 500
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.grey[800]
  },
  formList: {
    padding: '8px 20px'
  },
  formItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  formIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#e8eaf6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0
  },
  formLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.grey[700],
    flexGrow: 1
  },
  formInput: {
    width: 120
  },
  statusMessage: {
    margin: '12px 20px',
    padding: '10px 14px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    textAlign: 'center'
  },
  statusOk: {
    backgroundColor: '#e8f5e9',
    color: colors.green[700],
    border: '1px solid ' + colors.green[200]
  },
  statusError: {
    backgroundColor: '#fbe9e7',
    color: colors.red[700],
    border: '1px solid ' + colors.red[200]
  },
  statusWarning: {
    backgroundColor: '#fff3e0',
    color: colors.orange[800],
    border: '1px solid ' + colors.orange[200]
  },
  actions: {
    padding: '16px 20px',
    display: 'flex',
    gap: 10
  },
  btnCancelar: {
    flex: 1,
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 6,
    color: colors.grey[700]
  },
  btnAceptar: {
    flex: 1,
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 6
  },
  totalButton: {
    fontWeight: 700,
    fontSize: 14,
    color: '#3f51b5',
    textTransform: 'none',
    padding: '2px 8px',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: 'rgba(63, 81, 181, 0.08)'
    }
  }
}));

export default function FormaPago({ TotalFactura, formasPago, setFormasPago }) {
  const classes = useStyles();
  const [abrirFormasPago, setAbrirFormasPago] = useState(false);
  const [valorDeclarado, setValorDeclarado] = useState(0);
  const [ListformasPago, setListformasPago] = useState([]);
  const { setCredito, setCreditoFP, setPermitirBotonCredito } =
    useContext(FacturaContext);

  const [mensaje, setMensaje] = useState({
    estado: '=',
    mensaje: 'TODO OK',
    btnName: 'Aceptar',
    factura: true,
    credito: false,
    bloquarBoton: false
  });

  const setFormaPagoDefault = (listFormasPago) => {
    listFormasPago.find((FPago) => FPago.default === 1);
  };

  const cargarFormasPago = async () => {
    const respuesta = await API.get('/api/forma-pagos');
    setFormaPagoDefault(respuesta.data);
    setListformasPago(respuesta.data);
  };

  const compararValores = (totalFactura, valorDeclarado) => {
    if (isNaN(totalFactura) || isNaN(valorDeclarado)) {
      return {
        estado: '<>',
        mensaje: 'Valores no válidos',
        btnName: 'Aceptar',
        factura: false,
        credito: false,
        bloquarBoton: true,
        permitirBotonCreditos: true
      };
    }
    if (+totalFactura === +valorDeclarado) {
      return {
        estado: '=',
        mensaje: 'El valor declarado es igual al total de la factura.',
        btnName: 'Aceptar',
        factura: true,
        credito: false,
        bloquarBoton: false,
        permitirBotonCreditos: false
      };
    }
    if (+valorDeclarado > +totalFactura) {
      return {
        estado: '>',
        mensaje: 'El valor declarado es mayor que el total de la factura.',
        btnName: 'Aceptar',
        factura: true,
        credito: false,
        bloquarBoton: true,
        permitirBotonCreditos: false
      };
    }
    return {
      estado: '<',
      mensaje: 'El valor declarado es menor que el total de la factura.',
      btnName: 'Aceptar/Crédito',
      factura: false,
      credito: true,
      bloquarBoton: false,
      permitirBotonCreditos: false
    };
  };

  const recalcular = () => {
    const suma = Object.values(formasPago).reduce(
      (acumulador, { valor }) => acumulador + +valor,
      0
    );
    setValorDeclarado(suma);

    var res = compararValores(
      TotalFactura.replace(/[^\d.]/g, '').toString(),
      suma.toString()
    );
    setMensaje(res);
    setCredito(res.credito);
    setCreditoFP(res.credito);
    setPermitirBotonCredito(res.permitirBotonCreditos);
  };

  const handleChange = (event, codigo) => {
    const { name, value } = event.target;
    setFormasPago({
      ...formasPago,
      [name]: {
        id: codigo,
        valor: value
      }
    });
  };

  const fn_cancelar = () => {
    setPermitirBotonCredito(true);
    setCreditoFP(false);
    setCredito(false);
    setMensaje({
      estado: '=',
      mensaje: 'TODO OK',
      btnName: 'Aceptar',
      factura: true,
      credito: false,
      bloquarBoton: false
    });
    setValorDeclarado(0);
    setFormasPago({});
    setAbrirFormasPago(false);
  };

  const buscarValor = (id) => {
    let formaPago = Object.values(formasPago).find((fp) => fp.id === id);
    return formaPago ? formaPago.valor : 0;
  };

  useEffect(() => {
    cargarFormasPago();
  }, [TotalFactura]);

  const getStatusClass = () => {
    if (mensaje.estado === '=') return classes.statusOk;
    if (mensaje.estado === '>') return classes.statusError;
    if (mensaje.estado === '<') return classes.statusWarning;
    return classes.statusError;
  };

  return (
    <div>
      <Button
        className={classes.totalButton}
        onClick={() => setAbrirFormasPago(true)}
      >
        {TotalFactura}
      </Button>

      <Drawer
        anchor="right"
        open={abrirFormasPago}
        classes={{ paper: classes.drawerPaper }}
      >
        {/* Header */}
        <div className={classes.header}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>
              <Typography className={classes.headerTitle}>
                Formas de Pago
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Distribuya el monto entre las formas disponibles
              </Typography>
            </div>
            <IconButton size="small" onClick={fn_cancelar} style={{ color: '#fff' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </div>

        {/* Summary */}
        <div className={classes.summaryBox}>
          <div className={classes.summaryRow}>
            <Typography className={classes.summaryLabel}>
              Total Factura
            </Typography>
            <Typography className={classes.summaryValue}>
              {TotalFactura}
            </Typography>
          </div>
          <Divider style={{ margin: '6px 0' }} />
          <div className={classes.summaryRow}>
            <Typography className={classes.summaryLabel}>
              Valor Declarado
            </Typography>
            <Typography
              className={classes.summaryValue}
              style={{
                color:
                  mensaje.estado === '='
                    ? colors.green[600]
                    : mensaje.estado === '<'
                    ? colors.orange[600]
                    : colors.red[600]
              }}
            >
              $ {valorDeclarado}
            </Typography>
          </div>
        </div>

        {/* Payment methods */}
        <div className={classes.formList}>
          {ListformasPago.map((formaP, index) => (
            <div className={classes.formItem} key={formaP.id || index}>
              <div className={classes.formIcon}>
                <AttachMoneyIcon
                  fontSize="small"
                  style={{ color: '#3f51b5' }}
                />
              </div>
              <Typography className={classes.formLabel}>
                {formaP.label}
              </Typography>
              <TextField
                name={formaP.nombre}
                defaultValue={buscarValor(formaP.id)}
                onChange={(event) => handleChange(event, formaP.id)}
                onKeyUp={recalcular}
                variant="outlined"
                size="small"
                className={classes.formInput}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  style: { fontSize: 13 }
                }}
              />
            </div>
          ))}
        </div>

        {/* Status message */}
        <div className={`${classes.statusMessage} ${getStatusClass()}`}>
          {mensaje.estado === '=' && (
            <CheckCircleOutlineIcon
              fontSize="small"
              style={{ verticalAlign: 'middle', marginRight: 6 }}
            />
          )}
          {mensaje.mensaje}
        </div>

        {/* Actions */}
        <Box flexGrow={1} />
        <div className={classes.actions}>
          <Button
            onClick={fn_cancelar}
            variant="outlined"
            className={classes.btnCancelar}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => setAbrirFormasPago(false)}
            variant="contained"
            color="primary"
            disabled={mensaje.bloquarBoton}
            className={classes.btnAceptar}
          >
            {mensaje.btnName}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
