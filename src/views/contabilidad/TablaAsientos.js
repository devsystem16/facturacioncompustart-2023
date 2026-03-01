import React, { useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  CircularProgress
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Pagination from '@material-ui/lab/Pagination';
import Swal from 'sweetalert2';
import { ContabilidadContext } from '../../context/ContabilidadContext';
import { LoginContext } from '../../context/LoginContext';

const estadoChip = {
  borrador: { label: 'Borrador', color: 'default' },
  contabilizado: { label: 'Contabilizado', style: { backgroundColor: '#4caf50', color: '#fff' } },
  anulado: { label: 'Anulado', style: { backgroundColor: '#f44336', color: '#fff' } }
};

const TablaAsientos = ({ onVer, onEditar }) => {
  const {
    asientos,
    loadingAsientos,
    paginacionAsientos,
    obtenerAsientos,
    contabilizarAsiento,
    anularAsiento
  } = useContext(ContabilidadContext);
  const { tienePermiso } = useContext(LoginContext);

  const handleContabilizar = (asiento) => {
    Swal.fire({
      title: 'Contabilizar asiento',
      text: `¿Contabilizar el asiento #${asiento.numero}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, contabilizar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await contabilizarAsiento(asiento.id);
      }
    });
  };

  const handleAnular = (asiento) => {
    Swal.fire({
      title: 'Anular asiento',
      text: `¿Anular el asiento #${asiento.numero}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await anularAsiento(asiento.id);
      }
    });
  };

  const handlePageChange = (event, page) => {
    obtenerAsientos(page);
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loadingAsientos) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>N°</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Debe</TableCell>
              <TableCell align="right">Haber</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asientos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hay asientos contables
                </TableCell>
              </TableRow>
            ) : (
              asientos.map((asiento) => {
                const chipConfig = estadoChip[asiento.estado] || estadoChip.borrador;
                return (
                  <TableRow key={asiento.id}>
                    <TableCell>{asiento.numero}</TableCell>
                    <TableCell>{asiento.fecha}</TableCell>
                    <TableCell>{asiento.descripcion}</TableCell>
                    <TableCell>{asiento.tipo}</TableCell>
                    <TableCell align="right">${formatCurrency(asiento.total_debe)}</TableCell>
                    <TableCell align="right">${formatCurrency(asiento.total_haber)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={chipConfig.label}
                        color={chipConfig.color || 'default'}
                        style={chipConfig.style || {}}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => onVer(asiento)} title="Ver detalle">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      {asiento.estado === 'borrador' && tienePermiso('contabilidad.asientos-editar') && (
                        <IconButton size="small" onClick={() => onEditar(asiento)} title="Editar">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {asiento.estado === 'borrador' && tienePermiso('contabilidad.asientos-contabilizar') && (
                        <IconButton size="small" onClick={() => handleContabilizar(asiento)} title="Contabilizar">
                          <CheckCircleIcon fontSize="small" style={{ color: '#4caf50' }} />
                        </IconButton>
                      )}
                      {asiento.estado !== 'anulado' && tienePermiso('contabilidad.asientos-anular') && (
                        <IconButton size="small" onClick={() => handleAnular(asiento)} title="Anular">
                          <CancelIcon fontSize="small" style={{ color: '#f44336' }} />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {paginacionAsientos.last_page > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={paginacionAsientos.last_page}
            page={paginacionAsientos.current_page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </>
  );
};

export default TablaAsientos;
