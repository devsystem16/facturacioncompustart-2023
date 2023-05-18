import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import AddCircle from '@material-ui/icons/AddCircle';
import ModalAbono from '../../components/CreditosTable/ModalAbono';
import { TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

import { CreditoContext } from '../../context/CreditoContext';
const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

export default function CreditosTable() {
  const classes = useStyles();

  const {
    SetIsOpenModalAbono,
    setCurrentCredito,
    creditos,
    recargarListaCreditos,

    recargarFiltro,
    setRecargarFiltro
  } = useContext(CreditoContext);

  const [_creditos, _setCreditos] = useState(creditos);

  const [_recargarListaCreditos, _setRecargarListaCreditos] = useState(
    recargarListaCreditos
  );

  const eliminarCredito = (id) => {
    alert('Eliminar --> ' + id);
  };
  const abonarCredito = (credito) => {
    setCurrentCredito(credito);
    SetIsOpenModalAbono(true);
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

  const filrarProductos = (text) => {
    const results = creditos.filter((credito) => {
      const itemData = credito.cliente.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    _setRecargarListaCreditos(false);
    _setCreditos(results);
  };

  return (
    <>
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
        <Table className={classes.table} aria-label="caption table">
          <caption>Creditos Pendientes</caption>
          <TableHead>
            <TableRow>
              <TableCell align="left">Fecha de crédito</TableCell>
              <TableCell style={{ width: '300px' }}>Descripción</TableCell>
              <TableCell align="center">Cliente</TableCell>
              <TableCell align="center">Teléfono</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Abono</TableCell>
              <TableCell align="right">Saldo</TableCell>
              <TableCell align="right"> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_creditos.map((credito) => (
              <TableRow key={credito.id}>
                <TableCell align="left">{credito.fecha}</TableCell>
                <TableCell>{credito.detalle}</TableCell>
                <TableCell align="center">{credito.cliente}</TableCell>
                <TableCell align="center">{credito.telefono}</TableCell>
                <TableCell align="right">$ {credito.total}</TableCell>
                <TableCell align="right">${credito.abono}</TableCell>
                <TableCell align="right">${credito.saldo}</TableCell>

                <TableCell align="right">
                  {/* <DeleteIcon
                  fontSize="small"
                  onClick={() => eliminarCredito(credito.id)}
                /> */}
                  <AddCircle
                    fontSize="small"
                    onClick={() => abonarCredito(credito)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
