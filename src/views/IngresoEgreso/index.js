import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormularioIngreso from './Formulario';
import Tabla from './Tabla';
import moment from 'moment';
import API from '../../Environment/config';
import { PeriodoContext } from '../../context/PeriodoContext';
import { ComponentIniciarPeriodo } from '../../Environment/utileria';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

export default function IngresoEgreso() {
  const classes = useStyles();
  const { periodo, periodoActivo } = useContext(PeriodoContext);

  const [denominaciones, setDenominaciones] = useState([]);

  const obtenerDenominaciones = async () => {
    const response = await API.get('api/retiros');
    setDenominaciones(response.data.data);
  };

  useEffect(() => {
    obtenerDenominaciones();
  }, []);

  if (!periodoActivo)
    return <ComponentIniciarPeriodo></ComponentIniciarPeriodo>;
  else
    return (
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <h2>Gastos</h2>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div>
                Periodo: {moment(periodo.fecha_apertura).format('DD/MM/YYYY')}
              </div>
              <br></br>

              <FormularioIngreso
                setDenominaciones={setDenominaciones}
              ></FormularioIngreso>
              <Tabla
                titulo="Listado de Gastos"
                setDenominaciones={setDenominaciones}
                denominaciones={denominaciones}
              ></Tabla>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
}
