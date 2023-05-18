import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API from '../Environment/config';
export const TecnicoContext = createContext();

const END_POINT = {
  listado_tecnicos: 'api/tecnicos'
};

const TecnicoProvider = (props) => {
  const [tecnicos, setTecnicos] = useState([]);
  const [currentTecnico, setCurrentTecnico] = useState([]);

  //
  useEffect(() => {
    cargarTecnicos();
  }, []);

  const cargarTecnicos = async () => {
    const response = await API.get(END_POINT.listado_tecnicos);
    setTecnicos(response.data);
  };

  return (
    <TecnicoContext.Provider
      value={{ tecnicos, currentTecnico, setCurrentTecnico }}
    >
      {props.children}
    </TecnicoContext.Provider>
  );
};

export default TecnicoProvider;
