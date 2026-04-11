import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, Typography, Divider, colors } from '@material-ui/core';
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
  const [enabledBoton, setEnabledBoton] = useState(true);
  const [formaPagoId, setFormaPagoId] = useState('');
  const [formaPagoNombre, setFormaPagoNombre] = useState('');
  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [creditoCompletado, setCreditoCompletado] = useState(null);

  const totalCredito = parseFloat(currentCredito.total) || 0;
  const totalAbonado = parseFloat(currentCredito.abono) || 0;
  const saldoPendiente = parseFloat(currentCredito.saldo) || 0;
  const formaPagoSeleccionada = formaPagoId !== '' && formaPagoId !== null;
  const abonoNumerico = parseFloat(abono) || 0;
  const excedeSaldo = abonoNumerico > saldoPendiente;

  const handleClose = () => {
    setFormaPagoId('');
    setFormaPagoNombre('');
    setAbono(0);
    SetIsOpenModalAbono(false);
  };

  const guardarAbonoCredito = async () => {
    if (!formaPagoSeleccionada) {
      alertify.error('Debe seleccionar una forma de pago');
      return;
    }
    if (abonoNumerico <= 0) {
      alertify.error('El abono debe ser mayor a 0');
      return;
    }
    if (excedeSaldo) {
      alertify.error(
        `El abono no puede superar el saldo pendiente de $${saldoPendiente.toFixed(2)}`
      );
      return;
    }
    setEnabledBoton(false);
    const data = await guardarAbono(abono, formaPagoId);
    setEnabledBoton(true);

    if (data && data.saldo === 0) {
      const cambioMsg =
        data.cambio > 0
          ? `<br/>Cambio/Vuelto: <strong>$${Number(data.cambio).toFixed(2)}</strong>`
          : '';

      const hoy = new Date().toISOString().split('T')[0];
      const pagosActualizados = [
        ...(currentCredito.pagos || []),
        {
          id: Date.now(),
          fecha: hoy,
          abono: parseFloat(abono),
          comentario: 'Abono',
          forma_pago: formaPagoNombre,
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

  const porcentajePagado = totalCredito > 0 ? (totalAbonado / totalCredito) * 100 : 0;

  return (
    <div>
      <Dialog
        open={isOpenModalAbono}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          id="form-dialog-title"
          disableTypography
          style={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: '#fff',
            padding: '16px 24px'
          }}
        >
          <Typography variant="h6" style={{ fontWeight: 600, color: '#fff' }}>
            Agregar Abono
          </Typography>
          {currentCredito.detalle && (
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {currentCredito.detalle}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent style={{ padding: '20px 24px' }}>
          {/* Resumen del crédito */}
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
              style={{ fontWeight: 600, color: colors.grey[500], letterSpacing: 0.5 }}
            >
              RESUMEN DEL CREDITO
            </Typography>

            <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" style={{ color: colors.grey[600] }}>
                Total
              </Typography>
              <Typography variant="body2" style={{ fontWeight: 700, color: colors.grey[800] }}>
                ${totalCredito.toFixed(2)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" style={{ color: colors.grey[600] }}>
                Abonado
              </Typography>
              <Typography variant="body2" style={{ fontWeight: 700, color: colors.green[700] }}>
                ${totalAbonado.toFixed(2)}
              </Typography>
            </Box>

            <Divider style={{ margin: '8px 0' }} />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" style={{ fontWeight: 600, color: colors.red[700] }}>
                Saldo pendiente
              </Typography>
              <Typography
                variant="body1"
                style={{ fontWeight: 700, color: colors.red[700], fontSize: '1.1rem' }}
              >
                ${saldoPendiente.toFixed(2)}
              </Typography>
            </Box>

            {/* Barra de progreso */}
            <Box mt={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Typography variant="caption" style={{ color: colors.grey[500] }}>
                  Progreso de pago
                </Typography>
                <Typography
                  variant="caption"
                  style={{ fontWeight: 600, color: colors.grey[600] }}
                >
                  {porcentajePagado.toFixed(0)}%
                </Typography>
              </Box>
              <Box
                style={{
                  width: '100%',
                  height: 6,
                  backgroundColor: colors.grey[200],
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Box
                  style={{
                    width: `${Math.min(porcentajePagado, 100)}%`,
                    height: '100%',
                    backgroundColor:
                      porcentajePagado >= 75
                        ? colors.green[500]
                        : porcentajePagado >= 40
                        ? colors.orange[500]
                        : colors.red[400],
                    borderRadius: 3,
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Forma de pago */}
          <Box mb={1}>
            <SelectJS
              path_api="/api/forma-pagos"
              value={formaPagoId}
              setValue={setFormaPagoId}
              setValueLabel={setFormaPagoNombre}
              title="Forma de Pago"
              defaultValue=""
              placeholderOption="-SELECCIONE FORMA PAGO-"
            />
          </Box>

          {/* Monto del abono */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => setAbono(e.target.value)}
            label="Monto del abono"
            placeholder="0.00"
            fullWidth
            variant="outlined"
            disabled={!formaPagoSeleccionada}
            error={excedeSaldo}
            helperText={
              !formaPagoSeleccionada
                ? 'Seleccione una forma de pago primero'
                : excedeSaldo
                ? `El monto excede el saldo pendiente de $${saldoPendiente.toFixed(2)}`
                : ''
            }
            InputProps={{
              inputComponent: NumberFormatCustom,
              style: { fontSize: '1.1rem' }
            }}
          />
        </DialogContent>

        <DialogActions style={{ padding: '12px 24px 16px' }}>
          <Button onClick={handleClose} style={{ color: colors.grey[600] }}>
            Cancelar
          </Button>
          <Button
            disabled={!enabledBoton || !formaPagoSeleccionada || abonoNumerico <= 0 || excedeSaldo}
            onClick={guardarAbonoCredito}
            color="primary"
            variant="contained"
            disableElevation
            style={{ minWidth: 120 }}
          >
            Guardar Abono
          </Button>
        </DialogActions>

        {isLoading && <LinearProgress />}
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
