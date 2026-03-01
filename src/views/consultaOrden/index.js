import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import API from '../../Environment/config';
import alertify from 'alertifyjs';
import Logo from '../../assets/LogoIngreso.PNG';

const estadoColores = {
  pendiente: { color: '#E65100', bg: '#FFF3E0' },
  en_proceso: { color: '#1565C0', bg: '#E3F2FD' },
  completado: { color: '#2E7D32', bg: '#E8F5E9' },
  entregado: { color: '#7B1FA2', bg: '#F3E5F5' }
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const useStyles = makeStyles((theme) => ({
  pageRoot: {
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  logo: {
    maxWidth: 180,
    marginBottom: theme.spacing(2)
  },
  formCard: {
    maxWidth: 500,
    width: '100%',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  resultContainer: {
    maxWidth: 800,
    width: '100%',
    marginTop: theme.spacing(3)
  },
  sectionCard: {
    borderRadius: 10,
    marginBottom: theme.spacing(2),
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing(1)
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 4
  },
  fieldLabel: {
    fontSize: 12,
    color: '#9e9e9e',
    fontWeight: 500
  },
  fieldValue: {
    fontSize: 14,
    color: '#424242',
    fontWeight: 500
  }
}));

const ConsultaOrden = () => {
  const classes = useStyles();

  const [cedula, setCedula] = useState('');
  const [ordenId, setOrdenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orden, setOrden] = useState(null);
  const [error, setError] = useState(null);

  // Errores de validacion local
  const [errCedula, setErrCedula] = useState('');
  const [errOrdenId, setErrOrdenId] = useState('');

  const validar = () => {
    let ok = true;
    setErrCedula('');
    setErrOrdenId('');

    const cedulaLimpia = cedula.trim();
    if (!cedulaLimpia) {
      setErrCedula('Ingrese su cedula');
      ok = false;
    } else if (!/^\d+$/.test(cedulaLimpia)) {
      setErrCedula('Solo numeros');
      ok = false;
    } else if (cedulaLimpia.length < 10 || cedulaLimpia.length > 13) {
      setErrCedula('Entre 10 y 13 digitos');
      ok = false;
    }

    if (!ordenId.trim()) {
      setErrOrdenId('Ingrese el numero de orden');
      ok = false;
    } else if (parseInt(ordenId) < 1) {
      setErrOrdenId('Numero de orden invalido');
      ok = false;
    }

    return ok;
  };

  const consultarOrden = async () => {
    if (!validar()) return;

    try {
      setLoading(true);
      setOrden(null);
      setError(null);
      const response = await API.post('api/public/consulta-orden', {
        cedula: cedula.trim(),
        orden_id: parseInt(ordenId)
      });
      if (response.data.codigo === 200) {
        setOrden(response.data.orden);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No se encontro ninguna orden con los datos proporcionados.');
      } else if (err.response?.status === 429) {
        setError('Demasiadas consultas. Intente nuevamente en unos minutos.');
      } else if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        if (errors?.cedula) setErrCedula(errors.cedula[0]);
        if (errors?.orden_id) setErrOrdenId(errors.orden_id[0]);
      } else {
        setError('Error de conexion. Intente mas tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const nuevaConsulta = () => {
    setOrden(null);
    setError(null);
    setCedula('');
    setOrdenId('');
    setErrCedula('');
    setErrOrdenId('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') consultarOrden();
  };

  return (
    <Box className={classes.pageRoot}>
      <Container maxWidth="md" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo y titulo */}
        <img src={Logo} alt="Logo" className={classes.logo} />
        <Typography variant="h5" style={{ fontWeight: 700, color: '#333', marginBottom: 4, textAlign: 'center' }}>
          Consulta tu Orden de Reparación
        </Typography>
        <Typography variant="body2" style={{ color: '#757575', marginBottom: 24, textAlign: 'center' }}>
          Ingresa tu cédula y número de orden para ver el estado
        </Typography>

        {/* Formulario */}
        <Card className={classes.formCard}>
          <CardContent style={{ padding: '24px 28px' }}>
            <TextField
              fullWidth
              label="Cédula"
              variant="outlined"
              value={cedula}
              onChange={(e) => {
                setCedula(e.target.value);
                setErrCedula('');
              }}
              onKeyDown={handleKeyDown}
              error={!!errCedula}
              helperText={errCedula || 'Cédula o RUC del cliente'}
              style={{ marginBottom: 16 }}
              inputProps={{ maxLength: 13 }}
            />
            <TextField
              fullWidth
              label="N° de Orden"
              variant="outlined"
              type="number"
              value={ordenId}
              onChange={(e) => {
                setOrdenId(e.target.value);
                setErrOrdenId('');
              }}
              onKeyDown={handleKeyDown}
              error={!!errOrdenId}
              helperText={errOrdenId || 'Número que aparece en su comprobante'}
              style={{ marginBottom: 20 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={consultarOrden}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              style={{ borderRadius: 8, textTransform: 'none', fontSize: 16, padding: '10px 0' }}
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </Button>

            {/* Error general */}
            {error && (
              <Box mt={2} p={2} style={{ backgroundColor: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
                <Typography variant="body2" style={{ color: '#dc2626', fontWeight: 500 }}>
                  {error}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Resultado */}
        {orden && (
          <Box className={classes.resultContainer}>
            {/* Header con estado */}
            <Card className={classes.sectionCard}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                  <Box>
                    <Typography variant="h6" style={{ fontWeight: 700 }}>
                      Orden #{orden.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fecha de ingreso: {formatearFecha(orden.fecha_ingreso)}
                    </Typography>
                  </Box>
                  <Chip
                    label={orden.estado_label}
                    style={{
                      backgroundColor: estadoColores[orden.estado]?.bg || '#f5f5f5',
                      color: estadoColores[orden.estado]?.color || '#616161',
                      fontWeight: 600,
                      fontSize: 13
                    }}
                  />
                </Box>
                {orden.ultima_actualizacion && (
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 4, display: 'block' }}>
                    Ultima actualizacion: {formatearFecha(orden.ultima_actualizacion)}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Informacion del equipo */}
            <Card className={classes.sectionCard}>
              <CardContent>
                <Typography className={classes.sectionTitle}>Equipo</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.fieldLabel}>Tipo</Typography>
                    <Typography className={classes.fieldValue}>{orden.equipo?.tipo || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.fieldLabel}>Marca</Typography>
                    <Typography className={classes.fieldValue}>{orden.equipo?.marca || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.fieldLabel}>Modelo</Typography>
                    <Typography className={classes.fieldValue}>{orden.equipo?.modelo || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.fieldLabel}>Serie</Typography>
                    <Typography className={classes.fieldValue}>{orden.equipo?.serie || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Detalle de reparacion */}
            <Card className={classes.sectionCard}>
              <CardContent>
                <Typography className={classes.sectionTitle}>Detalle de Reparacion</Typography>
                <Box mb={1.5}>
                  <Typography className={classes.fieldLabel}>Falla reportada</Typography>
                  <Typography className={classes.fieldValue}>
                    {orden.falla || 'Sin especificar'}
                  </Typography>
                </Box>
                <Box mb={1.5}>
                  <Typography className={classes.fieldLabel}>Trabajo realizado</Typography>
                  <Typography className={classes.fieldValue}>
                    {orden.trabajo_realizado || 'Pendiente'}
                  </Typography>
                </Box>
                {orden.observacion && (
                  <Box mb={1.5}>
                    <Typography className={classes.fieldLabel}>Observacion</Typography>
                    <Typography className={classes.fieldValue}>{orden.observacion}</Typography>
                  </Box>
                )}
                {orden.ultimo_tecnico && (
                  <Box>
                    <Typography className={classes.fieldLabel}>Atendido por</Typography>
                    <Typography className={classes.fieldValue}>{orden.ultimo_tecnico}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Resumen financiero */}
            <Card className={classes.sectionCard}>
              <CardContent>
                <Typography className={classes.sectionTitle}>Resumen Financiero</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography className={classes.fieldLabel}>Total</Typography>
                    <Typography style={{ fontSize: 18, fontWeight: 700, color: '#424242' }}>
                      ${parseFloat(orden.financiero?.total || 0).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography className={classes.fieldLabel}>Abonado</Typography>
                    <Typography style={{ fontSize: 18, fontWeight: 700, color: '#2e7d32' }}>
                      ${parseFloat(orden.financiero?.abono || 0).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography className={classes.fieldLabel}>Saldo</Typography>
                    {parseFloat(orden.financiero?.saldo || 0) === 0 ? (
                      <Chip
                        label="Pagado"
                        size="small"
                        style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
                      />
                    ) : (
                      <Typography style={{ fontSize: 18, fontWeight: 700, color: '#e65100' }}>
                        ${parseFloat(orden.financiero?.saldo || 0).toFixed(2)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Historial / Timeline */}
            {orden.historial && orden.historial.length > 0 && (
              <Card className={classes.sectionCard}>
                <CardContent>
                  <Typography className={classes.sectionTitle}>Historial</Typography>
                  {orden.historial.map((h, i) => (
                    <Box key={i} display="flex" mb={2}>
                      <Box mr={2} display="flex" flexDirection="column" alignItems="center">
                        <Box
                          className={classes.timelineDot}
                          style={{
                            backgroundColor:
                              i === orden.historial.length - 1 ? '#1565C0' : '#9e9e9e'
                          }}
                        />
                        {i < orden.historial.length - 1 && (
                          <Box className={classes.timelineLine} />
                        )}
                      </Box>
                      <Box flex={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                          <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
                            {h.evento}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatearFecha(h.fecha)}
                          </Typography>
                        </Box>
                        {h.detalle && (
                          <Typography variant="body2" color="textSecondary">
                            {h.detalle}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Boton nueva consulta */}
            <Box display="flex" justifyContent="center" mt={1} mb={4}>
              <Button
                variant="text"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={nuevaConsulta}
                style={{ textTransform: 'none' }}
              >
                Realizar otra consulta
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ConsultaOrden;
