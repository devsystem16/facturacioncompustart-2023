import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
  makeStyles
} from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import API from '../../Environment/config';
import Swal from 'sweetalert2';
import alertify from 'alertifyjs';
import { LoginContext } from '../../context/LoginContext';
import Loading from '../../components/Loading/Loading';
import { formatCurrency } from '../../Environment/utileria';
import { PeriodoContext } from '../../context/PeriodoContext';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  headerCell: {
    backgroundColor: '#f5f6fa',
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: '#ecedf2'
    }
  },
  headerCellNoSort: {
    backgroundColor: '#f5f6fa',
    fontWeight: 600
  },
  bodyRow: {
    '&:hover': {
      backgroundColor: '#f8f9ff'
    }
  },
  totalRow: {
    backgroundColor: '#fafafa'
  }
}));

const TablaRetiros = ({ titulo = 'Listado', denominaciones, setDenominaciones }) => {
  const classes = useStyles();
  const { totalRetiros, setTotalRetiros } = useContext(PeriodoContext);
  const { tienePermiso } = useContext(LoginContext);

  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [isLoading, setIsLoading] = useState(false);

  const calcularTotal = (array) => {
    const sumaValorRetiro = array.reduce((acc, item) => acc + item.valorRetiro, 0);
    setTotalRetiros(sumaValorRetiro);
  };

  useEffect(() => {
    calcularTotal(denominaciones);
  }, [denominaciones]);

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

  const filteredData = denominaciones.filter((row) =>
    row.concepto?.toLowerCase().includes(filter.toLowerCase()) ||
    row.observacion?.toLowerCase().includes(filter.toLowerCase()) ||
    row.valorRetiro?.toString().includes(filter)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const eliminar = async (idRetiro) => {
    setIsLoading(true);
    try {
      const response = await API.post(`/api/retiros/eliminar/retiro/${idRetiro}`);
      setDenominaciones(response.data.data);
      calcularTotal(response.data.data);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc'
      ? <ArrowUpwardIcon style={{ fontSize: 14, marginLeft: 4, verticalAlign: 'middle' }} />
      : <ArrowDownwardIcon style={{ fontSize: 14, marginLeft: 4, verticalAlign: 'middle' }} />;
  };

  const totalNumerico = denominaciones.reduce((acc, item) => acc + item.valorRetiro, 0);

  return (
    <Card className={classes.card}>
      <CardContent style={{ paddingBottom: 0 }}>
        <Loading text="Eliminando..." open={isLoading} setOpen={setIsLoading} />

        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={2}>
          <Box display="flex" alignItems="center">
            <ListAltIcon style={{ marginRight: 8, color: '#3f51b5' }} />
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              {titulo}
            </Typography>
            <Chip
              label={`${denominaciones.length} registros`}
              size="small"
              style={{ marginLeft: 12, backgroundColor: '#e8eaf6', color: '#3f51b5' }}
            />
          </Box>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Buscar..."
            value={filter}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#9e9e9e' }} />
                </InputAdornment>
              )
            }}
            style={{ minWidth: 220 }}
          />
        </Box>
      </CardContent>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell} onClick={() => handleSort('id')}>
                ID <SortIcon columnKey="id" />
              </TableCell>
              <TableCell className={classes.headerCell} onClick={() => handleSort('valorRetiro')}>
                Valor Retiro <SortIcon columnKey="valorRetiro" />
              </TableCell>
              <TableCell className={classes.headerCell} onClick={() => handleSort('concepto')}>
                Por Concepto de <SortIcon columnKey="concepto" />
              </TableCell>
              <TableCell className={classes.headerCell} onClick={() => handleSort('observacion')}>
                Observaciones <SortIcon columnKey="observacion" />
              </TableCell>
              <TableCell className={classes.headerCellNoSort} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" style={{ padding: 32 }}>
                  <Typography variant="body2" color="textSecondary">
                    No hay gastos registrados en este periodo
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((retiro) => (
                <TableRow key={retiro.id} className={classes.bodyRow}>
                  <TableCell>{retiro.id}</TableCell>
                  <TableCell>
                    <Chip
                      label={formatCurrency(retiro.valorRetiro)}
                      size="small"
                      style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>{retiro.concepto}</TableCell>
                  <TableCell>{retiro.observacion || '-'}</TableCell>
                  <TableCell align="center">
                    {tienePermiso('retiros.eliminar') && (
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => eliminar(retiro.id)}>
                          <DeleteIcon fontSize="small" style={{ color: '#e53935' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {tienePermiso('contabilidad.asientos-generar') && (
                      <Tooltip title="Generar Asiento Contable">
                        <IconButton
                          size="small"
                          onClick={() => {
                            Swal.fire({
                              title: 'Generar asiento contable',
                              text: `¿Generar asiento desde el retiro #${retiro.id}?`,
                              icon: 'question',
                              showCancelButton: true,
                              confirmButtonText: 'Sí, generar',
                              cancelButtonText: 'Cancelar'
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                try {
                                  const resp = await API.post(`api/asientos-contables/generar/desde-retiro/${retiro.id}`);
                                  alertify.success(resp.data.mensaje || 'Asiento generado', 2);
                                } catch (error) {
                                  const msg = error.response?.data?.mensaje || 'Error al generar asiento';
                                  alertify.error(msg, 3);
                                }
                              }
                            });
                          }}
                        >
                          <AccountBalanceIcon fontSize="small" style={{ color: '#1976d2' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}

            {/* Total row */}
            {sortedData.length > 0 && (
              <TableRow className={classes.totalRow}>
                <TableCell colSpan={1} />
                <TableCell>
                  <Chip
                    label={`Total: ${formatCurrency(totalNumerico)}`}
                    style={{
                      backgroundColor: '#1a237e',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  />
                </TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default TablaRetiros;
