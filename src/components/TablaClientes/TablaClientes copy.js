import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@material-ui/core';
import columns from './columns';
import API from '../../Environment/config';
import { ClienteContext } from '../../context/ClienteContext';
import alertify from 'alertifyjs';

const END_POINT = {
  actualizarCliente: 'api/clientes'
};

export default function TablaClientes() {
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [clienteEdit, setClienteEdit] = React.useState(null);

  const {
    clientes,
    clientesFiltro,
    setClientes,
    setExistenCambios,
    cargarClientes,
  } = React.useContext(ClienteContext);

  // Cargar clientes al montar el componente
  React.useEffect(() => {
    cargarClientes();
  }, []);

  // Abrir modal al doble click en la fila
  const onCellDoubleClick = (params) => {
    const cliente = clientes.find(c => c.id === params.id);
    if (!cliente) return;
    setClienteEdit({ ...cliente }); // Clonar objeto para editar
    setModalOpen(true);
  };

  // Manejar cambios en los inputs del modal
  const handleChange = (field, value) => {
    setClienteEdit(prev => ({ ...prev, [field]: value }));
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!clienteEdit) return;
    try {
      setTableIsLoading(true);
      await API.patch(`${END_POINT.actualizarCliente}/${clienteEdit.id}`, clienteEdit);

      // Actualizar estado local
      setClientes(prev =>
        prev.map(c => (c.id === clienteEdit.id ? clienteEdit : c))
      );

      alertify.success('Cliente actualizado correctamente', 2);
      setExistenCambios(false);
      setModalOpen(false);
      setClienteEdit(null);

      // Recargar tabla
      cargarClientes();
    } catch (err) {
      console.error(err);
      alertify.error('Error al actualizar el cliente', 2);
    } finally {
      setTableIsLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setModalOpen(false);
    setClienteEdit(null);
    // Recargar tabla
    cargarClientes();
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
          onCellDoubleClick={onCellDoubleClick}
        />
      </div>

      {/* Modal de edición */}
      <Dialog open={modalOpen} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          {clienteEdit && (
            <>
              <TextField
                fullWidth
                margin="dense"
                label="Cédula"
                value={clienteEdit.cedula}
                onChange={(e) => handleChange('cedula', e.target.value)}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Nombres"
                value={clienteEdit.nombres}
                onChange={(e) => handleChange('nombres', e.target.value)}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Teléfono"
                value={clienteEdit.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Dirección"
                value={clienteEdit.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Correo"
                value={clienteEdit.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Observación"
                value={clienteEdit.observacion}
                onChange={(e) => handleChange('observacion', e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={tableIsLoading}>
            {tableIsLoading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
