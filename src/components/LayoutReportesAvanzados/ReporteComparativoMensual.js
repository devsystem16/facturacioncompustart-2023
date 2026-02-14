import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles,
  useTheme,
  colors
} from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import ExportButtons from './ExportButtons';
import { ReportesAvanzadosContext } from '../../context/ReportesAvanzadosContext';

const useStyles = makeStyles((theme) => ({
  input: {
    marginRight: theme.spacing(2),
    width: 100
  }
}));

const MESES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic'
];

const COLORES_DATASET = [
  colors.indigo[500],
  colors.green[500],
  colors.orange[500],
  colors.red[500],
  colors.blue[500]
];

const ReporteComparativoMensual = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { comparativoMensual, isLoading, cargarComparativoMensual } = useContext(
    ReportesAvanzadosContext
  );

  const currentYear = new Date().getFullYear();
  const [anioDesde, setAnioDesde] = useState(currentYear);
  const [anioHasta, setAnioHasta] = useState('');

  const handleBuscar = () => {
    cargarComparativoMensual(
      parseInt(anioDesde),
      anioHasta ? parseInt(anioHasta) : null
    );
  };

  const generarDatasets = () => {
    if (!comparativoMensual || !Array.isArray(comparativoMensual)) return { datasets: [], labels: MESES };

    const anios = [...new Set(comparativoMensual.map((d) => d.anio))].sort();

    const datasets = anios.map((anio, index) => {
      const dataPorMes = new Array(12).fill(0);
      comparativoMensual.forEach((d) => {
        if (d.anio === anio) {
          dataPorMes[d.mes - 1] = d.total_ventas;
        }
      });

      return {
        backgroundColor: COLORES_DATASET[index % COLORES_DATASET.length],
        data: dataPorMes,
        label: String(anio)
      };
    });

    return { datasets, labels: MESES };
  };

  const chartData = generarDatasets();

  const options = {
    animation: false,
    layout: { padding: 0 },
    legend: { display: true },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
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
          label="Año"
          type="number"
          value={anioDesde}
          onChange={(e) => setAnioDesde(e.target.value)}
          className={classes.input}
          size="small"
        />
        <TextField
          label="Año hasta (opc.)"
          type="number"
          value={anioHasta}
          onChange={(e) => setAnioHasta(e.target.value)}
          className={classes.input}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleBuscar}
          disabled={isLoading}
        >
          Generar
        </Button>
      </Box>

      {comparativoMensual && (
        <>
          <Card>
            <CardHeader title="Comparativo Mensual" />
            <Divider />
            <CardContent>
              <Box height={400} position="relative">
                <Bar data={chartData} options={options} />
              </Box>
            </CardContent>
          </Card>

          <ExportButtons
            tipoReporte="comparativo_mensual"
            fechaDesde={String(anioDesde)}
            fechaHasta={anioHasta ? String(anioHasta) : String(anioDesde)}
          />
        </>
      )}
    </div>
  );
};

export default ReporteComparativoMensual;
