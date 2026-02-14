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
  Typography,
  makeStyles
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import { formatCurrency } from '../../../Environment/utileria';

const useStyles = makeStyles(() => ({
  root: {}
}));

const CreditosPendientesTable = ({ className, creditosPendientes, ...rest }) => {
  const classes = useStyles();
  const creditos = creditosPendientes?.creditos || [];
  const totalPendiente = creditosPendientes?.total_pendiente || 0;

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Créditos Pendientes" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={400}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Detalle</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Saldo</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creditos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay créditos pendientes
                  </TableCell>
                </TableRow>
              ) : (
                creditos.map((credito) => (
                  <TableRow hover key={credito.id}>
                    <TableCell>
                      {credito.cliente?.nombres || 'N/A'}
                    </TableCell>
                    <TableCell>{credito.detalle}</TableCell>
                    <TableCell>{formatCurrency(credito.total)}</TableCell>
                    <TableCell>{formatCurrency(credito.saldo)}</TableCell>
                    <TableCell>
                      {moment(credito.fecha).format('DD/MM/YYYY')}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {creditos.length > 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle2">Total Pendiente:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {formatCurrency(totalPendiente)}
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default CreditosPendientesTable;
