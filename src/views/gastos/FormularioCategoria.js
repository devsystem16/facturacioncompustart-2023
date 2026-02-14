import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import alertify from 'alertifyjs';
import { GastosContext } from '../../context/GastosContext';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(2)
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1)
  }
}));

const FormularioCategoria = ({ categoriaEditar, setCategoriaEditar }) => {
  const classes = useStyles();
  const { crearCategoria, actualizarCategoria, setRecargarCategorias } =
    useContext(GastosContext);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    color: '#3f51b5'
  });

  useEffect(() => {
    if (categoriaEditar) {
      setForm({
        nombre: categoriaEditar.nombre || '',
        descripcion: categoriaEditar.descripcion || '',
        color: categoriaEditar.color || '#3f51b5'
      });
    }
  }, [categoriaEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({ nombre: '', descripcion: '', color: '#3f51b5' });
    setCategoriaEditar(null);
  };

  const guardar = async () => {
    if (!form.nombre) return alertify.error('El nombre es obligatorio', 2);

    try {
      if (categoriaEditar) {
        const resp = await actualizarCategoria(categoriaEditar.id, form);
        if (resp.codigo === 200) {
          alertify.success('Categoría actualizada', 2);
        } else {
          alertify.error(resp.Message || 'Error al actualizar', 2);
        }
      } else {
        const resp = await crearCategoria(form);
        if (resp.codigo === 200) {
          alertify.success('Categoría creada', 2);
        } else {
          alertify.error(resp.Message || 'Error al crear', 2);
        }
      }
      limpiarFormulario();
      setRecargarCategorias(true);
    } catch (error) {
      alertify.error('Error al guardar categoría', 2);
      console.error(error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Color"
              name="color"
              type="color"
              value={form.color}
              onChange={handleChange}
              className={classes.input}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <div className={classes.buttonGroup}>
              {categoriaEditar && (
                <Button
                  variant="contained"
                  style={{ backgroundColor: 'rgb(220, 0, 78)', color: 'white' }}
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </Button>
              )}
              <Button variant="contained" color="primary" onClick={guardar}>
                {categoriaEditar ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FormularioCategoria;
