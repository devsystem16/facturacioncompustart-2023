import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import { formatCurrencySimple } from '../../Envirnoment/utileria';
const options = ['Precio Público', 'Precio Técnico', 'Precio Mayorista'];

const ITEM_HEIGHT = 38;

export default function MenuFactura({ producto }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const redondear = (valor) => {
    return Math.round(valor * 100) / 100;
  };
  const obtienePrecioBruto = (precioNeto) => {
    return redondear(precioNeto - precioNeto * 0.15);
    // return formatCurrencySimple(precioNeto - precioNeto * 0.15);
    // return formatCurrencySimple(trunc(precioNeto / 1.15, 4));
  };

  const [precio, setPrecio] = useState(0);

  useEffect(() => {
    if (producto.tipoPrecio === 'publico') {
      setPrecio(obtienePrecioBruto(producto.precio_publico));
    }
    if (producto.tipoPrecio === 'tecnico') {
      setPrecio(obtienePrecioBruto(producto.precio_tecnico));
    }
    if (producto.tipoPrecio === 'mayorista') {
      setPrecio(obtienePrecioBruto(producto.precio_distribuidor));
    }
  }, [precio]);

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ padding: '0px', float: 'right', marginTop: '-5px' }}
      >
        <MoreVertIcon />
      </IconButton>
      <span style={{ fontSize: '11px' }}> {precio}</span>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch'
          }
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === 'Pyxis'}
            onClick={handleClose}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
