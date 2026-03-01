import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card, Box, Typography, makeStyles } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import columns from './columns';
import API from '../../Environment/config';
import { useNavigate } from 'react-router-dom';
import { ClienteContext } from '../../context/ClienteContext';
import { LoginContext } from '../../context/LoginContext';
import alertify from 'alertifyjs';

const useStyles = makeStyles((theme) => ({
  tableCard: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  tableHeader: {
    padding: '12px 20px',
    backgroundColor: '#fafbfc',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  tableHeaderTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#424242'
  },
  tableHeaderCount: {
    fontSize: 12,
    color: '#78909C',
    marginLeft: 4
  },
  gridContainer: {
    height: 420,
    width: '100%',
    '& .MuiDataGrid-root': {
      border: 'none',
      fontSize: 13
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f5f5f5',
      borderBottom: '2px solid #e0e0e0',
      fontSize: 13,
      fontWeight: 600
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#E3F2FD'
    },
    '& .MuiDataGrid-row.Mui-selected': {
      backgroundColor: '#BBDEFB',
      '&:hover': {
        backgroundColor: '#90CAF9'
      }
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid #f0f0f0'
    }
  }
}));

const END_POINT = {
  actualizarCliente: 'api/clientes'
};

export default function TablaClientes() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
  const [existenCambios, setExistenCambios] = React.useState(false);

  const {
    clientes,
    clientesFiltro,
    setClientes,
    setDeleteCliente,
    cargarClientes,
    deleteCliente
  } = React.useContext(ClienteContext);

  const {
    setEdicionActiva
  } = React.useContext(LoginContext);

  React.useEffect(() => {
    cargarClientes();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEdicionActiva(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const buscarClienteObjeto = (id) => {
    return clientes.find((clienteActual) => clienteActual.id === id);
  };

  const marcarCambios = (params, event) => {
    if (params.colDef.editable) setEdicionActiva(true);
  };

  const editarCliente = (prm_cliente) => {
    const cliente = buscarClienteObjeto(prm_cliente.id);
    if (!cliente) return;

    const field = prm_cliente.field;
    const clienteNuevo = { ...cliente, [field]: prm_cliente.value };

    updateclientesDB(clienteNuevo);

    const nuevoListado = clientes.map((item) =>
      item.id === cliente.id ? clienteNuevo : item
    );

    setClientes(nuevoListado);
    setEdicionActiva(false);
  };

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

  const onRowSelectEvent = (parameters) => {
    if (parameters.length < 1) return;
    const cliente = buscarClienteObjeto(parameters[0]);
    setDeleteCliente(cliente);
  };

  return (
    <Card className={classes.tableCard}>
      <Box className={classes.tableHeader}>
        <ListIcon style={{ fontSize: 18, color: '#1565C0' }} />
        <Typography className={classes.tableHeaderTitle}>
          Listado de Clientes
        </Typography>
        <Typography className={classes.tableHeaderCount}>
          ({clientesFiltro.length} registros)
        </Typography>
      </Box>
      <div className={classes.gridContainer}>
        <DataGrid
          rows={clientesFiltro}
          columns={columns}
          checkboxSelection={false}
          pageSize={15}
          rowHeight={32}
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
