import React, { useState, useContext } from 'react';
import clsx from 'clsx';
// import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  // Button,
  Card,
  CardHeader,
  // Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  // TableSortLabel,
  // Tooltip,
  makeStyles
} from '@material-ui/core';
// import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { EstadisticasContext } from '../../../context/EstadisticasContext';
const data = [
  {
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1048',
    amount: 25.1,
    customer: {
      name: 'Cao Yu'
    },
    createdAt: 1555016400000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1047',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson'
    },
    createdAt: 1554930000000,
    status: 'refunded'
  },
  {
    id: uuid(),
    ref: 'CDD1046',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer'
    },
    createdAt: 1554757200000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1045',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'sss',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'sssssss',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'aaaasss',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  }
];

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestOrders = ({ className, ...rest }) => {
  const { reporte } = useContext(EstadisticasContext);

  const classes = useStyles();
  const [orders] = useState(data);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Detalles de Ventas" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={400}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Incidencia</TableCell>
                <TableCell>Producto/Credito/Orden</TableCell>
                <TableCell>Detalle</TableCell>
                {/* <TableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel active direction="desc">
                      Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell> */}
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reporte.desglose.map((order) => (
                <TableRow hover key={order.id}>
                  <TableCell>{order.incidencia}</TableCell>
                  <TableCell>{order.detalle}</TableCell>
                  <TableCell>
                    {/* {moment(order.createdAt).format('DD/MM/YYYY')} */}
                    {order.precio_tipo}
                  </TableCell>
                  <TableCell>
                    {/* <Chip color="primary" label={order.valor} size="small" /> */}
                    $ {order.valor}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box display="flex" justifyContent="flex-end" p={2}>
        {/* <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button> */}
      </Box>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
