import React, { useContext, useState, useRef } from 'react';
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
import { Button } from '@material-ui/core';
import BuscadorFacturas from './BuscadorFacturas';
import { EstadisticasContext } from '../../../src/context/EstadisticasContext';
import { FacturaContext } from '../../../src/context/FacturaContext';
import Swal from 'sweetalert2';
import Permisos from '../../Environment/Permisos.json';
import SelectLimit from './SelectLimit';

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

function Row(props) {
  const { row, imprimirFactura } = props;

  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const { fn_anularFactura, setIsReload } = useContext(EstadisticasContext);

  function trunc(x, posiciones = 0) {
    var s = x.toString();
    var l = s.length;
    var decimalLength = s.indexOf('.') + 1;
    var numStr = s.substr(0, decimalLength + posiciones);
    return Number(numStr);
  }

  const anularFactura = (id, estado) => {
    if (estado !== 'cerrada') {
      Swal.fire('No permitido.', '', 'warning');
      return;
    }

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

        // const response = await API.patch(
        //   END_POINT.eliminar_orden + '/' + datosImpresion.orden.id,
        //   { estado: 0 }
        // );
        // if (response.data === 1) {
        //   setReload(true);
        //   setIsReload(true);
        //   Swal.fire('Eliminado', '', 'success');
        // }
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
        <TableCell align="right">$ {row.total}</TableCell>
        <TableCell align="right">{row.observacion}</TableCell>
        <TableCell align="right">{row.estado}</TableCell>

        {Permisos[localStorage.getItem('tipo_usuario')]['anular factura'] && (
          <TableCell align="right">
            <PrintIco
              title="Reimprimir Factura"
              onClick={() => imprimirFactura(row.id, row.estado)}
              style={{ cursor: 'pointer' }}
            />
            <PrintIcon
              title="Anular Factura"
              onClick={() => anularFactura(row.id, row.estado)}
              style={{ cursor: 'pointer' }}
            />
          </TableCell>
        )}
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
                      <TableCell>{historyRow.producto}</TableCell>
                      <TableCell align="center">
                        {/* $ {trunc(historyRow.subtotal / 1.12, 4)} */}${' '}
                        {historyRow.subtotal}
                      </TableCell>
                      <TableCell align="right">
                        {historyRow.precio_tipo}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const { historicofacturas, limite, setLimite } =
    useContext(EstadisticasContext);
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
    onAfterPrint: () => {
      // setProductosFactura([]);
      // setCredito(false);
      // setCurrentCliente({
      //   cedula: '',
      //   nombres: '-SELECCIONE-'
      // });
    }
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
      <SelectLimit data={limite} setData={setLimite}></SelectLimit>
      <BuscadorFacturas></BuscadorFacturas>

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
              {Permisos[localStorage.getItem('tipo_usuario')][
                'anular factura'
              ] && <TableCell align="right">Acciones</TableCell>}
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
