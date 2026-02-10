import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputMoneda from '../../components/InputMoneda';
import { ProductosContext } from '../../context/ProductosContext';
import { Box, Button, Grid, Typography, Divider } from '@material-ui/core';
import alertify from 'alertifyjs';

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

export default function NuevoProducto() {
  const classes = useStyles();

  const { guardarProducto, setIsNew } = useContext(ProductosContext);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo_barra, setCodigoBarra] = useState('');
  const [precio_publico, setPrecio_plublico] = useState('');
  const [precio_tecnico, setPrecio_tecnico] = useState('');
  const [precio_compra, setPrecio_compra] = useState('');
  const [precio_distribuidor, setPrecioDistribuidor] = useState('');
  const [stock, setStock] = useState(0);

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

    let descr = descripcion;
    if (descr === '') descr = '-';

    let cod_barr = codigo_barra;
    if (cod_barr === '') cod_barr = '-';

    const newProducto = {
      nombre,
      descripcion: descr,
      codigo_barra: cod_barr,
      precio_publico,
      precio_tecnico,
      precio_compra,
      precio_distribuidor,
      stock
    };

    guardarProducto(newProducto);

    setIsNew(false);
  };

  const cancelar = () => {
    setIsNew(false);
  };

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
          <TextField
            label="Cod. Proveedor"
            variant="outlined"
            fullWidth
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Código del proveedor"
            helperText="Código o referencia del proveedor"
            InputLabelProps={{ shrink: true }}
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
    </div>
  );
}
