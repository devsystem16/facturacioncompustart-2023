import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
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

const ReporteVentasPorProducto = () => {
  const { ventasPorProducto, isLoading, cargarVentasPorProducto } = useContext(
    ReportesAvanzadosContext
  );
  const [fechas, setFechas] = useState({ desde: '', hasta: '' });

  const handleBuscar = (fechaDesde, fechaHasta) => {
    setFechas({ desde: fechaDesde, hasta: fechaHasta });
    cargarVentasPorProducto(fechaDesde, fechaHasta);
  };

  return (
    <div>
      <FiltroFechas onBuscar={handleBuscar} isLoading={isLoading} />

      {ventasPorProducto && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <CardContent>
              <Typography variant="h5" style={{ color: colors.green[600] }}>
                Total Ventas:{' '}
                {formatCurrency(ventasPorProducto.total_ventas || 0)}
              </Typography>
            </CardContent>
          </Card>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Total Ventas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(ventasPorProducto.productos || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.codigo_barra}</TableCell>
                    <TableCell align="right">{item.total_cantidad}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.total_ventas)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ExportButtons
            tipoReporte="ventas_por_producto"
            fechaDesde={fechas.desde}
            fechaHasta={fechas.hasta}
          />
        </>
      )}
    </div>
  );
};

export default ReporteVentasPorProducto;
