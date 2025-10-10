import React, { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import alertify from 'alertifyjs';

import Page from '../../components/Page';
import { LoginContext } from '../../context/LoginContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, setCredenciales, setUserloggin } = useContext(LoginContext);

  /** Limpia cualquier sesión activa previa */
  const clearSession = useCallback(() => {
    localStorage.clear();
  }, []);

  /** Maneja el inicio de sesión */
  const handleLogin = async (values) => {
    try {
      const { email, password } = values;
      const response = await login({ user: email, pass: password });

      if (response.login !== 1) {
        alertify.error(response.mensaje || 'Credenciales inválidas', 5);
        return;
      }

      const userData = {
        avatar: '/static/images/avatars/avatar_6.png',
        jobTitle: response.tipo,
        name: response.nombres,
      };

      setUserloggin(userData);
      setCredenciales(response);

      // Guarda la sesión en localStorage
      const sessionKeys = {
        login: 1,
        user_id: response.user_id,
        nombres: response.nombres,
        tipo_usuario: response.tipo,
        tipousuario_id: response.tipousuario_id,
        hora_inicio: response.hora_inicio,
        hora_fin: response.hora_fin,
      };

      Object.entries(sessionKeys).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Redirección según tipo de usuario
      navigate(response.tipo === 'ADMINISTRADOR' ? '/app/dashboard' : '/app', {
        replace: true,
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alertify.error('Ocurrió un error inesperado al iniciar sesión', 5);
    }
  };

  useEffect(() => {
    clearSession();
  }, [clearSession]);

  /** Validación con Yup */
  const validationSchema = Yup.object({
    email: Yup.string().required('El usuario es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
  });

  return (
    <Page className={classes.root} title="Login">
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
        <Container maxWidth="sm">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
              <Form>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Iniciar Sesión
                  </Typography>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Identifíquese para continuar
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Usuario"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                  variant="outlined"
                />

                <Box my={2}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Iniciar sesión
                  </Button>

                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body2"
                    style={{ marginTop: '10px' }}
                  >
                    Grupocompustar V 2.0.0
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
