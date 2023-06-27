import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Listado from './ListadoProformas/ListadoProformas';
import FormularioNuevaProforma from './nuevaProforma/nuevaProforma';
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

export default function Proformas() {
  const classes = useStyles();
  const { periodoActivo } = useContext(PeriodoContext);
  if (!periodoActivo)
    return <ComponentIniciarPeriodo></ComponentIniciarPeriodo>;
  else
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <h2>Proformas</h2>
            </Paper>
          </Grid>

          <FormularioNuevaProforma></FormularioNuevaProforma>

          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Listado></Listado>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
}

{
  /* <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>xs=12 sm=6</Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>xs=12 sm=6</Paper>
          </Grid>
        </Grid> */
}
