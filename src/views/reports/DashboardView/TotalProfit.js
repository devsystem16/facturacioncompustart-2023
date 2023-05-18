import React, { useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import { EstadisticasContext } from '../../../context/EstadisticasContext';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));

const TotalProfit = ({ className, ...rest }) => {
  const classes = useStyles();

  const { reporte } = useContext(EstadisticasContext);

  const validarFormaPago = (formasPago) => {
    if (formasPago?.label !== undefined)
      return `${formasPago?.label} $ ${formasPago.total} `;
    else return '';
  };
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

            {reporte.formasPago.map((formasPago) => {
              return (
                <Typography color="textSecondary" variant="h6">
                  {validarFormaPago(formasPago)}
                </Typography>
              );
            })}
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string
};

export default TotalProfit;
