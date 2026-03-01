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

import { Box, Button, Typography, colors } from '@material-ui/core';
import date from 'date-and-time';
import SelectCliente from '../../../src/components/SelectCliente/SelectCliente';
import Switch from '@material-ui/core/Switch';
import EstadoIngreso from '../../components/EstadoIngreso';
import alertify from 'alertifyjs';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ModalFacturaIgreso from './ModalFacturaIgreso';

// Impresion
import Loading from './Loading';
import { useReactToPrint } from 'react-to-print';
import Factura_imp from '../ComponentesImpresion/Factura_imp';

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
  },
  duplicadoBanner: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 12
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
  const { guardarOrden, setIsNew, setReload, state, ordenDuplicar, setOrdenDuplicar } =
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

  // Pre-fill desde orden duplicada
  const [equipo, setEquipo] = useState(ordenDuplicar?.equipo || '');
  const [marca, setMarca] = useState(ordenDuplicar?.marca || '');
  const [modelo, setModelo] = useState(ordenDuplicar?.modelo || '');
  const [serie, setSerie] = useState('');
  const [falla, setFalla] = useState(ordenDuplicar?.falla || '');
  const [trabajo, setTrabajo] = useState('');
  const [total, setTotal] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [abono, setAbono] = useState(0);
  const [observacion, setObservacionLocal] = useState('');

  // Errores de validación
  const [errores, setErrores] = useState({});

  useEffect(() => {
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
    setOrdenDuplicar(null);
  };

  const cancelar = () => {
    setOrdenDuplicar(null);
    setIsNew(false);
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!equipo.trim()) nuevosErrores.equipo = true;
    if (!marca.trim()) nuevosErrores.marca = true;
    if (!modelo.trim()) nuevosErrores.modelo = true;
    if (!serie.trim()) nuevosErrores.serie = true;
    if (!falla.trim()) nuevosErrores.falla = true;
    if (!currentCliente.id) nuevosErrores.cliente = true;

    setErrores(nuevosErrores);

    if (!equipo.trim()) return { estado: false, mensaje: 'Ingrese el equipo' };
    if (!marca.trim()) return { estado: false, mensaje: 'Ingrese la marca' };
    if (!modelo.trim()) return { estado: false, mensaje: 'Ingrese el modelo' };
    if (!serie.trim()) return { estado: false, mensaje: 'Ingrese la serie' };
    if (!falla.trim())
      return { estado: false, mensaje: 'Describa la falla del equipo' };
    if (!currentCliente.id)
      return { estado: false, mensaje: 'Seleccione el cliente' };

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
        <div style={{ display: 'none' }}>
          <Factura_imp ref={componentRef}></Factura_imp>
        </div>

        <div>
          {/* Banner de duplicado */}
          {ordenDuplicar && (
            <div className={classes.duplicadoBanner}>
              Duplicando orden #{ordenDuplicar.id} — Modifique los campos necesarios (serie, falla, etc.)
            </div>
          )}

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

          <br />
          <br />

          <div className={classes.root}>
            <TextField
              id="date"
              label="Fecha Ingreso"
              type="datetime-local"
              onChange={(e) => setFechaIngreso(e.target.value)}
              defaultValue={fechaIngreso}
              className={classes.textFieldFecha}
              InputLabelProps={{ shrink: true }}
            />
            <SelectCliente ancho={400} concatenarCedula={true} />
          </div>

          <TextField
            required
            label="Equipo"
            id="margin-none"
            value={equipo}
            error={errores.equipo}
            onChange={(e) => {
              setEquipo(e.target.value);
              setErrores({ ...errores, equipo: false });
            }}
            className={classes.textField1}
            helperText={errores.equipo ? 'Campo requerido' : 'P. Ej. CPU'}
          />
          <TextField
            required
            label="Marca"
            id="margin-none"
            value={marca}
            error={errores.marca}
            onChange={(e) => {
              setMarca(e.target.value);
              setErrores({ ...errores, marca: false });
            }}
            className={classes.textField1}
            helperText={errores.marca ? 'Campo requerido' : ''}
          />
          <TextField
            required
            label="Modelo"
            id="margin-none"
            value={modelo}
            error={errores.modelo}
            onChange={(e) => {
              setModelo(e.target.value);
              setErrores({ ...errores, modelo: false });
            }}
            className={classes.textField1}
            helperText={errores.modelo ? 'Campo requerido' : ''}
          />
          <TextField
            required
            label="Serie"
            id="margin-none"
            value={serie}
            error={errores.serie}
            onChange={(e) => {
              setSerie(e.target.value);
              setErrores({ ...errores, serie: false });
            }}
            className={classes.textField1}
            helperText={errores.serie ? 'Campo requerido' : ''}
          />
          <EstadoIngreso></EstadoIngreso>

          <TextField
            id="standard-full-width"
            onChange={(e) => {
              setFalla(e.target.value);
              setErrores({ ...errores, falla: false });
            }}
            label="Falla"
            value={falla}
            error={errores.falla}
            style={{ margin: 8, width: '90%' }}
            placeholder=""
            multiline
            helperText={
              errores.falla
                ? 'Describa la falla del equipo'
                : 'P. Ej. No enciende'
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            id="standard-full-width"
            onChange={(e) => setTrabajo(e.target.value)}
            label="Trabajo"
            value={trabajo}
            style={{ margin: 8, width: '90%' }}
            placeholder=""
            multiline
            helperText="P. Ej. Se reparó circuito"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
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
            InputLabelProps={{ shrink: true }}
            variant="filled"
          />
        </div>

        <div>
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
