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
import CabeceraReporte from '../configuracion/CabeceraReporte';

import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 350
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

export default function RptIngresosXempleado() {
  const { ingresosXepleado } = useContext(ReportesContext);

  const classes = useStyles();
  var data = {
    labels: ingresosXepleado?.grafico?.labels,
    series: ingresosXepleado?.grafico?.series,
    colors: ['#d70206', '#dda458', '#6188e2']
  };

  var options = {
    width: '260px',
    height: '260px',
    donut: false
  };
  var type = 'Pie';

  return (
    <>
      <CabeceraReporte title="Ingresos por Empleados"></CabeceraReporte>
      <h3>Total Ventas $ {ingresosXepleado.total_ventas}</h3>

      <Grid container spacing={3}>
        <Grid item xs={7}>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell align="right">N° Ingresos</TableCell>
                  <TableCell align="right">Total Vendido</TableCell>
                  {/* <TableCell align="right">Total</TableCell> */}
                  {/* <TableCell align="right">Tipo</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {ingresosXepleado.ventasEmpleados.map((ventas, index) => (
                  <TableRow key={'rptFs' + index}>
                    <TableCell component="th" scope="row">
                      {ventas.usuario}
                    </TableCell>
                    <TableCell align="right">
                      {ventas.cantidad_ordenes}
                    </TableCell>
                    <TableCell align="right">$ {ventas.total_venta}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={5}>
          <center>
            <ChartistGraph data={data} options={options} type={type} />
          </center>
        </Grid>
      </Grid>
    </>
  );
}
