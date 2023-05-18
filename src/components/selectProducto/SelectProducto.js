import React, { useState, useContext, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { ClienteContext } from '../../context/ClienteContext';
import { ProductosContext } from '../../context/ProductosContext';
const SelectProducto = ({
  ancho = 300,
  concatenarCedula = false,
  defaultCliete = undefined,
  selectInactive = false
}) => {
  const [currentProducto, setCurrentProducto] = useState({
    stock: '0',
    nombres: '-SELECCIONE-'
  });

  const { productos } = useContext(ProductosContext);

  return (
    <>
      <input type="text" name="a"></input>
      <Autocomplete
        id="debug"
        // value={currentCliente}
        // value={defaultCliete === undefined ? undefined : defaultCliete}
        // disabled={selectInactive}
        options={productos}
        debug
        // defaultValue={defaultCliete === undefined ? null : defaultCliete}
        onChange={(event, newValue) => {
          console.log(newValue);
          if (newValue === null) return;
          setCurrentProducto(newValue);
        }}
        getOptionLabel={(option) =>
          'Stock: [' + option.stock + '] ' + option.nombre
        }
        style={{ width: +ancho }}
        renderInput={(params) => (
          <TextField
            {...params}
            style={{ width: +ancho }}
            label="Seleccione Producto"
            variant="outlined"
          />
        )}
      />
    </>
  );
};

export default SelectProducto;
