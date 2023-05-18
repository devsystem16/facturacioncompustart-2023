import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { EstadisticasContext } from './EstadisticasContext';
import API from '../Environment/config';

const END_POINT = {
  guardarAbono: 'api/creditos/abonar',
  obtenerCreditos: 'api/creditos/lista/listado',
  eliminarCredito: 'api/creditos/eliminar/'
};

export const CreditoContext = createContext();

const CreditoProvider = (props) => {
  const [isOpenModalAbono, SetIsOpenModalAbono] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCredito, setCurrentCredito] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [recargarListaCreditos, setRecargarListaCreditos] = useState(true);
  const [recargarFiltro, setRecargarFiltro] = useState(false);

  const { setIsReload } = useContext(EstadisticasContext);

  const guardarAbono = async (abono, formaPagoId = 1) => {
    setIsLoading(true);

    const respuesta = await API.post(END_POINT.guardarAbono, {
      credito_id: currentCredito.id,
      abono: abono,
      forma_pago_id: formaPagoId
    });

    setIsReload(true);

    setRecargarListaCreditos(true);
    setRecargarFiltro(true);
    setIsLoading(false);
    SetIsOpenModalAbono(false);
    console.log(respuesta.data);
  };

  const obtenerCreditos = async () => {
    const response = await API.get(END_POINT.obtenerCreditos);
    setCreditos(response.data);
  };

  const eliminarCreditos = async (credito) => {
    const response = await API.post(END_POINT.eliminarCredito + credito.id);
    setIsReload(true);
    setRecargarListaCreditos(true);
    setRecargarFiltro(true);

    return response.data;
  };

  useEffect(() => {
    if (recargarListaCreditos) {
      console.log('RECARGAR ---------> CREDITPS');
      setRecargarListaCreditos(false);
      obtenerCreditos();
    }
  }, [recargarListaCreditos]);

  return (
    <CreditoContext.Provider
      value={{
        setRecargarListaCreditos,
        recargarListaCreditos,
        creditos,
        isOpenModalAbono,
        SetIsOpenModalAbono,
        currentCredito,
        setCurrentCredito,
        guardarAbono,
        isLoading,
        setIsLoading,
        recargarFiltro,
        setRecargarFiltro,
        eliminarCreditos
      }}
    >
      {props.children}
    </CreditoContext.Provider>
  );
};

export default CreditoProvider;
