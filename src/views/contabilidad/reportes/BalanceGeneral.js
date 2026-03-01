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

const SeccionBalance = ({ titulo, cuentas, total, colorTotal }) => (
  <Box mb={2}>
    <Typography variant="h6" gutterBottom>{titulo}</Typography>
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
          {(cuentas || []).map((c, i) => (
            <TableRow key={i}>
              <TableCell>{c.codigo}</TableCell>
              <TableCell>{c.nombre}</TableCell>
              <TableCell align="right" style={{ color: c.saldo >= 0 ? '#4caf50' : '#f44336' }}>
                ${formatCurrency(c.saldo)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} align="right">
              <Typography variant="subtitle2">Total {titulo}:</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" style={{ color: colorTotal }}>
                ${formatCurrency(total)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const BalanceGeneral = () => {
  const { obtenerBalanceGeneral, loadingReporte } = useContext(ContabilidadContext);
  const [fechaHasta, setFechaHasta] = useState('');
  const [data, setData] = useState(null);

  const handleBuscar = async () => {
    if (!fechaHasta) return;
    const result = await obtenerBalanceGeneral({ fecha_hasta: fechaHasta });
    setData(result);
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField label="Fecha de corte" type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
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
            Fecha de corte: {data.fecha_corte}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SeccionBalance titulo="Activos" cuentas={data.activos} total={data.totales?.activos} colorTotal="#4caf50" />
            </Grid>
            <Grid item xs={12} md={6}>
              <SeccionBalance titulo="Pasivos" cuentas={data.pasivos} total={data.totales?.pasivos} colorTotal="#f44336" />
              <SeccionBalance titulo="Patrimonio" cuentas={data.patrimonio} total={data.totales?.patrimonio} colorTotal="#2196f3" />
              <Box mt={1} p={2} style={{ backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <Typography variant="subtitle1">
                  Pasivos + Patrimonio: <strong>${formatCurrency(data.totales?.pasivos_patrimonio)}</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default BalanceGeneral;
