import React, { useState, useContext, useMemo } from 'react';
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
  TextField,
  InputAdornment,
  colors
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import FiltroFechas from './FiltroFechas';
import ExportButtons from './ExportButtons';
import { formatCurrency } from '../../Environment/utileria';
import { ReportesAvanzadosContext } from '../../context/ReportesAvanzadosContext';

const ReporteVentasPorProducto = () => {
  const { ventasPorProducto, isLoading, cargarVentasPorProducto } = useContext(
    ReportesAvanzadosContext
  );
  const [fechas, setFechas] = useState({ desde: '', hasta: '' });
  const [filtro, setFiltro] = useState('');

  const handleBuscar = (fechaDesde, fechaHasta) => {
    setFechas({ desde: fechaDesde, hasta: fechaHasta });
    cargarVentasPorProducto(fechaDesde, fechaHasta);
  };

  const productosFiltrados = useMemo(() => {
    const productos = ventasPorProducto?.productos || [];
    if (!filtro.trim()) return productos;
    const texto = filtro.toLowerCase().trim();
    return productos.filter(
      (item) =>
        (item.nombre || '').toLowerCase().includes(texto) ||
        (item.codigo_barra || '').toLowerCase().includes(texto)
    );
  }, [ventasPorProducto, filtro]);

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

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Buscar por nombre de producto o código..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ marginBottom: 16 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />

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
                {productosFiltrados.map((item) => (
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
