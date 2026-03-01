import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  makeStyles
} from '@material-ui/core';
import alertify from 'alertifyjs';
import moment from 'moment';
import NumberFormatCustom from '../../components/ValidationCurrency/ValidationCurrency';
import { GastosContext } from '../../context/GastosContext';
import { LoginContext } from '../../context/LoginContext';

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

const FormularioGasto = ({ gastoEditar, setGastoEditar }) => {
  const classes = useStyles();
  const { categorias, crearGasto, actualizarGasto, setRecargarGastos } =
    useContext(GastosContext);
  const { tienePermiso } = useContext(LoginContext);
  const puedeCrear = tienePermiso('gastos.crear');
  const puedeEditar = tienePermiso('gastos.editar');

  const [form, setForm] = useState({
    categoria_gasto_id: '',
    concepto: '',
    monto: '',
    fecha: moment().format('YYYY-MM-DD'),
    observacion: ''
  });

  useEffect(() => {
    if (gastoEditar) {
      setForm({
        categoria_gasto_id: gastoEditar.categoria_gasto_id || '',
        concepto: gastoEditar.concepto || '',
        monto: gastoEditar.monto || '',
        fecha: gastoEditar.fecha
          ? moment(gastoEditar.fecha).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        observacion: gastoEditar.observacion || ''
      });
    }
  }, [gastoEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({
      categoria_gasto_id: '',
      concepto: '',
      monto: '',
      fecha: moment().format('YYYY-MM-DD'),
      observacion: ''
    });
    setGastoEditar(null);
  };

  const guardar = async () => {
    if (!form.categoria_gasto_id)
      return alertify.error('Seleccione una categoría', 2);
    if (!form.concepto) return alertify.error('El concepto es obligatorio', 2);
    if (!form.monto || parseFloat(form.monto) <= 0)
      return alertify.error('El monto debe ser mayor a 0', 2);

    const data = {
      ...form,
      monto: parseFloat(form.monto),
      usuario_id: localStorage.getItem('user_id')
    };

    try {
      if (gastoEditar) {
        const resp = await actualizarGasto(gastoEditar.id, data);
        if (resp.codigo === 200) {
          alertify.success('Gasto actualizado', 2);
        } else {
          alertify.error(resp.Message || 'Error al actualizar', 2);
        }
      } else {
        const resp = await crearGasto(data);
        if (resp.codigo === 200) {
          alertify.success('Gasto registrado', 2);
        } else {
          alertify.error(resp.Message || 'Error al registrar', 2);
        }
      }
      limpiarFormulario();
      setRecargarGastos(true);
    } catch (error) {
      alertify.error('Error al guardar gasto', 2);
      console.error(error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {gastoEditar ? 'Editar Gasto' : 'Nuevo Gasto'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              select
              variant="outlined"
              label="Categoría"
              name="categoria_gasto_id"
              value={form.categoria_gasto_id}
              onChange={handleChange}
              className={classes.input}
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Concepto"
              name="concepto"
              value={form.concepto}
              onChange={handleChange}
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Monto"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              className={classes.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                inputComponent: NumberFormatCustom
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Fecha"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              className={classes.input}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Observación"
              name="observacion"
              value={form.observacion}
              onChange={handleChange}
              className={classes.input}
            />
          </Grid>
        </Grid>
        <div className={classes.buttonGroup}>
          {gastoEditar && (
            <Button
              variant="contained"
              style={{ backgroundColor: 'rgb(220, 0, 78)', color: 'white' }}
              onClick={limpiarFormulario}
            >
              Cancelar
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={guardar}
            disabled={gastoEditar ? !puedeEditar : !puedeCrear}
          >
            {gastoEditar ? 'Actualizar' : 'Registrar Gasto'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormularioGasto;
