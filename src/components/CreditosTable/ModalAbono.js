import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { CreditoContext } from '../../context/CreditoContext';
import SelectJS from '../../components/SelectJS';

import NumberFormatCustom from '../../components/ValidationCurrency/ValidationCurrency';

export default function ModalAbono() {
  const {
    isOpenModalAbono,
    SetIsOpenModalAbono,
    guardarAbono,
    currentCredito,
    isLoading
  } = useContext(CreditoContext);

  const [abono, setAbono] = useState(0);

  const [formaPagoId, setFormaPagoId] = useState(null);
  // const handleClickOpen = () => {
  //   SetIsOpenModalAbono(true);
  // };

  const handleClose = () => {
    SetIsOpenModalAbono(false);
  };
  const guardarAbonoCredito = () => {
    guardarAbono(abono, formaPagoId);
  };

  return (
    <div>
      <Dialog
        open={isOpenModalAbono}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Agregar Abono</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Descripción: {currentCredito.detalle}
            <SelectJS
              path_api="/api/forma-pagos"
              value={formaPagoId}
              setValue={setFormaPagoId}
              title="Forma de Pago"
            >
              {' '}
            </SelectJS>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => setAbono(e.target.value)}
            label="$ 0.00"
            // type="number"
            fullWidth
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={guardarAbonoCredito} color="primary">
            Guardar
          </Button>
        </DialogActions>
        {isLoading ? <LinearProgress /> : null}
      </Dialog>
    </div>
  );
}
