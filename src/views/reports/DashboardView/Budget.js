import React, { useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';

import MoneyIcon from '@material-ui/icons/Money';
import { EstadisticasContext } from '../../../context/EstadisticasContext';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 36,
    width: 36
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  }
}));

const Budget = ({ className, ...rest }) => {
  const classes = useStyles();
  const { reporte } = useContext(EstadisticasContext);
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Facturas del día
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {reporte.numeroFacturas}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        {/* <Box mt={2} display="flex" alignItems="center">
          <ArrowDownwardIcon className={classes.differenceIcon} />
          <Typography className={classes.differenceValue} variant="body2">
            15%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box> */}
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
