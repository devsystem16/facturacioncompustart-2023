import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  TextField,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    marginRight: theme.spacing(2)
  }
}));

const DashboardDateFilter = ({
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  tipoPeriodo,
  setTipoPeriodo,
  onActualizar
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" flexWrap="wrap">
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
          <ButtonGroup size="small" style={{ marginRight: 16 }}>
            <Button
              variant={tipoPeriodo === 'diario' ? 'contained' : 'outlined'}
              color={tipoPeriodo === 'diario' ? 'primary' : 'default'}
              onClick={() => setTipoPeriodo('diario')}
            >
              Diario
            </Button>
            <Button
              variant={tipoPeriodo === 'semanal' ? 'contained' : 'outlined'}
              color={tipoPeriodo === 'semanal' ? 'primary' : 'default'}
              onClick={() => setTipoPeriodo('semanal')}
            >
              Semanal
            </Button>
            <Button
              variant={tipoPeriodo === 'mensual' ? 'contained' : 'outlined'}
              color={tipoPeriodo === 'mensual' ? 'primary' : 'default'}
              onClick={() => setTipoPeriodo('mensual')}
            >
              Mensual
            </Button>
          </ButtonGroup>
          <Button variant="contained" color="primary" onClick={onActualizar}>
            Actualizar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardDateFilter;
