import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import alertify from 'alertifyjs';
import { ClienteContext } from '../../context/ClienteContext';
import { EstadisticasContext } from '../../context/EstadisticasContext';

import API from '../../Environment/config';

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
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
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
  nuevoCliente: 'api/clientes'
};

const NuevoCliente = ({ className, ...rest }) => {
  const classes = useStyles();
  const { setIsNewClient, setClientes, clientes, setClientesFiltro } =
    useContext(ClienteContext);
  const { setIsReload } = useContext(EstadisticasContext);

  const [cedula, setCedula] = useState('');
  const [nombres, setNombres] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [observacion, setObservacion] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const guardarCliente = async () => {
    if (cedula === '') {
      alertify.error('La cédula es obligatoria', 2);
      return;
    }
    if (nombres === '') {
      alertify.error('Los nombres son obligatorios', 2);
      return;
    }

    let telef = telefono,
      direc = direccion,
      corr = correo,
      obs = observacion;

    if (typeof telef === 'undefined' || telef === '') telef = '-';
    if (typeof direc === 'undefined' || direc === '') direc = '-';
    if (typeof corr === 'undefined' || corr === '') corr = '-';
    if (typeof obs === 'undefined' || obs === '') obs = '-';

    setIsLoading(true);
    const nuevoCliente = {
      cedula,
      nombres,
      telefono: telef,
      direccion: direc,
      correo: corr,
      observacion: obs
    };

    const respuesta = await API.post(END_POINT.nuevoCliente, nuevoCliente);
    setIsLoading(false);

    if (respuesta.data.estado !== 201) {
      alertify.error(respuesta.data.mensaje, 2);
      return;
    }

    setIsReload(true);
    setCedula('');
    setNombres('');
    setTelefono('');
    setDireccion('');
    setCorreo('');
    setObservacion('');
    setClientes([respuesta.data.cliente, ...clientes]);
    setClientesFiltro([respuesta.data.cliente, ...clientes]);
    setIsNewClient(false);
    alertify.success('Guardado correctamente', 2);
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box mt={3}>
        <Card>
          <CardContent className={classes.root}>
            <h2> Nuevo cliente</h2>
            <Input
              defaultValue={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Cédula (Obligatorio)"
              inputProps={{ 'aria-label': 'Cédula' }}
            />
            <Input
              defaultValue={nombres}
              onChange={(e) => setNombres(e.target.value)}
              placeholder="Nombres (Obligatorio)"
              inputProps={{ 'aria-label': 'Nombres' }}
            />
            <Input
              defaultValue={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono"
              inputProps={{ 'aria-label': 'Teléfono' }}
            />
            <br />
            <Input
              defaultValue={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección"
              inputProps={{ 'aria-label': 'Dirección' }}
            />
            <Input
              defaultValue={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo"
              inputProps={{ 'aria-label': 'Correo' }}
            />

            <Input
              defaultValue={correo}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Observación"
              inputProps={{ 'aria-label': 'Observación' }}
            />
          </CardContent>
          <Box display="flex" justifyContent="flex-end">
            {isLoading ? <CircularProgress /> : null}

            <Button
              style={{ backgroundColor: 'rgb(220, 0, 78)', color: 'white' }}
              variant="contained"
              onClick={() => setIsNewClient(false)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={guardarCliente}
              disabled={isLoading}
            >
              Guardar Cliente
            </Button>
          </Box>
        </Card>
      </Box>
    </div>
  );
};

export default NuevoCliente;
