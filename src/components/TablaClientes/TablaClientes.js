import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card } from '@material-ui/core';
import columns from './columns';
import axios from 'axios';
import API from '../../Environment/config';

import { ClienteContext } from '../../context/ClienteContext';

// import PerfectScrollbar from 'react-perfect-scrollbar';
import alertify from 'alertifyjs';

const END_POINT = {
  actualizarCliente: 'api/clientes'
};

export default function TablaClientes({}) {
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
  const {
    clientes,
    clientesFiltro,
    setClientes,
    setDeleteCliente,
    cargarClientes
  } = React.useContext(ClienteContext);

  React.useEffect(() => {
    cargarClientes();
  }, []);

  const buscarClienteObjeto = (id) => {
    return clientes.find((clienteActual) => clienteActual.id === id);
  };

  const editarCliente = (prm_cliente) => {
    var cliente = buscarClienteObjeto(prm_cliente.id);

    if (cliente.id) {
      var field = prm_cliente.field;
      var clienteNuevo = [];

      const nuevoListado = clientes.map((item) => {
        if (item.id === cliente.id) {
          if (field === 'correo')
            clienteNuevo = {
              ...item,
              correo: prm_cliente.value
            };
          if (field === 'cedula')
            clienteNuevo = {
              ...item,
              cedula: prm_cliente.value
            };
          if (field === 'nombres')
            clienteNuevo = {
              ...item,
              nombres: prm_cliente.value
            };

          if (field === 'telefono')
            clienteNuevo = {
              ...item,
              telefono: prm_cliente.value
            };
          if (field === 'direccion')
            clienteNuevo = {
              ...item,
              direccion: prm_cliente.value
            };
          if (field === 'observacion')
            clienteNuevo = {
              ...item,
              observacion: prm_cliente.value
            };

          updateclientesDB(clienteNuevo);

          return clienteNuevo;
        }

        return item;
      });

      setClientes(nuevoListado);
    }
  };

  const updateclientesDB = async (cliente) => {
    setTableIsLoading(true);

    const result = await API.patch(
      END_POINT.actualizarCliente + '/' + cliente.id,
      cliente
    );

    setTableIsLoading(false);
    alertify.success('Actualizado', 2);
    console.log(result);
  };

  const onRowSelectEvent = (parameters) => {
    if (parameters.length < 1) return;

    var cliente = buscarClienteObjeto(parameters[0]);

    setDeleteCliente(cliente);
    // alert(JSON.stringify(parameters.data));
  };
  return (
    <Card>
      <div style={{ height: 360, width: '100%' }}>
        <DataGrid
          rows={clientesFiltro}
          columns={columns}
          datasets="Commodity"
          checkboxSelection={false}
          // onEditCellChangeCommitted={editarCliente}
          onCellEditCommit={(params) => {
            editarCliente(params);
          }}
          pageSize={10}
          disableSelectionOnClick={false}
          rowHeight={23}
          loading={tableIsLoading}
          // onRowSelected={onRowSelectEvent}
          onSelectionModelChange={(row) => {
            onRowSelectEvent(row);
          }}
        />
      </div>
    </Card>
  );
}
