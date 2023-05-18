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
export default function ModalAbonoIngreso() {
  const {
    isOpenModalIngreso,
    SetIsOpenModalIngreso,
    guardarAbono,
    isLoading,
    setIsLoading
  } = useContext(IngresoContext);
  const { setIsReload } = useContext(EstadisticasContext);

  const [abono, setAbono] = useState(0);
  // const handleClickOpen = () => {
  //   SetIsOpenModalIngreso(true);
  // };

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

  return (
    <div>
      <Dialog
        open={isOpenModalIngreso}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Agregar Abono</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => setAbono(e.target.value)}
            label="$ 0.00"
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={guardarAbonoIngreso} color="primary">
            Guardar
          </Button>
        </DialogActions>
        {isLoading ? <LinearProgress /> : null}
      </Dialog>
    </div>
  );
}
