import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';

import { useReactToPrint } from 'react-to-print';
import API from '../Environment/config';
import Swal from 'sweetalert2';
import { ClienteContext } from './ClienteContext';
import { TecnicoContext } from './TecnicoContext';
import { EstadisticasContext } from './EstadisticasContext';

import ImpresionOrden from '../components/ImpresionOrden/ImpresionOrden';
export const IngresoContext = createContext();

const END_POINT = {
  listado: 'api/ordenes',
  guardar: 'api/ordenes',
  actualizar: 'api/ordenes',
  eliminar_orden: 'api/ordenes',
  abonar: 'api/ordenes/abonos/nuevoabono',
  actualizarTotal: 'api/ordenes/total/actualizar'
};

const IngresoProvider = (props) => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesTemp, setOrdenesTemp] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [definirFactura, setDefinirFactura] = useState(false);

  const [openModalIngreso, setOpenModalIngreso] = useState(false);

  const [reload, setReload] = useState(true);
  const { clientes, buscarCliente } = useContext(ClienteContext);
  const { setIsReload, fn_anularFactura } = useContext(EstadisticasContext);

  const [currentIngreso, setCurrentIngreso] = useState([]);
  const [datosImpresion, setDatosImpresion] = useState([]);

  const [isOpenModalIngreso, SetIsOpenModalIngreso] = useState(false);
  const [isOpenModalTotal, SetIsOpenModalTotal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useState({
    camara: false,
    teclado: false,
    microfono: false,
    parlantes: false,
    pantalla: false
  });

  const guardarAbono = async (abono) => {
    var datos = {
      orden_id: datosImpresion.orden.id,
      abono: abono
    };

    const response = await API.post(END_POINT.abonar, datos);

    setReload(true);

    return { codigo: 200, mensaje: 'Abono Registrado.' };
  };

  const actualizarTotal = async (total) => {
    var datos = {
      orden_id: datosImpresion.orden.id,
      total: total
    };
    const response = await API.post(END_POINT.actualizarTotal, datos);
    setReload(true);
    return { codigo: 200, mensaje: 'Total Actualizado.' };
  };

  const PrepararDatosImpresion = async (orden) => {
    console.log('Orden a imprimir', orden);

    var cliente = clientes.filter((cli) => {
      return cli.id === orden.cliente_id;
    });
    // console.log('cliente', cliente.length);

    // const tecnico = tecnicos.filter((tec) => {
    //   return tec.id === orden.tecnico_id;
    // });

    if (cliente === undefined) return;

    if (cliente.length == 0) {
      const objcliente = await buscarCliente(orden.cliente_id);

      cliente = [{ ...objcliente }];
    }

    

    setDatosImpresion({
      cliente: {
        nombres: cliente[0].nombres,
        cedula: cliente[0].cedula,
        telefono: cliente[0].telefono
      },
      tecnico: {
        nombres: localStorage.getItem('nombres')
      },

   
      orden: {
        id: orden.id,
        cliente_id: orden.cliente_id,
        equipo: orden.equipo,
        serie: orden.serie,
        marca: orden.marca,
        modelo: orden.modelo,
        observacion: orden.observacion,
        falla: orden.falla,
        trabajo: orden.trabajo,
        total: orden.total,
        abono: orden.abono,
        saldo: orden.saldo,
        fecha: orden.fecha,
        camara: orden.camara,
        teclado: orden.teclado,
        microfono: orden.microfono,
        parlantes: orden.parlantes,
        factura_relacionada: orden.factura_relacionada
      }
    });

    // console.log(datosImpresion);
  };

  useEffect(() => {
    if (reload) {
      console.log('RECARGANDO ORDENES.');
      cargarOrdenes();
      setReload(false);
    }
    // console.log('CONTEXTO', datosImpresion);
  }, [reload, datosImpresion]);

  const cargarOrdenes = async () => {
    const response = await API.get(END_POINT.listado);
    setOrdenes(response.data);
    setOrdenesTemp(response.data);
  };

  const guardarOrden = async (orden) => {
    const response = await API.post(END_POINT.guardar, orden);
    console.log(response);
    return { code: 200, mensaje: 'Guardado OK' };
  };

  const eliminarOrden = async () => {
    if (datosImpresion?.orden?.id === undefined) return;

    Swal.fire({
      title: '¿Está seguro de eliminar la orden?',
      showDenyButton: true,
      confirmButtonText: `si, borrar`,
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await API.patch(
          END_POINT.eliminar_orden + '/' + datosImpresion.orden.id,
          { estado: 0 }
        );
        if (response.data === 1) {
          // aqui orden
          if (datosImpresion.orden.factura_relacionada > 0) {
            var responseFac = await fn_anularFactura(
              datosImpresion.orden.factura_relacionada
            );
          }

          setReload(true);
          setIsReload(true);
          Swal.fire('Eliminado', '', 'success');
        }
      }
    });
  };

  const actualizarIngreso = async (ingreso) => {
    const result = await API.patch(
      `${END_POINT.actualizar}/${ingreso.id}`,
      ingreso
    );

    return { code: 200, mensaje: 'Actualizado', payload: result.data };
  };

  const abonarIngreso = async (ingreso) => {
    const result = await API.patch(
      `${END_POINT.actualizar}/${ingreso.id}`,
      ingreso
    );

    return { code: 200, mensaje: 'Actualizado', payload: result.data };
  };

  const componentRef = useRef();

  const EventoImprimirReact = () => {
    print();
  };

  const print = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <>
      <div style={{ display: 'none' }}>
        <ImpresionOrden
          datos="mychael datos"
          datosImpresion={datosImpresion}
          ref={componentRef}
        />
      </div>
      <IngresoContext.Provider
        value={{
          ordenes,
          ordenesTemp,
          setOrdenes,
          setOrdenesTemp,
          setReload,
          isNew,
          setIsNew,
          guardarOrden,
          actualizarIngreso,
          abonarIngreso,
          currentIngreso,
          setCurrentIngreso,
          PrepararDatosImpresion,
          EventoImprimirReact,
          componentRef,
          state,
          setState,
          isOpenModalIngreso,
          SetIsOpenModalIngreso,
          guardarAbono,
          isLoading,
          setIsLoading,
          eliminarOrden,
          isOpenModalTotal,
          SetIsOpenModalTotal,
          actualizarTotal,
          openModalIngreso,
          setOpenModalIngreso,
          datosImpresion,
          definirFactura,
          setDefinirFactura
        }}
      >
        {props.children}
      </IngresoContext.Provider>
    </>
  );
};

export default IngresoProvider;
