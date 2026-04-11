import React, { createContext, useState, useEffect, useContext } from 'react';
 
import { EstadisticasContext } from './EstadisticasContext';
import { PeriodoContext } from './PeriodoContext';
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
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const { setIsReload } = useContext(EstadisticasContext);
  const { periodo } = useContext(PeriodoContext);
  const guardarAbono = async (abono, formaPagoId = 1) => {
    setIsLoading(true);

    const respuesta = await API.post(END_POINT.guardarAbono, {
      credito_id: currentCredito.id,
      abono: abono,
      forma_pago_id: formaPagoId,
      periodo_id: periodo.id
    });

    setIsReload(true);

    setRecargarListaCreditos(true);
    setRecargarFiltro(true);
    setIsLoading(false);
    SetIsOpenModalAbono(false);

    return respuesta.data;
  };


  const actualizarFormaPagoDetalleCredito = async (id, formaPagoId) => {
    const response = await API.put(`api/detalle-creditos/${id}/forma-pago`, {
      forma_pago_id: formaPagoId
    });


      setIsReload(true);

    setRecargarListaCreditos(true);
    setRecargarFiltro(true);
    setIsLoading(false);
 


      return response.data;
  }


  const parseFecha = (fechaStr) => {
    if (!fechaStr) return null;
    const [y, m, d] = fechaStr.split('-');
    return new Date(+y, +m - 1, +d);
  };

  const calcularResumenCreditos = (lista) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const enSieteDias = new Date(hoy);
    enSieteDias.setDate(enSieteDias.getDate() + 7);

    const resumen = {
      vencido: { total: 0, saldo: 0 },
      por_vencer: { total: 0, saldo: 0 },
      sin_fecha: { total: 0, saldo: 0 }
    };

    lista.forEach((c) => {
      const saldo = parseFloat(c.saldo || 0);
      if (!c.fecha_limite) {
        resumen.sin_fecha.total += 1;
        resumen.sin_fecha.saldo += saldo;
      } else {
        const fl = parseFecha(c.fecha_limite);
        if (fl < hoy) {
          resumen.vencido.total += 1;
          resumen.vencido.saldo += saldo;
        } else if (fl <= enSieteDias) {
          resumen.por_vencer.total += 1;
          resumen.por_vencer.saldo += saldo;
        }
      }
    });

    return resumen;
  };

  const [resumenCreditos, setResumenCreditos] = useState({
    vencido: { total: 0, saldo: 0 },
    por_vencer: { total: 0, saldo: 0 },
    sin_fecha: { total: 0, saldo: 0 }
  });

  const obtenerCreditos = async () => {
    const response = await API.get(END_POINT.obtenerCreditos);
    setCreditos(response.data);
    setResumenCreditos(calcularResumenCreditos(response.data));
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
        eliminarCreditos,
        actualizarFormaPagoDetalleCredito,
        filtroEstado,
        setFiltroEstado,
        resumenCreditos
      }}
    >
      {props.children}
    </CreditoContext.Provider>
  );
};

export default CreditoProvider;
