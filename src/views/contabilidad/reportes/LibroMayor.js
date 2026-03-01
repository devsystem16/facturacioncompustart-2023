import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { ContabilidadContext } from '../../../context/ContabilidadContext';

const formatCurrency = (val) => {
  const num = parseFloat(val) || 0;
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const colorSaldo = (val) => {
  const num = parseFloat(val) || 0;
  if (num > 0) return { color: '#4caf50' };
  if (num < 0) return { color: '#f44336' };
  return {};
};

const LibroMayor = () => {
  const { obtenerLibroMayor, obtenerCuentasDetalle, cuentasDetalle, loadingReporte } =
    useContext(ContabilidadContext);

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [cuentaId, setCuentaId] = useState('');
  const [resumen, setResumen] = useState(null);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    obtenerCuentasDetalle();
  }, []);

  const handleBuscar = async () => {
    if (!fechaDesde || !fechaHasta) return;
    setDetalle(null);
    const params = { fecha_desde: fechaDesde, fecha_hasta: fechaHasta };
    if (cuentaId) params.cuenta_contable_id = cuentaId;
    const result = await obtenerLibroMayor(params);
    if (result) {
      if (result.movimientos) {
        setDetalle(result);
      } else {
        setResumen(result);
      }
    }
  };

  const handleVerDetalle = async (id) => {
    const params = { fecha_desde: fechaDesde, fecha_hasta: fechaHasta, cuenta_contable_id: id };
    const result = await obtenerLibroMayor(params);
    if (result) setDetalle(result);
  };

  const handleVolverResumen = () => {
    setDetalle(null);
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={2}>
          <TextField label="Desde" type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField label="Hasta" type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Cuenta (opcional)</InputLabel>
            <Select value={cuentaId} onChange={(e) => setCuentaId(e.target.value)}>
              <MenuItem value="">Todas</MenuItem>
              {cuentasDetalle.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.codigo} - {c.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={handleBuscar} disabled={loadingReporte} fullWidth>
            Consultar
          </Button>
        </Grid>
      </Grid>

      {loadingReporte && (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      )}

      {detalle && !loadingReporte && (
        <Box mt={2}>
          {resumen && (
            <Button startIcon={<ArrowBackIcon />} onClick={handleVolverResumen} size="small" style={{ marginBottom: 8 }}>
              Volver al resumen
            </Button>
          )}
          <Typography variant="h6">
            {detalle.cuenta?.codigo} - {detalle.cuenta?.nombre}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Saldo: <span style={colorSaldo(detalle.cuenta?.saldo)}>${formatCurrency(detalle.cuenta?.saldo)}</span>
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: 8 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Asiento N°</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="right">Debe</TableCell>
                  <TableCell align="right">Haber</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(detalle.movimientos || []).map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.numero}</TableCell>
                    <TableCell>{m.fecha}</TableCell>
                    <TableCell>{m.descripcion || m.asiento_descripcion}</TableCell>
                    <TableCell align="right">${formatCurrency(m.debe)}</TableCell>
                    <TableCell align="right">${formatCurrency(m.haber)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {resumen && !detalle && !loadingReporte && (
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Cuenta</TableCell>
                  <TableCell align="right">Debe</TableCell>
                  <TableCell align="right">Haber</TableCell>
                  <TableCell align="right">Saldo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(resumen.data || []).map((c) => (
                  <TableRow
                    key={c.cuenta_contable_id}
                    hover
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleVerDetalle(c.cuenta_contable_id)}
                  >
                    <TableCell>{c.codigo}</TableCell>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell align="right">${formatCurrency(c.total_debe)}</TableCell>
                    <TableCell align="right">${formatCurrency(c.total_haber)}</TableCell>
                    <TableCell align="right" style={colorSaldo(c.saldo)}>
                      ${formatCurrency(c.saldo)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default LibroMayor;
