import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import alertify from 'alertifyjs';
import API from '../Environment/config';

const END_POINT = {
  cargarClientes: 'api/clientes/listado/1000000',
  guardarFactura: 'api/facturas',
  eliminar: 'api/clientes',
  buscarCliente: 'api/clientes'
};

export const ClienteContext = createContext();

const ClienteProvider = (props) => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltro, setClientesFiltro] = useState([]);
  const [deleteCliente, setDeleteCliente] = useState(0);

  const [currentCliente, setCurrentCliente] = useState({
    cedula: '',
    nombres: '-SELECCIONE-'
  });

  const [isNewClient, setIsNewClient] = useState(false);

  const cargarClientes = async () => {
    const jsonClientes = await API.get(END_POINT.cargarClientes);

    setClientes(jsonClientes.data);
    setClientesFiltro(jsonClientes.data);
  };

  const buscarCliente = async (id) => {
    const response = await API.get(END_POINT.buscarCliente + '/' + id);
    return response.data;
  };
  const eliminarCliente = async () => {
    const response = await API.delete(
      END_POINT.eliminar + '/' + deleteCliente.id
    );

    if (response.data.estado !== 200) {
      alertify.error(response.data.mensaje, 2);
      return;
    }
    alertify.success(response.data.mensaje, 2);
    cargarClientes();
  };
  const filtrar = (e) => {
    console.log(e.target.value);
    const results = clientes.filter((cliente) => {
      const itemData =
        cliente && cliente.nombres ? cliente.nombres.toUpperCase() : '';
      const textData = e.target.value.toUpperCase();

      const itemData1 =
        cliente && cliente.cedula ? cliente.cedula.toUpperCase() : '';
      const textData1 = e.target.value.toUpperCase();

      const itemData2 =
        cliente && cliente.telefono ? cliente.telefono.toUpperCase() : '';
      const textData2 = e.target.value.toUpperCase();

      const itemData3 =
        cliente && cliente.correo ? cliente.correo.toUpperCase() : '';
      const textData3 = e.target.value.toUpperCase();

      // const itemData = cliente.nombres.toUpperCase();
      // const textData = e.target.value.toUpperCase();

      // const itemData1 = cliente.cedula.toUpperCase();
      // const textData1 = e.target.value.toUpperCase();

      // const itemData2 = cliente.telefono.toUpperCase();
      // const textData2 = e.target.value.toUpperCase();

      // const itemData3 = cliente.correo.toUpperCase();
      // const textData3 = e.target.value.toUpperCase();

      return (
        itemData.indexOf(textData) > -1 ||
        itemData1.indexOf(textData1) > -1 ||
        itemData2.indexOf(textData2) > -1 ||
        itemData3.indexOf(textData3) > -1
      );
    });

    setClientesFiltro(results);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <ClienteContext.Provider
      value={{
        clientes,
        currentCliente,
        setClientes,
        setCurrentCliente,
        isNewClient,
        setIsNewClient,
        filtrar,
        clientesFiltro,
        setClientesFiltro,
        setDeleteCliente,
        deleteCliente,
        eliminarCliente,
        buscarCliente,
        cargarClientes
      }}
    >
      {props.children}
    </ClienteContext.Provider>
  );
};

export default ClienteProvider;
