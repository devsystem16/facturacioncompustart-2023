import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputMoneda from '../../components/InputMoneda';
import { ProductosContext } from '../../context/ProductosContext';
import {
  Box,
  Button,
  Grid,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import alertify from 'alertifyjs';
import API from '../../Environment/config';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: '#555',
    fontWeight: 500
  },
  btn: {
    marginLeft: theme.spacing(1)
  },
  inputFull: {
    width: '100%'
  }
}));

const AGREGAR_NUEVO = { id: '__nuevo__', codigo: '+', nombre: 'Agregar nuevo proveedor' };

export default function NuevoProducto() {
  const classes = useStyles();

  const { guardarProducto, setIsNew } = useContext(ProductosContext);

  const [nombre, setNombre] = useState('');
  const [codigo_barra, setCodigoBarra] = useState('');
  const [precio_publico, setPrecio_plublico] = useState('');
  const [precio_tecnico, setPrecio_tecnico] = useState('');
  const [precio_compra, setPrecio_compra] = useState('');
  const [precio_distribuidor, setPrecioDistribuidor] = useState('');
  const [stock, setStock] = useState(0);
  const [generandoCodigo, setGenerandoCodigo] = useState(false);

  // Proveedor
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [openDialogProveedor, setOpenDialogProveedor] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    codigo: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ruc_cedula: '',
    contacto: ''
  });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const response = await API.get('api/proveedores');
      setProveedores(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar proveedores', error);
    }
  };

  const handleProveedorChange = (event, value) => {
    if (value && value.id === '__nuevo__') {
      setOpenDialogProveedor(true);
      return;
    }
    setProveedorSeleccionado(value);
  };

  const handleNuevoProveedorChange = (campo) => (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [campo]: e.target.value });
  };

  const guardarNuevoProveedor = async () => {
    if (!nuevoProveedor.codigo.trim()) {
      alertify.error('El código del proveedor es requerido', 2);
      return;
    }
    if (!nuevoProveedor.nombre.trim()) {
      alertify.error('El nombre del proveedor es requerido', 2);
      return;
    }

    try {
      const response = await API.post('api/proveedores', nuevoProveedor);
      if (response.data.codigo === 200) {
        alertify.success('Proveedor creado correctamente', 2);
        const creado = response.data.data;
        setProveedores((prev) => [...prev, creado]);
        setProveedorSeleccionado(creado);
        setOpenDialogProveedor(false);
        setNuevoProveedor({
          codigo: '',
          nombre: '',
          telefono: '',
          email: '',
          direccion: '',
          ruc_cedula: '',
          contacto: ''
        });
      } else {
        alertify.error(response.data.Message || 'Error al crear proveedor', 2);
      }
    } catch (error) {
      alertify.error('Error al crear proveedor', 2);
    }
  };

  const generarCodigoBarra = async () => {
    setGenerandoCodigo(true);
    try {
      const response = await API.get('api/productos/next-id/codigo-barra');
      if (response.data.codigo === 200) {
        setCodigoBarra(response.data.codigo_barra);
      } else {
        alertify.error('Error al generar código de barras', 2);
      }
    } catch (error) {
      alertify.error('Error al generar código de barras', 2);
    }
    setGenerandoCodigo(false);
  };

  const guardar = async () => {
    if (nombre === '') {
      alertify.error('Falta el nombre del prodcuto', 2);
      return;
    }

    if (precio_compra === '' || +precio_compra === 0) {
      alertify.error('El precio de compra no puede ser vacío o 0', 2);
      return;
    }

    if (precio_publico === '' || +precio_publico === 0) {
      alertify.error('El precio público no puede ser vacío o 0', 2);
      return;
    }
    if (precio_tecnico === '' || +precio_tecnico === 0) {
      alertify.error('El precio Técnico no puede ser vacío o 0', 2);
      return;
    }

    if (precio_distribuidor === '' || +precio_distribuidor === 0) {
      alertify.error('El precio Mayorista no puede ser vacío o 0', 2);
      return;
    }

    if (stock === '' || +stock === 0) {
      alertify.error('El Stock no puede ser vacío o 0', 2);
      return;
    }

    let cod_barr = codigo_barra;
    if (cod_barr === '') cod_barr = '-';

    const newProducto = {
      nombre,
      descripcion: proveedorSeleccionado
        ? `${proveedorSeleccionado.codigo} - ${proveedorSeleccionado.nombre}`
        : '-',
      codigo_barra: cod_barr,
      precio_publico,
      precio_tecnico,
      precio_compra,
      precio_distribuidor,
      stock,
      proveedor_id: proveedorSeleccionado ? proveedorSeleccionado.id : null
    };

    guardarProducto(newProducto);

    setIsNew(false);
  };

  const cancelar = () => {
    setIsNew(false);
  };

  const opcionesAutocomplete = [...proveedores, AGREGAR_NUEVO];

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* Sección: Información General */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" className={classes.sectionTitle}>
            Información General
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre producto"
            variant="outlined"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            helperText="Nombre oficial del producto"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={opcionesAutocomplete}
            getOptionLabel={(option) =>
              option.id === '__nuevo__'
                ? '+ Agregar nuevo proveedor'
                : `${option.codigo} - ${option.nombre}`
            }
            value={proveedorSeleccionado}
            onChange={handleProveedorChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Proveedor"
                variant="outlined"
                fullWidth
                helperText="Seleccione o cree un proveedor"
                InputLabelProps={{ shrink: true }}
              />
            )}
            renderOption={(option) =>
              option.id === '__nuevo__' ? (
                <Typography style={{ color: '#1976d2', fontWeight: 500 }}>
                  + Agregar nuevo proveedor
                </Typography>
              ) : (
                `${option.codigo} - ${option.nombre}`
              )
            }
          />
        </Grid>

        {/* Sección: Precios */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" className={classes.sectionTitle}>
            Precios
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <InputMoneda
            label="P. Compra"
            helperText="Costo adquisición"
            onChangeText={setPrecio_compra}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InputMoneda
            label="P. Público"
            helperText="Venta público"
            onChangeText={setPrecio_plublico}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InputMoneda
            label="P. Técnico"
            helperText="Venta técnico"
            onChangeText={setPrecio_tecnico}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InputMoneda
            label="P. Mayorista"
            helperText="Venta mayoreo"
            onChangeText={setPrecioDistribuidor}
          />
        </Grid>

        {/* Sección: Inventario */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" className={classes.sectionTitle}>
            Inventario
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            label="Código de barras"
            variant="filled"
            fullWidth
            value={codigo_barra}
            onChange={(e) => setCodigoBarra(e.target.value)}
            helperText="Escanee o ingrese el código de barras"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    color="primary"
                    onClick={generarCodigoBarra}
                    disabled={generandoCodigo}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {generandoCodigo ? <CircularProgress size={20} /> : 'Generar'}
                  </Button>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Stock Inicial"
            type="number"
            variant="outlined"
            fullWidth
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            helperText="Cantidad disponible"
          />
        </Grid>

        {/* Botones de Acción */}
        <Grid item xs={12}>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" className={classes.btn} onClick={cancelar}>
              Cancelar
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={classes.btn}
              onClick={guardar}
            >
              Guardar Producto
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Dialog para crear nuevo proveedor */}
      <Dialog
        open={openDialogProveedor}
        onClose={() => setOpenDialogProveedor(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nuevo Proveedor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código *"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.codigo}
                onChange={handleNuevoProveedorChange('codigo')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre *"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.nombre}
                onChange={handleNuevoProveedorChange('nombre')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.telefono}
                onChange={handleNuevoProveedorChange('telefono')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.email}
                onChange={handleNuevoProveedorChange('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.direccion}
                onChange={handleNuevoProveedorChange('direccion')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="RUC / Cédula"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.ruc_cedula}
                onChange={handleNuevoProveedorChange('ruc_cedula')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contacto"
                variant="outlined"
                fullWidth
                margin="dense"
                value={nuevoProveedor.contacto}
                onChange={handleNuevoProveedorChange('contacto')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogProveedor(false)}>Cancelar</Button>
          <Button color="primary" variant="contained" onClick={guardarNuevoProveedor}>
            Guardar Proveedor
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
