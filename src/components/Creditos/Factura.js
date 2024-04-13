import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formatCurrencySimple } from '../../Environment/utileria';
const TAX_RATE = 0.15;

const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99)
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function SpanningTable({ factura }) {
  const classes = useStyles();
  function trunc(x, posiciones = 0) {
    return formatCurrencySimple(x);
    var s = x.toString();
    var l = s.length;
    var decimalLength = s.indexOf('.') + 1;
    var numStr = s.substr(0, decimalLength + posiciones);
    return Number(numStr);
  }
  return (
    <TableContainer
      component={Paper}
      style={{ backgroundColor: 'rgba(217, 217, 217, 0.29)' }}
    >
      <strong>Cliente: </strong> {factura.cliente}
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          {/* <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow> */}
          <TableRow style={{ backgroundColor: '#9d9d9d5e' }}>
            <TableCell>Producto</TableCell>
            <TableCell align="right">Cant.</TableCell>
            <TableCell align="right">T. Unit</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {factura.detalles.map((row) => (
            <TableRow key={row.producto}>
              <TableCell>{row.producto}</TableCell>
              <TableCell align="right">{row.cantidad}</TableCell>
              <TableCell align="right">
                {trunc(row.subtotal / row.cantidad / 1.15, 4)}
              </TableCell>
              <TableCell align="right">
                {ccyFormat(row.cantidad * (row.subtotal / row.cantidad / 1.15))}
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(factura.subtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>IVA</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
              0
            )} %`}</TableCell>
            <TableCell align="right">{ccyFormat(factura.iva)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(factura.total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
