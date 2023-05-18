import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import alertify from 'alertifyjs';
import API from '../Environment/config';

const END_POINT = {
  buscarProducto: 'api/productos/buscarProducto',
  obtenerListado: 'api/productos/listado/1000000000000',
  guardarProducto: 'api/productos',
  eliminar: 'api/productos'
};

export const ProductosContext = createContext();

const ProductosProvider = (props) => {
  const [productos, setProductos] = useState([]);
  const [productosTemp, setProductosTemp] = useState([]);
  const [productosTemp2, setProductosTemp2] = useState([]);

  const [isNew, setIsNew] = useState(false);
  const [reload, setReload] = useState(true);
  const [deleteProducto, setDeleteProducto] = useState(0);

  const buscarProductos = async (text) => {
    if (text !== '') text = `/${text}`;

    const productos = await API.get(END_POINT.buscarProducto + text);

    setProductos(productos.data);
  };

  const ObtenerProductos = async () => {
    const productos = await API.get(END_POINT.obtenerListado);

    setProductos(productos.data);
    setProductosTemp(productos.data);
    setProductosTemp2(productos.data);
  };

  const guardarProducto = async (producto) => {
    const resultado = await API.post(END_POINT.guardarProducto, producto);

    await ObtenerProductos();
    console.log(resultado);
  };

  const eliminarProducto = async () => {
    const response = await API.delete(
      END_POINT.eliminar + '/' + deleteProducto.id
    );

    if (response.data.estado !== 200) {
      alertify.error(response.data.mensaje, 2);
      return;
    }
    alertify.success(response.data.mensaje, 2);
    ObtenerProductos();
  };
  useEffect(() => {
    // if (reload) {

    ObtenerProductos();
    // setReload(false);
    // }
    // Obtener Listado de productos.
  }, []);

  return (
    <ProductosContext.Provider
      value={{
        productos,
        setProductos,
        productosTemp,
        setProductosTemp,
        buscarProductos,
        setReload,
        guardarProducto,
        isNew,
        setIsNew,
        eliminarProducto,
        deleteProducto,
        setDeleteProducto,
        ObtenerProductos,
        productosTemp2,
        setProductosTemp2
      }}
    >
      {props.children}
    </ProductosContext.Provider>
  );
};

export default ProductosProvider;
