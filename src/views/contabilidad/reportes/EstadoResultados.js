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

const EstadoResultados = () => {
  const { obtenerEstadoResultados, loadingReporte } = useContext(ContabilidadContext);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [data, setData] = useState(null);

  const handleBuscar = async () => {
    if (!fechaDesde || !fechaHasta) return;
    const result = await obtenerEstadoResultados({ fecha_desde: fechaDesde, fecha_hasta: fechaHasta });
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

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Ingresos</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Cuenta</TableCell>
                      <TableCell align="right">Saldo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data.ingresos || []).map((c, i) => (
                      <TableRow key={i}>
                        <TableCell>{c.codigo}</TableCell>
                        <TableCell>{c.nombre}</TableCell>
                        <TableCell align="right" style={{ color: '#4caf50' }}>
                          ${formatCurrency(c.saldo)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Typography variant="subtitle2">Total Ingresos:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" style={{ color: '#4caf50' }}>
                          ${formatCurrency(data.totales?.ingresos)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Gastos</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Cuenta</TableCell>
                      <TableCell align="right">Saldo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data.gastos || []).map((c, i) => (
                      <TableRow key={i}>
                        <TableCell>{c.codigo}</TableCell>
                        <TableCell>{c.nombre}</TableCell>
                        <TableCell align="right" style={{ color: '#f44336' }}>
                          ${formatCurrency(c.saldo)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Typography variant="subtitle2">Total Gastos:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" style={{ color: '#f44336' }}>
                          ${formatCurrency(data.totales?.gastos)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Box mt={2} p={2} style={{
            backgroundColor: data.totales?.utilidad_neta >= 0 ? '#e8f5e9' : '#ffebee',
            borderRadius: 4
          }}>
            <Typography variant="h5" align="center">
              Utilidad Neta:{' '}
              <strong style={{ color: data.totales?.utilidad_neta >= 0 ? '#4caf50' : '#f44336' }}>
                ${formatCurrency(data.totales?.utilidad_neta)}
              </strong>
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EstadoResultados;
