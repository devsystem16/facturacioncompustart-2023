import React, { useState, useContext } from 'react';

import Search from '@material-ui/icons/Search';
import { isEmpty } from 'lodash';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { EstadisticasContext } from '../../../src/context/EstadisticasContext';
const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const BuscadorFacturas = () => {
  const classes = useStyles();
  const { historicofacturas, cargarHistoricoFacturasFilter } =
    useContext(EstadisticasContext);

  const filtrarFacturas = (e) => {
    // if (!isEmpty(e.target.value)) {
    if (e.key === 'Enter') {
      cargarHistoricoFacturasFilter(e.target.value);
    }
    // }
  };

  return (
    <CardContent style={{ backgroundColor: 'white', textAlign: 'center' }}>
      <Box maxWidth={500}>
        <TextField
          fullWidth
          onKeyDown={filtrarFacturas}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          placeholder="Buscar Facturas."
          variant="outlined"
        />
      </Box>
      {/* <Button
        variant="contained"
        color="secondary"
        className={classes.exportButton}
        startIcon={<Search />}
        onClick={null}
      >
        Imprimir
      </Button> */}
    </CardContent>
  );
};

export default BuscadorFacturas;
