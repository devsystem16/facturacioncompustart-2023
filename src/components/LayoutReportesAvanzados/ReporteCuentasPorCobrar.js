import React, { useContext, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  colors
} from '@material-ui/core';
import moment from 'moment';
import ExportButtons from './ExportButtons';
import { formatCurrency } from '../../Environment/utileria';
import { ReportesAvanzadosContext } from '../../context/ReportesAvanzadosContext';

const colorPorRango = {
  '0-30': colors.green[500],
  '31-60': colors.orange[500],
  '61-90': colors.deepOrange[500],
  '90+': colors.red[600]
};

const ReporteCuentasPorCobrar = () => {
  const { cuentasPorCobrar, isLoading, cargarCuentasPorCobrar } = useContext(
    ReportesAvanzadosContext
  );

  useEffect(() => {
    cargarCuentasPorCobrar();
  }, []);

  return (
    <div>
      {cuentasPorCobrar && (
        <>
          <Grid container spacing={2} style={{ marginBottom: 16 }}>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    0-30 días
                  </Typography>
                  <Typography variant="h5" style={{ color: colors.green[600] }}>
                    {formatCurrency(cuentasPorCobrar.resumen_rangos?.['0-30'] || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    31-60 días
                  </Typography>
                  <Typography variant="h5" style={{ color: colors.orange[600] }}>
                    {formatCurrency(cuentasPorCobrar.resumen_rangos?.['31-60'] || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    61-90 días
                  </Typography>
                  <Typography
                    variant="h5"
                    style={{ color: colors.deepOrange[600] }}
                  >
                    {formatCurrency(cuentasPorCobrar.resumen_rangos?.['61-90'] || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    90+ días
                  </Typography>
                  <Typography variant="h5" style={{ color: colors.red[600] }}>
                    {formatCurrency(cuentasPorCobrar.resumen_rangos?.['90+'] || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card style={{ marginBottom: 16 }}>
            <CardContent>
              <Typography variant="h5" style={{ color: colors.red[600] }}>
                Total por Cobrar:{' '}
                {formatCurrency(cuentasPorCobrar.total_por_cobrar || 0)}
              </Typography>
            </CardContent>
          </Card>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Cédula</TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Saldo</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="center">Días Atraso</TableCell>
                  <TableCell align="center">Antigüedad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(cuentasPorCobrar.creditos || []).map((credito) => (
                  <TableRow key={credito.id}>
                    <TableCell>{credito.cliente?.nombres || 'N/A'}</TableCell>
                    <TableCell>{credito.cliente?.cedula || 'N/A'}</TableCell>
                    <TableCell>{credito.detalle}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(credito.total)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(credito.saldo)}
                    </TableCell>
                    <TableCell>
                      {moment(credito.fecha).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell align="center">{credito.dias_atraso}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={credito.rango_antiguedad}
                        size="small"
                        style={{
                          backgroundColor:
                            colorPorRango[credito.rango_antiguedad] || colors.grey[500],
                          color: '#fff'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ExportButtons tipoReporte="cuentas_por_cobrar" />
        </>
      )}
    </div>
  );
};

export default ReporteCuentasPorCobrar;
