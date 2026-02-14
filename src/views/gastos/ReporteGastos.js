import React, { useState, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Button,
  Typography,
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';
import moment from 'moment';
import { formatCurrency } from '../../Environment/utileria';
import { GastosContext } from '../../context/GastosContext';

const useStyles = makeStyles((theme) => ({
  input: {
    marginRight: theme.spacing(2)
  }
}));

const COLORES = [
  colors.indigo[500],
  colors.red[500],
  colors.orange[500],
  colors.green[500],
  colors.blue[500],
  colors.purple[500],
  colors.teal[500],
  colors.pink[500],
  colors.amber[500],
  colors.cyan[500]
];

const ReporteGastos = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { gastosPorCategoria, balanceCaja, cargarGastosPorCategoria, cargarBalanceCaja } =
    useContext(GastosContext);

  const [fechaDesde, setFechaDesde] = useState(
    moment().startOf('month').format('YYYY-MM-DD')
  );
  const [fechaHasta, setFechaHasta] = useState(moment().format('YYYY-MM-DD'));

  const buscar = async () => {
    await cargarGastosPorCategoria(fechaDesde, fechaHasta);
    await cargarBalanceCaja(fechaDesde, fechaHasta);
  };

  const chartData = {
    datasets: [
      {
        data: gastosPorCategoria?.categorias?.map((c) => c.total_monto) || [],
        backgroundColor:
          gastosPorCategoria?.categorias?.map(
            (c, i) => c.color || COLORES[i % COLORES.length]
          ) || [],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: gastosPorCategoria?.categorias?.map((c) => c.nombre) || []
  };

  const chartOptions = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <div>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Desde"
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          InputLabelProps={{ shrink: true }}
          className={classes.input}
          size="small"
        />
        <TextField
          label="Hasta"
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          InputLabelProps={{ shrink: true }}
          className={classes.input}
          size="small"
        />
        <Button variant="contained" color="primary" onClick={buscar}>
          Generar
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Gastos por Categoría" />
            <Divider />
            <CardContent>
              {gastosPorCategoria?.categorias?.length > 0 ? (
                <>
                  <Box height={300} position="relative">
                    <Doughnut data={chartData} options={chartOptions} />
                  </Box>
                  <Box display="flex" justifyContent="center" flexWrap="wrap" mt={2}>
                    {gastosPorCategoria.categorias.map((cat, i) => (
                      <Box key={cat.id} p={1} textAlign="center">
                        <Typography color="textPrimary" variant="body2">
                          {cat.nombre}
                        </Typography>
                        <Typography
                          style={{ color: cat.color || COLORES[i % COLORES.length] }}
                          variant="h6"
                        >
                          {formatCurrency(cat.total_monto)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Divider style={{ marginTop: 16 }} />
                  <Box mt={2} textAlign="center">
                    <Typography variant="h5">
                      Total: {formatCurrency(gastosPorCategoria.total)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography align="center" color="textSecondary">
                  Presione "Generar" para ver los datos
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Balance de Caja" />
            <Divider />
            <CardContent>
              {balanceCaja ? (
                <div>
                  <Box mb={2}>
                    <Typography variant="h6" color="textSecondary">
                      Ingresos
                    </Typography>
                    <Typography variant="body1">
                      Facturas: {formatCurrency(balanceCaja.ingresos?.facturas || 0)}
                    </Typography>
                    <Typography variant="body1">
                      Ordenes: {formatCurrency(balanceCaja.ingresos?.ordenes || 0)}
                    </Typography>
                    <Typography variant="body1">
                      Créditos: {formatCurrency(balanceCaja.ingresos?.creditos || 0)}
                    </Typography>
                    <Typography variant="h6" style={{ color: colors.green[600] }}>
                      Total Ingresos: {formatCurrency(balanceCaja.ingresos?.total || 0)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box mt={2} mb={2}>
                    <Typography variant="h6" color="textSecondary">
                      Egresos
                    </Typography>
                    <Typography variant="body1">
                      Gastos: {formatCurrency(balanceCaja.egresos?.gastos || 0)}
                    </Typography>
                    <Typography variant="body1">
                      Retiros: {formatCurrency(balanceCaja.egresos?.retiros || 0)}
                    </Typography>
                    <Typography variant="h6" style={{ color: colors.red[600] }}>
                      Total Egresos: {formatCurrency(balanceCaja.egresos?.total || 0)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box mt={2} textAlign="center">
                    <Typography variant="h4" style={{
                      color: balanceCaja.balance >= 0 ? colors.green[600] : colors.red[600]
                    }}>
                      Balance: {formatCurrency(balanceCaja.balance || 0)}
                    </Typography>
                  </Box>
                </div>
              ) : (
                <Typography align="center" color="textSecondary">
                  Presione "Generar" para ver el balance
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReporteGastos;
