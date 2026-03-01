import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { ClienteContext } from '../../context/ClienteContext';
import { EstadisticasContext } from '../../context/EstadisticasContext';
import API from '../../Environment/config';
import alertify from 'alertifyjs';

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  InputAdornment
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import BadgeIcon from '@material-ui/icons/AccountBox';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import HomeIcon from '@material-ui/icons/Home';
import NotesIcon from '@material-ui/icons/Notes';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1)
  },
  formCard: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  formHeader: {
    background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  formHeaderIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 600
  },
  formHeaderSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12
  },
  formBody: {
    padding: '24px 24px 16px'
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1565C0',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 8
  },
  fieldRow: {
    marginBottom: 16
  },
  buttonGroup: {
    marginTop: 8,
    padding: '0 24px 20px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10
  },
  btnCancel: {
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    padding: '8px 24px'
  },
  btnSave: {
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    padding: '8px 28px',
    boxShadow: '0 2px 8px rgba(21,101,192,0.3)'
  },
  suggestionsCard: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    height: '100%'
  },
  suggestionsHeader: {
    background: '#f5f5f5',
    padding: '14px 20px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  suggestionsHeaderTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#424242'
  },
  suggestionsBody: {
    maxHeight: 380,
    overflowY: 'auto',
    padding: 0
  },
  suggestionItem: {
    '&:hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#9e9e9e'
  },
  emptyIcon: {
    fontSize: 48,
    color: '#e0e0e0',
    marginBottom: 8
  },
  warningBadge: {
    backgroundColor: '#FFF3E0',
    color: '#E65100',
    borderRadius: 12,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 8
  }
}));

const END_POINT = {
  nuevoCliente: 'api/clientes'
};

const NuevoCliente = ({ className, ...rest }) => {
  const classes = useStyles();
  const { setIsNewClient, setClientes, clientes, setClientesFiltro } = useContext(ClienteContext);
  const { setIsReload } = useContext(EstadisticasContext);

  const [form, setForm] = useState({
    cedula: '',
    nombres: '',
    telefono: '',
    direccion: '',
    correo: '',
    observacion: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = () => {
    const termCedula = form.cedula.trim().toLowerCase();
    const termNombre = form.nombres.trim().toLowerCase();

    const matches = clientes.filter(
      (c) =>
        (termCedula && c.cedula.toLowerCase().includes(termCedula)) ||
        (termNombre && c.nombres.toLowerCase().includes(termNombre))
    );

    setSugerencias(matches);
  };

  const guardarCliente = async () => {
    if (!form.cedula) return alertify.error('La cedula es obligatoria', 2);
    if (!form.nombres) return alertify.error('Los nombres son obligatorios', 2);

    const nuevoCliente = {
      ...form,
      telefono: form.telefono || '-',
      direccion: form.direccion || '-',
      correo: form.correo || '-',
      observacion: form.observacion || '-'
    };

    setIsLoading(true);
    try {
      const respuesta = await API.post(END_POINT.nuevoCliente, nuevoCliente);
      setIsLoading(false);

      if (respuesta.data.estado !== 201) {
        alertify.error(respuesta.data.mensaje, 2);
        return;
      }

      setIsReload(true);
      setClientes([respuesta.data.cliente, ...clientes]);
      setClientesFiltro([respuesta.data.cliente, ...clientes]);
      setForm({ cedula: '', nombres: '', telefono: '', direccion: '', correo: '', observacion: '' });
      setIsNewClient(false);
      setSugerencias([]);
      alertify.success('Guardado correctamente', 2);
    } catch (err) {
      setIsLoading(false);
      alertify.error('Error al guardar el cliente', 2);
      console.error(err);
    }
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={3}>
        {/* Formulario */}
        <Grid item xs={12} md={7}>
          <Card className={classes.formCard}>
            {/* Header azul */}
            <Box className={classes.formHeader}>
              <Box className={classes.formHeaderIcon}>
                <PersonIcon style={{ color: '#fff', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography className={classes.formHeaderTitle}>
                  Registrar Nuevo Cliente
                </Typography>
                <Typography className={classes.formHeaderSubtitle}>
                  Completa los datos del cliente
                </Typography>
              </Box>
            </Box>

            {/* Body del formulario */}
            <Box className={classes.formBody}>
              {/* Seccion: Datos Principales */}
              <Typography className={classes.sectionTitle}>
                Datos Principales
              </Typography>
              <Grid container spacing={2} className={classes.fieldRow}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Cedula / RUC *"
                    name="cedula"
                    value={form.cedula}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon style={{ fontSize: 18, color: '#9e9e9e' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nombres Completos *"
                    name="nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon style={{ fontSize: 18, color: '#9e9e9e' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>

              {/* Seccion: Contacto */}
              <Typography className={classes.sectionTitle}>
                Informacion de Contacto
              </Typography>
              <Grid container spacing={2} className={classes.fieldRow}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Telefono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon style={{ fontSize: 18, color: '#9e9e9e' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Correo Electronico"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon style={{ fontSize: 18, color: '#9e9e9e' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>

              {/* Seccion: Adicional */}
              <Typography className={classes.sectionTitle}>
                Informacion Adicional
              </Typography>
              <Grid container spacing={2} className={classes.fieldRow}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Direccion"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon style={{ fontSize: 18, color: '#9e9e9e' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Observacion"
                    name="observacion"
                    value={form.observacion}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NotesIcon style={{ fontSize: 18, color: '#9e9e9e' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Botones */}
            <Box className={classes.buttonGroup}>
              {isLoading && <CircularProgress size={24} />}
              <Button
                variant="outlined"
                className={classes.btnCancel}
                startIcon={<CancelIcon />}
                onClick={() => setIsNewClient(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                variant="contained"
                className={classes.btnSave}
                startIcon={<SaveIcon />}
                onClick={guardarCliente}
                disabled={isLoading}
              >
                Guardar Cliente
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Panel de Sugerencias */}
        <Grid item xs={12} md={5}>
          <Card className={classes.suggestionsCard}>
            <Box className={classes.suggestionsHeader}>
              <SearchIcon style={{ fontSize: 18, color: '#616161' }} />
              <Typography className={classes.suggestionsHeaderTitle}>
                Clientes Similares
              </Typography>
              {sugerencias.length > 0 && (
                <span className={classes.warningBadge}>
                  {sugerencias.length} encontrados
                </span>
              )}
            </Box>

            <Box className={classes.suggestionsBody}>
              {sugerencias.length === 0 ? (
                <Box className={classes.emptyState}>
                  <SearchIcon className={classes.emptyIcon} />
                  <Typography variant="body2" style={{ color: '#9e9e9e' }}>
                    Ingresa cedula o nombre para buscar coincidencias
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {sugerencias.map((cliente) => (
                    <React.Fragment key={cliente.id}>
                      <ListItem className={classes.suggestionItem}>
                        <ListItemIcon style={{ minWidth: 36 }}>
                          <WarningIcon style={{ fontSize: 18, color: '#E65100' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography style={{ fontSize: 14, fontWeight: 600, color: '#263238' }}>
                              {cliente.nombres}
                            </Typography>
                          }
                          secondary={
                            <Typography style={{ fontSize: 12, color: '#78909C' }}>
                              Cedula: {cliente.cedula} | Tel: {cliente.telefono}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default NuevoCliente;
