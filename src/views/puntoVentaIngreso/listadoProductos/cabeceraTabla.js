import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const CabeceraTabla = ({classes}) => {
  return (
    <>
 
      <Grid container spacing={0} style={{ fontSize: '11px' }}>
        <Grid item xs={8}>
          <Paper className={classes.paper2} style={{ textAlign: "center" }} > <strong>Descripción</strong> </Paper>
        </Grid>

        <Grid item xs={1}>
          <Paper className={classes.paper2} style={{ textAlign: "center" }} > <strong>P. Público</strong> </Paper>
        </Grid>
        <Grid item xs={1}>
          <Paper className={classes.paper2} style={{ textAlign: "center" }} > <strong>P. Técnico</strong> </Paper>
        </Grid>

        <Grid item xs={1}>
          <Paper className={classes.paper2} style={{ textAlign: "center" }} > <strong>Stock</strong> </Paper>
        </Grid>
        <Grid item xs={1}>
          <Paper className={classes.paper2} style={{ textAlign: "center" }} > <strong>Añadir</strong> </Paper>
        </Grid>
      </Grid>


    </>
  );
}

export default CabeceraTabla;
