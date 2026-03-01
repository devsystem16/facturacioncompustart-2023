import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import { KardexContext } from '../../context/KardexContext';
import { LoginContext } from '../../context/LoginContext';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1)
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap'
  }
}));

const FiltrosKardex = () => {
  const classes = useStyles();
  const {
    filtros,
    setFiltros,
    bodegas,
    obtenerMovimientos,
    obtenerBodegas,
    exportarExcel,
    setModalAjuste,
    setModalEntrada,
    setModalTransferencia
  } = useContext(KardexContext);
  const { tienePermiso } = useContext(LoginContext);

  useEffect(() => {
    obtenerBodegas();
    obtenerMovimientos();
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = () => {
    obtenerMovimientos(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleBuscar();
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Fecha Inicio"
              name="fecha_inicio"
              type="date"
              value={filtros.fecha_inicio}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Fecha Fin"
              name="fecha_fin"
              type="date"
              value={filtros.fecha_fin}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Ver"
              name="tipo"
              value={filtros.tipo}
              onChange={handleChange}
              size="small"
              variant="outlined"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="entradas">Entradas</MenuItem>
              <MenuItem value="salidas">Salidas</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Bodega"
              name="bodega_id"
              value={filtros.bodega_id}
              onChange={handleChange}
              size="small"
              variant="outlined"
            >
              <MenuItem value="">Todas</MenuItem>
              {bodegas.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Buscar"
              name="search"
              value={filtros.search}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              size="small"
              variant="outlined"
              placeholder="Codigo, producto..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <div className={classes.actionButtons}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBuscar}
                size="small"
              >
                Buscar
              </Button>
              {tienePermiso('kardex.exportar-excel') && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={exportarExcel}
                  size="small"
                >
                  Excel
                </Button>
              )}
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: 8 }}>
          {tienePermiso('kardex.ajuste') && (
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setModalAjuste(true)}
              >
                Ajuste
              </Button>
            </Grid>
          )}
          {tienePermiso('kardex.entrada') && (
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setModalEntrada(true)}
              >
                Entrada
              </Button>
            </Grid>
          )}
          {tienePermiso('kardex.transferencia') && (
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setModalTransferencia(true)}
              >
                Transferencia
              </Button>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FiltrosKardex;
