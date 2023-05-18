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
import AddCircle from '@material-ui/icons/AddCircle';
import ModalAbono from '../../components/CreditosTable/ModalAbono';
import { CreditoContext } from '../../context/CreditoContext';
import { TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import alertify from 'alertifyjs';
import Swal from 'sweetalert2';
import DeleteForever from '@material-ui/icons/DeleteForever';
import PagosIcon from '@material-ui/icons/ChromeReaderMode';
import PayIcon from '@material-ui/icons/MonetizationOn';
import ModalPagos from './ModalPagos';
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
  const { credito } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const [AbrirModalPagos, setAbrirModalPagos] = useState(false);

  const { SetIsOpenModalAbono, setCurrentCredito, eliminarCreditos } =
    useContext(CreditoContext);

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

        <TableCell align="right"> {credito.detalle}</TableCell>
        <TableCell align="right"> {credito.cliente}</TableCell>
        <TableCell align="right">{credito.telefono}</TableCell>
        <TableCell align="right">{credito.total}</TableCell>
        <TableCell align="right">{credito.abono}</TableCell>
        <TableCell align="right"> {credito.saldo}</TableCell>
        <TableCell align="right">
          <PayIcon
            style={{ cursor: 'pointer' }}
            fontSize="small"
            onClick={() => abonarCredito(credito)}
          />
          <PagosIcon
            title="Ver Abonos"
            onClick={() => imprimirAbonos(credito)}
            style={{ cursor: 'pointer' }}
          />
          <DeleteForever
            title="Anular Crédito"
            onClick={() => eliminarCredito(credito)}
            style={{ cursor: 'pointer' }}
          />
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
    const results = creditos.filter((credito) => {
      const itemData = credito.cliente.toUpperCase();
      const textData = text.toUpperCase();

      const itemData1 = credito?.factura?.id.toString();
      const textData1 = text.toString();

      return (
        itemData1.indexOf(textData1) > -1 || itemData.indexOf(textData) > -1
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
          placeholder="Buscar credito"
          variant="outlined"
        />
      </Paper>

      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell style={{ backgroundColor: '#f0f3ff' }}>
              Fact. referencia
            </TableCell>
            <TableCell>Fecha crédito</TableCell>
            <TableCell align="right">Descripción</TableCell>
            <TableCell align="right">Cliente</TableCell>
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
            <Row key={'___' + credito.id} credito={credito} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
