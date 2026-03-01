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

const ModalAjuste = () => {
  const { modalAjuste, setModalAjuste, bodegas, registrarAjuste } =
    useContext(KardexContext);
  const [form, setForm] = useState({
    producto_id: '',
    cantidad: '',
    tipo_ajuste: 'positivo',
    detalle: '',
    bodega_id: ''
  });
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    if (modalAjuste) {
      cargarProductosInicial();
      setForm({
        producto_id: '',
        cantidad: '',
        tipo_ajuste: 'positivo',
        detalle: '',
        bodega_id: ''
      });
      setProductoSeleccionado(null);
    }
  }, [modalAjuste]);

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
    const ok = await registrarAjuste(data);
    if (ok) {
      setForm({
        producto_id: '',
        cantidad: '',
        tipo_ajuste: 'positivo',
        detalle: '',
        bodega_id: ''
      });
      setProductoSeleccionado(null);
    }
  };

  const handleClose = () => {
    setModalAjuste(false);
  };

  return (
    <Dialog open={modalAjuste} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ajuste de Inventario</DialogTitle>
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
              label="Tipo Ajuste"
              name="tipo_ajuste"
              value={form.tipo_ajuste}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="positivo">Positivo (+)</MenuItem>
              <MenuItem value="negativo">Negativo (-)</MenuItem>
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
              label="Detalle / Motivo"
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
          Registrar Ajuste
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAjuste;
