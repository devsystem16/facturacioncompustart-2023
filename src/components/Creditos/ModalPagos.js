import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './StyleTablaAbonos.css';

const formatCurrency = (number) => {
  return `$ ${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export default function ModalPagos({ open, setOpen, credito }) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <center>{'Detalle de pagos realizados por el cliente'} </center>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <strong>Cliente: </strong> {credito.cliente}
            </div>
            <div>
              <strong>Pendiente: </strong> {formatCurrency(credito.saldo)}
            </div>
            <div>
              <strong>Total: </strong> {formatCurrency(credito.total)}
            </div>
            <CreditosTable credito={credito}></CreditosTable>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const CreditosTable = ({ credito }) => {
  const totalAbonos = credito.pagos.reduce((sum, pago) => sum + pago.abono, 0);

  return (
    <table className="creditos-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Valor Abono</th>
          <th>Forma de Pago</th>
        </tr>
      </thead>
      <tbody>
        {credito.pagos.map((pago) => (
          <tr key={pago.id}>
            <td>{pago.fecha}</td>
            <td className="centered">{formatCurrency(pago.abono)}</td>
            <td>{pago.forma_pago}</td>
          </tr>
        ))}

        <tr key="000221">
          <td className="centered-rigth">
            <strong> TOTAL </strong>
          </td>
          <td className="centered">
            <strong> {formatCurrency(totalAbonos)} </strong>
          </td>
          <td> </td>
        </tr>
      </tbody>
    </table>
  );
};
