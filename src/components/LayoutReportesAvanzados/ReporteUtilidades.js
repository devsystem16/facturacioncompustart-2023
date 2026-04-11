import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
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

const EstadoChip = ({ estado }) => {
  const config = {
    cerrada:            { label: 'Contado',        bg: colors.blue[50],   color: colors.blue[800],   border: colors.blue[300] },
    credito:            { label: 'Crédito',         bg: colors.orange[100], color: colors.orange[800], border: colors.orange[300] },
    'credito (PAGADO)': { label: 'Crédito Pagado', bg: colors.green[100], color: colors.green[800],  border: colors.green[300] },
  };
  const c = config[estado];
  if (!c) return null;
  return (
    <Chip
      label={c.label}
      size="small"
      style={{
        marginLeft: 6,
        height: 18,
        fontSize: 10,
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`
      }}
    />
  );
};

const ReporteUtilidades = () => {
  const { utilidades, abonosCreditos, isLoading, cargarUtilidades } = useContext(
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="h6">
                    Recaudación Créditos
                  </Typography>
                  <Typography variant="h4" style={{ color: colors.teal[600] }}>
                    {formatCurrency(abonosCreditos?.total_abonos || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="h6">
                    Utilidad Bruta
                  </Typography>
                  <Typography variant="h4" style={{ color: colors.green[600] }}>
                    {formatCurrency(
                      (utilidades.resumen?.total_venta || 0) -
                      (utilidades.resumen?.total_costo || 0)
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell># Fact.</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell align="right">Cant.</TableCell>
                  <TableCell align="right">Total Venta</TableCell>
                  <TableCell align="right">Total Costo</TableCell>
                  <TableCell align="right">Utilidad</TableCell>
                  <TableCell>Forma de Pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(utilidades.detalle || []).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                    <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                      {item.factura_id}
                      <EstadoChip estado={item.estado} />
                    </span>
                  </TableCell>
                    <TableCell>{item.fecha}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.codigo_barra}</TableCell>
                    <TableCell align="right">{item.cantidad}</TableCell>
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
                    <TableCell>{item.forma_pago || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {abonosCreditos && (abonosCreditos.detalle || []).length > 0 && (
            <>
              <Typography variant="h6" style={{ marginTop: 24, marginBottom: 8 }}>
                Recaudación de Créditos (Flujo de Caja)
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell># Factura</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Fecha Abono</TableCell>
                      <TableCell align="right">Monto Abono</TableCell>
                      <TableCell>Forma de Pago</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(abonosCreditos.detalle || []).map((abono, i) => (
                      <TableRow key={i}>
                        <TableCell>{abono.factura_id}</TableCell>
                        <TableCell>{abono.cliente}</TableCell>
                        <TableCell>{abono.fecha}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(abono.monto)}
                        </TableCell>
                        <TableCell>{abono.forma_pago}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <strong>Total Abonos</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong style={{ color: colors.teal[600] }}>
                          {formatCurrency(abonosCreditos?.total_abonos || 0)}
                        </strong>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

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
