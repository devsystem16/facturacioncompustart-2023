import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card } from '@material-ui/core';
import columns from './columns';
import API from '../../Environment/config';
import { useNavigate } from 'react-router-dom';
import { ClienteContext } from '../../context/ClienteContext';
import { LoginContext } from '../../context/LoginContext';
import alertify from 'alertifyjs';

const END_POINT = {
  actualizarCliente: 'api/clientes'
};

export default function TablaClientes() {
  const navigate = useNavigate();
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
   const [existenCambios, setExistenCambios] = React.useState(false);

  const {
    clientes,
    clientesFiltro,
    setClientes,
    setDeleteCliente,
    cargarClientes ,
 
    deleteCliente
  } = React.useContext(ClienteContext);


  const {
    setEdicionActiva
  } = React.useContext(LoginContext);

  // Cargar clientes al montar el componente
  React.useEffect(() => {
    cargarClientes();


     const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        console.log('Se presionó Escape');
        setEdicionActiva(false);
        // Aquí puedes cancelar edición, cerrar modal, etc.
      }
    };
document.addEventListener('keydown', handleKeyDown);

  }, []);


 


  // Buscar cliente por ID
  const buscarClienteObjeto = (id) => {
    return clientes.find((clienteActual) => clienteActual.id === id);
  };

  // Marcar que hay cambios
  const marcarCambios = (params, event) => {
 
if(params.colDef.editable)
    setEdicionActiva(true);
 
  };

  // Editar cliente
  const editarCliente = (prm_cliente) => {


    
    const cliente = buscarClienteObjeto(prm_cliente.id);
    if (!cliente) return;

    const field = prm_cliente.field;
    const clienteNuevo = { ...cliente, [field]: prm_cliente.value };

    // Actualizar en DB
    updateclientesDB(clienteNuevo);

    // Actualizar estado local
    const nuevoListado = clientes.map((item) =>
      item.id === cliente.id ? clienteNuevo : item
    );

    setClientes(nuevoListado);
    setEdicionActiva(false); // reset cambios
    
  };

  // Actualizar cliente en API
  const updateclientesDB = async (cliente) => {
    try {
      setTableIsLoading(true);
      await API.patch(`${END_POINT.actualizarCliente}/${cliente.id}`, cliente);
      alertify.success('Cliente actualizado correctamente', 2);
    } catch (err) {
      alertify.error('Error al actualizar el cliente', 2);
      console.error(err);
    } finally {
      setTableIsLoading(false);
    }
  };

  // Selección de fila
  const onRowSelectEvent = (parameters) => {
    if (parameters.length < 1) return;
    const cliente = buscarClienteObjeto(parameters[0]);
    setDeleteCliente(cliente);
  };


   
 


  return (
    <Card>
      <div style={{ height: 360, width: '100%' }}>
        <DataGrid
          rows={clientesFiltro}
          columns={columns}
          checkboxSelection={false}
          pageSize={10}
          rowHeight={23}
          loading={tableIsLoading}
          disableSelectionOnClick={false}
          onCellEditCommit={editarCliente}
          onSelectionModelChange={onRowSelectEvent}
           onCellDoubleClick={(params, event) => {
            marcarCambios(params, event);
            }}
        />
      </div>
    </Card>
  );
}
