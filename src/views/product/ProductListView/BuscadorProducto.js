import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import NuevoProducto from '../../../components/NuevoProducto/NuevoProducto';
import clsx from 'clsx';
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
import DeleteIcon from '@material-ui/icons/Delete';
import { ProductosContext } from '../../../context/ProductosContext';
const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const BuscadorProducto = ({ className, ...rest }) => {
  const classes = useStyles();

  const {
    setProductosTemp,
    productos,
    isNew,
    setIsNew,
    eliminarProducto,
    deleteProducto
  } = useContext(ProductosContext);

  const accionesBoton = () => {};

  const filrarProductos = (e) => {
    console.log(e.target.value);
    // if (e.key === 'Enter') {
    console.log(productos);
    const results = productos.filter((producto) => {
      const itemData = producto.nombre.toUpperCase();
      const textData = e.target.value.toUpperCase();

      const itemData1 =
        producto.codigo_barra === null
          ? ''
          : producto.codigo_barra.toUpperCase();
      const textData1 = e.target.value.toUpperCase();

      return (
        itemData.indexOf(textData) > -1 || itemData1.indexOf(textData1) > -1
      );
    });
    console.log(results);
    setProductosTemp(results);
    // }
  };

  const fn_nuevoProducto = () => {
    setIsNew(true);
  };

  const fn_guardar = () => {
    setIsNew(false);
  };

  const deleteProduct = () => {
    if (deleteProducto?.id === undefined) return;

    Swal.fire({
      title: '¿Está seguro de eliminar el producto?',
      showDenyButton: true,
      confirmButtonText: `si, eliminar`,
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        eliminarProducto();
      }
    });
  };
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        {isNew ? null : (
          <Button
            variant="contained"
            style={{ backgroundColor: 'rgb(154, 0, 54)' }}
            color="secondary"
            className={classes.exportButton}
            startIcon={<DeleteIcon />}
            onClick={deleteProduct}
          >
            Eliminar
          </Button>
        )}

        {isNew ? null : (
          <Button
            color="primary"
            variant="contained"
            onClick={fn_nuevoProducto}
          >
            Nuevo Producto
          </Button>
        )}
      </Box>
      <Box mt={3}>
        <Card>
          {isNew ? (
            <NuevoProducto />
          ) : (
            <Buscador filrarProductos={filrarProductos} />
          )}
        </Card>
      </Box>
    </div>
  );
};

const Buscador = ({ filrarProductos }) => {
  return (
    <CardContent>
      <Box maxWidth={500}>
        <TextField
          fullWidth
          onChange={filrarProductos}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          placeholder="Buscar producto"
          variant="outlined"
        />
      </Box>
    </CardContent>
  );
};

export default BuscadorProducto;
