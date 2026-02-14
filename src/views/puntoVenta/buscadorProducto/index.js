import React, { useContext } from 'react';
import { TextField, InputAdornment, SvgIcon, makeStyles } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { ProductosContext } from '../../../context/ProductosContext';

const useStyles = makeStyles((theme) => ({
  searchInput: {
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8
    }
  }
}));

const BuscadorProductos = () => {
  const classes = useStyles();
  const { setProductosTemp, productos } = useContext(ProductosContext);

  const filtrarProductos = (e) => {
    const palabrasFiltro = e.target.value.toLowerCase().split(' ');

    const results = productos.filter((producto) => {
      const nombreProducto = producto.nombre.toLowerCase();
      const codigoProducto =
        producto.codigo_barra === null
          ? ''
          : producto.codigo_barra.toLowerCase();

      return palabrasFiltro.every((palabra) => {
        return (
          nombreProducto.includes(palabra) || codigoProducto.includes(palabra)
        );
      });
    });

    setProductosTemp(results);
  };

  return (
    <TextField
      fullWidth
      onChange={filtrarProductos}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SvgIcon fontSize="small" color="action">
              <SearchIcon />
            </SvgIcon>
          </InputAdornment>
        )
      }}
      placeholder="Buscar por nombre o código..."
      variant="outlined"
      size="small"
      className={classes.searchInput}
    />
  );
};

export default BuscadorProductos;
