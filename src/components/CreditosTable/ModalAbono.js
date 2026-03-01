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
import alertify from 'alertifyjs';
import Swal from 'sweetalert2';
import NumberFormatCustom from '../../components/ValidationCurrency/ValidationCurrency';
import ModalPagos from '../../components/Creditos/ModalPagos';

export default function ModalAbono() {
  const {
    isOpenModalAbono,
    SetIsOpenModalAbono,
    guardarAbono,
    currentCredito,
    isLoading
  } = useContext(CreditoContext);

  const [abono, setAbono] = useState(0);
  const [enabledBoton , setEnabledBoton] = useState(true);
  const [formaPagoId, setFormaPagoId] = useState(1);
  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [creditoCompletado, setCreditoCompletado] = useState(null);

  const handleClose = () => {
    SetIsOpenModalAbono(false);
  };

  const guardarAbonoCredito = async () => {
    if (abono <= 0) {
      alertify.error('El abono debe ser mayor a 0');
      return;
    }
    setEnabledBoton(false);
    const data = await guardarAbono(abono, formaPagoId);
    setEnabledBoton(true);

    if (data && data.saldo === 0) {
      const cambioMsg = data.cambio > 0
        ? `<br/>Cambio/Vuelto: <strong>$${Number(data.cambio).toFixed(2)}</strong>`
        : '';

      // Construir el credito actualizado con el nuevo pago incluido
      const hoy = new Date().toISOString().split('T')[0];
      const pagosActualizados = [
        ...(currentCredito.pagos || []),
        {
          id: Date.now(),
          fecha: hoy,
          abono: parseFloat(abono),
          comentario: 'Abono',
          forma_pago: '', // se muestra en la tabla
          forma_pago_id: formaPagoId
        }
      ];

      const creditoActualizado = {
        ...currentCredito,
        saldo: 0,
        abono: data.totalPagado,
        pagos: pagosActualizados
      };

      Swal.fire({
        title: 'Credito Pagado!',
        html: `Se han completado todos los pagos de este credito.${cambioMsg}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Imprimir Comprobante',
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#1976d2'
      }).then((result) => {
        if (result.isConfirmed) {
          setCreditoCompletado(creditoActualizado);
          setOpenModalPagos(true);
        }
      });
    }
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
            Descripcion: {currentCredito.detalle}
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
          <Button disabled={!enabledBoton} onClick={guardarAbonoCredito} color="primary">
            Guardar
          </Button>
        </DialogActions>
        {isLoading ? <LinearProgress /> : null}
      </Dialog>

      {creditoCompletado && (
        <ModalPagos
          open={openModalPagos}
          setOpen={setOpenModalPagos}
          credito={creditoCompletado}
        />
      )}
    </div>
  );
}
