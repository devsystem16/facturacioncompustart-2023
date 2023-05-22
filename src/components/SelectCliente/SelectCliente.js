import React, { useState, useContext, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { ClienteContext } from '../../context/ClienteContext';

const SelectCliente = ({
  ancho = 300,
  concatenarCedula = false,
  defaultCliete = undefined,
  selectInactive = false
}) => {
  const { clientes, currentCliente, setCurrentCliente, cargarClientes } =
    useContext(ClienteContext);

  const fn_concatenarNombreEnSelect = (concatenar, option) => {
    if (concatenar)
      return option.cedula === ''
        ? ''
        : 'CI: ' + option.cedula + ' - ' + option.nombres;
    else return option.nombres;
  };

  if (defaultCliete === undefined) {
    return (
      <>
        <Autocomplete
          id="debug"
          value={currentCliente}
          // value={defaultCliete === undefined ? undefined : defaultCliete}
          disabled={selectInactive}
          options={clientes}
          debug
          // defaultValue={defaultCliete === undefined ? null : defaultCliete}
          onChange={(event, newValue) => {
            console.log(newValue);
            if (newValue === null) return;
            setCurrentCliente(newValue);
          }}
          getOptionLabel={(option) =>
            fn_concatenarNombreEnSelect(concatenarCedula, option)
          }
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              style={{ width: ancho }}
              label="Seleccione Cliente"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } else
    return (
      <>
        <Autocomplete
          id="debug"
          disabled={selectInactive}
          options={clientes}
          value={defaultCliete}
          debug
          defaultValue={defaultCliete === undefined ? null : defaultCliete}
          onChange={(event, newValue) => {
            console.log(newValue);
            if (newValue === null) return;
            setCurrentCliente(newValue);
          }}
          getOptionLabel={(option) =>
            fn_concatenarNombreEnSelect(concatenarCedula, option)
          }
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              style={{ width: ancho }}
              label="Seleccione Cliente"
              variant="outlined"
            />
          )}
        />
      </>
    );
};

export default SelectCliente;
