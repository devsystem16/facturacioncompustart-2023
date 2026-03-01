import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  Grid,
  CircularProgress
} from '@material-ui/core';
import Swal from 'sweetalert2';
import { ContabilidadContext } from '../../context/ContabilidadContext';
import { LoginContext } from '../../context/LoginContext';

const ModalDetalleAsiento = ({ open, onClose, asientoId }) => {
  const { obtenerAsientoDetalle, contabilizarAsiento, anularAsiento } =
    useContext(ContabilidadContext);
  const { tienePermiso } = useContext(LoginContext);

  const [asiento, setAsiento] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && asientoId) {
      cargar();
    }
  }, [open, asientoId]);

  const cargar = async () => {
    setLoading(true);
    const data = await obtenerAsientoDetalle(asientoId);
    setAsiento(data);
    setLoading(false);
  };

  const handleContabilizar = () => {
    Swal.fire({
      title: 'Contabilizar',
      text: `¿Contabilizar el asiento #${asiento.numero}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, contabilizar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await contabilizarAsiento(asiento.id);
        onClose();
      }
    });
  };

  const handleAnular = () => {
    Swal.fire({
      title: 'Anular',
      text: `¿Anular el asiento #${asiento.numero}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await anularAsiento(asiento.id);
        onClose();
      }
    });
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const estadoChip = (estado) => {
    if (estado === 'contabilizado')
      return <Chip label="Contabilizado" size="small" style={{ backgroundColor: '#4caf50', color: '#fff' }} />;
    if (estado === 'anulado')
      return <Chip label="Anulado" size="small" style={{ backgroundColor: '#f44336', color: '#fff' }} />;
    return <Chip label="Borrador" size="small" />;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle del Asiento Contable</DialogTitle>
      <DialogContent>
        {loading || !asiento ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="caption" color="textSecondary">Número</Typography>
                <Typography variant="body1"><strong>{asiento.numero}</strong></Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="textSecondary">Fecha</Typography>
                <Typography variant="body1">{asiento.fecha}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="textSecondary">Tipo</Typography>
                <Typography variant="body1">{asiento.tipo}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="textSecondary">Estado</Typography>
                <Box mt={0.5}>{estadoChip(asiento.estado)}</Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">Descripción</Typography>
                <Typography variant="body1">{asiento.descripcion}</Typography>
              </Grid>
            </Grid>

            <Box mt={2}>
              <TableContainer component={Paper} variant="outlined">
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
                    {(asiento.detalles_con_cuenta || []).map((det) => (
                      <TableRow key={det.id}>
                        <TableCell>
                          {det.cuenta_contable?.codigo} - {det.cuenta_contable?.nombre}
                        </TableCell>
                        <TableCell>{det.descripcion}</TableCell>
                        <TableCell align="right">${formatCurrency(det.debe)}</TableCell>
                        <TableCell align="right">${formatCurrency(det.haber)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Typography variant="subtitle2">Totales:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">${formatCurrency(asiento.total_debe)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">${formatCurrency(asiento.total_haber)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {asiento && asiento.estado === 'borrador' && tienePermiso('contabilidad.asientos-contabilizar') && (
          <Button onClick={handleContabilizar} style={{ color: '#4caf50' }}>
            Contabilizar
          </Button>
        )}
        {asiento && asiento.estado !== 'anulado' && tienePermiso('contabilidad.asientos-anular') && (
          <Button onClick={handleAnular} style={{ color: '#f44336' }}>
            Anular
          </Button>
        )}
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDetalleAsiento;
