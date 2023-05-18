import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card } from '@material-ui/core';
import columns from './columns';
import API from '../../Environment/config';
import alertify from 'alertifyjs';

import { ProductosContext } from '../../context/ProductosContext';

const END_POINT = {
  actualizarProducto: 'api/productos'
};

export default function TablaProductos() {
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
  const [productosDesmontado, setProductosDesmontado] = React.useState([
    { mycae: '1' }
  ]);
  const {
    productos,
    productosTemp,
    setProductos,
    setReload,
    setProductosTemp,
    setDeleteProducto,
    ObtenerProductos
  } = React.useContext(ProductosContext);

  // const [reloadThis, setReloadThis] = React.useState(1);

  React.useEffect(() => {
    ObtenerProductos();
    return () => {
      // console.log('desmontado con ', productosDesmontado);
      // setProductosTemp(productosDesmontado)

      if (productos.length > 0) setProductosTemp(productos);
    };
  }, []);

  const buscarProductoObjeto = (id) => {
    return productos.find((productoActual) => productoActual.id === id);
  };
  const editarProducto = (producto) => {
    var field = producto.field;
    var productoNuevo = [];

    const nuevoListado = productos.map((item) => {
      if (item.id === producto.id) {
        if (field === 'nombre')
          productoNuevo = {
            ...item,
            nombre: producto.value
          };
        if (field === 'descripcion')
          productoNuevo = {
            ...item,
            descripcion: producto.value
          };
        if (field === 'precio_publico')
          productoNuevo = {
            ...item,
            precio_publico: producto.value
          };

        if (field === 'precio_tecnico')
          productoNuevo = {
            ...item,
            precio_tecnico: producto.value
          };

        if (field === 'precio_compra')
          productoNuevo = {
            ...item,
            precio_compra: producto.value
          };

        if (field === 'precio_distribuidor')
          productoNuevo = {
            ...item,
            precio_distribuidor: producto.value
          };

        if (field === 'stock')
          productoNuevo = {
            ...item,
            stock: producto.value
          };

        if (field === 'codigo_barra')
          productoNuevo = {
            ...item,
            codigo_barra: producto.value
          };

        updateProductoDB(productoNuevo);
        return productoNuevo;
      }
      return item;
    });

    setProductos(nuevoListado);
    // setProductosDesmontado(nuevoListado);
    // PARA LA BUSQUED
    // setProductosTemp(nuevoListado);
    // setReload(true);
  };

  const updateProductoDB = async (producto) => {
    setTableIsLoading(true);

    const result = await API.patch(
      END_POINT.actualizarProducto + '/' + producto.id,
      producto
    );

    setTableIsLoading(false);
    alertify.success('Actualizado', 2);
    console.log(result);
  };

  const onRowSelectEvent = (parameters) => {
    if (parameters.length < 1) return;
    var produc = buscarProductoObjeto(parameters[0]);
    setDeleteProducto(produc);
  };

  return (
    <Card>
      <div style={{ height: 360, width: '100%' }}>
        <DataGrid
          rows={productosTemp}
          columns={columns}
          checkboxSelection={false}
          datasets="Commodity"
          // onEditCellChangeCommitted={editarProducto}
          onCellEditCommit={(params) => {
            editarProducto(params);
          }}
          pageSize={10}
          disableSelectionOnClick={false}
          rowHeight={23}
          // onRowSelected={onRowSelectEvent}

          onSelectionModelChange={(row) => {
            onRowSelectEvent(row);
          }}
          loading={tableIsLoading}
        />
      </div>
    </Card>
  );
}
