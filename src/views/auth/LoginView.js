import React, { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
  Paper,
  Hidden,
  Avatar
} from '@material-ui/core';
import alertify from 'alertifyjs';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Page from '../../components/Page';
import { LoginContext } from '../../context/LoginContext';
import LogoIngreso from '../../assets/LogoIngreso.PNG';
import FondoLogin from '../../assets/fondoLogin.png';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6f8',
  },
  imageSection: {
    backgroundImage: `url(${FondoLogin})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay for better text readability
      backdropFilter: 'blur(3px)',
    }
  },
  contentSection: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 1,
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 450,
    borderRadius: theme.spacing(2),
    backgroundColor: 'transparent', // Integrated into contentSection
    boxShadow: 'none',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: 50,
    borderRadius: 25,
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'none',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
    }
  },
  welcomeText: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  subText: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
  },
  brandContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
    color: 'white',
    textAlign: 'center',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  brandLogo: {
    width: '150px',
    marginBottom: theme.spacing(2),
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
  },
  brandTitle: {
    fontWeight: 800,
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  brandSubtitle: {
    fontSize: '1.2rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, setCredenciales, setUserloggin, setPestaniaActiva, cargarPermisos } = useContext(LoginContext);

  const clearSession = useCallback(() => {
    localStorage.clear();
  }, []);

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

      // Cargar permisos del usuario
      await cargarPermisos();

      if (response.tipo === 'SUPER USUARIO' || response.tipo === 'ADMINISTRADOR') {
        setPestaniaActiva('Dashboard');
      } else {
        setPestaniaActiva('');
      }

      navigate(response.tipo === 'SUPER USUARIO' || response.tipo === 'ADMINISTRADOR' ? '/app/dashboard' : '/app', {
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

  const validationSchema = Yup.object({
    email: Yup.string().required('El usuario es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
  });

  return (
    <Page className={classes.root} title="Login">
      <Grid container component="main" style={{ height: '100vh' }}>
        <Hidden smDown>
          <Grid item xs={false} sm={4} md={7} className={classes.imageSection}>
            <Box className={classes.brandContainer}>
              {/* <img src={LogoIngreso} alt="Logo" className={classes.brandLogo} /> */}
              <Typography variant="h1" className={classes.brandTitle}>
                Bienvenido
              </Typography>
              <Typography variant="h5" className={classes.brandSubtitle}>
                Sistema de Facturación Compustar.
              </Typography>
            </Box>
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.contentSection}>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h4" className={classes.welcomeText}>
              Iniciar Sesión
            </Typography>
            <Typography variant="body1" className={classes.subText}>
              Ingresa tus credenciales para continuar
            </Typography>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
                <Form className={classes.form}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Usuario"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      style: { borderRadius: 10 }
                    }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      style: { borderRadius: 10 }
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                  </Button>
                  <Box mt={3}>
                    <Typography variant="body2" color="textSecondary" align="center">
                      {'Copyright © '}
                      Compustar {new Date().getFullYear()}
                      {'.'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center">
                      {'V 3.1.0'}

                    </Typography>
                  </Box>
                </Form>
              )}
            </Formik>
          </div>
        </Grid>
      </Grid>
    </Page>
  );
};

export default LoginView;
