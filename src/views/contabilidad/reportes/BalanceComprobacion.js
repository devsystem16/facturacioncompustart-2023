import React, { useState, useContext } from 'react';
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
  Grid,
  CircularProgress
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { ContabilidadContext } from '../../../context/ContabilidadContext';

const formatCurrency = (val) => {
  const num = parseFloat(val) || 0;
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const BalanceComprobacion = () => {
  const { obtenerBalanceComprobacion, loadingReporte } = useContext(ContabilidadContext);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [data, setData] = useState(null);

  const handleBuscar = async () => {
    if (!fechaDesde || !fechaHasta) return;
    const result = await obtenerBalanceComprobacion({ fecha_desde: fechaDesde, fecha_hasta: fechaHasta });
    setData(result);
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField label="Desde" type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="Hasta" type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
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

      {data && !loadingReporte && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Periodo: {data.periodo?.desde} al {data.periodo?.hasta}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Cuenta</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Sumas Debe</TableCell>
                  <TableCell align="right">Sumas Haber</TableCell>
                  <TableCell align="right">Saldo Debe</TableCell>
                  <TableCell align="right">Saldo Haber</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.data || []).map((c) => (
                  <TableRow key={c.cuenta_contable_id}>
                    <TableCell>{c.codigo}</TableCell>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{c.tipo}</TableCell>
                    <TableCell align="right">${formatCurrency(c.total_debe)}</TableCell>
                    <TableCell align="right">${formatCurrency(c.total_haber)}</TableCell>
                    <TableCell align="right" style={{ color: c.saldo_debe > 0 ? '#4caf50' : undefined }}>
                      ${formatCurrency(c.saldo_debe)}
                    </TableCell>
                    <TableCell align="right" style={{ color: c.saldo_haber > 0 ? '#4caf50' : undefined }}>
                      ${formatCurrency(c.saldo_haber)}
                    </TableCell>
                  </TableRow>
                ))}
                {data.totales && (
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle2">TOTALES:</Typography>
                    </TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">${formatCurrency(data.totales.total_debe)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">${formatCurrency(data.totales.total_haber)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">${formatCurrency(data.totales.saldo_debe)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">${formatCurrency(data.totales.saldo_haber)}</Typography></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default BalanceComprobacion;
