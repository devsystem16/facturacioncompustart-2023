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

const ReporteVentasPorCliente = () => {
  const { ventasPorCliente, isLoading, cargarVentasPorCliente } = useContext(
    ReportesAvanzadosContext
  );
  const [fechas, setFechas] = useState({ desde: '', hasta: '' });

  const handleBuscar = (fechaDesde, fechaHasta) => {
    setFechas({ desde: fechaDesde, hasta: fechaHasta });
    cargarVentasPorCliente(fechaDesde, fechaHasta);
  };

  return (
    <div>
      <FiltroFechas onBuscar={handleBuscar} isLoading={isLoading} />

      {ventasPorCliente && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <CardContent>
              <Typography variant="h5" style={{ color: colors.green[600] }}>
                Total Ventas:{' '}
                {formatCurrency(ventasPorCliente.total_ventas || 0)}
              </Typography>
            </CardContent>
          </Card>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Cédula</TableCell>
                  <TableCell align="right">Facturas</TableCell>
                  <TableCell align="right">Total Compras</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(ventasPorCliente.clientes || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombres}</TableCell>
                    <TableCell>{item.cedula}</TableCell>
                    <TableCell align="right">{item.total_facturas}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.total_compras)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ExportButtons
            tipoReporte="ventas_por_cliente"
            fechaDesde={fechas.desde}
            fechaHasta={fechas.hasta}
          />
        </>
      )}
    </div>
  );
};

export default ReporteVentasPorCliente;
