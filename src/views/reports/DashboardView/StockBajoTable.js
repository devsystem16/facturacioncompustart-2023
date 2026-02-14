import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  colors
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { formatCurrency } from '../../../Environment/utileria';

const useStyles = makeStyles(() => ({
  root: {}
}));

const StockBajoTable = ({ className, productosStockBajo, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Productos con Stock Bajo" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={400}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell>Precio Compra</TableCell>
                <TableCell>Precio Público</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosStockBajo.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay productos con stock bajo
                  </TableCell>
                </TableRow>
              ) : (
                productosStockBajo.map((producto) => (
                  <TableRow hover key={producto.id}>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell
                      align="center"
                      style={{
                        color:
                          producto.stock <= 2
                            ? colors.red[600]
                            : colors.orange[600],
                        fontWeight: 'bold'
                      }}
                    >
                      {producto.stock}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(producto.precio_compra)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(producto.precio_publico)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default StockBajoTable;
