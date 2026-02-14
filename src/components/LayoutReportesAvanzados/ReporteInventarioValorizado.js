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
  colors
} from '@material-ui/core';
import ExportButtons from './ExportButtons';
import { formatCurrency } from '../../Environment/utileria';
import { ReportesAvanzadosContext } from '../../context/ReportesAvanzadosContext';

const ReporteInventarioValorizado = () => {
  const { inventarioValorizado, isLoading, cargarInventarioValorizado } =
    useContext(ReportesAvanzadosContext);

  useEffect(() => {
    cargarInventarioValorizado();
  }, []);

  return (
    <div>
      {inventarioValorizado && (
        <>
          <Grid container spacing={2} style={{ marginBottom: 16 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="h6">
                    Total Productos
                  </Typography>
                  <Typography variant="h4" style={{ color: colors.blue[600] }}>
                    {inventarioValorizado.resumen?.total_productos || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="h6">
                    Total Unidades
                  </Typography>
                  <Typography variant="h4" style={{ color: colors.indigo[600] }}>
                    {inventarioValorizado.resumen?.total_unidades || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="h6">
                    Total Valorizado
                  </Typography>
                  <Typography variant="h4" style={{ color: colors.green[600] }}>
                    {formatCurrency(
                      inventarioValorizado.resumen?.total_valorizado || 0
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
                  <TableCell>Producto</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Precio Compra</TableCell>
                  <TableCell align="right">Precio Público</TableCell>
                  <TableCell align="right">Valor Inventario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(inventarioValorizado.productos || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.codigo_barra}</TableCell>
                    <TableCell align="right">{item.stock}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.precio_compra)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.precio_publico)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.valor_inventario)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ExportButtons tipoReporte="inventario_valorizado" />
        </>
      )}
    </div>
  );
};

export default ReporteInventarioValorizado;
