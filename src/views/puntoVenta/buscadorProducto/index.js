import React, { useContext, useState, useRef, useEffect } from 'react';
import { TextField, InputAdornment, SvgIcon, makeStyles } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { ProductosContext } from '../../../context/ProductosContext';
import { FacturaContext } from '../../../context/FacturaContext';
import alertify from 'alertifyjs';

const useStyles = makeStyles((theme) => ({
  searchInput: {
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8
    }
  }
}));

const playBeep = (frequency = 800, duration = 150) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioCtx.close();
    }, duration);
  } catch (e) {}
};

const BuscadorProductos = () => {
  const classes = useStyles();
  const { setProductosTemp, productos } = useContext(ProductosContext);
  const { agregarProductoFactura } = useContext(FacturaContext);

  const [busqueda, setBusqueda] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filtrarProductos = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    const palabrasFiltro = valor.toLowerCase().split(' ');

    const results = productos.filter((producto) => {
      const nombreProducto = producto.nombre.toLowerCase();
      const codigoProducto =
        producto.codigo_barra === null
          ? ''
          : producto.codigo_barra.toLowerCase();

      return palabrasFiltro.every((palabra) => {
        return (
          nombreProducto.includes(palabra) || codigoProducto.includes(palabra)
        );
      });
    });

    setProductosTemp(results);
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const input = busqueda.trim();
    if (input === '') return;

    // Parsear sintaxis de cantidad: "5*ABC123" o solo "ABC123"
    let cantidadSolicitada = 1;
    let codigoEscaneado = input;

    if (input.includes('*')) {
      const parts = input.split('*');
      const qty = parseInt(parts[0]);
      if (!isNaN(qty) && qty > 0) {
        cantidadSolicitada = qty;
        codigoEscaneado = parts.slice(1).join('*');
      }
    }

    const productoEncontrado = productos.find(
      (p) =>
        p.codigo_barra &&
        p.codigo_barra.toLowerCase() === codigoEscaneado.toLowerCase()
    );

    if (!productoEncontrado) {
      playBeep(300, 300);
      alertify.error('Producto no encontrado', 2);
      setBusqueda('');
      setProductosTemp(productos);
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    playBeep(800, 150);
    agregarProductoFactura(productoEncontrado, cantidadSolicitada);

    setBusqueda('');
    setProductosTemp(productos);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <TextField
      fullWidth
      value={busqueda}
      onChange={filtrarProductos}
      onKeyDown={handleKeyDown}
      inputRef={inputRef}
      data-shortcut="buscador"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SvgIcon fontSize="small" color="action">
              <SearchIcon />
            </SvgIcon>
          </InputAdornment>
        )
      }}
      placeholder="Buscar por nombre o código... (ej: 5*CODE)"
      variant="outlined"
      size="small"
      className={classes.searchInput}
    />
  );
};

export default BuscadorProductos;
