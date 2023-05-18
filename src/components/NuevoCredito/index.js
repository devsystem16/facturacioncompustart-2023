import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { ClienteContext } from '../../context/ClienteContext';
import { CreditoContext } from '../../context/CreditoContext';
import { EstadisticasContext } from '../../context/EstadisticasContext';
import API from '../../Environment/config';
import SelectCliente from '../../../src/components/SelectCliente/SelectCliente';
import date from 'date-and-time';
import InputMoneda from '../InputMoneda';
import alertify from 'alertifyjs';

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';

import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  root1: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const END_POINT = {
  nuevoCredito: 'api/creditos'
};

const NuevoCredito = ({ className, ...rest }) => {
  const classes = useStyles();
  const now = new Date();

  const { setIsReload } = useContext(EstadisticasContext);
  const { setIsNewClient, setClientes, clientes, currentCliente } =
    useContext(ClienteContext);

  const { setRecargarListaCreditos } = useContext(CreditoContext);

  const [fechaCredito, setFechaCredito] = useState(
    date.format(now, 'YYYY-MM-DD')
  );

  const [comentarioCredito, setComentarioCredito] = useState('');
  const [totalCredito, setTotalCredito] = useState(0);
  const [abonoCredito, setAbonoCredito] = useState(0);
  const [saldoCredito, setSaldoCredito] = useState(0);
  const [detallesCredito, setDetalleCredito] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const calcularSaldo = (valor) => {
    setTotalCredito(+valor);
    setSaldoCredito(+valor - +abonoCredito);
  };

  const calcularSaldo_abono = (valor) => {
    setAbonoCredito(+valor);
    setSaldoCredito(+totalCredito - +valor);
  };

  const guardarCredito = async () => {
    if (currentCliente.cedula === '') {
      alertify.error('Ingrese el cliente.', 2);
      return;
    }

    setIsLoading(true);
    console.log(abonoCredito);

    var detalle = [];

    if (abonoCredito !== 0) {
      var objAbono = [];
      objAbono = {
        abono: abonoCredito,
        fecha: fechaCredito,
        comentario: 'Registro'
      };
      detalle = [objAbono];
    }

    const credito = {
      cabecera: {
        cliente_id: currentCliente.id,
        fecha: fechaCredito,
        detalle: comentarioCredito,
        saldo: saldoCredito,
        total: totalCredito
      },
      detalle
    };

    const respuesta = await API.post(END_POINT.nuevoCredito, credito);

    if (respuesta.status === 200) {
      setIsReload(true);
      setRecargarListaCreditos(true);
      alertify.success('Credito almacenado.', 2);
      setIsLoading(false);
      setComentarioCredito('');
      setTotalCredito(0);
      setAbonoCredito(0);
      setSaldoCredito(0);
    }
  };

  const asignarTotal = (e) => {
    setTotalCredito(e);
  };
  const abonarTXT = (e) => {
    setAbonoCredito(e);
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        {isLoading ? <CircularProgress /> : null}

        <Button
          style={{ backgroundColor: 'rgb(220, 0, 78)', color: 'white' }}
          variant="contained"
          onClick={() => setIsNewClient(false)}
        >
          Cancelar
        </Button>
        <Button color="primary" variant="contained" onClick={guardarCredito}>
          Guardar
        </Button>
      </Box>

      <Box mt={3}>
        <Card>
          <CardContent className={classes.root}>
            <h2> Nuevo Credito</h2>
            <form className={classes.root1} noValidate autoComplete="off">
              <div>
                <SelectCliente ancho={500} concatenarCedula={true} />
                <TextField
                  id="date"
                  label="Fecha Credito"
                  type="date"
                  onChange={(e) => setFechaCredito(e.target.value)}
                  defaultValue={fechaCredito}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <TextField
                  required
                  value={comentarioCredito}
                  // defaultValue={comentarioCredito}

                  onChange={(e) => setComentarioCredito(e.target.value)}
                  id="standard-required"
                  label="Detalle"
                />

                <InputMoneda
                  label="Total"
                  helperText=""
                  onChangeText={calcularSaldo}
                />

                {/* <TextField
                  required
                  onChange={(e) => asignarTotal(e.target.value)}
                  id="standard-required"
                  label="Total $"
                  // defaultValue={totalCredito}
                  value={totalCredito}
                /> */}
                {/* <TextField
                  onChange={(e) => abonarTXT(e.target.value)}
                  id="standard-required"
                  label="Abono $"
                  // defaultValue={abonoCredito}
                  value={abonoCredito}
                /> */}
                <InputMoneda
                  label="Abono $"
                  helperText=""
                  onChangeText={calcularSaldo_abono}
                />

                <TextField
                  disabled
                  onChange={(e) => setSaldoCredito(e.target.value)}
                  id="standard-required"
                  label="Saldo $"
                  // defaultValue={saldoCredito}
                  value={saldoCredito}
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default NuevoCredito;
