import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { ClienteContext } from '../../context/ClienteContext';
import { EstadisticasContext } from '../../context/EstadisticasContext';
import API from '../../Environment/config';
import alertify from 'alertifyjs';

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  makeStyles,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  suggestions: {
    maxHeight: 400,
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
}));

const END_POINT = {
  nuevoCliente: 'api/clientes'
};

const NuevoCliente = ({ className, ...rest }) => {
  const classes = useStyles();
  const { setIsNewClient, setClientes, clientes, setClientesFiltro } = useContext(ClienteContext);
  const { setIsReload } = useContext(EstadisticasContext);

  const [form, setForm] = useState({
    cedula: '',
    nombres: '',
    telefono: '',
    direccion: '',
    correo: '',
    observacion: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);

  // Manejo de cambios
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejo de Blur para filtrar clientes similares
  const handleBlur = () => {
    const termCedula = form.cedula.trim().toLowerCase();
    const termNombre = form.nombres.trim().toLowerCase();

    const matches = clientes.filter(
      (c) =>
        (termCedula && c.cedula.toLowerCase().includes(termCedula)) ||
        (termNombre && c.nombres.toLowerCase().includes(termNombre))
    );

    setSugerencias(matches);
  };

  const guardarCliente = async () => {
    if (!form.cedula) return alertify.error('La cédula es obligatoria', 2);
    if (!form.nombres) return alertify.error('Los nombres son obligatorios', 2);

    const nuevoCliente = {
      ...form,
      telefono: form.telefono || '-',
      direccion: form.direccion || '-',
      correo: form.correo || '-',
      observacion: form.observacion || '-'
    };

    setIsLoading(true);
    try {
      const respuesta = await API.post(END_POINT.nuevoCliente, nuevoCliente);
      setIsLoading(false);

      if (respuesta.data.estado !== 201) {
        alertify.error(respuesta.data.mensaje, 2);
        return;
      }

      setIsReload(true);
      setClientes([respuesta.data.cliente, ...clientes]);
      setClientesFiltro([respuesta.data.cliente, ...clientes]);
      setForm({ cedula: '', nombres: '', telefono: '', direccion: '', correo: '', observacion: '' });
      setIsNewClient(false);
      setSugerencias([]);
      alertify.success('Guardado correctamente', 2);
    } catch (err) {
      setIsLoading(false);
      alertify.error('Error al guardar el cliente', 2);
      console.error(err);
    }
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={3}>
        {/* Formulario */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Nuevo Cliente</Typography>
              <TextField
                fullWidth
                variant="outlined"
                label="Cédula (Obligatorio)"
                name="cedula"
                value={form.cedula}
                onChange={handleChange}
                onBlur={handleBlur}
                className={classes.input}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Nombres (Obligatorio)"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                onBlur={handleBlur}
                className={classes.input}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className={classes.input}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                className={classes.input}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Correo"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                className={classes.input}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Observación"
                name="observacion"
                value={form.observacion}
                onChange={handleChange}
                className={classes.input}
              />

              <div className={classes.buttonGroup}>
                {isLoading && <CircularProgress size={24} />}
                <Button
                  variant="contained"
                  style={{ backgroundColor: 'rgb(220, 0, 78)', color: 'white' }}
                  onClick={() => setIsNewClient(false)}
                  disabled={isLoading}
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
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Sugerencias */}
        <Grid item xs={12} md={6}>
          <Paper className={classes.suggestions}>
            <Typography variant="h6">Clientes Similares</Typography>
            {sugerencias.length === 0 ? (
              <Typography variant="body2">No se encontraron coincidencias</Typography>
            ) : (
              <List>
                {sugerencias.map((cliente) => (
                  <React.Fragment key={cliente.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${cliente.nombres}`}
                        secondary={`Cédula: ${cliente.cedula} | Teléfono: ${cliente.telefono}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default NuevoCliente;
