import React, { useContext } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { ContabilidadContext } from '../../context/ContabilidadContext';
import { LoginContext } from '../../context/LoginContext';

const FiltrosAsientos = ({ onNuevo }) => {
  const { filtrosAsientos, setFiltrosAsientos, obtenerAsientos } = useContext(ContabilidadContext);
  const { tienePermiso } = useContext(LoginContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltrosAsientos((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuscar = () => {
    obtenerAsientos(1);
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={2}>
          <TextField
            label="Desde"
            type="date"
            name="fecha_desde"
            value={filtrosAsientos.fecha_desde}
            onChange={handleChange}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Hasta"
            type="date"
            name="fecha_hasta"
            value={filtrosAsientos.fecha_hasta}
            onChange={handleChange}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Estado</InputLabel>
            <Select name="estado" value={filtrosAsientos.estado} onChange={handleChange}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="borrador">Borrador</MenuItem>
              <MenuItem value="contabilizado">Contabilizado</MenuItem>
              <MenuItem value="anulado">Anulado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select name="tipo" value={filtrosAsientos.tipo} onChange={handleChange}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="venta">Venta</MenuItem>
              <MenuItem value="credito">Crédito</MenuItem>
              <MenuItem value="abono_credito">Abono Crédito</MenuItem>
              <MenuItem value="gasto">Gasto</MenuItem>
              <MenuItem value="retiro">Retiro</MenuItem>
              <MenuItem value="anulacion">Anulación</MenuItem>
              <MenuItem value="ajuste">Ajuste</MenuItem>
              <MenuItem value="cierre">Cierre</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleBuscar}
            fullWidth
          >
            Buscar
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          {tienePermiso('contabilidad.asientos-crear') && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onNuevo}
              fullWidth
            >
              Nuevo Asiento
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FiltrosAsientos;
