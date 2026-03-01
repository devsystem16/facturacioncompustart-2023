import React, { useContext } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { KardexContext } from '../../context/KardexContext';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    overflowX: 'auto'
  },
  headerCell: {
    fontWeight: 600,
    whiteSpace: 'nowrap',
    fontSize: '0.75rem',
    padding: '8px 6px'
  },
  bodyCell: {
    fontSize: '0.8rem',
    padding: '6px',
    whiteSpace: 'nowrap'
  },
  paginationBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    flexWrap: 'wrap',
    gap: theme.spacing(1)
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4)
  }
}));

const tipoColors = {
  Ventas: { backgroundColor: '#e3f2fd', color: '#1565c0' },
  Compras: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  Fabricacion: { backgroundColor: '#fff3e0', color: '#e65100' },
  Ajuste: { backgroundColor: '#fce4ec', color: '#c62828' },
  Transferencia: { backgroundColor: '#f3e5f5', color: '#6a1b9a' },
  Devolucion: { backgroundColor: '#e0f2f1', color: '#00695c' }
};

const TablaKardex = () => {
  const classes = useStyles();
  const {
    movimientos,
    loading,
    paginacion,
    filtros,
    setFiltros,
    obtenerMovimientos
  } = useContext(KardexContext);

  const handlePageChange = (event, page) => {
    obtenerMovimientos(page);
  };

  const handlePerPageChange = (e) => {
    setFiltros({ ...filtros, per_page: parseInt(e.target.value) });
    setTimeout(() => obtenerMovimientos(1), 0);
  };

  const formatNumber = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (loading) {
    return (
      <Card>
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <TableContainer className={classes.tableContainer}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>ID</TableCell>
              <TableCell className={classes.headerCell}>Fecha</TableCell>
              <TableCell className={classes.headerCell}>Codigo</TableCell>
              <TableCell className={classes.headerCell}>Producto</TableCell>
              <TableCell className={classes.headerCell}>Bodega</TableCell>
              <TableCell className={classes.headerCell}>Detalle</TableCell>
              <TableCell className={classes.headerCell}>Tipo</TableCell>
              <TableCell className={classes.headerCell} align="right">Entrada</TableCell>
              <TableCell className={classes.headerCell} align="right">Salida</TableCell>
              <TableCell className={classes.headerCell} align="right">Saldo</TableCell>
              <TableCell className={classes.headerCell} align="right">Costo Unit.</TableCell>
              <TableCell className={classes.headerCell} align="right">Costo Total</TableCell>
              <TableCell className={classes.headerCell}>Usuario</TableCell>
              <TableCell className={classes.headerCell}>Referencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimientos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No se encontraron movimientos
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              movimientos.map((mov) => (
                <TableRow key={mov.id} hover>
                  <TableCell className={classes.bodyCell}>{mov.id}</TableCell>
                  <TableCell className={classes.bodyCell}>{mov.fecha}</TableCell>
                  <TableCell className={classes.bodyCell}>{mov.codigo}</TableCell>
                  <TableCell className={classes.bodyCell}>{mov.producto}</TableCell>
                  <TableCell className={classes.bodyCell}>
                    {mov.bodega ? mov.bodega.nombre : '-'}
                  </TableCell>
                  <TableCell className={classes.bodyCell}>{mov.detalle || '-'}</TableCell>
                  <TableCell className={classes.bodyCell}>
                    <Chip
                      label={mov.tipo}
                      size="small"
                      style={tipoColors[mov.tipo] || {}}
                    />
                  </TableCell>
                  <TableCell className={classes.bodyCell} align="right">
                    {parseFloat(mov.entrada) > 0 ? formatNumber(mov.entrada) : '-'}
                  </TableCell>
                  <TableCell className={classes.bodyCell} align="right">
                    {parseFloat(mov.salida) > 0 ? formatNumber(mov.salida) : '-'}
                  </TableCell>
                  <TableCell className={classes.bodyCell} align="right">
                    {formatNumber(mov.saldo)}
                  </TableCell>
                  <TableCell className={classes.bodyCell} align="right">
                    ${formatNumber(mov.costo_unitario)}
                  </TableCell>
                  <TableCell className={classes.bodyCell} align="right">
                    ${formatNumber(mov.costo_total)}
                  </TableCell>
                  <TableCell className={classes.bodyCell}>{mov.usuario || '-'}</TableCell>
                  <TableCell className={classes.bodyCell}>{mov.referencia || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className={classes.paginationBox}>
        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
          <Typography variant="body2">
            {paginacion.total} registros
          </Typography>
          <TextField
            select
            size="small"
            variant="outlined"
            value={filtros.per_page}
            onChange={handlePerPageChange}
            style={{ width: 80 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>
        </Box>
        <Pagination
          count={paginacion.last_page}
          page={paginacion.current_page}
          onChange={handlePageChange}
          color="primary"
          size="small"
        />
      </Box>
    </Card>
  );
};

export default TablaKardex;
