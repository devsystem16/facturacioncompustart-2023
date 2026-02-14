import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Tabs, Tab, Box, Typography } from '@material-ui/core';
import UsuariosProvider from '../../context/UsuariosContext';
import FormularioUsuario from './FormularioUsuario';
import TablaUsuarios from './TablaUsuarios';
import CambiarPassword from './CambiarPassword';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  }
}));

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

function UsuariosContent() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" align="center" gutterBottom>
          Administración de Usuarios
        </Typography>
      </Paper>

      <Paper style={{ marginTop: 8 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Usuarios" />
          <Tab label="Cambiar Contraseña" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <FormularioUsuario
          usuarioEditar={usuarioEditar}
          setUsuarioEditar={setUsuarioEditar}
        />
        <TablaUsuarios setUsuarioEditar={setUsuarioEditar} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <CambiarPassword />
      </TabPanel>
    </div>
  );
}

export default function Usuarios() {
  return (
    <UsuariosProvider>
      <UsuariosContent />
    </UsuariosProvider>
  );
}
