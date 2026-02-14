import React from 'react';
import clsx from 'clsx';
import { HorizontalBar } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const TopProductosChart = ({ className, topProductos, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: colors.blue[500],
        data: topProductos.map((p) => p.total_cantidad),
        label: 'Cantidad vendida'
      }
    ],
    labels: topProductos.map((p) => p.nombre)
  };

  const options = {
    animation: false,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true
          },
          gridLines: {
            borderDash: [2],
            color: theme.palette.divider,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
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
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Top 10 Productos" />
      <Divider />
      <CardContent>
        <Box height={400} position="relative">
          <HorizontalBar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopProductosChart;
