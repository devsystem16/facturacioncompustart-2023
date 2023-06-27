import React, { useContext, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';

import ArrowDownwardIcon from '@material-ui/icons/ArrowBack'; // MoneyOff
import LocalAtm from '@material-ui/icons/AccountBalance';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import { EstadisticasContext } from '../../../context/EstadisticasContext';
import { PeriodoContext } from '../../../context/PeriodoContext';
import { formatCurrency } from '../../../Environment/utileria';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 36,
    width: 36
  },
  iconCaja: {
    color: colors.blue[900]
  },
  IconRetiro: {
    color: colors.orange[900]
  },
  textoRetiro: {
    color: colors.orange[900],
    marginRight: theme.spacing(1)
  },
  textoCaja: {
    color: colors.blue[900],
    marginRight: theme.spacing(1)
  }
}));

const TotalProfit = ({ className, ...rest }) => {
  const classes = useStyles();

  const { reporte } = useContext(EstadisticasContext);
  const { periodoActivo, periodo, totalRetiros, obtenerRetirosBD } =
    useContext(PeriodoContext);

  const validarFormaPago = (formasPago) => {
    if (formasPago?.label !== undefined)
      return `${formasPago?.label} $ ${formasPago.total} `;
    else return '';
  };

  useEffect(() => {
    obtenerRetirosBD();
  }, []);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={1}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              VENTAS DEL DÍA
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
              style={{ paddingBottom: '10px' }}
            >
              $ {reporte.totalVentas}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        {reporte.formasPago.map((formasPago) => {
          return (
            <Typography color="textSecondary" variant="h6">
              {validarFormaPago(formasPago)}
            </Typography>
          );
        })}
        <Box mt={0} display="flex" alignItems="center">
          <LocalAtm className={classes.iconCaja} />
          <Typography className={classes.textoCaja} variant="body2">
            {formatCurrency(periodo.fondo_asignado)} Caja
          </Typography>
        </Box>
        <Box mt={0} display="flex" alignItems="center">
          <ArrowDownwardIcon className={classes.IconRetiro} />
          <Typography className={classes.textoRetiro} variant="body2">
            {periodoActivo ? totalRetiros : 0} Gastos
          </Typography>
        </Box>
        Efectivo a entregar:
        {formatCurrency(
          calcularTotalEfectivoEntregar(
            obtenerEfectivo(reporte.formasPago),
            periodo.fondo_asignado,
            totalRetiros,
            periodoActivo
          )
        )}
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string
};

export default TotalProfit;

const calcularTotalEfectivoEntregar = (
  valorEfectivo,
  valorCaja,
  valorRetiros,
  periodoActivo
) => {
  if (!periodoActivo) return 0;
  // Asignar valores predeterminados si los parámetros son indefinidos o nulos
  valorEfectivo = valorEfectivo ?? 0;
  valorCaja = valorCaja ?? 0;
  valorRetiros = valorRetiros ?? 0;

  // Verificar si los valores son numéricos
  if (isNaN(valorEfectivo) || isNaN(valorCaja) || isNaN(valorRetiros)) {
    return 0; // Retornar NaN si alguno de los valores no es numérico
  }

  // Realizar la operación de suma y retornar el resultado
  return valorEfectivo + valorCaja - valorRetiros;
};

const obtenerEfectivo = (data) => {
  const totalEfectivo = data
    .map((item) => (item.label === 'Efectivo' ? item.total : null))
    .filter((value) => value !== null)[0];
  return totalEfectivo;
};
