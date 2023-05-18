import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import alertify from 'alertifyjs';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import SvgIcon from '@material-ui/core/SvgIcon';
// import AddIcon from '@material-ui/icons/AddBox';
// import RemoveIcon from '@material-ui/icons/RemoveCircle';
// import MenuFactura from '../../../components/MenuFactura/MenuFactura';
import { FacturaContext } from '../../../context/FacturaContext';

// import { ProductosContext } from '../../../context/ProductosContext';
// import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1)
  },
  divider: {
    margin: theme.spacing(2, 0)
  }
}));

function trunc(x, posiciones = 0) {
  var s = x.toString();
  var l = s.length;
  var decimalLength = s.indexOf('.') + 1;
  var numStr = s.substr(0, decimalLength + posiciones);
  return Number(numStr);
}
const redondear = (valor) => {
  return Math.round(valor * 100) / 100;
};
const obtienePrecioBruto = (precioNeto) => {
  return trunc(precioNeto / 1.12, 4);
};
export default function RowFactura({ producto }) {
  const classes = useStyles();

  const {
    // sumarStockProductoFactura,
    // sumarStockProductoFacturaCantidad,
    // restarStockProductoFactura,
    eliminarProductoFactura,
    // numeroItems,
    SetNumeroItems,
    actualizarStockProductosCantidad,
    // productos,
    productosFactura,
    calcularTotalesFactura,
    actualizarProductosFactura
  } = useContext(FacturaContext);

  const [cantidad, setCantidad] = useState(1);

  const fn_onBlur = (producto, cantidad) => {
    var cont = 0;
    productosFactura.map((items) => {
      if (producto.tipoPrecio !== items.tipoPrecio) {
        cont = parseInt(cont) + parseInt(items.cantidad);
      }
    });
    cont = parseInt(cont) + parseInt(cantidad);

    actualizarProductosFactura(producto, cantidad);
    actualizarStockProductosCantidad(producto, cont);
    calcularTotalesFactura(productosFactura);
  };
  const cambiarCantidad = (cantidad, e, producto) => {
    const esValido = e.target.validity.valid;

    if (!esValido) return;

    if (cantidad == 0) {
      alertify.error('La cantidad no puede ser 0', 2);
      return;
    }

    if (cantidad > producto.stock) {
      alertify.error('La cantidad supera el Stock del producto', 2);
      return;
    }

    setCantidad(cantidad);
    fn_onBlur(producto, cantidad);

    SetNumeroItems(cantidad);
  };

  const eliminar = (producto) => {
    var cont = 0;
    productosFactura.map((items) => {
      if (producto.tipoPrecio !== items.tipoPrecio) {
        cont = parseInt(cont) + parseInt(items.cantidad);
      }
    });

    eliminarProductoFactura(producto, cont);
  };

  function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="fa fa-plus-circle" />
      </SvgIcon>
    );
  }

  return (
    <div style={{ height: '24px' }} key={producto.id + producto.tipoPrecio}>
      <Grid container spacing={0} margin={0} style={{ fontSize: '11px' }}>
        <Grid item xs={1}>
          <Paper className={classes.paper}>
            <DeleteIcon
              style={{ cursor: 'pointer' }}
              onClick={() => eliminar(producto)}
              color="action"
              fontSize={'inherit'}
            />
          </Paper>
        </Grid>

        <Grid item xs={2}>
          <Paper className={classes.paper}>
            {/* <AddIcon
              style={{ cursor: 'pointer' }}
              onClick={() => sumarStockProductoFactura(producto, 1)}
              color="action"
              fontSize={'inherit'}
            /> */}
            <input
              type="text"
              onBlur={(e) => fn_onBlur(producto, e.target.value)}
              onChange={(e) => cambiarCantidad(e.target.value, e, producto)}
              // onChange={(e) => setCantidad(e.target.value)}
              value={cantidad}
              pattern="[0-9]{0,13}"
              style={{
                width: '70px',
                height: '14px',
                fontSize: '10px',
                textAlign: 'center'
              }}
            />
            {/* <strong>{producto.cantidad} </strong> */}

            {/* <RemoveIcon
              style={{ cursor: 'pointer' }}
              onClick={() => restarStockProductoFactura(producto)}
              color="action"
              fontSize={'inherit'}
            /> */}
          </Paper>
        </Grid>
        <Grid item xs={5} title={producto.nombre}>
          <Paper className={classes.paper}>{producto.nombre}</Paper>
        </Grid>
        <Grid item xs={2} style={{ backgroundColor: '#cef2e6' }}>
          <Paper
            style={{ backgroundColor: '#cef2e6' }}
            className={classes.paper}
          >
            {producto.tipoPrecio === 'publico'
              ? obtienePrecioBruto(producto.precio_publico)
              : ''}
            {producto.tipoPrecio === 'tecnico'
              ? obtienePrecioBruto(producto.precio_tecnico)
              : ''}
            {producto.tipoPrecio === 'mayorista'
              ? obtienePrecioBruto(producto.precio_distribuidor)
              : ''}
            {/* <MenuFactura producto={producto}></MenuFactura> */}
          </Paper>
        </Grid>

        {/* <Grid item xs={2}>
          <Paper className={classes.paper}>{producto.precio_tecnico}</Paper>
        </Grid> */}
        <Grid item xs={2}>
          <Paper className={classes.paper}> {producto.total}</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
