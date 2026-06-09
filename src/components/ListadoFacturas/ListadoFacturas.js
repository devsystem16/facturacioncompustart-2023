import React, { useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PrintIcon from '@material-ui/icons/DeleteForever';
import PrintIco from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import BuscadorFacturas from './BuscadorFacturas';
import { EstadisticasContext } from '../../../src/context/EstadisticasContext';
import { FacturaContext } from '../../../src/context/FacturaContext';
import Swal from 'sweetalert2';
import { LoginContext } from '../../context/LoginContext';
import SelectLimit from './SelectLimit';
import { formatCurrencySimple } from '../../Environment/utileria';
import API from '../../Environment/config';
import alertify from 'alertifyjs';
import NumberFormatCustom from '../ValidationCurrency/ValidationCurrency';


import CreditCardIcon from '@material-ui/icons/CreditCard';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

// impresion Facturas
import { useReactToPrint } from 'react-to-print';
import Factura_imp from '../ReimpresionFacturas/Factura_imp';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
});
export default function CollapsibleTable() {
  const {
    historicofacturas,
    limite,
    setLimite,
    cargarHistoricoFacturasFilter
  } = useContext(EstadisticasContext);
  const { fn_obtenerFactura, factura } = useContext(FacturaContext);

  const [isPrinter, setIsPrinter] = useState({
    loading: false,
    datos: { id: 1111 }
  });
  const [factura_id, setFactura_id] = useState(false);
  // IMPRESION

  const componentRef = useRef();
  const EventoImprimirReact = () => {
    print();
  };
  const print = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => { }
  });

  const imprimirFactura = async (id, estado) => {
    let response = await fn_obtenerFactura(id);


    setFactura_id(id);

    setIsPrinter({
      loading: true,
      factura: response.factura
    });

    EventoImprimirReact();
  };

  // END IMPRESION
  return (
    <>
      <div
        style={{
          display: 'none'
        }}
      >
        {isPrinter.loading && (
          <Factura_imp
            ref={componentRef}
            dataFactura={isPrinter.factura}
          ></Factura_imp>
        )}
        {/* {factura?.id && <Factura_imp ref={componentRef}></Factura_imp>} */}
      </div>
      <center>
        <h1>Historico de facturas</h1>
      </center>
      <SelectLimit
        onChangeData={cargarHistoricoFacturasFilter}
        data={limite}
        setData={setLimite}
      ></SelectLimit>
      <BuscadorFacturas limite={limite} ></BuscadorFacturas>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>N° Fac</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="left">Fecha</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Observación</TableCell>
              <TableCell align="right">Estatus</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicofacturas.map((row, index) => (
              <Row
                key={index}
                row={row.factura}
                imprimirFactura={imprimirFactura}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function ModalEditarFormaPago({ open, onClose, row, onSuccess }) {
  const [formasPagoDisponibles, setFormasPagoDisponibles] = useState([]);
  const [valores, setValores] = useState({});
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (open) {
      cargarDatos();
    }
  }, [open]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const resp = await API.get('/api/forma-pagos');
      const lista = resp.data;
      setFormasPagoDisponibles(lista);

      // Pre-llenar con los valores actuales de la factura
      const valoresIniciales = {};
      lista.forEach((fp) => {
        const existente = row.formasPago.find((f) => f.forma_pago_id === fp.id);
        valoresIniciales[fp.id] = existente ? String(existente.valor) : '0';
      });
      setValores(valoresIniciales);
    } catch {
      alertify.error('Error al cargar formas de pago', 3);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (formaPagoId, value) => {
    setValores((prev) => ({ ...prev, [formaPagoId]: value }));
  };

  const sumaTotal = Object.values(valores).reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
  const totalFactura = parseFloat(row.total);
  const esSumaValida = Math.abs(sumaTotal - totalFactura) < 0.01;

  const guardar = async () => {
    if (!esSumaValida) {
      Swal.fire('Error', 'La suma de las formas de pago debe ser igual al total de la factura.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const formasPago = Object.entries(valores)
        .filter(([, v]) => parseFloat(v) > 0)
        .map(([id, v]) => ({
          forma_pago_id: parseInt(id),
          valor: parseFloat(v)
        }));

      const resp = await API.put(`api/facturas/${row.id}/formas-pago`, { formasPago });

      if (resp.data.estado === 200) {
        Swal.fire('Actualizado', resp.data.mensaje, 'success');
        onSuccess();
        onClose();
      } else {
        Swal.fire('Error', resp.data.mensaje, 'warning');
      }
    } catch {
      Swal.fire('Error', 'Error al actualizar las formas de pago.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Editar Formas de Pago - Factura #{row.id}
      </DialogTitle>
      <DialogContent dividers>
        {cargando ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box mb={2} p={1.5} style={{ backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <Typography variant="body2">
                <strong>Total de la factura:</strong> ${formatCurrencySimple(row.total)}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: esSumaValida ? '#2e7d32' : '#d32f2f',
                  fontWeight: 600
                }}
              >
                Suma declarada: ${formatCurrencySimple(sumaTotal)}
                {esSumaValida ? ' (correcto)' : ' (no coincide)'}
              </Typography>
            </Box>

            {formasPagoDisponibles.map((fp) => (
              <Box key={fp.id} display="flex" alignItems="center" mb={1.5} style={{ gap: 12 }}>
                <AttachMoneyIcon fontSize="small" color="primary" />
                <Typography variant="body2" style={{ flexGrow: 1, minWidth: 120 }}>
                  {fp.label}
                </Typography>
                <TextField
                  name={`fp-${fp.id}`}
                  value={valores[fp.id] || '0'}
                  onChange={(e) => handleChange(fp.id, e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ width: 150 }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    style: { fontSize: 13 }
                  }}
                />
              </Box>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={guardar}
          color="primary"
          variant="contained"
          disabled={loading || !esSumaValida || cargando}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Row(props) {
  const { row, imprimirFactura } = props;

  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const { fn_anularFactura, setIsReload } = useContext(EstadisticasContext);
  const { tienePermiso } = useContext(LoginContext);
  const [openEditFP, setOpenEditFP] = useState(false);
  const [editandoObs, setEditandoObs] = useState(false);
  const [obsValue, setObsValue] = useState(row.observacion || '');
  const [savingObs, setSavingObs] = useState(false);

  const guardarObservacion = async () => {
    if (obsValue === (row.observacion || '')) {
      setEditandoObs(false);
      return;
    }
    setSavingObs(true);
    try {
      await API.put(`api/facturas/${row.id}`, { observacion: obsValue });
      alertify.success('Observacion actualizada', 2);
      setIsReload(true);
    } catch {
      alertify.error('Error al actualizar', 3);
    } finally {
      setSavingObs(false);
      setEditandoObs(false);
    }
  };

  function trunc(x, posiciones = 0) {
    var s = x.toString();
    var l = s.length;
    var decimalLength = s.indexOf('.') + 1;
    var numStr = s.substr(0, decimalLength + posiciones);
    return Number(numStr);
  }

  const anularFactura = (id, estado) => {
    // if (estado !== 'cerrada') {
    //   Swal.fire('No permitido.', '', 'warning');
    //   return;
    // }



    // if (estado === 'credito')
    //   if (localStorage.getItem('tipo_usuario') !== 'ADMINISTRADOR') {
    //     Swal.fire("No tiene permisos suficientes para realizar esta acción.", '', 'warning');
    //     return;
    //   }



    Swal.fire({
      title: '¿Está seguro de Anular la Factura?',
      showDenyButton: true,
      confirmButtonText: `si, Anular`,
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        var response = await fn_anularFactura(id);

        if (response.codigo === 200) {
          Swal.fire(response.mensaje, '', 'success');
          setIsReload(true);
        } else {
          Swal.fire(response.mensaje, '', 'warning');
        }
      }
    });
  };
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.id}</TableCell>
        <TableCell component="th" scope="row">
          {row.cliente}
        </TableCell>
        <TableCell align="left">{row.fecha}</TableCell>
        <TableCell align="right">$ {formatCurrencySimple(row.total)}</TableCell>
        <TableCell align="right">
          {editandoObs ? (
            <Box display="flex" alignItems="center" justifyContent="flex-end" style={{ gap: 4 }}>
              <TextField
                value={obsValue}
                onChange={(e) => setObsValue(e.target.value)}
                size="small"
                variant="outlined"
                autoFocus
                disabled={savingObs}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') guardarObservacion();
                  if (e.key === 'Escape') { setEditandoObs(false); setObsValue(row.observacion || ''); }
                }}
                style={{ minWidth: 120 }}
                inputProps={{ style: { fontSize: 13, padding: '4px 8px' } }}
              />
              <IconButton size="small" onClick={guardarObservacion} disabled={savingObs}>
                {savingObs ? <CircularProgress size={16} /> : <EditIcon style={{ color: '#4caf50' }} fontSize="small" />}
              </IconButton>
            </Box>
          ) : (
            <span
              onClick={() => setEditandoObs(true)}
              style={{ cursor: 'pointer' }}
              title="Clic para editar"
            >
              {row.observacion || '-'}
            </span>
          )}
        </TableCell>
        <TableCell align="right">{row.estado}</TableCell>

        <TableCell align="right">
          {tienePermiso('facturas.reimprimir') && (
            <PrintIco
              title="Reimprimir Factura"
              onClick={() => imprimirFactura(row.id, row.estado)}
              style={{ cursor: 'pointer' }}
            />
          )}
          {tienePermiso('facturas.anular') && (
            <PrintIcon
              title="Anular Factura"
              onClick={() => anularFactura(row.id, row.estado)}
              style={{ cursor: 'pointer' }}
            />
          )}
          {tienePermiso('facturas.editar-forma-pago') && row.estado !== 'Anulada' && (
            <EditIcon
              title="Editar Forma de Pago"
              onClick={() => setOpenEditFP(true)}
              style={{ cursor: 'pointer', color: '#ff9800', marginLeft: 4 }}
              fontSize="small"
            />
          )}
          {tienePermiso('contabilidad.asientos-generar') && row.estado !== 'anulada' && (
            <AccountBalanceIcon
              title="Generar Asiento Contable"
              style={{ cursor: 'pointer', color: '#1976d2', marginLeft: 4 }}
              fontSize="small"
              onClick={() => {
                Swal.fire({
                  title: 'Generar asiento contable',
                  text: `¿Generar asiento desde la factura #${row.id}?`,
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, generar',
                  cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    try {
                      const resp = await API.post(`api/asientos-contables/generar/desde-factura/${row.id}`);
                      alertify.success(resp.data.mensaje || 'Asiento generado', 2);
                    } catch (error) {
                      const msg = error.response?.data?.mensaje || 'Error al generar asiento';
                      alertify.error(msg, 3);
                    }
                  }
                });
              }}
            />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Cant.</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell align="center">Total Item ($)</TableCell>
                    <TableCell align="right">Tipo Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.detalles.map((historyRow) => (
                    <TableRow key={'d' + historyRow.id}>
                      <TableCell component="th" scope="row">
                        {historyRow.cantidad}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {historyRow.codigo_barra}
                      </TableCell>
                      <TableCell>{historyRow?.idProducto + " - " + historyRow.producto}</TableCell>
                      <TableCell align="center">
                        {/* $ {trunc(historyRow.subtotal / 1.15, 4)} */}${' '}
                        {formatCurrencySimple(historyRow.subtotal)}
                      </TableCell>
                      <TableCell align="right">
                        {historyRow.precio_tipo}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>


                {/* <Typography variant="h6" gutterBottom component="div">
                Formas de Pago
              </Typography>
                 <TableBody>
                  {row.formasPago.map((formapago) => (
                    <TableRow key={'fp' + formapago.id}>
                      <TableCell component="th" scope="row">
                        {formapago.descripcionFormaPago}
                      </TableCell>
                      <TableCell>  $ {formapago.valor} </TableCell>
                      <TableCell align="center">
                   
                  
                      </TableCell>
                      <TableCell align="right">
                  
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody> */}

                <Typography variant="h6" gutterBottom component="div" sx={{ mt: 2 }}>
                  {row.es_credito ? 'Abonos realizados' : 'Formas de Pago'}
                </Typography>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 11, fontWeight: 700, color: '#888', padding: '4px 8px' }}>Tipo de Pago</TableCell>
                    <TableCell style={{ fontSize: 11, fontWeight: 700, color: '#888', padding: '4px 8px' }}>Valor</TableCell>
                    <TableCell style={{ fontSize: 11, fontWeight: 700, color: '#888', padding: '4px 8px' }}>
                      {row.es_credito ? 'Fecha Abono' : 'Observación'}
                    </TableCell>
                    <TableCell style={{ fontSize: 11, fontWeight: 700, color: '#888', padding: '4px 8px' }}>
                      {row.es_credito ? 'Comentario' : ''}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.formasPago.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} style={{ color: '#aaa', fontSize: 12, fontStyle: 'italic' }}>
                        {row.es_credito ? 'Sin abonos registrados' : 'Sin formas de pago'}
                      </TableCell>
                    </TableRow>
                  ) : row.formasPago.map((fp) => {
                    let Icon;
                    switch (fp.descripcionFormaPago?.toLowerCase()) {
                      case 'efectivo':
                        Icon = AttachMoneyIcon;
                        break;
                      case 'transferencia':
                        Icon = AccountBalanceIcon;
                        break;
                      case 'depósito':
                        Icon = ReceiptIcon;
                        break;
                      case 'tarjeta de crédito':
                        Icon = CreditCardIcon;
                        break;
                      case 'cheque':
                        Icon = AccountBalanceWalletIcon;
                        break;
                      default:
                        Icon = AttachMoneyIcon;
                    }

                    return (
                      <TableRow key={`fp${fp.id}`}>
                        <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icon fontSize="small" color="primary" />
                          {fp.descripcionFormaPago || '-'}
                        </TableCell>
                        <TableCell>${formatCurrencySimple(fp.valor)}</TableCell>
                        <TableCell align="left">{fp.fecha || '-'}</TableCell>
                        <TableCell align="left">{fp.comentario || '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <ModalEditarFormaPago
        open={openEditFP}
        onClose={() => setOpenEditFP(false)}
        row={row}
        onSuccess={() => setIsReload(true)}
      />
    </React.Fragment>
  );
}

