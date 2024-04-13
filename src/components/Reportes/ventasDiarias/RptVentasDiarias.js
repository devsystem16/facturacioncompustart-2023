import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BotonImprimir from '../BotonImpresion/BotonImprimir';
import { ReportesContext } from '../../../context/ReportesContext';
import ChartistGraph from 'react-chartist';
import date from 'date-and-time';
import TextField from '@material-ui/core/TextField';
import CabeceraReporte from './CabeceraReporte';
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField1: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '36ch'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch'
  },
  textFieldFecha: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
    width: '25ch'
  },
  btn: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default function VentasDiarias() {
  const { ventasDiarias } = useContext(ReportesContext);
  const classes = useStyles();
  var data = {
    labels: ['Nathy 20%', 'Freddy 15%', 'Mychael 40%', 'Katyta 10%'],
    series: [20, 15, 30, 10],
    colors: ['#d70206', '#dda458', '#6188e2']
  };

  var options = {
    width: '300px',
    height: '300px',
    donut: false
  };
  var type = 'Pie';

  return (
    <>
      <CabeceraReporte></CabeceraReporte>
      <h3>Total Ventas $ {ventasDiarias.total_ventas}</h3>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Fecha</TableCell>
              <TableCell align="right">Observación</TableCell>
              <TableCell align="right">Total</TableCell>
              {/* <TableCell align="right">Tipo</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              style={{ backgroundColor: '#e6e6e6' }}
              key="rowFacturas01"
            >
              <TableCell component="th" colSpan={5} scope="row">
                <center>
                  <strong>Facturas ({ventasDiarias.facturas.length})</strong>
                </center>
              </TableCell>
            </TableRow>

            {ventasDiarias.facturas.map((factura) => (
              <TableRow key={'rptF' + factura.idControl}>
                <TableCell component="th" scope="row">
                  {factura.cliente}
                </TableCell>
                <TableCell align="right">{factura.fecha}</TableCell>
                <TableCell align="right">
                  {factura.observacion === null ? '-' : factura.observacion}
                </TableCell>
                <TableCell align="right">$ {factura.totalAbono}</TableCell>
                {/* <TableCell align="right">{factura.tipo}</TableCell> */}
              </TableRow>
            ))}
            {/* <TableRow style={{ backgroundColor: '#e6e6e6' }} key="rowIngres01">
              <TableCell component="th" colSpan={5} scope="row">
                <center>
                  <strong>Ingresos ({ventasDiarias.ordenes.length}) </strong>
                </center>
              </TableCell>
            </TableRow>
            {ventasDiarias.ordenes.map((obj) => (
              <TableRow key={'rptF' + obj.idControl}>
                <TableCell component="th" scope="row">
                  {obj.cliente}
                </TableCell>
                <TableCell align="right">{obj.fecha}</TableCell>
                <TableCell align="right">
                  {obj.observacion === null ? '-' : obj.observacion}
                </TableCell>
                <TableCell align="right">$ {obj.totalAbono}</TableCell>
                
              </TableRow>
            ))} */}

            <TableRow style={{ backgroundColor: '#e6e6e6' }} key="rowOrd01">
              <TableCell component="th" colSpan={5} scope="row">
                <center>
                  <strong>Créditos ({ventasDiarias.creditos.length}) </strong>
                </center>
              </TableCell>
            </TableRow>
            {ventasDiarias.creditos.map((obj) => (
              <TableRow key={'rptF' + obj.idControl}>
                <TableCell component="th" scope="row">
                  {obj.cliente}
                </TableCell>
                <TableCell align="right">{obj.fecha}</TableCell>
                <TableCell align="right">
                  {obj.observacion === null ? '-' : obj.observacion}
                </TableCell>
                <TableCell align="right">$ {obj.totalAbono}</TableCell>
                {/* <TableCell align="right">{obj.tipo}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <ChartistGraph data={data} options={options} type={type} /> */}
    </>
  );
}
