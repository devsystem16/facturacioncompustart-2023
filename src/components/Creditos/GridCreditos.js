import React, { useContext, useEffect, useState } from 'react';
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
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import FacturaYPagos from './FacturaYPagos';

import ModalAbono from '../../components/CreditosTable/ModalAbono';
import { CreditoContext } from '../../context/CreditoContext';
import { TextField, InputAdornment, SvgIcon, Chip, Button, CircularProgress } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import EditIcon from '@material-ui/icons/Edit';

import Swal from 'sweetalert2';
import alertify from 'alertifyjs';
import API from '../../Environment/config';
import DeleteForever from '@material-ui/icons/DeleteForever';
import PagosIcon from '@material-ui/icons/ChromeReaderMode';
import PayIcon from '@material-ui/icons/MonetizationOn';
import ModalPagos from './ModalPagos';
import { formatCurrencySimple } from '../../Environment/utileria';
import { LoginContext } from '../../context/LoginContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
});

function Row(props) {
  const { credito  } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const [AbrirModalPagos, setAbrirModalPagos] = useState(false);

  const { SetIsOpenModalAbono, setCurrentCredito, eliminarCreditos, setRecargarListaCreditos, setRecargarFiltro } =
    useContext(CreditoContext);
  const { tienePermiso } = useContext(LoginContext);

  const [editandoDesc, setEditandoDesc] = useState(false);
  const [descValue, setDescValue] = useState(credito.detalle || '');
  const [savingDesc, setSavingDesc] = useState(false);

  const guardarDescripcion = async () => {
    if (descValue === (credito.detalle || '')) {
      setEditandoDesc(false);
      return;
    }
    setSavingDesc(true);
    try {
      await API.put(`api/creditos/${credito.id}`, { detalle: descValue });
      alertify.success('Descripcion actualizada', 2);
      setRecargarListaCreditos(true);
      setRecargarFiltro(true);
    } catch {
      alertify.error('Error al actualizar', 3);
    } finally {
      setSavingDesc(false);
      setEditandoDesc(false);
    }
  };

  const abonarCredito = (credito) => {
    setCurrentCredito(credito);
    SetIsOpenModalAbono(true);
  };

  const imprimirAbonos = () => {
    setAbrirModalPagos(true);
  };
  const eliminarCredito = async (credito) => {
    Swal.fire({
      title: '¿Está seguro de Anular el Crédito?',
      showDenyButton: true,
      confirmButtonText: `si, Anular`,
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await eliminarCreditos(credito);

        if (response?.codigo === 200) {
          Swal.fire(response.Message, '', 'success');
        } else {
          Swal.fire(response.Message, '', 'warning');
        }
      }
    });
  };

  return (
    <React.Fragment>
      <ModalPagos
        open={AbrirModalPagos}
        setOpen={setAbrirModalPagos}
        credito={credito}
 
      ></ModalPagos>

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
        <TableCell
          style={{ backgroundColor: '#f0f3ff', textAlign: 'center' }}
          component="th"
          scope="row"
        >
          {credito?.factura?.id}
        </TableCell>
        <TableCell component="th" scope="row">
          {credito.fecha}
        </TableCell>
       <TableCell align="right"> {credito.cliente}</TableCell>
        <TableCell align="right">
          {editandoDesc ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
              <TextField
                value={descValue}
                onChange={(e) => setDescValue(e.target.value)}
                size="small"
                variant="outlined"
                autoFocus
                disabled={savingDesc}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') guardarDescripcion();
                  if (e.key === 'Escape') { setEditandoDesc(false); setDescValue(credito.detalle || ''); }
                }}
                style={{ minWidth: 120 }}
                inputProps={{ style: { fontSize: 13, padding: '4px 8px' } }}
              />
              <IconButton size="small" onClick={guardarDescripcion} disabled={savingDesc}>
                {savingDesc ? <CircularProgress size={16} /> : <EditIcon style={{ color: '#4caf50' }} fontSize="small" />}
              </IconButton>
            </div>
          ) : (
            <span
              onClick={() => setEditandoDesc(true)}
              style={{ cursor: 'pointer' }}
              title="Clic para editar"
            >
              {credito.detalle || '-'}
            </span>
          )}
        </TableCell>
        <TableCell align="right">{credito.telefono}</TableCell>
        <TableCell align="right">
          {formatCurrencySimple(credito.total)}
        </TableCell>
        <TableCell align="right">
          {formatCurrencySimple(credito.abono)}
        </TableCell>
        <TableCell align="right">
          {' '}
          {formatCurrencySimple(credito.saldo)}
        </TableCell>
        <TableCell align="right">
          {tienePermiso('creditos.abonar') && (
            <PayIcon
              style={{ cursor: 'pointer' }}
              fontSize="small"
              onClick={() => abonarCredito(credito)}
            />
          )}

          {tienePermiso('creditos.ver-pagos') && (
            <PagosIcon
              title="Ver Abonos"
              onClick={() => imprimirAbonos(credito)}
              style={{ cursor: 'pointer' }}
            />
          )}

          {tienePermiso('creditos.anular') && (
            <DeleteForever
              title="Anular Crédito"
              onClick={() => eliminarCredito(credito)}
              style={{ cursor: 'pointer' }}
            />
          )}

          {/* <DeleteForever
            title="Anular Crédito"
            onClick={() => eliminarCredito(credito)}
            style={{ cursor: 'pointer' }}
          /> */}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <FacturaYPagos
                factura={credito.factura}
                pagos={credito.pagos}
                totalAbonado={credito.abono}
              ></FacturaYPagos>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const classes = useStyles();
  const { creditos, recargarListaCreditos, recargarFiltro, setRecargarFiltro } =
    useContext(CreditoContext);

  const [_creditos, _setCreditos] = useState(creditos);

  const [_recargarListaCreditos, _setRecargarListaCreditos] = useState(
    recargarListaCreditos
  );
 

  const filrarProductos = (text) => {
    const searchTerm = text.toUpperCase().split(' ');

    const results = creditos.filter((credito) => {
      const nombres =
        credito && credito?.cliente ? credito?.cliente.toUpperCase() : '';
      const codigo =
        credito && credito?.factura?.id
          ? credito?.factura?.id.toString().toUpperCase()
          : '';

      // Verificar si cada término de búsqueda está presente en alguno de los campos
      return searchTerm.every(
        (term) => nombres.includes(term) || codigo.includes(term)
      );
    });

    _setRecargarListaCreditos(false);
    _setCreditos(results);
  };

  useEffect(() => {
    if (_recargarListaCreditos) {
      _setCreditos(creditos);
      setRecargarFiltro(false);
    }

    if (recargarFiltro) {
      _setCreditos(creditos);
      setRecargarFiltro(false);
    }
  }, [creditos, _creditos]);
  const totalSaldoPendiente = _creditos.reduce((sum, c) => sum + parseFloat(c.saldo || 0), 0);
  const totalGeneral = _creditos.reduce((sum, c) => sum + parseFloat(c.total || 0), 0);
  const totalAbonado = _creditos.reduce((sum, c) => sum + parseFloat(c.abono || 0), 0);

  const exportarPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-EC');

    // Titulo
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('REPORTE DE CREDITOS PENDIENTES', 14, 18);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Fecha de emisión: ${fecha}`, 14, 25);

    // Si hay un solo cliente filtrado, mostrar su nombre
    const clientesUnicos = [...new Set(_creditos.map((c) => c.cliente))];
    if (clientesUnicos.length === 1) {
      doc.setFont(undefined, 'bold');
      doc.text(`Cliente: ${clientesUnicos[0]}`, 14, 31);
      doc.setFont(undefined, 'normal');
    }
    doc.text(`Total de créditos: ${_creditos.length}`, 14, clientesUnicos.length === 1 ? 37 : 31);

    const startY = clientesUnicos.length === 1 ? 42 : 36;

    // Tabla
    doc.autoTable({
      startY,
      head: [['# Fact.', 'Fecha', 'Cliente', 'Descripción', 'Total', 'Abono', 'Saldo']],
      body: _creditos.map((c) => [
        c.factura?.id || '',
        c.fecha || '',
        c.cliente || '',
        c.detalle || '',
        formatCurrencySimple(c.total),
        formatCurrencySimple(c.abono),
        formatCurrencySimple(c.saldo)
      ]),
      foot: [['', '', '', 'TOTALES', formatCurrencySimple(totalGeneral), formatCurrencySimple(totalAbonado), formatCurrencySimple(totalSaldoPendiente)]],
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [63, 81, 181], textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 18 },
        1: { cellWidth: 22 },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' }
      },
      alternateRowStyles: { fillColor: [248, 249, 255] }
    });

    // Saldo pendiente resaltado al final
    const finalY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(230, 81, 0);
    doc.text(`SALDO PENDIENTE TOTAL: ${formatCurrencySimple(totalSaldoPendiente)}`, 14, finalY);

    // Nombre del archivo
    const nombreArchivo = clientesUnicos.length === 1
      ? `Creditos_${clientesUnicos[0].replace(/\s+/g, '_')}_${fecha.replace(/\//g, '-')}.pdf`
      : `Creditos_${fecha.replace(/\//g, '-')}.pdf`;

    doc.save(nombreArchivo);
  };

  return (
    <TableContainer component={Paper}>
      <ModalAbono></ModalAbono>
      <Paper className={classes.paper}>
        <TextField
          fullWidth
          onChange={(e) => filrarProductos(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="inherit" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          placeholder="Buscar credito por cliente o # factura"
          variant="outlined"
        />
      </Paper>

      <Box display="flex" alignItems="center" justifyContent="flex-end" px={2} py={1} style={{ gap: 12 }}>
        <Chip
          size="small"
          label={`${_creditos.length} crédito(s)`}
          style={{ backgroundColor: '#e3f2fd', fontWeight: 500 }}
        />
        <Chip
          size="small"
          label={`Total: ${formatCurrencySimple(totalGeneral)}`}
          style={{ backgroundColor: '#e8eaf6', fontWeight: 500 }}
        />
        <Chip
          size="small"
          label={`Abonado: ${formatCurrencySimple(totalAbonado)}`}
          style={{ backgroundColor: '#e8f5e9', fontWeight: 500 }}
        />
        <Chip
          size="small"
          label={`Saldo pendiente: ${formatCurrencySimple(totalSaldoPendiente)}`}
          style={{ backgroundColor: '#fff3e0', color: '#e65100', fontWeight: 'bold' }}
        />
        <Button
          variant="contained"
          size="small"
          startIcon={<PictureAsPdfIcon />}
          onClick={exportarPDF}
          disabled={_creditos.length === 0}
          style={{ backgroundColor: '#d32f2f', color: '#fff', textTransform: 'none' }}
        >
          Exportar PDF
        </Button>
      </Box>

      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell style={{ backgroundColor: '#f0f3ff' }}>
              Fact. referencia
            </TableCell>
            <TableCell>Fecha crédito</TableCell>
            <TableCell align="right">Cliente</TableCell>
            <TableCell align="right">Descripción</TableCell>
            <TableCell align="right">Teléfono</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Abono</TableCell>
            <TableCell align="right">Saldo</TableCell>
            <TableCell style={{ width: '10%' }} align="right">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {_creditos.map((credito) => (
            <Row     key={'___' + credito.id} credito={credito} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
