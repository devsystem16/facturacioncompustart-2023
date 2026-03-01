import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
  Box,
  colors,
  makeStyles
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LockIcon from '@material-ui/icons/Lock';
import alertify from 'alertifyjs';
import Swal from 'sweetalert2';
import { UsuariosContext } from '../../context/UsuariosContext';

const useStyles = makeStyles((theme) => ({
  infoBox: {
    padding: theme.spacing(2),
    backgroundColor: '#e8eaf6',
    borderRadius: 8,
    marginBottom: theme.spacing(2),
    border: '1px solid #c5cae9'
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1)
  }
}));

const CambiarPassword = () => {
  const classes = useStyles();
  const { usuarios, cambiarPassword } = useContext(UsuariosContext);

  const [usuarioId, setUsuarioId] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirmar, setPassConfirmar] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const miTipo = (localStorage.getItem('tipo_usuario') || '').toUpperCase();

  // Filtrar usuarios según jerarquía de permisos
  const usuariosPermitidos = usuarios.filter((u) => {
    const tipoUsuario = (u.tipo || '').toUpperCase();
    if (miTipo === 'SUPER USUARIO') return true;
    if (miTipo === 'ADMINISTRADOR') return tipoUsuario !== 'SUPER USUARIO';
    return false;
  });

  const limpiar = () => {
    setUsuarioId('');
    setPassNueva('');
    setPassConfirmar('');
    setShowPassword(false);
  };

  const handleCambiar = async () => {
    if (!usuarioId) return alertify.error('Seleccione un usuario', 2);
    if (!passNueva.trim())
      return alertify.error('Ingrese la nueva contraseña', 2);
    if (passNueva !== passConfirmar)
      return alertify.error('Las contraseñas no coinciden', 2);

    const usuarioSeleccionado = usuarios.find((u) => u.id === usuarioId);

    Swal.fire({
      title: 'Resetear contraseña',
      text: `¿Está seguro de cambiar la contraseña de "${usuarioSeleccionado?.nombres}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const resp = await cambiarPassword(usuarioId, {
            pass_nueva: passNueva
          });
          if (resp.codigo === 200) {
            alertify.success('Contraseña actualizada correctamente', 2);
            limpiar();
          } else {
            alertify.error(resp.Message || 'Error al cambiar contraseña', 2);
          }
        } catch (error) {
          alertify.error('Error al cambiar contraseña', 2);
          console.error(error);
        }
      }
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          <LockIcon
            style={{
              verticalAlign: 'middle',
              marginRight: 8,
              color: '#3f51b5'
            }}
          />
          Reset de Contraseña
        </Typography>

        <Box className={classes.infoBox}>
          <Typography variant="body2" style={{ color: colors.grey[700] }}>
            {miTipo === 'SUPER USUARIO'
              ? 'Como Super Usuario puede resetear la contraseña de cualquier usuario del sistema.'
              : 'Puede resetear la contraseña de usuarios según su nivel de acceso. No es posible modificar la contraseña de un Super Usuario.'}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              select
              label="Seleccionar usuario"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
            >
              {usuariosPermitidos.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.nombres} ({u.usuario})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              value={passNueva}
              onChange={(e) => setPassNueva(e.target.value)}
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
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Confirmar contraseña"
              type={showPassword ? 'text' : 'password'}
              value={passConfirmar}
              onChange={(e) => setPassConfirmar(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <div className={classes.buttonGroup}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCambiar}
                size="small"
                disabled={!usuarioId || !passNueva}
              >
                Cambiar
              </Button>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CambiarPassword;
