import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid
} from '@material-ui/core';
import { ContabilidadContext } from '../../context/ContabilidadContext';

const initialForm = {
  codigo: '',
  nombre: '',
  tipo: 'activo',
  naturaleza: 'deudora',
  parent_id: '',
  nivel: 1,
  es_detalle: false
};

const ModalCuenta = ({ open, onClose, cuenta }) => {
  const { crearCuenta, editarCuenta, cuentasArbol } = useContext(ContabilidadContext);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (cuenta) {
      setForm({
        codigo: cuenta.codigo || '',
        nombre: cuenta.nombre || '',
        tipo: cuenta.tipo || 'activo',
        naturaleza: cuenta.naturaleza || 'deudora',
        parent_id: cuenta.parent_id || '',
        nivel: cuenta.nivel || 1,
        es_detalle: cuenta.es_detalle || false
      });
    } else {
      setForm(initialForm);
    }
  }, [cuenta, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setForm((prev) => ({ ...prev, es_detalle: e.target.checked }));
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      nivel: Number(form.nivel),
      parent_id: form.parent_id || null,
      es_detalle: form.es_detalle
    };

    let ok;
    if (cuenta) {
      ok = await editarCuenta(cuenta.id, data);
    } else {
      ok = await crearCuenta(data);
    }
    if (ok) onClose();
  };

  // Flatten tree for parent select
  const flattenCuentas = (nodos, list = []) => {
    if (!nodos) return list;
    nodos.forEach((c) => {
      if (!c.es_detalle) {
        list.push(c);
      }
      if (c.children_recursive) {
        flattenCuentas(c.children_recursive, list);
      }
    });
    return list;
  };

  const cuentasPadre = flattenCuentas(cuentasArbol);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{cuenta ? 'Editar Cuenta Contable' : 'Nueva Cuenta Contable'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Código"
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Tipo</InputLabel>
              <Select name="tipo" value={form.tipo} onChange={handleChange}>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="pasivo">Pasivo</MenuItem>
                <MenuItem value="patrimonio">Patrimonio</MenuItem>
                <MenuItem value="ingreso">Ingreso</MenuItem>
                <MenuItem value="gasto">Gasto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Naturaleza</InputLabel>
              <Select name="naturaleza" value={form.naturaleza} onChange={handleChange}>
                <MenuItem value="deudora">Deudora</MenuItem>
                <MenuItem value="acreedora">Acreedora</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Cuenta Padre</InputLabel>
              <Select
                name="parent_id"
                value={form.parent_id}
                onChange={handleChange}
              >
                <MenuItem value="">Ninguna (raíz)</MenuItem>
                {cuentasPadre.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.codigo} - {c.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Nivel"
              name="nivel"
              type="number"
              value={form.nivel}
              onChange={handleChange}
              fullWidth
              margin="dense"
              inputProps={{ min: 1, max: 5 }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.es_detalle}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="Detalle"
              style={{ marginTop: 16 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!form.codigo || !form.nombre}
        >
          {cuenta ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCuenta;
