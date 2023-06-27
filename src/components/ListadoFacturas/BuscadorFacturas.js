import React, { useState, useContext } from 'react';

import {
  Box,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { EstadisticasContext } from '../../../src/context/EstadisticasContext';
import Loading from '../Loading/Loading';

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

  const [isLoading, setIsLoading] = React.useState(false);

  const filtrarFacturas = async (e) => {
    // if (!isEmpty(e.target.value)) {
    if (e.key === 'Enter') {
      setIsLoading(true);
      const response = await cargarHistoricoFacturasFilter(e.target.value);
      setIsLoading(false);
    }
    // }
  };

  return (
    <CardContent style={{ backgroundColor: 'white', textAlign: 'center' }}>
      <Loading
        text="Obteniendo.."
        open={isLoading}
        seOpen={setIsLoading}
      ></Loading>
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
