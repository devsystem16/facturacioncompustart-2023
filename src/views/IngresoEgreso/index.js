import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import moment from 'moment';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import ReceiptIcon from '@material-ui/icons/Receipt';
import TodayIcon from '@material-ui/icons/Today';
import EventNoteIcon from '@material-ui/icons/EventNote';
import Page from '../../components/Page';
import FormularioIngreso from './Formulario';
import Tabla from './Tabla';
import TablaHistorico from './TablaHistorico';
import API from '../../Environment/config';
import { PeriodoContext } from '../../context/PeriodoContext';
import { LoginContext } from '../../context/LoginContext';
import { ComponentIniciarPeriodo, formatCurrency } from '../../Environment/utileria';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  headerCard: {
    background: 'linear-gradient(135deg, #3f51b5 0%, #1a237e 100%)',
    color: '#fff',
    marginBottom: theme.spacing(2)
  },
  statCard: {
    height: '100%',
    position: 'relative',
    overflow: 'visible'
  },
  statCardContent: {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  },
  statAvatar: {
    height: 48,
    width: 48,
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)'
  }
}));

const SummaryCard = ({ titulo, valor, subtitulo, icon, avatarColor }) => {
  const classes = useStyles();
  return (
    <Card className={classes.statCard}>
      <CardContent className={classes.statCardContent}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {titulo}
            </Typography>
            <Typography variant="h4" color="textPrimary">
              {valor}
            </Typography>
            {subtitulo && (
              <Typography variant="caption" color="textSecondary">
                {subtitulo}
              </Typography>
            )}
          </Box>
          <Avatar className={classes.statAvatar} style={{ backgroundColor: avatarColor }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function IngresoEgreso() {
  const classes = useStyles();
  const { periodo, periodoActivo, totalRetiros } = useContext(PeriodoContext);
  const { tienePermiso } = useContext(LoginContext);

  const [denominaciones, setDenominaciones] = useState([]);

  const obtenerDenominaciones = async () => {
    const response = await API.get('api/retiros');
    setDenominaciones(response.data.data);
  };

  useEffect(() => {
    obtenerDenominaciones();
  }, []);

  if (!periodoActivo)
    return <ComponentIniciarPeriodo />;

  return (
    <Page className={classes.root} title="Gastos / Retiros">
      <Container maxWidth={false}>
        {/* ===== HEADER ===== */}
        <Card className={classes.headerCard}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <MoneyOffIcon style={{ marginRight: 12, fontSize: 32 }} />
              <Box>
                <Typography variant="h5" style={{ color: '#fff' }}>
                  Gastos / Retiros
                </Typography>
                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Periodo: {moment(periodo.fecha_apertura).format('DD/MM/YYYY')}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* ===== SUMMARY CARDS ===== */}
        <Grid container spacing={2}>
          <Grid item lg={4} sm={4} xs={12}>
            <SummaryCard
              titulo="TOTAL GASTOS"
              valor={formatCurrency(totalRetiros || 0)}
              subtitulo="del periodo actual"
              icon={<MoneyOffIcon />}
              avatarColor={colors.red[500]}
            />
          </Grid>
          <Grid item lg={4} sm={4} xs={12}>
            <SummaryCard
              titulo="CANTIDAD DE RETIROS"
              valor={denominaciones.length}
              subtitulo="registros"
              icon={<ReceiptIcon />}
              avatarColor={colors.orange[600]}
            />
          </Grid>
          <Grid item lg={4} sm={4} xs={12}>
            <SummaryCard
              titulo="PERIODO ACTUAL"
              valor={moment(periodo.fecha_apertura).format('DD/MM/YYYY')}
              subtitulo="fecha de apertura"
              icon={<EventNoteIcon />}
              avatarColor={colors.indigo[600]}
            />
          </Grid>
        </Grid>

        {/* ===== FORMULARIO ===== */}
        {tienePermiso('retiros.crear') && (
          <Box mt={3}>
            <FormularioIngreso setDenominaciones={setDenominaciones} />
          </Box>
        )}

        {/* ===== TABLA PERIODO ACTUAL ===== */}
        <Box mt={3}>
          <Tabla
            titulo="Listado de Gastos"
            setDenominaciones={setDenominaciones}
            denominaciones={denominaciones}
          />
        </Box>

        {/* ===== HISTORICO ===== */}
        {tienePermiso('retiros.ver-historico') && (
          <Box mt={3}>
            <TablaHistorico />
          </Box>
        )}
      </Container>
    </Page>
  );
}
