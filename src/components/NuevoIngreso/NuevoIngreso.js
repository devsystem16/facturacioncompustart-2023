import React, { useState, useContext, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputMoneda from '../InputMoneda';
import { ClienteContext } from '../../context/ClienteContext';
import { TecnicoContext } from '../../context/TecnicoContext';
import { IngresoContext } from '../../context/IngresoContext';

import { PeriodoContext } from '../../context/PeriodoContext';

import { EstadisticasContext } from '../../context/EstadisticasContext';
import { FacturaContext } from '../../context/FacturaContext';

import { Box, Button } from '@material-ui/core';
import date from 'date-and-time';
import SelectCliente from '../../../src/components/SelectCliente/SelectCliente';
import Switch from '@material-ui/core/Switch';
import EstadoIngreso from '../../components/EstadoIngreso';
import alertify from 'alertifyjs';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ModalFacturaIgreso from './ModalFacturaIgreso';
// public\css\bootstrap.min.css
// import 'publiccss\bootstrap.min.css';

// Impresion
import Loading from './Loading';
import { useReactToPrint } from 'react-to-print';
import Factura_imp from '../ComponentesImpresion/Factura_imp'; //'components/ComponentesImpresion/Factura_imp';

const useStyles = makeStyles((theme) => ({
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
    width: '27ch'
  },
  btn: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default function NuevoIngreso() {
  const classes = useStyles();
  const now = new Date();

  const [isLoading, setIsLoading] = useState(false);

  const [fechaIngreso, setFechaIngreso] = useState(
    date.format(now, 'YYYY-MM-DD HH:mm:ss')
  );
  const { periodo } = useContext(PeriodoContext);
  const {
    guardarFactura,
    totales,
    setProductosFactura,
    setCredito,
    setObservacion
  } = useContext(FacturaContext);

  const { setCurrentCliente, currentCliente } = useContext(ClienteContext);

  const { currentTecnico } = useContext(TecnicoContext);
  const { setIsReload } = useContext(EstadisticasContext);
  const { guardarOrden, setIsNew, setReload, state } =
    useContext(IngresoContext);

  // IMPRESION

  const componentRef = useRef();
  const EventoImprimirReact = () => {
    print();
  };
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

  // END IMPRESION
  const [equipo, setEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [falla, setFalla] = useState('');
  const [trabajo, setTrabajo] = useState('');
  const [total, setTotal] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [abono, setAbono] = useState(0);
  const [observacion, setObservacionLocal] = useState('');

  useEffect(() => {
    console.log('redner nuevo');

    setCurrentCliente({
      cedula: '',
      nombres: '-SELECCIONE-'
    });
  }, [saldo]);

  const calcularSaldo_total = (valor) => {
    setTotal(+valor);
    setSaldo(+valor - +abono);
  };
  const calcularSaldo_abono = (valor) => {
    setAbono(+valor);
    setSaldo(+total - +valor);
  };

  const guardar = async () => {
    var validar = validarCampos();

    if (!validar.estado) {
      alertify.error(validar.mensaje, 2);
      return;
    }

    setIsLoading(true);

    var abono_ordenes = [];

    if (abono !== 0) {
      var objAbono = [];
      objAbono = {
        abono,
        fecha: fechaIngreso,
        comentario: 'Abono inicial'
      };
      abono_ordenes = [objAbono];
    }

    var usuario_id = 1;
    if (localStorage.getItem('user_id') !== null) {
      usuario_id = localStorage.getItem('user_id');
    }

    var responseFactura = -1;
    var total_factura = 0;
    if (facturarIngreso.checked_facturarIngreso) {
      total_factura = totales.total;
      const estado = await guardarFactura();

      if (estado.status === 500) {
        alertify.error('[ERROR EN FACTURA] ' + estado.mensaje, 2);
        setIsLoading(false);
        return;
      }

      EventoImprimirReact();
      if (estado.status == 200) {
        responseFactura = estado.codigoFac;
      }
    }
    const newOrden = {
      cliente_id: currentCliente.id,
      usuario_id: usuario_id,
      fecha: fechaIngreso,
      equipo,
      marca,
      modelo,
      serie,
      falla,
      trabajo,
      total: total_factura,
      saldo,
      abono,
      observacion,
      camara: state.camara,
      teclado: state.teclado,
      microfono: state.microfono,
      parlantes: state.parlantes,
      last_user_update: usuario_id,
      user_update_work: usuario_id,
      abono_ordenes,
      factura_relacionada: responseFactura,
      periodo_id: periodo.id
    };

    const response = await guardarOrden(newOrden);

    if (response.code !== 200) {
      alertify.error(response.mensaje, 2);
      setIsLoading(false);
      return;
    }
    alertify.success(response.mensaje, 2);
    setIsReload(true);
    setReload(true);
    setIsNew(false);
    setIsLoading(false);
    setObservacion('');
  };

  const cancelar = () => {
    setIsNew(false);
  };

  const validarCampos = () => {
    if (equipo === '') return { estado: false, mensaje: 'Ingrese el equipo' };
    if (marca === '') return { estado: false, mensaje: 'Ingrese la marca' };
    if (modelo === '') return { estado: false, mensaje: 'Ingrese el modelo' };
    if (serie === '') return { estado: false, mensaje: 'Ingrese la serie' };
    if (falla === '') return { estado: false, mensaje: 'Ingrese la falla' };
    // if (total === 0 || total === '0')
    //   return { estado: false, mensaje: 'Total inválido, no puede ser 0' };

    if (currentCliente.id === undefined)
      return { estado: false, mensaje: 'Seleccione el cliente' };

    // if (localStorage.getItem('tipo_usuario') === undefined)
    //   return { estado: false, mensaje: 'Seleccione el Técnico' };

    return { estado: true, mensaje: 'OK' };
  };

  const [facturarIngreso, setFacturarIngreso] = React.useState({
    checked_facturarIngreso: false
  });

  const handleChangeStock = (event) => {
    setFacturarIngreso({
      ...facturarIngreso,
      [event.target.name]: event.target.checked
    });
  };

  return (
    <>
      <div className={classes.root}>
        <div
          style={{
            display: 'none'
          }}
        >
          <Factura_imp ref={componentRef}></Factura_imp>
        </div>

        <div>
          <div></div>

          <FormControlLabel
            control={
              <Switch
                checked={facturarIngreso.checked_facturarIngreso}
                onChange={handleChangeStock}
                name="checked_facturarIngreso"
                color="primary"
              />
            }
            label="Ingreso facturado"
          />
          {facturarIngreso.checked_facturarIngreso && <ModalFacturaIgreso />}

          {/* {stateStock.checked_descontarStock && <SelectProducto ancho="400" />} */}

          <br />
          <br />

          <div></div>
          <div className={classes.root}>
            <TextField
              id="date"
              label="Fecha Ingreso"
              // type="date"
              type="datetime-local"
              onChange={(e) => setFechaIngreso(e.target.value)}
              defaultValue={fechaIngreso}
              className={classes.textFieldFecha}
              InputLabelProps={{
                shrink: true
              }}
            />
            <SelectCliente ancho={400} concatenarCedula={true} />
          </div>

          <TextField
            required
            label="Equipo"
            id="margin-none"
            defaultValue=""
            onChange={(e) => setEquipo(e.target.value)}
            className={classes.textField1}
            helperText="P. Ej. CPU"
          />
          <TextField
            required
            label="Marca"
            id="margin-none"
            defaultValue=""
            onChange={(e) => setMarca(e.target.value)}
            className={classes.textField1}
            // helperText="P. Ej. DELL"
          />
          <TextField
            required
            label="Modelo"
            id="margin-none"
            defaultValue=""
            onChange={(e) => setModelo(e.target.value)}
            className={classes.textField1}
            helperText=""
          />
          <TextField
            required
            label="Serie"
            id="margin-none"
            defaultValue=""
            onChange={(e) => setSerie(e.target.value)}
            className={classes.textField1}
            helperText=""
          />
          <EstadoIngreso></EstadoIngreso>

          <TextField
            id="standard-full-width"
            onChange={(e) => setFalla(e.target.value)}
            label="Falla"
            style={{ margin: 8, width: '90%' }}
            placeholder=""
            multiline
            helperText="P. Ej. No enciende"
            //   fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="standard-full-width"
            onChange={(e) => setTrabajo(e.target.value)}
            label="Trabajo"
            style={{ margin: 8, width: '90%' }}
            placeholder=""
            multiline
            helperText="P. Ej. Se reparó circuito"
            //   fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />

          {/* <InputMoneda
            label="Total"
            helperText=""
            onChangeText={calcularSaldo_total}
          />
          <InputMoneda
            label="Abono"
            helperText=""
            onChangeText={calcularSaldo_abono}
          />
          <TextField
            disabled
            id="standard-disabled"
            label="Saldo"
            value={saldo}
          /> */}

          {/* <InputMoneda
            label="Saldo"
            Disabled={true}
            helperText=""
            value={saldo}
            onChangeText={setSaldo}
          /> */}
        </div>
        <div>
          <TextField
            id="filled-full-width"
            label="Observación"
            style={{ margin: '3px 10px 3px 3px', width: '425px' }}
            placeholder=""
            helperText=""
            fullWidth
            margin="normal"
            onChange={(e) => setObservacionLocal(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            variant="filled"
          />
        </div>

        <div>
          {/* <SelectTecnico ancho={300} />  */}
          <TextField
            disabled
            id="standard-disabled"
            label="Usuario"
            value={localStorage.getItem('nombres')}
          />
        </div>
      </div>

      <Box display="flex" justifyContent="flex-end">
        {isLoading && <Loading />}

        <Button variant="contained" className={classes.btn} onClick={cancelar}>
          Cancelar
        </Button>
        <Button
          disabled={isLoading ? true : false}
          color="primary"
          variant="contained"
          onClick={guardar}
        >
          Guardar
        </Button>
      </Box>
    </>
  );
}
