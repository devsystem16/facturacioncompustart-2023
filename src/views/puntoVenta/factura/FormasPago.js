import React, { useContext } from 'react';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import NumberFormatCustom from '../../../components/ValidationCurrency/ValidationCurrency';

import TextField from '@material-ui/core/TextField';
import { useState, useEffect } from 'react';
import API from '../../../Environment/config';
import { FacturaContext } from '../../../context/FacturaContext';
export default function FormaPago({ TotalFactura, formasPago, setFormasPago }) {
  const [abrirFormasPago, setAbrirFormasPago] = useState(false);
  const [valorDeclarado, setValorDeclarado] = useState(0);

  const [ListformasPago, setListformasPago] = useState([]);
  const { setCredito, setCreditoFP, setPermitirBotonCredito } =
    useContext(FacturaContext);

  const setFormaPagoDefault = (listFormasPago) => {
    let fPago = listFormasPago.find((FPago) => FPago.default === 1);
    // setFormasPago({
    //   [fPago.nombre]: {
    //     id: fPago.id,
    //     valor: TotalFactura.replace(/[^\d.]/g, '')
    //   }
    // });
  };
  const cargarFormasPago = async () => {
    const respuesta = await API.get('/api/forma-pagos');
    setFormaPagoDefault(respuesta.data); // Esblecer el total de la factura con la forma de pago default.
    setListformasPago(respuesta.data);
  };

  const [mensaje, setMensaje] = useState({
    estado: '=',
    mensaje: 'TODO OK',
    btnName: 'Aceptar',
    factura: true,
    credito: false,
    bloquarBoton: false
  });
  const compararValores = (totalFactura, valorDeclarado) => {
    console.log(totalFactura, valorDeclarado);
    if (isNaN(totalFactura) || isNaN(valorDeclarado)) {
      return {
        estado: '<>',
        mensaje: 'error',
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

  const recalcular = (event) => {
    const suma = Object.values(formasPago).reduce(
      (acumulador, { valor }) => acumulador + +valor,
      0
    );
    setValorDeclarado(suma);

    console.log(
      'TOTAL FAC:  (' +
        TotalFactura.replace(/[^\d.]/g, '') +
        ') --- SUMA: ' +
        suma,
      TotalFactura.replace(/[^\d.]/g, '').toString() === suma.toString()
    );

    var res = compararValores(
      TotalFactura.replace(/[^\d.]/g, '').toString(),
      suma.toString()
    );
    setMensaje(res);

    setCredito(res.credito);
    setCreditoFP(res.credito);
    setPermitirBotonCredito(res.permitirBotonCreditos);

    // if (TotalFactura.replace(/[^\d.]/g, '').toString() === suma.toString())
    //   setHasError(false);
    // else setHasError(true);
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
    // setFormaPagoDefault(ListformasPago);
    setFormasPago({});
    setAbrirFormasPago(false);
  };

  const buscarValor = (id) => {
    let formaPago = Object.values(formasPago).find((fp) => fp.id === id);
    if (formaPago) {
      return formaPago.valor;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    cargarFormasPago();
  }, [TotalFactura]);

  const list = () => (
    <div role="presentation">
      <center>
        <h2>Formas de pago </h2>
        <p>Total: {TotalFactura}</p>
        <p>Valor Declarado: $ {valorDeclarado}</p>
        <hr></hr>
        {/* <p>{JSON.stringify(mensaje)}</p> */}
      </center>
      <List>
        {ListformasPago.map((formaP, index) => (
          <div>
            <ListItem button key={formaP.nombre}>
              <ListItemIcon index={index}>
                {formaP.label} <AttachMoneyIcon />
              </ListItemIcon>

              <TextField
                id="standard-disabled"
                //   label={formaP.label}
                name={formaP.nombre}
                // disabled={true}
                defaultValue={buscarValor(formaP.id)}
                onChange={(event) => handleChange(event, formaP.id)}
                onKeyUp={(event) => recalcular(event)}
                variant="standard"
                style={{ width: 200, textAlign: 'center' }}
                InputProps={{
                  inputComponent: NumberFormatCustom
                }}
              />
            </ListItem>
          </div>
        ))}
      </List>
      <Divider />
      <br></br>
      <center>
        <Button onClick={() => fn_cancelar()} variant="contained" color="">
          Cancelar
        </Button>{' '}
        <Button
          onClick={() => setAbrirFormasPago(false)}
          variant="contained"
          color="primary"
          // disabled={hasError}
          disabled={mensaje.bloquarBoton}
        >
          {/* Aceptar */}
          {mensaje.btnName}
        </Button>
      </center>
    </div>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            style={{ height: '10px' }}
            onClick={() => setAbrirFormasPago(true)}
          >
            {TotalFactura}
          </Button>
          <Drawer anchor={anchor} open={abrirFormasPago}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
