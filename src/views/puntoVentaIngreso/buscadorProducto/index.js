import React, { useContext } from 'react';
import { Paper, TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { ProductosContext } from '../../../context/ProductosContext';
import { isEmpty } from 'lodash';

const BuscadorProductos = ({ classes }) => {
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

  const filtrarProductosOLD = (e) => {
    // if (isEmpty(e.target.value)) {
    //   setProductosTemp(productos);
    // } else if (e.key === 'Enter') {
    const results = productos.filter((producto) => {
      const itemData = producto.nombre.toUpperCase();
      const textData = e.target.value.toUpperCase();

      const itemData1 =
        producto.codigo_barra === null
          ? ''.toString()
          : producto.codigo_barra.toString();
      const textData1 = e.target.value.toString();

      return (
        itemData.indexOf(textData) > -1 || itemData1.indexOf(textData1) > -1
      );
    });
    setProductosTemp(results);
    // }
  };

  return (
    <Paper className={classes.paper}>
      <TextField
        fullWidth
        onChange={filtrarProductos}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon fontSize="inherit" color="action">
                <SearchIcon />
              </SvgIcon>
            </InputAdornment>
          )
        }}
        placeholder="Buscar Producto"
        variant="outlined"
      />
    </Paper>
  );
};

export default BuscadorProductos;
