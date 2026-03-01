import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Tooltip
} from '@material-ui/core';
import { ClienteContext } from '../../../context/ClienteContext';
import { LoginContext } from '../../../context/LoginContext';

import { Search as SearchIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  toolbarCard: {
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden'
  },
  toolbarContent: {
    padding: '12px 20px !important'
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: '#fafbfc',
      '&:hover': {
        backgroundColor: '#f5f5f5'
      },
      '&.Mui-focused': {
        backgroundColor: '#fff'
      }
    }
  },
  btnExport: {
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    padding: '6px 16px'
  },
  btnDelete: {
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    padding: '6px 16px',
    backgroundColor: 'rgb(154, 0, 54)',
    '&:hover': {
      backgroundColor: 'rgb(130, 0, 45)'
    }
  },
  btnNew: {
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    padding: '6px 20px',
    boxShadow: '0 2px 8px rgba(25,118,210,0.3)'
  }
}));

const exportarCSV = (clientes) => {
  if (!clientes || clientes.length === 0) return;

  const headers = ['Cedula', 'Nombres', 'Correo', 'Telefono', 'Direccion', 'Observacion'];
  const rows = clientes.map((c) =>
    [
      `"${(c.cedula || '').replace(/"/g, '""')}"`,
      `"${(c.nombres || '').replace(/"/g, '""')}"`,
      `"${(c.correo || '').replace(/"/g, '""')}"`,
      `"${(c.telefono || '').replace(/"/g, '""')}"`,
      `"${(c.direccion || '').replace(/"/g, '""')}"`,
      `"${(c.observacion || '').replace(/"/g, '""')}"`,
    ].join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `clientes_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();

  const [disablebotones, setDisablebotones] = useState({
    eliminar: false,
    nuevoCliente: false
  });

  const { setIsNewClient, filtrar, eliminarCliente, deleteCliente, clientesFiltro } =
    useContext(ClienteContext);
  const { tienePermiso } = useContext(LoginContext);

  useEffect(() => {
    verificarAccesos();
  }, []);

  const verificarAccesos = () => {
    setDisablebotones({
      eliminar: !tienePermiso('clientes.eliminar'),
      nuevoCliente: !tienePermiso('clientes.crear')
    });
  };

  const deleteCustomer = () => {
    if (deleteCliente?.id === undefined) return;

    Swal.fire({
      title: '¿Esta seguro de eliminar el cliente?',
      showDenyButton: true,
      confirmButtonText: `Si, eliminar`,
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        eliminarCliente();
      }
    });
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Card className={classes.toolbarCard}>
        <CardContent className={classes.toolbarContent}>
          <Box display="flex" alignItems="center" flexWrap="wrap" style={{ gap: 10 }}>
            {/* Buscador */}
            <Box flexGrow={1} maxWidth={480} minWidth={200}>
              <TextField
                fullWidth
                onChange={filtrar}
                className={classes.searchField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Buscar por nombre, cedula, telefono..."
                variant="outlined"
                size="small"
              />
            </Box>

            {/* Botones */}
            <Box display="flex" style={{ gap: 8 }}>
              <Tooltip title="Exportar listado a CSV">
                <Button
                  variant="outlined"
                  color="default"
                  className={classes.btnExport}
                  startIcon={<GetAppIcon />}
                  onClick={() => exportarCSV(clientesFiltro)}
                >
                  Exportar
                </Button>
              </Tooltip>

              <Tooltip title="Eliminar cliente seleccionado">
                <span>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.btnDelete}
                    startIcon={<DeleteIcon />}
                    disabled={disablebotones.eliminar}
                    onClick={deleteCustomer}
                  >
                    Eliminar
                  </Button>
                </span>
              </Tooltip>

              <Button
                color="primary"
                variant="contained"
                className={classes.btnNew}
                startIcon={<PersonAddIcon />}
                onClick={() => setIsNewClient(true)}
                disabled={disablebotones.nuevoCliente}
              >
                Nuevo Cliente
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
