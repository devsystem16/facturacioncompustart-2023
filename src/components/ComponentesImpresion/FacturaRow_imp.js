import React from 'react';
import Grid from '@material-ui/core/Grid';
import { formatCurrencySimple } from '../../Environment/utileria';

function trunc(x, posiciones = 0) {
  var s = x.toString();
  var l = s.length;
  var decimalLength = s.indexOf('.') + 1;
  var numStr = s.substr(0, decimalLength + posiciones);
  return Number(numStr);
}

const obtienePrecioBruto = (precioNeto) => {
  return formatCurrencySimple(trunc(precioNeto / 1.15, 4));
};
export default function FacturaRow_imp({ producto }) {
  return (
    <div style={{ height: '24px' }} key={producto.id + producto.tipoPrecio}>
      <Grid
        container
        spacing={0}
        margin={0}
        style={{ fontSize: '11px', marginTop: '3px' }}
      >
        <Grid item xs={1}>
          <strong> {producto.cantidad} </strong>
          {/* </Paper> */}
        </Grid>
        <Grid item xs={7} title={producto.nombre}>
          {producto.id +" - "+ producto.nombre}
        </Grid>
        <Grid item xs={2} style={{ backgroundColor: '#cef2e6' }}>
          {/* <Paper
            style={{ backgroundColor: '#cef2e6' }}
            className={classes.paper}
          > */}
          {producto.tipoPrecio === 'publico'
            ? obtienePrecioBruto(producto.precio_publico)
            : ''}
          {producto.tipoPrecio === 'tecnico'
            ? obtienePrecioBruto(producto.precio_tecnico)
            : ''}
          {producto.tipoPrecio === 'mayorista'
            ? obtienePrecioBruto(producto.precio_distribuidor)
            : ''}
          {/* </Paper> */}
        </Grid>

        <Grid item xs={2}>
          {/* <Paper className={classes.paper}> */}
          {formatCurrencySimple(producto.total)}
          {/* </Paper> */}
        </Grid>
      </Grid>
    </div>
  );
}
