import React, { useState, useContext } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { TecnicoContext } from '../../context/TecnicoContext';

const SelectTecnico = ({ ancho = 300 }) => {
  const { tecnicos, currentTecnico, setCurrentTecnico } =
    useContext(TecnicoContext);

  return (
    <Autocomplete
      id="debug"
      options={tecnicos}
      debug
      onChange={(event, newValue) => {
        console.log(newValue);
        if (newValue === null) return;
        setCurrentTecnico(newValue);
      }}
      getOptionLabel={(option) => option.nombres}
      style={{ width: 300, marginTop: 5 }}
      renderInput={(params) => (
        <TextField
          {...params}
          style={{ width: ancho }}
          label="Seleccione Técnico"
          variant="outlined"
        />
      )}
    />
  );
};

export default SelectTecnico;
