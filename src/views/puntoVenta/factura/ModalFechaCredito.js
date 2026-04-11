import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  colors
} from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';

const defaultFecha = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
};

const hoyISO = () => new Date().toISOString().split('T')[0];

export default function ModalFechaCredito({ open, onConfirmar, onCancelar }) {
  const [fecha, setFecha] = useState(defaultFecha());

  const handleConfirmar = () => {
    onConfirmar(fecha);
    setFecha(defaultFecha());
  };

  const handleCancelar = () => {
    onCancelar();
    setFecha(defaultFecha());
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth disableBackdropClick disableEscapeKeyDown>
      <DialogTitle disableTypography>
        <Box display="flex" alignItems="center" style={{ gap: 10 }}>
          <EventIcon style={{ color: colors.indigo[600] }} />
          <Typography variant="h6" style={{ fontWeight: 700 }}>
            Fecha límite de pago
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          style={{
            backgroundColor: '#fff8e1',
            border: '1px solid #ffe082',
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: 16
          }}
        >
          <Typography variant="body2" style={{ color: '#5d4037' }}>
            Debe establecer una fecha máxima de pago para este crédito.
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          Fecha máxima de pago <span style={{ color: colors.red[600] }}>*</span>
        </Typography>
        <TextField
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          inputProps={{ min: hoyISO() }}
          variant="outlined"
          size="small"
          fullWidth
        />
      </DialogContent>

      <DialogActions style={{ padding: '12px 20px', gap: 8 }}>
        <Button
          onClick={handleCancelar}
          variant="outlined"
          size="small"
          style={{ textTransform: 'none', color: colors.grey[700] }}
        >
          Cancelar crédito
        </Button>
        <Button
          onClick={handleConfirmar}
          variant="contained"
          size="small"
          color="primary"
          style={{ textTransform: 'none', fontWeight: 600 }}
          disabled={!fecha}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
