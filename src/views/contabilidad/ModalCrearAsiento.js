import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { ContabilidadContext } from '../../context/ContabilidadContext';

const lineaVacia = { cuenta_contable_id: '', descripcion: '', debe: '', haber: '' };

const ModalCrearAsiento = ({ open, onClose, asiento }) => {
  const { cuentasDetalle, crearAsiento, editarAsiento, obtenerAsientoDetalle } =
    useContext(ContabilidadContext);

  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [lineas, setLineas] = useState([{ ...lineaVacia }, { ...lineaVacia }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (asiento) {
        cargarAsiento(asiento.id);
      } else {
        const hoy = new Date().toISOString().split('T')[0];
        setFecha(hoy);
        setDescripcion('');
        setLineas([{ ...lineaVacia }, { ...lineaVacia }]);
      }
    }
  }, [open, asiento]);

  const cargarAsiento = async (id) => {
    setLoading(true);
    const data = await obtenerAsientoDetalle(id);
    if (data) {
      setFecha(data.fecha || '');
      setDescripcion(data.descripcion || '');
      const detalles = data.detalles_con_cuenta || [];
      setLineas(
        detalles.map((d) => ({
          cuenta_contable_id: d.cuenta_contable_id,
          descripcion: d.descripcion || '',
          debe: parseFloat(d.debe) || '',
          haber: parseFloat(d.haber) || ''
        }))
      );
    }
    setLoading(false);
  };

  const handleLineaChange = (index, field, value) => {
    const nuevas = [...lineas];
    nuevas[index] = { ...nuevas[index], [field]: value };
    setLineas(nuevas);
  };

  const agregarLinea = () => {
    setLineas([...lineas, { ...lineaVacia }]);
  };

  const eliminarLinea = (index) => {
    if (lineas.length <= 2) return;
    setLineas(lineas.filter((_, i) => i !== index));
  };

  const totalDebe = lineas.reduce((sum, l) => sum + (parseFloat(l.debe) || 0), 0);
  const totalHaber = lineas.reduce((sum, l) => sum + (parseFloat(l.haber) || 0), 0);
  const cuadrado = Math.abs(totalDebe - totalHaber) < 0.01 && totalDebe > 0;
  const lineasValidas = lineas.every(
    (l) => l.cuenta_contable_id && (parseFloat(l.debe) > 0 || parseFloat(l.haber) > 0)
  );

  const handleSubmit = async () => {
    const data = {
      fecha,
      descripcion,
      usuario_id: parseInt(localStorage.getItem('usuario_id')) || 1,
      lineas: lineas.map((l) => ({
        cuenta_contable_id: l.cuenta_contable_id,
        descripcion: l.descripcion,
        debe: parseFloat(l.debe) || 0,
        haber: parseFloat(l.haber) || 0
      }))
    };

    let ok;
    if (asiento) {
      ok = await editarAsiento(asiento.id, data);
    } else {
      ok = await crearAsiento(data);
    }
    if (ok) onClose();
  };

  const formatNum = (val) =>
    val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{asiento ? 'Editar Asiento Contable' : 'Nuevo Asiento Contable'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>

        <Box mt={2}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 200 }}>Cuenta</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="right" style={{ width: 120 }}>Debe</TableCell>
                  <TableCell align="right" style={{ width: 120 }}>Haber</TableCell>
                  <TableCell style={{ width: 50 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lineas.map((linea, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={linea.cuenta_contable_id}
                          onChange={(e) =>
                            handleLineaChange(index, 'cuenta_contable_id', e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Seleccione cuenta
                          </MenuItem>
                          {cuentasDetalle.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.codigo} - {c.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={linea.descripcion}
                        onChange={(e) =>
                          handleLineaChange(index, 'descripcion', e.target.value)
                        }
                        fullWidth
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={linea.debe}
                        onChange={(e) => handleLineaChange(index, 'debe', e.target.value)}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: '0.01' }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={linea.haber}
                        onChange={(e) => handleLineaChange(index, 'haber', e.target.value)}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: '0.01' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => eliminarLinea(index)}
                        disabled={lineas.length <= 2}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    <Typography variant="subtitle2">Totales:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="subtitle2"
                      style={{ color: cuadrado ? '#4caf50' : '#f44336' }}
                    >
                      ${formatNum(totalDebe)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="subtitle2"
                      style={{ color: cuadrado ? '#4caf50' : '#f44336' }}
                    >
                      ${formatNum(totalHaber)}
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {!cuadrado && totalDebe > 0 && (
            <Typography variant="caption" color="error" style={{ marginTop: 4 }}>
              El asiento no cuadra. Diferencia: ${formatNum(Math.abs(totalDebe - totalHaber))}
            </Typography>
          )}
        </Box>

        <Box mt={1}>
          <Button startIcon={<AddIcon />} onClick={agregarLinea} size="small">
            Agregar Línea
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!cuadrado || !lineasValidas || !fecha || !descripcion || loading}
        >
          {asiento ? 'Guardar' : 'Crear Asiento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCrearAsiento;
