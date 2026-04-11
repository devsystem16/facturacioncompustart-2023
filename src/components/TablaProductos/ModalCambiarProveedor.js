import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  Box
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import alertify from 'alertifyjs';
import API from '../../Environment/config';

const AGREGAR_NUEVO = { id: '__nuevo__', codigo: '+', nombre: 'Agregar nuevo proveedor' };

const nuevoProveedorVacio = {
  codigo: '',
  nombre: '',
  telefono: '',
  email: '',
  direccion: '',
  ruc_cedula: '',
  contacto: ''
};

export default function ModalCambiarProveedor({ open, onClose, producto, onGuardar }) {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [openDialogNuevo, setOpenDialogNuevo] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState(nuevoProveedorVacio);

  useEffect(() => {
    if (open) cargarProveedores();
  }, [open]);

  useEffect(() => {
    if (open && proveedores.length > 0 && producto) {
      const existing = proveedores.find((p) => p.id === producto.proveedor_id);
      setProveedorSeleccionado(existing || null);
    }
  }, [open, proveedores, producto]);

  const cargarProveedores = async () => {
    try {
      const response = await API.get('api/proveedores');
      setProveedores(response.data.data || []);
    } catch (e) {
      console.error('Error al cargar proveedores', e);
    }
  };

  const handleChange = (_, value) => {
    if (value && value.id === '__nuevo__') {
      setOpenDialogNuevo(true);
      return;
    }
    setProveedorSeleccionado(value);
  };

  const handleGuardar = () => {
    if (!proveedorSeleccionado) {
      alertify.error('Seleccione un proveedor', 2);
      return;
    }
    onGuardar(producto.id, proveedorSeleccionado);
    onClose();
  };

  const handleNuevoChange = (campo) => (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [campo]: e.target.value });
  };

  const guardarNuevoProveedor = async () => {
    if (!nuevoProveedor.codigo.trim()) {
      alertify.error('El código del proveedor es requerido', 2);
      return;
    }
    if (!nuevoProveedor.nombre.trim()) {
      alertify.error('El nombre del proveedor es requerido', 2);
      return;
    }
    try {
      const response = await API.post('api/proveedores', nuevoProveedor);
      if (response.data.codigo === 200) {
        const creado = response.data.data;
        setProveedores((prev) => [...prev, creado]);
        setProveedorSeleccionado(creado);
        setOpenDialogNuevo(false);
        setNuevoProveedor(nuevoProveedorVacio);
        alertify.success('Proveedor creado correctamente', 2);
      } else {
        alertify.error(response.data.Message || 'Error al crear proveedor', 2);
      }
    } catch (e) {
      alertify.error('Error al crear proveedor', 2);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cambiar Proveedor
          {producto && (
            <Typography variant="body2" color="textSecondary">
              {producto.nombre}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box mt={1} mb={2}>
            <Autocomplete
              options={[...proveedores, AGREGAR_NUEVO]}
              getOptionLabel={(option) =>
                option.id === '__nuevo__'
                  ? '+ Agregar nuevo proveedor'
                  : `${option.codigo} - ${option.nombre}`
              }
              value={proveedorSeleccionado}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proveedor"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
              renderOption={(option) =>
                option.id === '__nuevo__' ? (
                  <Typography style={{ color: '#1976d2', fontWeight: 500 }}>
                    + Agregar nuevo proveedor
                  </Typography>
                ) : (
                  `${option.codigo} - ${option.nombre}`
                )
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button color="primary" variant="contained" onClick={handleGuardar}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog anidado para crear nuevo proveedor */}
      <Dialog
        open={openDialogNuevo}
        onClose={() => setOpenDialogNuevo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nuevo Proveedor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código *"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.codigo}
                onChange={handleNuevoChange('codigo')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre *"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.nombre}
                onChange={handleNuevoChange('nombre')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.telefono}
                onChange={handleNuevoChange('telefono')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.email}
                onChange={handleNuevoChange('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.direccion}
                onChange={handleNuevoChange('direccion')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="RUC / Cédula"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.ruc_cedula}
                onChange={handleNuevoChange('ruc_cedula')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contacto"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.contacto}
                onChange={handleNuevoChange('contacto')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogNuevo(false)}>Cancelar</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={guardarNuevoProveedor}
          >
            Guardar Proveedor
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
