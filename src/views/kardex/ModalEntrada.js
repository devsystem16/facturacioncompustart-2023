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

const ModalEntrada = () => {
  const { modalEntrada, setModalEntrada, bodegas, registrarEntrada } =
    useContext(KardexContext);
  const [form, setForm] = useState({
    producto_id: '',
    cantidad: '',
    tipo: 'Compras',
    detalle: '',
    referencia: '',
    bodega_id: ''
  });
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    if (modalEntrada) {
      cargarProductosInicial();
      setForm({
        producto_id: '',
        cantidad: '',
        tipo: 'Compras',
        detalle: '',
        referencia: '',
        bodega_id: ''
      });
      setProductoSeleccionado(null);
    }
  }, [modalEntrada]);

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
    const ok = await registrarEntrada(data);
    if (ok) {
      setForm({
        producto_id: '',
        cantidad: '',
        tipo: 'Compras',
        detalle: '',
        referencia: '',
        bodega_id: ''
      });
      setProductoSeleccionado(null);
    }
  };

  const handleClose = () => {
    setModalEntrada(false);
  };

  return (
    <Dialog open={modalEntrada} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Entrada</DialogTitle>
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
          <Grid item xs={6}>
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
              label="Tipo"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="Compras">Compras</MenuItem>
              <MenuItem value="Fabricacion">Fabricacion</MenuItem>
              <MenuItem value="Devolucion">Devolucion</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Bodega"
              name="bodega_id"
              value={form.bodega_id}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Principal</MenuItem>
              {bodegas.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Referencia (Nro. documento)"
              name="referencia"
              value={form.referencia}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
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
          disabled={!form.producto_id || !form.cantidad}
        >
          Registrar Entrada
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEntrada;
