import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  colors
} from '@material-ui/core';
import FiltroFechas from './FiltroFechas';
import ExportButtons from './ExportButtons';
import { formatCurrency } from '../../Environment/utileria';
import { ReportesAvanzadosContext } from '../../context/ReportesAvanzadosContext';

const ReporteUtilidades = () => {
  const { utilidades, isLoading, cargarUtilidades } = useContext(
    ReportesAvanzadosContext
  );
  const [fechas, setFechas] = useState({ desde: '', hasta: '' });

  const handleBuscar = (fechaDesde, fechaHasta) => {
    setFechas({ desde: fechaDesde, hasta: fechaHasta });
    cargarUtilidades(fechaDesde, fechaHasta);
  };

  return (
    <div>
      <FiltroFechas onBuscar={handleBuscar} isLoading={isLoading} />

      {utilidades && (
        <>
          <Grid container spacing={2} style={{ marginBottom: 16 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="h6">
                    Total Ventas
                  </Typography>
                  <Typography variant="h4" style={{ color: colors.blue[600] }}>
                    {formatCurrency(utilidades.resumen?.total_venta || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="h6">
                    Total Costo
                  </Typography>
                  <Typography variant="h4" style={{ color: colors.orange[600] }}>
                    {formatCurrency(utilidades.resumen?.total_costo || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="h6">
                    Utilidad Bruta
                  </Typography>
                  <Typography variant="h4" style={{ color: colors.green[600] }}>
                    {formatCurrency(utilidades.resumen?.utilidad_bruta || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Total Venta</TableCell>
                  <TableCell align="right">Total Costo</TableCell>
                  <TableCell align="right">Utilidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(utilidades.detalle || []).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.codigo_barra}</TableCell>
                    <TableCell align="right">{item.total_cantidad}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.total_venta)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.total_costo)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        color:
                          item.utilidad >= 0
                            ? colors.green[600]
                            : colors.red[600]
                      }}
                    >
                      {formatCurrency(item.utilidad)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ExportButtons
            tipoReporte="utilidades"
            fechaDesde={fechas.desde}
            fechaHasta={fechas.hasta}
          />
        </>
      )}
    </div>
  );
};

export default ReporteUtilidades;
