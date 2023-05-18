import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const TAX_RATE = 0.07;

const useStyles = makeStyles({
  table: {
    minWidth: 400,
    width: '50%',
    backgroundColor: '#f9f3ff'
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
  createRow('2021-12-01', 100, 1.15),
  createRow('2021-12-02', 10, 45.99),
  createRow('2021-12-04', 2, 17.99)
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function SpanningTable({ pagos, totalAbonado }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Abono.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pagos.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.fecha}</TableCell>
              <TableCell align="right">{ccyFormat(row.abono)}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell />

            <TableCell colSpan={4}>
              Total Abono ${ccyFormat(totalAbonado)}
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
