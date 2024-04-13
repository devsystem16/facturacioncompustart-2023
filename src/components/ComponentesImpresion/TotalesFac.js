import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import { FacturaContext } from '../../context/FacturaContext';
import { formatCurrencySimple } from '../../Environment/utileria';
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(0),
    fontSize: '12px'
  },
  paper: {
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(0)
  },
  paperRight: {
    padding: theme.spacing(0),
    textAlign: 'Right',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(0)
  },
  divider: {
    margin: theme.spacing(2, 0)
  }
}));

export default function TotalesFac({ totales }) {
  const classes = useStyles();

  const { observacion } = useContext(FacturaContext);
 
  return (
    <div>
      <Divider className={classes.divider} />

      <div className={classes.container}>
        <div style={{ gridColumnEnd: 'span 8', height: '24px' }}>
          <Paper className={classes.paperRight}>SUBTOTAL 15% $: </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}>
            {formatCurrencySimple(totales.subtotal)}
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 8', height: '24px' }}>
          <Paper className={classes.paperRight}>SUBTOTAL 0% :$ </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}> 0.00</Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 8', height: '24px' }}>
          <Paper className={classes.paperRight}>DESCUENTO 0% :$ </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}> 0.00</Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 8', height: '24px' }}>
          <Paper className={classes.paperRight}>SUBTOTAL :$ </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}>
            {formatCurrencySimple(totales.subtotal)}
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 8' }}>
          <Paper className={classes.paperRight}>IVA 15%:$ </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}>
            {formatCurrencySimple(totales.iva)}
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 8' }}>
          <Paper className={classes.paperRight}>VALOR TOTAL:$ </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}>
            $ {formatCurrencySimple(totales.total)}
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 9', marginTop: '3px' }}>
          <Paper className={classes.paperRight} style={{ textAlign: 'left' }}>
            Observaciones: {observacion}
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 3', textAlign: 'center' }}></div>
      </div>
    </div>
  );
}
