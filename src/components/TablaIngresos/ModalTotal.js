import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import { IngresoContext } from '../../context/IngresoContext';
import { EstadisticasContext } from '../../context/EstadisticasContext';
export default function Modaltotal() {
  const {
    isOpenModalTotal,
    SetIsOpenModalTotal,
    actualizarTotal,
    isLoading,
    setIsLoading
  } = useContext(IngresoContext);
  const { setIsReload } = useContext(EstadisticasContext);

  const [total, setTotal] = useState(0);
  const handleClickOpen = () => {
    SetIsOpenModalTotal(true);
  };

  const handleClose = () => {
    SetIsOpenModalTotal(false);
  };
  const fn_actualizarTotal = async () => {
    setIsLoading(true);
    const response = await actualizarTotal(total);
    setIsLoading(false);
    if (response.codigo !== 200) {
      return;
    }

    SetIsOpenModalTotal(false);
    setIsReload(true);
  };

  return (
    <div>
      <Dialog
        open={isOpenModalTotal}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Actualizar Total</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Descripción: {currentCredito.detalle} */}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => setTotal(e.target.value)}
            label="$ 0.00"
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={fn_actualizarTotal} color="primary">
            Guardar
          </Button>
        </DialogActions>
        {isLoading ? <LinearProgress /> : null}
      </Dialog>
    </div>
  );
}
