import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { useContext } from 'react';
import { FacturaContext } from '../../../context/FacturaContext';
import { makeStyles } from '@material-ui/core/styles';
import './listadoProductos.css';

// Carga Asincrona.
import { FixedSizeList } from 'react-window';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3)
  },
  paper: {
    maxWidth: '100%',
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(1)
  }
}));

const ProductosTabla = ({ productos }) => {
  const productosConStock = productos.filter((producto) => producto.stock > 0);

  return (
    <FixedSizeList
      height={500}
      width={'100%'}
      itemCount={productosConStock.length}
      itemSize={100}
      itemData={productosConStock}
    >
      {Row}
    </FixedSizeList>
  );
};

export default ProductosTabla;

function Row(props) {
  const { agregarProductoFactura } = useContext(FacturaContext);

  const classess = useStyles();
  const { index, style, data } = props;

  const item = data[index];

  const rowStyles = {
    margin: 0,
    padding: 0,
    border: 'none',
    background: 'none',
    color: 'red',
    fontSize: '16px',
    position: 'relative',
    ...style
  };
  // if (item?.stock === 0) return;
  return (
    <div style={rowStyles}>
      <div key={item?.id}>
        <Paper
          id="productoTabla"
          style={{
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'Roboto',
            textAlign: 'justify'
          }}
          className={classess.paper}
          onClick={() => agregarProductoFactura(item)}
        >
          <Grid container wrap="nowrap" spacing={1}>
            <Grid item>
              <Avatar title={'Stock ' + item?.stock}>{item?.stock}</Avatar>
            </Grid>
            <Grid item xs>
              <strong style={{ color: '#3f51b5' }}>{item?.nombre}</strong>
              <br></br>
              {item.descripcion}
            </Grid>
            <Grid item xs={3}>
              P. Público ${item?.precio_publico}
              <br />
              P. Técnico ${item?.precio_tecnico}
              <br />
              P. Mayorista ${item.precio_distribuidor}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ fontSize: '9px' }}>
            Cod: {item?.codigo_barra}
          </Grid>
        </Paper>
      </div>
    </div>
  );
}
