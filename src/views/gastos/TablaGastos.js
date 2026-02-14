import React, { useState, useContext } from 'react';
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
  Typography,
  TextField
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';
import alertify from 'alertifyjs';
import moment from 'moment';
import { formatCurrency } from '../../Environment/utileria';
import { GastosContext } from '../../context/GastosContext';

const TablaGastos = ({ setGastoEditar }) => {
  const { gastos, totalGastos, eliminarGasto, setRecargarGastos } =
    useContext(GastosContext);

  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = gastos.filter(
    (row) =>
      row.concepto?.toLowerCase().includes(filter.toLowerCase()) ||
      row.observacion?.toLowerCase().includes(filter.toLowerCase()) ||
      row.categoria_gasto?.nombre?.toLowerCase().includes(filter.toLowerCase()) ||
      row.monto?.toString().includes(filter)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    if (sortConfig.key === 'categoria') {
      aValue = a.categoria_gasto?.nombre || '';
      bValue = b.categoria_gasto?.nombre || '';
    }
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleEditar = (gasto) => {
    setGastoEditar(gasto);
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: 'Eliminar gasto',
      text: '¿Está seguro de eliminar este gasto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const resp = await eliminarGasto(id);
          if (resp.codigo === 200) {
            alertify.success('Gasto eliminado', 2);
            setRecargarGastos(true);
          } else {
            alertify.error(resp.Message || 'Error al eliminar', 2);
          }
        } catch (error) {
          alertify.error('Error al eliminar gasto', 2);
        }
      }
    });
  };

  const sortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: 16 }}>
      <Typography variant="h6" style={{ padding: 16 }}>
        Listado de Gastos
      </Typography>
      <div style={{ padding: '0 16px 16px' }}>
        <TextField
          label="Buscar"
          type="text"
          value={filter}
          onChange={handleFilterChange}
          size="small"
        />
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('categoria')}
            >
              Categoría{sortIndicator('categoria')}
            </TableCell>
            <TableCell
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('concepto')}
            >
              Concepto{sortIndicator('concepto')}
            </TableCell>
            <TableCell
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('monto')}
            >
              Monto{sortIndicator('monto')}
            </TableCell>
            <TableCell
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('fecha')}
            >
              Fecha{sortIndicator('fecha')}
            </TableCell>
            <TableCell>Observación</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No hay gastos registrados
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((gasto) => (
              <TableRow key={gasto.id}>
                <TableCell>
                  <Chip
                    label={gasto.categoria_gasto?.nombre || 'Sin categoría'}
                    style={{
                      backgroundColor: gasto.categoria_gasto?.color || '#ccc',
                      color: '#fff'
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>{gasto.concepto}</TableCell>
                <TableCell>{formatCurrency(gasto.monto)}</TableCell>
                <TableCell>
                  {moment(gasto.fecha).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>{gasto.observacion || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEditar(gasto)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEliminar(gasto.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell colSpan={2} align="right">
              <Typography variant="h6">Total:</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">
                {formatCurrency(totalGastos)}
              </Typography>
            </TableCell>
            <TableCell colSpan={3}></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaGastos;
