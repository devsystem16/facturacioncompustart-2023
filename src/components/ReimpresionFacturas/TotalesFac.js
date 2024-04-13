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
    marginBottom: theme.spacing(1)
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

function calcularImpuesto(impuesto) {
  const impuestos = {
    12: '12%',
    15: '15%',
    null: 'no definido'
  };

  return impuestos[impuesto] || 'valor inválido';
}

export default function TotalesFac({ totales , impuesto =null , observacion =""}) {


  
  const classes = useStyles();

  // const { observacion } = useContext(FacturaContext);

 

  function trunc(x, posiciones = 0) {
    var s = x.toString();
    var l = s.length;
    var decimalLength = s.indexOf('.') + 1;
    var numStr = s.substr(0, decimalLength + posiciones);
    return Number(numStr);
  }
  return (
    <div>
      <Divider className={classes.divider} />

      <div className={classes.container}>
        <div style={{ gridColumnEnd: 'span 8', height: '24px' }}>
          <Paper className={classes.paperRight}>SUBTOTAL {calcularImpuesto(impuesto)} $: </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}> {totales.subtotal}</Paper>
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
          <Paper className={classes.paperRight}>IVA {calcularImpuesto(impuesto)}:$ </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}>
            {formatCurrencySimple(trunc(totales.iva, 4))}
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

        <div style={{ gridColumnEnd: 'span 9' }}>
          <Paper className={classes.paperRight} style={{ textAlign: 'left' }}>
            Observaciones: {observacion}
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 3', textAlign: 'center' }}></div>
      </div>
    </div>
  );
}
