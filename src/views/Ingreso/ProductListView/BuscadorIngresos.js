import React, { useState, useContext, useEffect } from 'react';
import NuevoIngreso from '../../../components/NuevoIngreso/NuevoIngreso';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Grid,
  Collapse,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import DeleteIcon from '@material-ui/icons/Delete';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GetAppIcon from '@material-ui/icons/GetApp';
import FilterListIcon from '@material-ui/icons/FilterList';

import { IngresoContext } from '../../../context/IngresoContext';
import { LoginContext } from '../../../context/LoginContext';
import PrintIcon from '@material-ui/icons/Print';
import Panorama from '@material-ui/icons/Visibility';
import ModalFacturaIgreso from '../../../../src/components/NuevoIngreso/ModalFacturaIgreso';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  filterPanel: {
    padding: theme.spacing(2),
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    marginBottom: theme.spacing(1)
  }
}));

const exportarCSV = (ordenes) => {
  if (!ordenes || ordenes.length === 0) return;

  const headers = [
    'ID',
    'Cliente',
    'Fecha',
    'Estado',
    'Equipo',
    'Marca',
    'Modelo',
    'Serie',
    'Falla',
    'Trabajo',
    'Observación',
    'Factura'
  ];
  const rows = ordenes.map((o) =>
    [
      o.id,
      `"${(o.cliente || '').replace(/"/g, '""')}"`,
      o.fecha,
      o.estado_reparacion || '',
      `"${(o.equipo || '').replace(/"/g, '""')}"`,
      `"${(o.marca || '').replace(/"/g, '""')}"`,
      `"${(o.modelo || '').replace(/"/g, '""')}"`,
      `"${(o.serie || '').replace(/"/g, '""')}"`,
      `"${(o.falla || '').replace(/"/g, '""')}"`,
      `"${(o.trabajo || '').replace(/"/g, '""')}"`,
      `"${(o.observacion || '').replace(/"/g, '""')}"`,
      o.factura_relacionada || ''
    ].join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ingresos_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const BuscadorIngresos = ({ className, ...rest }) => {
  const classes = useStyles();

  const [disablebotones, setDisablebotones] = useState({
    imprimir: false,
    eliminar: false,
    nuevoIngreso: false
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [filtroEquipo, setFiltroEquipo] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');

  const { tienePermiso } = useContext(LoginContext);

  const verificarAccesos = () => {
    setDisablebotones({
      imprimir: !tienePermiso('ingresos.imprimir'),
      eliminar: !tienePermiso('ingresos.eliminar'),
      nuevoIngreso: !tienePermiso('ingresos.crear')
    });
  };

  const {
    setOrdenesTemp,
    ordenes,
    ordenesTemp,
    isNew,
    setIsNew,
    datosImpresion,
    EventoImprimirReact,
    eliminarOrden,
    definirFactura,
    setOpenModalIngreso,
    setOrdenDuplicar,
    filtroEstado
  } = useContext(IngresoContext);

  const verIngreso = () => {
    if (datosImpresion?.cliente !== undefined) setOpenModalIngreso(true);
  };

  const preImprimir = () => {
    if (datosImpresion?.cliente !== undefined) EventoImprimirReact();
  };

  const aplicarFiltros = (texto = '') => {
    const searchTerm = texto.toUpperCase().split(' ');

    const results = ordenes.filter((orden) => {
      // Filtro por texto
      const nombres =
        orden && orden?.cliente ? orden?.cliente.toUpperCase() : '';
      const codigo =
        orden && orden?.id ? orden?.id.toString().toUpperCase() : '';

      const textoMatch = searchTerm.every(
        (term) => nombres.includes(term) || codigo.includes(term)
      );

      // Filtro por estado
      const estadoMatch =
        filtroEstado === 'todos' || orden.estado_reparacion === filtroEstado;

      // Filtro por fecha
      let fechaMatch = true;
      if (fechaDesde && orden.fecha) {
        fechaMatch = fechaMatch && orden.fecha >= fechaDesde;
      }
      if (fechaHasta && orden.fecha) {
        fechaMatch = fechaMatch && orden.fecha <= fechaHasta + ' 23:59:59';
      }

      // Filtro por equipo
      let equipoMatch = true;
      if (filtroEquipo) {
        equipoMatch =
          (orden.equipo || '').toUpperCase().includes(filtroEquipo.toUpperCase());
      }

      // Filtro por marca
      let marcaMatch = true;
      if (filtroMarca) {
        marcaMatch =
          (orden.marca || '').toUpperCase().includes(filtroMarca.toUpperCase());
      }

      return textoMatch && estadoMatch && fechaMatch && equipoMatch && marcaMatch;
    });

    setOrdenesTemp(results);
  };

  const filrarIngresos = (e) => {
    aplicarFiltros(e.target.value);
  };

  // Reaplicar filtros cuando cambia el filtro de estado
  useEffect(() => {
    aplicarFiltros('');
  }, [filtroEstado, fechaDesde, fechaHasta, filtroEquipo, filtroMarca]);

  const fn_nuevoProducto = () => {
    setOrdenDuplicar(null);
    setIsNew(true);
  };

  const fn_duplicarOrden = () => {
    if (!datosImpresion?.orden) return;
    setOrdenDuplicar(datosImpresion.orden);
    setIsNew(true);
  };

  const fn_abrirWhatsApp = () => {
    const telefono = datosImpresion?.cliente?.telefono;
    if (!telefono) return;
    const numero = telefono.replace(/\D/g, '');
    const mensaje = encodeURIComponent(
      `Hola, le informamos sobre su orden #${datosImpresion?.orden?.id} - Equipo: ${datosImpresion?.orden?.equipo} ${datosImpresion?.orden?.marca}`
    );
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
  };

  const limpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
    setFiltroEquipo('');
    setFiltroMarca('');
  };

  useEffect(() => {
    verificarAccesos();
  }, [datosImpresion]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end" flexWrap="wrap" style={{ gap: 6 }}>
        {isNew ? null : definirFactura ? (
          <ModalFacturaIgreso IsguardarFactura={true} />
        ) : null}

        {/* WhatsApp */}
        {!isNew && datosImpresion?.cliente?.telefono && (
          <Tooltip title={`WhatsApp: ${datosImpresion.cliente.telefono}`}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#25D366', color: '#fff' }}
              className={classes.exportButton}
              startIcon={<WhatsAppIcon />}
              onClick={fn_abrirWhatsApp}
            >
              WhatsApp
            </Button>
          </Tooltip>
        )}

        {/* Duplicar */}
        {!isNew && datosImpresion?.orden && (
          <Button
            variant="contained"
            color="default"
            className={classes.exportButton}
            startIcon={<FileCopyIcon />}
            onClick={fn_duplicarOrden}
            title="Duplicar orden con mismos datos de equipo"
          >
            Duplicar
          </Button>
        )}

        {!isNew && (
          <Button
            variant="contained"
            color="secondary"
            className={classes.exportButton}
            startIcon={<Panorama />}
            title="Ver/Editar Ingreso"
            onClick={verIngreso}
          >
            Ver
          </Button>
        )}

        {!isNew && (
          <Button
            variant="contained"
            color="secondary"
            className={classes.exportButton}
            startIcon={<PrintIcon />}
            onClick={preImprimir}
            disabled={disablebotones.imprimir}
          >
            Imprimir
          </Button>
        )}

        {!isNew && (
          <Button
            variant="contained"
            style={{ backgroundColor: 'rgb(154, 0, 54)' }}
            color="secondary"
            className={classes.exportButton}
            disabled={disablebotones.eliminar}
            onClick={eliminarOrden}
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        )}

        {/* Exportar CSV */}
        {!isNew && (
          <Button
            variant="outlined"
            color="default"
            className={classes.exportButton}
            startIcon={<GetAppIcon />}
            onClick={() => exportarCSV(ordenesTemp)}
          >
            Exportar
          </Button>
        )}

        {!isNew && (
          <Button
            color="primary"
            variant="contained"
            onClick={fn_nuevoProducto}
            disabled={disablebotones.nuevoIngreso}
          >
            Nuevo Ingreso
          </Button>
        )}
      </Box>

      <Box mt={3}>
        <Card>
          {isNew ? (
            <NuevoIngreso />
          ) : (
            <CardContent>
              <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                <Box flexGrow={1} maxWidth={500}>
                  <TextField
                    fullWidth
                    onChange={filrarIngresos}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon fontSize="small" color="action">
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Buscar por cliente o N° orden..."
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  color={mostrarFiltros ? 'primary' : 'default'}
                  title="Filtros avanzados"
                >
                  <FilterListIcon />
                </IconButton>
              </Box>

              {/* Filtros avanzados */}
              <Collapse in={mostrarFiltros}>
                <Box className={classes.filterPanel} mt={2}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Desde"
                        type="date"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Hasta"
                        type="date"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Equipo"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={filtroEquipo}
                        onChange={(e) => setFiltroEquipo(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Marca"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={filtroMarca}
                        onChange={(e) => setFiltroMarca(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={limpiarFiltros}
                      >
                        Limpiar filtros
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </CardContent>
          )}
        </Card>
      </Box>
    </div>
  );
};

export default BuscadorIngresos;
