import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
// import FacebookIcon from 'src/icons/Facebook';
// import GoogleIcon from 'src/icons/Google';

import Page from '../../components/Page';

import { LoginContext } from '../../context/LoginContext';
import alertify from 'alertifyjs';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { credenciales, setCredenciales, login, setUserloggin } =
    useContext(LoginContext);

  const fn_login = async (datos, password) => {
    const usuario = {
      user: datos.email,
      pass: datos.password
    };
    const response = await login(usuario);

    if (response.login !== 1) {
      alertify.error(response.mensaje, 5);
      return;
    }

    setUserloggin({
      avatar: '/static/images/avatars/avatar_6.png',
      jobTitle: response.tipo,
      name: response.nombres
    });

    localStorage.setItem('login', 1);
    localStorage.setItem('user_id', response.user_id);
    localStorage.setItem('nombres', response.nombres);
    localStorage.setItem('tipo_usuario', response.tipo);
    localStorage.setItem('tipousuario_id', response.tipousuario_id);
    localStorage.setItem('hora_inicio', response.hora_inicio);
    localStorage.setItem('hora_fin', response.hora_fin);
    setCredenciales(response);

    if (response.tipo === 'ADMINISTRADOR') {
      navigate('/app/dashboard', { replace: true });
    } else {
      navigate('/app', { replace: true });
    }
  };

  const logut = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('user_id');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('nombres');
    localStorage.removeItem('tipousuario_id');
    localStorage.removeItem('hora_inicio');
    localStorage.removeItem('hora_fin');
  };

  useEffect(() => {
    logut();
  }, []);

  return (
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            // validationSchema={Yup.object().shape({
            //   email: Yup.string()
            //     .email('Must be a valid email')
            //     .max(255)
            //     .required('Email is required'),
            //   password: Yup.string().max(255).required('Password is required')
            // })}
            onSubmit={(email, password) => {
              fn_login(email, password);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Iniciar Sesión
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Indentifique
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Usuario"
                  margin="normal"
                  name="email"
                  // onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Iniciar sesión
                  </Button>
                  <center>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Grupocompustar V 1.0.0.1
                    </Typography>
                  </center>
                </Box>
                {/* <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography> */}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
