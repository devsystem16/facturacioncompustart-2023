import React, { useEffect, useContext, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress
} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import { ContabilidadContext } from '../../context/ContabilidadContext';
import { LoginContext } from '../../context/LoginContext';
import ModalCuenta from './ModalCuenta';

const PlanDeCuentas = () => {
  const {
    cuentasArbol,
    loadingCuentas,
    obtenerCuentasArbol,
    eliminarCuenta
  } = useContext(ContabilidadContext);
  const { tienePermiso } = useContext(LoginContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [cuentaEditar, setCuentaEditar] = useState(null);

  useEffect(() => {
    obtenerCuentasArbol();
  }, []);

  const handleNuevaCuenta = () => {
    setCuentaEditar(null);
    setModalOpen(true);
  };

  const handleEditar = (cuenta) => {
    setCuentaEditar(cuenta);
    setModalOpen(true);
  };

  const handleEliminar = (cuenta) => {
    Swal.fire({
      title: 'Eliminar cuenta',
      text: `¿Está seguro de eliminar "${cuenta.codigo} - ${cuenta.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarCuenta(cuenta.id);
      }
    });
  };

  const renderTree = (nodos) => {
    if (!nodos || nodos.length === 0) return null;
    return nodos.map((cuenta) => (
      <TreeItem
        key={cuenta.id}
        nodeId={String(cuenta.id)}
        label={
          <Box display="flex" alignItems="center" justifyContent="space-between" py={0.5}>
            <Typography variant="body2">
              <strong>{cuenta.codigo}</strong> - {cuenta.nombre}
              {cuenta.es_detalle && (
                <span style={{ color: '#888', marginLeft: 8, fontSize: 11 }}>
                  (detalle)
                </span>
              )}
            </Typography>
            <Box>
              {tienePermiso('contabilidad.plan-cuentas-editar') && (
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleEditar(cuenta); }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {tienePermiso('contabilidad.plan-cuentas-eliminar') && (
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleEliminar(cuenta); }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        }
      >
        {renderTree(cuenta.children_recursive)}
      </TreeItem>
    ));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Plan de Cuentas</Typography>
        {tienePermiso('contabilidad.plan-cuentas-crear') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNuevaCuenta}
          >
            Nueva Cuenta
          </Button>
        )}
      </Box>

      {loadingCuentas ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {renderTree(cuentasArbol)}
        </TreeView>
      )}

      <ModalCuenta
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cuenta={cuentaEditar}
      />
    </Box>
  );
};

export default PlanDeCuentas;
