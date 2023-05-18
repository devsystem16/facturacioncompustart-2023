import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputMoneda from '../../components/InputMoneda';
import { ProductosContext } from '../../context/ProductosContext';
import { Box, Button } from '@material-ui/core';
import alertify from 'alertifyjs';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField1: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '36ch'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch'
  },
  btn: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
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
    <>
      <div className={classes.root}>
        <div>
          <TextField
            label="Nombre producto"
            id="margin-none"
            defaultValue=""
            onChange={(e) => setNombre(e.target.value)}
            className={classes.textField1}
            helperText="Describa un nombre para el producto"
          />
          <TextField
            id="standard-full-width"
            onChange={(e) => setDescripcion(e.target.value)}
            label="Descripción"
            style={{ margin: 8, width: '90%' }}
            placeholder=""
            multiline
            helperText="Describa una descripción breve del producto"
            //   fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />

          <InputMoneda
            label="P. Compra"
            helperText="Precio al que se adquirió el producto"
            onChangeText={setPrecio_compra}
          />
          <InputMoneda
            label="P. Público"
            helperText="Precio al que se venderá al público."
            onChangeText={setPrecio_plublico}
          />

          <InputMoneda
            label="P. Técnico"
            helperText="Precio para los técnicos del local."
            onChangeText={setPrecio_tecnico}
          />

          <InputMoneda
            label="P. Mayorista"
            helperText="Precio para ventas al mayoreo"
            onChangeText={setPrecioDistribuidor}
          />
        </div>
        <div>
          <TextField
            id="filled-full-width"
            label="Código de barras |||"
            style={{ margin: 4, width: '425px' }}
            placeholder=""
            helperText="Código de barra que identificará el producto al facturar"
            fullWidth
            margin="normal"
            onChange={(e) => setCodigoBarra(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            variant="filled"
          />
          <TextField
            label="Stock"
            id="margin-none"
            defaultValue=""
            type="number"
            onChange={(e) => setStock(e.target.value)}
            className={classes.textField}
            helperText="Cantidad de productos disponibles"
          />
        </div>

        <div></div>
      </div>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" className={classes.btn} onClick={cancelar}>
          Cancelar
        </Button>
        <Button color="primary" variant="contained" onClick={guardar}>
          Guardar
        </Button>
      </Box>
    </>
  );
}
