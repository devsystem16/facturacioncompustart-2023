import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, Typography, Divider, colors } from '@material-ui/core';

import { IngresoContext } from '../../context/IngresoContext';
import { EstadisticasContext } from '../../context/EstadisticasContext';

export default function ModalAbonoIngreso() {
  const {
    isOpenModalIngreso,
    SetIsOpenModalIngreso,
    guardarAbono,
    isLoading,
    setIsLoading,
    datosImpresion
  } = useContext(IngresoContext);
  const { setIsReload } = useContext(EstadisticasContext);

  const [abono, setAbono] = useState(0);

  const handleClose = () => {
    SetIsOpenModalIngreso(false);
  };

  const guardarAbonoIngreso = async () => {
    setIsLoading(true);
    const response = await guardarAbono(abono);

    setIsLoading(false);
    if (response.codigo !== 200) {
      return;
    }

    SetIsOpenModalIngreso(false);
    setIsReload(true);
  };

  const orden = datosImpresion?.orden;

  return (
    <div>
      <Dialog
        open={isOpenModalIngreso}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Agregar Abono</DialogTitle>
        <DialogContent>
          {/* Resumen de la orden */}
          {orden && (
            <Box
              mb={2}
              p={2}
              style={{
                backgroundColor: '#f8f9fc',
                borderRadius: 8,
                border: '1px solid #e8e8e8'
              }}
            >
              <Typography
                variant="caption"
                style={{ fontWeight: 600, color: colors.grey[500] }}
              >
                RESUMEN ORDEN #{orden.id}
              </Typography>
              <Box
                mt={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" style={{ color: colors.grey[600] }}>
                  Total
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontWeight: 700, color: colors.grey[800] }}
                >
                  $ {parseFloat(orden.total || 0).toFixed(2)}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" style={{ color: colors.grey[600] }}>
                  Abonado
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontWeight: 700, color: colors.green[700] }}
                >
                  $ {parseFloat(orden.abono || 0).toFixed(2)}
                </Typography>
              </Box>
              <Divider style={{ margin: '6px 0' }} />
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: 600, color: colors.red[700] }}
                >
                  Saldo pendiente
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontWeight: 700, color: colors.red[700] }}
                >
                  $ {parseFloat(orden.saldo || 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}

          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => setAbono(e.target.value)}
            label="Monto del abono"
            type="number"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={guardarAbonoIngreso}
            color="primary"
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
        {isLoading ? <LinearProgress /> : null}
      </Dialog>
    </div>
  );
}
