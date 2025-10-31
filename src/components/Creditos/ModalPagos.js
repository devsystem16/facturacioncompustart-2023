import React, { useState , useContext, useEffect} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactToPrint from 'react-to-print';
import alertify from 'alertifyjs';
import './StyleTablaAbonos.css';
import SelectJS from '../../components/SelectJS';
import { CreditoContext } from '../../context/CreditoContext';
const formatCurrency = (number) => {
  if (isNaN(number) || number === null) return '$ 0.00';
  return `$ ${Number(number).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export default function ModalPagos({ open, setOpen, credito  }) {
  const handleClose = () => setOpen(false);
  const componentRef = React.useRef();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <center style={{ cursor: 'pointer', marginTop: '10px' }}>
        <ReactToPrint
          trigger={() => (
            <PrintIcon
              style={{ cursor: 'pointer', fontSize: '28px', color: '#1976d2' }}
              titleAccess="Imprimir"
            />
          )}
          content={() => componentRef.current}
        />
      </center>

      <div ref={componentRef}>
        <DialogTitle id="alert-dialog-title">
          <center>
            <h3>Detalle de pagos realizados por el cliente</h3>
          </center>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <CreditosTable setAbrirModalAbono={setOpen}  credito={credito} />
          </DialogContentText>
        </DialogContent>
      </div>

      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const CreditosTable = ({ credito , setAbrirModalAbono  }) => {
  const [pagos, setPagos] = useState(credito?.pagos || []);
  const [editIndex, setEditIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [formaPagoId, setFormaPagoId] = useState(1);
  const {   actualizarFormaPagoDetalleCredito  , setRecargarListaCreditos, recargarListaCreditos } =  useContext(CreditoContext);



  const handleEditar = (index, pago) => {
    setEditIndex(index);
    setEditedData({ ...pago });
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async (index) => {
    const regexMonto = /^\d+(\.\d{1,2})?$/;
    if (!regexMonto.test(editedData.abono)) {
      alertify.error('Por favor ingrese un valor de abono válido (ej: 1200.50)');
      return;
    }

    if (!editedData.forma_pago) {
      alertify.error('Debe seleccionar una forma de pago.');
      return;
    }

    setLoading(true);
 
      const nuevosPagos = [...pagos];
      nuevosPagos[index] = { ...editedData };
     
      const data = await actualizarFormaPagoDetalleCredito(nuevosPagos[index].id, formaPagoId); 
 

 
        // setPagos(nuevosPagos);
      setEditIndex(null);
      setLoading(false);
      alertify.success('Pago actualizado correctamente');
 setAbrirModalAbono(false);
     
 
  };
 
  const totalAbonos = pagos.reduce((sum, pago) => sum + Number(pago.abono), 0);


  useEffect(() => {
    
  }, [recargarListaCreditos]);
  return (
    <div className="creditos-table">
      <div>
        <strong>Cliente:</strong> {credito?.cliente}
      </div>
      <div>
        <strong>Saldo:</strong> {formatCurrency(credito?.saldo)}
      </div>
      <div>
        <strong>Total:</strong> {formatCurrency(credito?.total)}
      </div>

      <table className="creditos-table">
        <thead>
          <tr>
            <th className="fecha-abono">Fecha</th>
            <th>Valor Abono</th>
            <th>Forma de Pago</th>
          </tr>
        </thead>
     <tbody>
  {pagos.map((pago, index) => (
    <tr key={pago.id}>
      <td>{pago.fecha}</td>
      <td>{formatCurrency(pago.abono)}</td>

      <td className="forma-pago-cell">
        {editIndex === index ? (
          <div className="forma-pago-wrapper">
            <SelectJS
              path_api="/api/forma-pagos"
              value={formaPagoId}
              setValue={setFormaPagoId}
              title=""
              margenes={0}
              defaultValue={pago.forma_pago_id}
            />
            <IconButton
              onClick={() => handleGuardar(index)}
              title="Guardar"
              disabled={loading}
              className="save-icon"
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon style={{ color: 'green' }} fontSize="small" />
              )}
            </IconButton>
          </div>
        ) : (
          <div className="forma-pago-wrapper">
            <span>{pago.forma_pago}</span>
            <IconButton
              className="edit-icon"
              onClick={() => handleEditar(index, pago)}
              title="Editar"
              size="small"
            >
              <EditIcon fontSize="small" style={{ color: '#f57c00' }} />
            </IconButton>
          </div>
        )}
      </td>
    </tr>
  ))}

  <tr>
    <td className="centered-right">
      <strong>TOTAL ABONADO</strong>
    </td>
    <td className="centered">
      <strong>{formatCurrency(totalAbonos)}</strong>
    </td>
    <td></td>
  </tr>
</tbody>

      </table>

      <center style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
        Grupocompustar
      </center>
    </div>
  );
};
