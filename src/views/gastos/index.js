import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Tabs, Tab, Box, Typography } from '@material-ui/core';
import { PeriodoContext } from '../../context/PeriodoContext';
import { ComponentIniciarPeriodo } from '../../Environment/utileria';
import FormularioGasto from './FormularioGasto';
import TablaGastos from './TablaGastos';
import FormularioCategoria from './FormularioCategoria';
import TablaCategorias from './TablaCategorias';
import ReporteGastos from './ReporteGastos';
import moment from 'moment';

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

export default function Gastos() {
  const classes = useStyles();
  const { periodo, periodoActivo } = useContext(PeriodoContext);
  const [tabValue, setTabValue] = useState(0);
  const [gastoEditar, setGastoEditar] = useState(null);
  const [categoriaEditar, setCategoriaEditar] = useState(null);

  if (!periodoActivo) return <ComponentIniciarPeriodo />;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" align="center" gutterBottom>
          Caja Chica / Gastos
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Periodo: {moment(periodo.fecha_apertura).format('DD/MM/YYYY')}
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
          <Tab label="Gastos" />
          <Tab label="Categorías" />
          <Tab label="Resumen" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <FormularioGasto gastoEditar={gastoEditar} setGastoEditar={setGastoEditar} />
        <TablaGastos setGastoEditar={setGastoEditar} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <FormularioCategoria
          categoriaEditar={categoriaEditar}
          setCategoriaEditar={setCategoriaEditar}
        />
        <TablaCategorias setCategoriaEditar={setCategoriaEditar} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ReporteGastos />
      </TabPanel>
    </div>
  );
}
