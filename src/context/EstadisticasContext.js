import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';

import API from '../Environment/config';

export const EstadisticasContext = createContext();

const END_POINT = {
  totalFormasPago: 'api/reportes/ventas-diarias/forma-pago',

  reporteDiario: 'api/reporte/ventas',
  historicofacturas: 'api/reporte/historicofacturas',
  historicofacturas_filter: 'api/reporte/historicofacturas-filter',
  actualizar: 'api/ordenes',
  abonar: 'api/ordenes/abonos/nuevoabono',
  anularFactura: 'api/facturas/anulacion/nota-credito'
};

const EstadisticasProvider = (props) => {
  const [limite, setLimite] = useState(10);
  const [isReload, setIsReload] = useState(true);
  const [historicofacturas, setHistoricofacturas] = useState([]);

  const [reporte, setReporte] = useState({
    numeroFacturas: 0,
    numeroCreditos: 0,
    clientes: 0,
    totalVentas: 0,
    desglose: [],
    formasPago: []
  });

  useEffect(() => {
    if (isReload) {
      console.log('RELOAD ESTADISTICAS');
      cargarHistoricoFacturas();
      cargarReporteDiario();
      setIsReload(false);
    }
  }, [isReload]);

  const cargarHistoricoFacturas = async () => {
    const response = await API.get(END_POINT.historicofacturas + '/' + limite);
    setHistoricofacturas(response.data);
  };

  const fn_anularFactura = async (id) => {
    const response = await API.post(END_POINT.anularFactura, { idFactura: id });
    return response.data;
  };

  const cargarHistoricoFacturasFilter = async (filter, limitePrm = 10) => {
    const response = await API.post(END_POINT.historicofacturas_filter, {
      filter: filter,
      limite: limitePrm === undefined ? limite : limitePrm
    });
    setHistoricofacturas(response.data);
  };

  const cargarReporteDiario = async () => {
    const response = await API.get(END_POINT.reporteDiario);

    const responseFp = await API.get(END_POINT.totalFormasPago);

    setReporte({
      numeroFacturas: response.data.NumeroFacturas,
      numeroCreditos: response.data.NumeroCreditos,
      stockBajo: response.data.productosStockBajo,
      clientes: response.data.clientes,
      totalVentas: response.data.totalVendido,
      desglose: response.data.desglose,
      formasPago: responseFp.data.reporteFormasPago,
      totalRetiros: responseFp.data.totalRetiros
    });
  };

  return (
    <>
      <EstadisticasContext.Provider
        value={{
          isReload,
          setIsReload,
          reporte,
          historicofacturas,
          cargarHistoricoFacturasFilter,
          fn_anularFactura,

          limite,
          setLimite
        }}
      >
        {props.children}
      </EstadisticasContext.Provider>
    </>
  );
};

export default EstadisticasProvider;
