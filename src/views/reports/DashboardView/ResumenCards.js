import React from 'react';
import clsx from 'clsx';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { formatCurrency } from '../../../Environment/utileria';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatarVentas: {
    backgroundColor: colors.green[600],
    height: 36,
    width: 36
  },
  avatarFacturas: {
    backgroundColor: colors.blue[600],
    height: 36,
    width: 36
  }
}));

const ResumenCards = ({ resumen }) => {
  const classes = useStyles();

  if (!resumen) return null;

  const cards = [
    {
      titulo: 'Total Facturas',
      valor: resumen.ventas?.total_facturas || 0,
      avatarClass: classes.avatarFacturas,
      icon: <ReceiptIcon />
    }
  ];

  return (
    <>
      {cards.map((card, index) => (
        <Grid item lg={3} sm={6} xl={3} xs={12} key={index}>
          <Card className={clsx(classes.root)}>
            <CardContent>
              <Grid container justify="space-between" spacing={3}>
                <Grid item>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    {card.titulo}
                  </Typography>
                  <Typography color="textPrimary" variant="h3">
                    {card.valor}
                  </Typography>
                </Grid>
                <Grid item>
                  <Avatar className={card.avatarClass}>{card.icon}</Avatar>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default ResumenCards;
