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
          disabled={selectInactive}
          options={clientes}
          debug
          filterOptions={(options, state) => {
            // Obtener el valor de búsqueda sin espacios y en minúsculas
            const inputValue = state.inputValue
              .toLowerCase()
              .replace(/\s/g, ' ');

            console.log('INPUT GPT', inputValue);

            // Filtrar las opciones según el valor de búsqueda flexible
            return options.filter((option) => {
              const { cedula, nombres } = option;

              // Convertir el nombre completo y el valor de búsqueda en minúsculas
              const fullName = nombres.toLowerCase();
              const fullcedula = cedula.toLowerCase();

              const searchValue = inputValue;

              // Separar el valor de búsqueda en palabras individuales
              const searchTerms = searchValue.split(' ');

              // Verificar si todas las palabras de búsqueda están presentes en el nombre completo
              return searchTerms.every(
                (term) => fullName.includes(term) || fullcedula.includes(term)
              );
            });
          }}
          onChange={(event, newValue) => {
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
          filterOptions={(options, state) => {
            // Obtener el valor de búsqueda sin espacios y en minúsculas
            const inputValue = state.inputValue
              .toLowerCase()
              .replace(/\s/g, ' ');

            console.log('INPUT GPT', inputValue);

            // Filtrar las opciones según el valor de búsqueda flexible
            return options.filter((option) => {
              const { cedula, nombres } = option;

              // Convertir el nombre completo y el valor de búsqueda en minúsculas
              const fullName = nombres.toLowerCase();
              const fullcedula = cedula.toLowerCase();

              const searchValue = inputValue;

              // Separar el valor de búsqueda en palabras individuales
              const searchTerms = searchValue.split(' ');

              // Verificar si todas las palabras de búsqueda están presentes en el nombre completo
              return searchTerms.every(
                (term) => fullName.includes(term) || fullcedula.includes(term)
              );
            });
          }}
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
