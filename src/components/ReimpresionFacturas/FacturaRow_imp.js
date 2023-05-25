import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { formatCurrencySimple } from '../../Environment/utileria';

// const redondear = (valor) => {
//   return Math.round(valor * 100) / 100;
// };
const obtienePrecioBruto = (precioNeto) => {
  return formatCurrencySimple(trunc(precioNeto / 1.12, 4));
  // return redondear(precioNeto - precioNeto * 0.12);
};
function trunc(x, posiciones = 0) {
  var s = x.toString();
  var l = s.length;
  var decimalLength = s.indexOf('.') + 1;
  var numStr = s.substr(0, decimalLength + posiciones);
  return Number(numStr);
}
export default function FacturaRow_imp({ producto }) {
  return (
    <div style={{ height: '24px' }} key={producto?.id + producto?.tipoPrecio}>
      <Grid
        container
        spacing={0}
        margin={0}
        style={{ fontSize: '11px', marginTop: '3px', marginBottom: '-2px' }}
      >
        <Grid item xs={1}>
          {/* <Paper className={classes.paper}> */}
          <strong> {producto?.cantidad} </strong>
          {/* </Paper> */}
        </Grid>
        <Grid item xs={7} title={producto?.producto}>
          {/* <Paper className={classes.paper}> */}
          {producto?.producto}
          {/* </Paper> */}
        </Grid>
        <Grid item xs={2} style={{ backgroundColor: '#cef2e6' }}>
          {/* <Paper
            style={{ backgroundColor: '#cef2e6' }}
            className={classes.paper}
          > */}
          {producto?.precio_tipo === 'publico'
            ? obtienePrecioBruto(producto?.precio_publico)
            : ''}
          {producto?.precio_tipo === 'tecnico'
            ? obtienePrecioBruto(producto?.precio_tecnico)
            : ''}
          {producto?.precio_tipo === 'mayorista'
            ? obtienePrecioBruto(producto?.precio_distribuidor)
            : ''}
          {/* </Paper> */}
        </Grid>

        <Grid item xs={2}>
          {/* <Paper className={classes.paper}> */}
          {obtienePrecioBruto(producto?.total)}
          {/* </Paper> */}
        </Grid>
      </Grid>
    </div>
  );
}
