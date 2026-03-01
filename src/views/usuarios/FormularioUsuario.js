import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
  makeStyles,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import alertify from 'alertifyjs';
import { UsuariosContext } from '../../context/UsuariosContext';
import { LoginContext } from '../../context/LoginContext';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(1)
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1)
  }
}));

const FormularioUsuario = ({ usuarioEditar, setUsuarioEditar }) => {
  const classes = useStyles();
  const { crearUsuario, actualizarUsuario, setRecargarUsuarios, tiposUsuario } =
    useContext(UsuariosContext);
  const { tienePermiso } = useContext(LoginContext);
  const puedeCrear = tienePermiso('usuarios.crear');
  const puedeEditar = tienePermiso('usuarios.editar');

  const [form, setForm] = useState({
    nombres: '',
    usuario: '',
    pass: '',
    tipo_usuarios_id: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (usuarioEditar) {
      setForm({
        nombres: usuarioEditar.nombres || '',
        usuario: usuarioEditar.usuario || '',
        pass: '',
        tipo_usuarios_id: usuarioEditar.tipo_usuarios_id || ''
      });
    }
  }, [usuarioEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({ nombres: '', usuario: '', pass: '', tipo_usuarios_id: '' });
    setUsuarioEditar(null);
    setShowPassword(false);
  };

  const guardar = async () => {
    if (!form.nombres.trim()) return alertify.error('El nombre es obligatorio', 2);
    if (!form.usuario.trim()) return alertify.error('El usuario es obligatorio', 2);
    if (!form.tipo_usuarios_id) return alertify.error('Seleccione un tipo de usuario', 2);

    try {
      if (usuarioEditar) {
        const body = {
          nombres: form.nombres,
          usuario: form.usuario,
          tipo_usuarios_id: form.tipo_usuarios_id
        };
        if (form.pass.trim()) {
          body.pass = form.pass;
        }
        const resp = await actualizarUsuario(usuarioEditar.id, body);
        if (resp.codigo === 200) {
          alertify.success('Usuario actualizado', 2);
        } else {
          alertify.error(resp.Message || 'Error al actualizar', 2);
          return;
        }
      } else {
        if (!form.pass.trim())
          return alertify.error('La contraseña es obligatoria', 2);
        const resp = await crearUsuario(form);
        if (resp.codigo === 200) {
          alertify.success('Usuario creado', 2);
        } else {
          alertify.error(resp.Message || 'Error al crear', 2);
          return;
        }
      }
      limpiarFormulario();
      setRecargarUsuarios(true);
    } catch (error) {
      alertify.error('Error al guardar usuario', 2);
      console.error(error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Nombre completo"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Usuario (login)"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label={usuarioEditar ? 'Nueva contraseña' : 'Contraseña'}
              name="pass"
              type={showPassword ? 'text' : 'password'}
              value={form.pass}
              onChange={handleChange}
              className={classes.input}
              helperText={usuarioEditar ? 'Dejar vacío para no cambiar' : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              select
              label="Tipo de usuario"
              name="tipo_usuarios_id"
              value={form.tipo_usuarios_id}
              onChange={handleChange}
              className={classes.input}
            >
              {tiposUsuario.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.tipo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <div className={classes.buttonGroup}>
              {usuarioEditar && (
                <Button
                  variant="contained"
                  style={{ backgroundColor: 'rgb(220, 0, 78)', color: 'white' }}
                  onClick={limpiarFormulario}
                  size="small"
                >
                  Cancelar
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={guardar}
                size="small"
                disabled={usuarioEditar ? !puedeEditar : !puedeCrear}
              >
                {usuarioEditar ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FormularioUsuario;
