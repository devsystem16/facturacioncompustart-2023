import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PrintIcon from '@material-ui/icons/Print';

import ReactToPrint from 'react-to-print';
import './StyleTablaAbonos.css';

const formatCurrency = (number) => {
  if (number === undefined || number === null) return 0;
  return `$ ${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export default function ModalPagos({ open, setOpen, credito }) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const componentRef = React.useRef();
  const handlePrint = () => {
    if (componentRef.current) {
      componentRef.current.handlePrint();
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <center style={{ cursor: 'pointer' }}>
          <ReactToPrint
            trigger={() => (
              <PrintIcon onClick={handlePrint}>Imprimir</PrintIcon>
            )}
            content={() => componentRef.current}
          />
        </center>

        <div ref={componentRef}>
          <DialogTitle id="alert-dialog-title">
            {/* <center>{'Detalle de pagos realizados por el cliente'} </center> */}
            <center>
              <h3>Detalle de pagos realizados por el cliente</h3>{' '}
            </center>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <CreditosTable credito={credito}></CreditosTable>
            </DialogContentText>
          </DialogContent>
        </div>
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
  const totalAbonos = credito?.pagos.reduce((sum, pago) => sum + pago.abono, 0);

  return (
    <div className="creditos-table">
      <div>
        <strong>Cliente: </strong> {credito?.cliente}
      </div>
      <div>
        <strong>Saldo: </strong> {formatCurrency(credito?.saldo)}
      </div>
      <div>
        <strong>Total: </strong> {formatCurrency(credito?.total)}
      </div>

      <table className="creditos-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Valor Abono</th>
            <th>Forma de Pago</th>
          </tr>
        </thead>
        <tbody>
          {credito?.pagos.map((pago) => (
            <tr key={pago.id}>
              <td>{pago.fecha}</td>
              <td className="centered">{formatCurrency(pago.abono)}</td>
              <td>{pago.forma_pago}</td>
            </tr>
          ))}

          <tr key="000221">
            <td className="centered-rigth">
              <strong> TOTAL ABONADO </strong>
            </td>
            <td className="centered">
              <strong> {formatCurrency(totalAbonos)} </strong>
            </td>
            <td> </td>
          </tr>
        </tbody>
      </table>
      <center>Grupocompustar</center>
    </div>
  );
};
