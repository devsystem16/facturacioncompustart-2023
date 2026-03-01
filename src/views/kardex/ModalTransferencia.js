import React, { useContext, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { KardexContext } from '../../context/KardexContext';
import API from '../../Environment/config';

const ModalTransferencia = () => {
  const {
    modalTransferencia,
    setModalTransferencia,
    bodegas,
    registrarTransferencia
  } = useContext(KardexContext);
  const [form, setForm] = useState({
    producto_id: '',
    cantidad: '',
    bodega_origen_id: '',
    bodega_destino_id: '',
    detalle: ''
  });
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    if (modalTransferencia) {
      cargarProductosInicial();
      setForm({
        producto_id: '',
        cantidad: '',
        bodega_origen_id: '',
        bodega_destino_id: '',
        detalle: ''
      });
      setProductoSeleccionado(null);
    }
  }, [modalTransferencia]);

  const cargarProductosInicial = async () => {
    try {
      const response = await API.get('api/productos/buscarProducto');
      setProductos(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setProductos([]);
    }
  };

  const buscarProductos = async (texto) => {
    try {
      const url = texto
        ? 'api/productos/buscarProducto/' + texto
        : 'api/productos/buscarProducto';
      const response = await API.get(url);
      setProductos(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setProductos([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      usuario: localStorage.getItem('nombres') || 'admin'
    };
    const ok = await registrarTransferencia(data);
    if (ok) {
      setForm({
        producto_id: '',
        cantidad: '',
        bodega_origen_id: '',
        bodega_destino_id: '',
        detalle: ''
      });
      setProductoSeleccionado(null);
    }
  };

  const handleClose = () => {
    setModalTransferencia(false);
  };

  return (
    <Dialog
      open={modalTransferencia}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Transferencia entre Bodegas</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={productos}
              getOptionLabel={(op) =>
                op.nombre ? `${op.codigo || ''} - ${op.nombre}` : ''
              }
              value={productoSeleccionado}
              onChange={(e, val) => {
                setProductoSeleccionado(val);
                setForm((prev) => ({ ...prev, producto_id: val ? val.codigo : '' }));
              }}
              onInputChange={(e, val, reason) => {
                if (reason === 'input') buscarProductos(val);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producto"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cantidad"
              name="cantidad"
              type="number"
              value={form.cantidad}
              onChange={handleChange}
              variant="outlined"
              size="small"
              inputProps={{ min: 0.01, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Bodega Origen"
              name="bodega_origen_id"
              value={form.bodega_origen_id}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              {bodegas.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Bodega Destino"
              name="bodega_destino_id"
              value={form.bodega_destino_id}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              {bodegas
                .filter((b) => b.id !== parseInt(form.bodega_origen_id))
                .map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.nombre}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Detalle"
              name="detalle"
              value={form.detalle}
              onChange={handleChange}
              variant="outlined"
              size="small"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={
            !form.producto_id ||
            !form.cantidad ||
            !form.bodega_origen_id ||
            !form.bodega_destino_id
          }
        >
          Registrar Transferencia
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalTransferencia;
