import React, { useContext } from 'react';
import {
  Box,
  Container,
  makeStyles,
  Card,
  CardContent,
  Typography,
  Grid
} from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import Page from '../../../components/Page';
import Toolbar from './Toolbar';
import NuevoCliente from '../../../components/NuevoCliente';
import { ClienteContext } from '../../../context/ClienteContext';
import TablaCliente from '../../../components/TablaClientes/TablaClientes';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  pageHeader: {
    marginBottom: 20
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#263238'
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#78909C',
    marginTop: 2
  },
  summaryCard: {
    textAlign: 'center',
    borderRadius: 12,
    transition: 'all 0.25s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
    }
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px'
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.2
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: 600,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  }
}));

const CustomerListView = () => {
  const { isNewClient, clientes, clientesFiltro } = useContext(ClienteContext);
  const classes = useStyles();

  const summaryCards = [
    {
      label: 'Total Clientes',
      value: clientes.length,
      color: '#1565C0',
      bg: '#E3F2FD',
      iconBg: '#BBDEFB',
      icon: <PeopleIcon style={{ fontSize: 26, color: '#1565C0' }} />
    },
    {
      label: 'Mostrando',
      value: clientesFiltro.length,
      color: '#2E7D32',
      bg: '#E8F5E9',
      iconBg: '#C8E6C9',
      icon: <PersonAddIcon style={{ fontSize: 26, color: '#2E7D32' }} />
    }
  ];

  return (
    <Page className={classes.root} title="Clientes">
      <Container maxWidth={false}>
        {/* Header */}
        <Box className={classes.pageHeader}>
          <Typography className={classes.pageTitle}>
            Gestion de Clientes
          </Typography>
          <Typography className={classes.pageSubtitle}>
            Administra la informacion de tus clientes
          </Typography>
        </Box>

        {/* Tarjetas resumen */}
        <Grid container spacing={2} style={{ marginBottom: 20 }}>
          {summaryCards.map((card, idx) => (
            <Grid item xs={6} sm={3} md={2} key={idx}>
              <Card
                className={classes.summaryCard}
                style={{ borderBottom: `3px solid ${card.color}` }}
              >
                <CardContent style={{ padding: '16px 12px 14px' }}>
                  <Box
                    className={classes.summaryIconBox}
                    style={{ backgroundColor: card.iconBg }}
                  >
                    {card.icon}
                  </Box>
                  <Typography
                    className={classes.summaryValue}
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    className={classes.summaryLabel}
                    style={{ color: card.color }}
                  >
                    {card.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {isNewClient ? <NuevoCliente /> : <Toolbar />}

        {!isNewClient && (
          <Box mt={2}>
            <TablaCliente />
          </Box>
        )}
      </Container>
    </Page>
  );
};

export default CustomerListView;
