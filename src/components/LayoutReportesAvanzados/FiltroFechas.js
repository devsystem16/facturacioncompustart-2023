import React, { useState } from 'react';
import { Box, Button, TextField, makeStyles } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  input: {
    marginRight: theme.spacing(2)
  }
}));

const FiltroFechas = ({ onBuscar, isLoading }) => {
  const classes = useStyles();
  const [fechaDesde, setFechaDesde] = useState(
    moment().startOf('month').format('YYYY-MM-DD')
  );
  const [fechaHasta, setFechaHasta] = useState(moment().format('YYYY-MM-DD'));

  const handleBuscar = () => {
    onBuscar(fechaDesde, fechaHasta);
  };

  return (
    <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleBuscar}
        disabled={isLoading}
      >
        Generar
      </Button>
    </Box>
  );
};

export default FiltroFechas;
