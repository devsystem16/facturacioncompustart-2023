import React, { useContext, useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Typography,
  Divider,
  makeStyles,
  colors
} from '@material-ui/core';
import moment from 'moment';

import Page from '../../../components/Page';
import LatestOrders from './LatestOrders';
import DashboardDateFilter from './DashboardDateFilter';
import VentasPeriodoChart from './VentasPeriodoChart';
import TopProductosChart from './TopProductosChart';
import TopClientesChart from './TopClientesChart';

import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TodayIcon from '@material-ui/icons/Today';

import Permisos from '../../../Environment/Permisos.json';
import { PeriodoContext } from '../../../context/PeriodoContext';
import { EstadisticasContext } from '../../../context/EstadisticasContext';
import { ComponentIniciarPeriodo } from '../../../Environment/utileria';
import { formatCurrency, formatCurrencySimple } from '../../../Environment/utileria';
import DashboardProvider from '../../../context/DashboardContext';
import { DashboardContext } from '../../../context/DashboardContext';
import Swal from 'sweetalert2';

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
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    fontWeight: 600
  },
  ventasCard: {
    height: '100%',
    borderLeft: `4px solid ${colors.indigo[600]}`
  },
  ventasCardContent: {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  },
  formasPagoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0'
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

const DashboardContent = () => {
  const classes = useStyles();
  const { periodo, cerrarPeriodo, periodoActivo } = useContext(PeriodoContext);
  const { setIsReload, reporte } = useContext(EstadisticasContext);
  const { periodoActivo: pa, totalRetiros, obtenerRetirosBD } = useContext(PeriodoContext);

  const {
    resumen,
    ventasPeriodo,
    topProductos,
    topClientes,
    cargarResumen,
    cargarVentasPeriodo,
    cargarTopProductos,
    cargarTopClientes
  } = useContext(DashboardContext);

  const [fechaDesde, setFechaDesde] = useState(
    moment().startOf('month').format('YYYY-MM-DD')
  );
  const [fechaHasta, setFechaHasta] = useState(moment().format('YYYY-MM-DD'));
  const [tipoPeriodo, setTipoPeriodo] = useState('diario');

  useEffect(() => {
    if (periodoActivo) {
      cargarResumen();
      cargarVentasPeriodo(tipoPeriodo, fechaDesde, fechaHasta);
      cargarTopProductos(fechaDesde, fechaHasta);
      cargarTopClientes(fechaDesde, fechaHasta);
      obtenerRetirosBD();
    }
  }, [periodoActivo]);

  const actualizarDashboard = () => {
    cargarResumen();
    cargarVentasPeriodo(tipoPeriodo, fechaDesde, fechaHasta);
    cargarTopProductos(fechaDesde, fechaHasta);
    cargarTopClientes(fechaDesde, fechaHasta);
  };

  const cerrarPeriodoVentas = async () => {
    Swal.fire({
      title: 'Finalizar el día',
      showDenyButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: 'Si, Finalizar el periodo',
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await cerrarPeriodo(periodo);
        console.log(response);
        setIsReload(true);
        Swal.fire('Periodo Cerrado!', '', 'success');
      }
    });
  };

  const validarFormaPago = (fp) => {
    if (fp?.label !== undefined) return { label: fp.label, total: fp.total };
    return null;
  };

  const obtenerEfectivo = (data) => {
    const item = data.find((i) => i.label === 'Efectivo');
    return item ? item.total : 0;
  };

  const efectivoEntregar = () => {
    if (!pa) return 0;
    const efectivo = obtenerEfectivo(reporte.formasPago);
    const caja = periodo.fondo_asignado ?? 0;
    const retiros = totalRetiros ?? 0;
    if (isNaN(efectivo) || isNaN(caja) || isNaN(retiros)) return 0;
    return efectivo + caja - retiros;
  };

  if (!periodoActivo)
    return <ComponentIniciarPeriodo></ComponentIniciarPeriodo>;

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        {/* ===== HEADER ===== */}
        <Card className={classes.headerCard}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
              <Box display="flex" alignItems="center">
                <TodayIcon style={{ marginRight: 12, fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" style={{ color: '#fff' }}>
                    Dashboard - Periodo Activo
                  </Typography>
                  <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Apertura: {moment(periodo.fecha_apertura).format('DD/MM/YYYY')}
                  </Typography>
                </Box>
              </Box>
              {periodoActivo &&
                Permisos[localStorage.getItem('tipo_usuario')]['finalizar-periodo'] && (
                  <Button
                    onClick={cerrarPeriodoVentas}
                    variant="contained"
                    style={{
                      backgroundColor: '#fff',
                      color: '#1a237e',
                      fontWeight: 600
                    }}
                  >
                    Finalizar Día
                  </Button>
                )}
            </Box>
          </CardContent>
        </Card>

        {/* ===== SUMMARY CARDS ===== */}
        <Grid container spacing={2}>
          <Grid item lg={3} sm={6} xs={12}>
            <SummaryCard
              titulo="FACTURAS DEL PERIODO"
              valor={resumen?.ventas?.total_facturas || reporte.numeroFacturas}
              subtitulo="facturas emitidas"
              icon={<ReceiptIcon />}
              avatarColor={colors.blue[600]}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <SummaryCard
              titulo="TOTAL CLIENTES"
              valor={reporte.clientes}
              subtitulo="clientes registrados"
              icon={<PeopleIcon />}
              avatarColor={colors.green[600]}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <SummaryCard
              titulo="CRÉDITOS PENDIENTES"
              valor={reporte.numeroCreditos + ' crédito/s'}
              icon={<InsertChartIcon />}
              avatarColor={colors.orange[600]}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <SummaryCard
              titulo="VENTAS DEL DÍA"
              valor={formatCurrency(reporte.totalVentas)}
              icon={<AttachMoneyIcon />}
              avatarColor={colors.indigo[600]}
            />
          </Grid>
        </Grid>

        {/* ===== VENTAS DETALLE + CAJA ===== */}
        <Grid container spacing={2} style={{ marginTop: 8 }}>
          <Grid item lg={6} md={6} xs={12}>
            <Card className={classes.ventasCard}>
              <CardContent className={classes.ventasCardContent}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                  Desglose por Forma de Pago
                </Typography>
                <Divider style={{ marginBottom: 8 }} />
                {reporte.formasPago.map((fp, i) => {
                  const parsed = validarFormaPago(fp);
                  if (!parsed) return null;
                  return (
                    <div className={classes.formasPagoItem} key={i}>
                      <Typography variant="body2" color="textSecondary">
                        {parsed.label}
                      </Typography>
                      <Typography variant="body2" style={{ fontWeight: 500 }}>
                        $ {formatCurrencySimple(parsed.total)}
                      </Typography>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Card className={classes.ventasCard}>
              <CardContent className={classes.ventasCardContent}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                  Resumen de Caja
                </Typography>
                <Divider style={{ marginBottom: 8 }} />
                <div className={classes.formasPagoItem}>
                  <Box display="flex" alignItems="center">
                    <AccountBalanceIcon
                      style={{ fontSize: 18, marginRight: 6, color: colors.blue[700] }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Fondo de Caja
                    </Typography>
                  </Box>
                  <Typography variant="body2" style={{ fontWeight: 500, color: colors.blue[700] }}>
                    {formatCurrency(periodo.fondo_asignado)}
                  </Typography>
                </div>
                <div className={classes.formasPagoItem}>
                  <Box display="flex" alignItems="center">
                    <ArrowBackIcon
                      style={{ fontSize: 18, marginRight: 6, color: colors.orange[700] }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Gastos / Retiros
                    </Typography>
                  </Box>
                  <Typography variant="body2" style={{ fontWeight: 500, color: colors.orange[700] }}>
                    {pa ? formatCurrency(totalRetiros || 0) : formatCurrency(0)}
                  </Typography>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div className={classes.formasPagoItem}>
                  <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                    Efectivo a Entregar
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 700, color: colors.green[700] }}
                  >
                    {formatCurrency(efectivoEntregar())}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ===== FILTRO + GRÁFICAS ===== */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Análisis de Ventas
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DashboardDateFilter
              fechaDesde={fechaDesde}
              setFechaDesde={setFechaDesde}
              fechaHasta={fechaHasta}
              setFechaHasta={setFechaHasta}
              tipoPeriodo={tipoPeriodo}
              setTipoPeriodo={setTipoPeriodo}
              onActualizar={actualizarDashboard}
            />
          </Grid>
          <Grid item lg={8} md={12} xs={12}>
            <VentasPeriodoChart ventasPeriodo={ventasPeriodo} />
          </Grid>
          <Grid item lg={4} md={12} xs={12}>
            <TopProductosChart topProductos={topProductos} />
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            <TopClientesChart topClientes={topClientes} />
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
