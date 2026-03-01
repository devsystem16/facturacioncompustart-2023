import React, { useState, useContext, useEffect } from 'react';
import {
  makeStyles,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  colors
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { UtilidadProductosContext } from '../../../context/UtilidadProductosContext';
import { LoginContext } from '../../../context/LoginContext';
import { formatCurrency } from '../../../Environment/utileria';

const useStyles = makeStyles((theme) => ({
  filtros: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  tableHeader: {
    backgroundColor: '#1a237e',
    '& th': {
      color: '#ffffff',
      fontWeight: 600,
      fontSize: '0.8rem',
      whiteSpace: 'nowrap'
    }
  },
  tableRowAlt: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f5f6fa'
    }
  },
  positivo: {
    color: colors.green[700],
    fontWeight: 600
  },
  negativo: {
    color: colors.red[700],
    fontWeight: 600
  },
  exportBtn: {
    backgroundColor: colors.green[600],
    color: '#fff',
    '&:hover': {
      backgroundColor: colors.green[800]
    }
  },
  paginacion: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    gap: theme.spacing(1)
  },
  resumenCard: {
    textAlign: 'center'
  }
}));

export default function TabUtilidad() {
  const classes = useStyles();
  const {
    productos,
    totales,
    meta,
    bodegas,
    isLoading,
    cargarBodegas,
    cargarProductos,
    exportarExcel
  } = useContext(UtilidadProductosContext);
  const { tienePermiso } = useContext(LoginContext);

  const [search, setSearch] = useState('');
  const [bodegaId, setBodegaId] = useState('todos');
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState('');
  const [orderDir, setOrderDir] = useState('asc');

  useEffect(() => {
    cargarBodegas();
    cargarProductos({ page: 1, bodega_id: 'todos', search: '' });
  }, []);

  const handleBuscar = () => {
    setPage(1);
    cargarProductos({ page: 1, bodega_id: bodegaId, search });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleBuscar();
  };

  const handleBodegaChange = (e) => {
    const value = e.target.value;
    setBodegaId(value);
    setPage(1);
    cargarProductos({ page: 1, bodega_id: value, search });
  };

  const handleExportar = () => {
    exportarExcel({ bodega_id: bodegaId, search });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    cargarProductos({ page: newPage, bodega_id: bodegaId, search });
  };

  const handleSort = (campo) => {
    const isAsc = orderBy === campo && orderDir === 'asc';
    setOrderDir(isAsc ? 'desc' : 'asc');
    setOrderBy(campo);
  };

  const sortData = (data) => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      let valA = a[orderBy];
      let valB = b[orderBy];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }
      if (valA < valB) return orderDir === 'asc' ? -1 : 1;
      if (valA > valB) return orderDir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const totalPages = Math.ceil((meta.total || 0) / (meta.per_page || 25));
  const productosSorted = sortData(productos);

  const columnas = [
    { id: 'id', label: 'Id', align: 'left', numeric: true },
    { id: 'codigo_barra', label: 'Código', align: 'left' },
    { id: 'nombre', label: 'Nombre', align: 'left' },
    { id: 'precio_publico', label: 'P. Público', align: 'right', currency: true },
    { id: 'precio_tecnico', label: 'P. Técnico', align: 'right', currency: true },
    { id: 'precio_distribuidor', label: 'P. Mayorista', align: 'right', currency: true },
    { id: 'stock', label: '#Stock', align: 'right', numeric: true },
    { id: 'precio_compra', label: 'P. Compra', align: 'right', decimal: true },
    { id: 'costo_total', label: 'Costo Total', align: 'right', decimal: true },
    { id: 'utilidad_unitaria', label: 'Utilidad Unitaria', align: 'right', utilidad: true },
    { id: 'utilidad_total', label: 'Utilidad Total', align: 'right', utilidad: true }
  ];

  const renderCelda = (producto, col) => {
    const valor = producto[col.id];
    if (col.currency) return formatCurrency(valor || 0);
    if (col.decimal) return `${(valor || 0).toFixed(2)}`;
    if (col.utilidad) {
      const num = valor || 0;
      return (
        <span className={num >= 0 ? classes.positivo : classes.negativo}>
          {num.toFixed(2)}
        </span>
      );
    }
    return valor;
  };

  return (
    <div>
      {/* Filtros */}
      <Paper className={classes.filtros}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Buscar por código o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" onClick={handleBuscar}>
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <TextField
              select
              variant="outlined"
              size="small"
              fullWidth
              label="Bodega"
              value={bodegaId}
              onChange={handleBodegaChange}
            >
              <MenuItem value="todos">Todos</MenuItem>
              {bodegas.map((bodega) => (
                <MenuItem key={bodega.id} value={bodega.id}>
                  {bodega.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {tienePermiso('productos.utilidad-exportar') && (
            <Grid item xs={12} sm={3} md={3}>
              <Button
                variant="contained"
                className={classes.exportBtn}
                startIcon={<GetAppIcon />}
                onClick={handleExportar}
              >
                Exportar Excel
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Resumen Totales */}
      <Grid container spacing={2} style={{ marginBottom: 8, marginTop: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card className={classes.resumenCard}>
            <CardContent>
              <Typography color="textSecondary" variant="h6">
                Total Stock
              </Typography>
              <Typography variant="h4" style={{ color: colors.blue[600] }}>
                {totales.total_stock || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className={classes.resumenCard}>
            <CardContent>
              <Typography color="textSecondary" variant="h6">
                Total Costo Inventario
              </Typography>
              <Typography variant="h4" style={{ color: colors.indigo[600] }}>
                {formatCurrency(totales.total_costo || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className={classes.resumenCard}>
            <CardContent>
              <Typography color="textSecondary" variant="h6">
                Total Utilidad
              </Typography>
              <Typography
                variant="h4"
                style={{
                  color:
                    (totales.total_utilidad || 0) >= 0
                      ? colors.green[600]
                      : colors.red[600]
                }}
              >
                {formatCurrency(totales.total_utilidad || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  {columnas.map((col) => (
                    <TableCell key={col.id} align={col.align}>
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? orderDir : 'asc'}
                        onClick={() => handleSort(col.id)}
                        style={{ color: '#fff' }}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {productosSorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <Typography variant="body2" style={{ padding: 16 }}>
                        No se encontraron productos
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  productosSorted.map((producto) => (
                    <TableRow key={producto.id} hover className={classes.tableRowAlt}>
                      {columnas.map((col) => (
                        <TableCell key={col.id} align={col.align}>
                          {renderCelda(producto, col)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginacion */}
          {totalPages > 1 && (
            <div className={classes.paginacion}>
              <IconButton
                size="small"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <Typography variant="body2">
                Página {page} de {totalPages} ({meta.total} registros)
              </Typography>
              <IconButton
                size="small"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                <NavigateNextIcon />
              </IconButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
