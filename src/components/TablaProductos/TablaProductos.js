import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card } from '@material-ui/core';
import columnsBase from './columns';
import API from '../../Environment/config';
import alertify from 'alertifyjs';

import { ProductosContext } from '../../context/ProductosContext';
import { LoginContext } from '../../context/LoginContext';
import ModalCambiarProveedor from './ModalCambiarProveedor';

const END_POINT = {
  actualizarProducto: 'api/productos'
};

export default function TablaProductos() {
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
  const [productosDesmontado, setProductosDesmontado] = React.useState([
    { mycae: '1' }
  ]);
  const [modalProveedorOpen, setModalProveedorOpen] = React.useState(false);
  const [productoEditandoProveedor, setProductoEditandoProveedor] = React.useState(null);
  const {
    productos,
    productosTemp,
    setProductos,
    setReload,
    setProductosTemp,
    setDeleteProducto,
    ObtenerProductos
  } = React.useContext(ProductosContext);
  const { tienePermiso } = React.useContext(LoginContext);

  const columns = React.useMemo(() => {
    return columnsBase.map((col) => {
      if (col.field === 'proveedor_codigo') {
        return {
          ...col,
          editable: false,
          renderCell: (cellValues) => {
            const puedeEditar = tienePermiso('productos.editar-proveedor');
            return (
              <span
                style={{
                  cursor: puedeEditar ? 'pointer' : 'default',
                  color: puedeEditar ? '#1976d2' : 'inherit',
                  textDecoration: puedeEditar ? 'underline' : 'none'
                }}
                title={puedeEditar ? 'Click para cambiar proveedor' : ''}
              >
                {cellValues.value || '-'}
              </span>
            );
          }
        };
      }
      return col;
    });
  }, [tienePermiso]);

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

        if (field === 'proveedor_codigo')
          productoNuevo = {
            ...item,
            proveedor_codigo: producto.value
          };

        updateProductoDB(productoNuevo);
        return productoNuevo;
      }
      return item;
    });

    setProductos(nuevoListado);
    setProductosTemp((prevTemp) =>
      prevTemp.map((item) => (item.id === producto.id ? productoNuevo : item))
    );
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

  const handleCellClick = (params) => {
    if (params.field !== 'proveedor_codigo') return;
    if (!tienePermiso('productos.editar-proveedor')) return;
    const producto = buscarProductoObjeto(params.id);
    if (!producto) return;
    setProductoEditandoProveedor(producto);
    setModalProveedorOpen(true);
  };

  const handleGuardarProveedor = async (productoId, proveedor) => {
    setTableIsLoading(true);
    try {
      await API.patch(END_POINT.actualizarProducto + '/' + productoId, {
        proveedor_id: proveedor.id,
        proveedor_codigo: proveedor.codigo
      });

      const actualizar = (lista) =>
        lista.map((item) => {
          if (item.id === productoId) {
            return {
              ...item,
              proveedor_id: proveedor.id,
              proveedor_codigo: proveedor.codigo,
              proveedor_nombre: proveedor.nombre
            };
          }
          return item;
        });

      setProductos(actualizar(productos));
      setProductosTemp(actualizar(productosTemp));

      alertify.success('Proveedor actualizado', 2);
    } catch (e) {
      alertify.error('Error al actualizar proveedor', 2);
    }
    setTableIsLoading(false);
  };

  const onRowSelectEvent = (parameters) => {
    if (parameters.length < 1) return;
    var produc = buscarProductoObjeto(parameters[0]);
    setDeleteProducto(produc);
  };

  return (
    <Card>
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={productosTemp}
          columns={columns}
          checkboxSelection={false}
          datasets="Commodity"
          autoHeight
          // onEditCellChangeCommitted={editarProducto}
          onCellEditCommit={(params) => {
            editarProducto(params);
          }}
          pageSize={10}
          disableSelectionOnClick={false}
          rowHeight={40}
          // onRowSelected={onRowSelectEvent}

          onSelectionModelChange={(row) => {
            onRowSelectEvent(row);
          }}
          onCellClick={handleCellClick}
          loading={tableIsLoading}
        />
      </div>
      <ModalCambiarProveedor
        open={modalProveedorOpen}
        onClose={() => setModalProveedorOpen(false)}
        producto={productoEditandoProveedor}
        onGuardar={handleGuardarProveedor}
      />
    </Card>
  );
}
