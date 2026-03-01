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
  Collapse,
  IconButton,
  Grid,
  CircularProgress
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { ContabilidadContext } from '../../../context/ContabilidadContext';

const formatCurrency = (val) => {
  const num = parseFloat(val) || 0;
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const FilaAsiento = ({ asiento }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{asiento.numero}</TableCell>
        <TableCell>{asiento.fecha}</TableCell>
        <TableCell>{asiento.descripcion}</TableCell>
        <TableCell>{asiento.tipo}</TableCell>
        <TableCell align="right">${formatCurrency(asiento.total_debe)}</TableCell>
        <TableCell align="right">${formatCurrency(asiento.total_haber)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cuenta</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right">Debe</TableCell>
                    <TableCell align="right">Haber</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(asiento.detalles_con_cuenta || []).map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.cuenta_contable?.codigo} - {d.cuenta_contable?.nombre}</TableCell>
                      <TableCell>{d.descripcion}</TableCell>
                      <TableCell align="right">${formatCurrency(d.debe)}</TableCell>
                      <TableCell align="right">${formatCurrency(d.haber)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const LibroDiario = () => {
  const { obtenerLibroDiario, loadingReporte } = useContext(ContabilidadContext);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [data, setData] = useState(null);

  const handleBuscar = async () => {
    if (!fechaDesde || !fechaHasta) return;
    const result = await obtenerLibroDiario({ fecha_desde: fechaDesde, fecha_hasta: fechaHasta });
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
                  <TableCell />
                  <TableCell>N°</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Debe</TableCell>
                  <TableCell align="right">Haber</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.data || []).map((a) => (
                  <FilaAsiento key={a.id} asiento={a} />
                ))}
                {data.totales && (
                  <TableRow>
                    <TableCell colSpan={5} align="right"><Typography variant="subtitle2">TOTALES:</Typography></TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">${formatCurrency(data.totales.total_debe)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">${formatCurrency(data.totales.total_haber)}</Typography></TableCell>
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

export default LibroDiario;
