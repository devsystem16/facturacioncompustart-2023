import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';

import { ClienteContext } from './ClienteContext';
import { CreditoContext } from './CreditoContext';
import { EstadisticasContext } from './EstadisticasContext';
import { ProductosContext } from './ProductosContext';

import API from '../Environment/config';

import date from 'date-and-time';
import alertify from 'alertifyjs';

import { useReactToPrint } from 'react-to-print';

export const FacturaContext = createContext();

const END_POINT = {
  guardarCredito: 'api/creditos',
  guardarFactura: 'api/facturas',
  guardarProforma: 'api/proformas',
  obtenerFactura: 'api/facturas/impresion/reimpresion/',
  obtenerProformas: 'api/proformas',
  eliminarProforma: 'api/proformas/eliminar/'
};

const FacturaProvider = (props) => {
  const now = new Date();
  const [factura, setFactura] = useState([]);
  const [esProforma, setEsProforma] = useState(false);
  const [factura_id, setFactura_id] = useState(-1);

  const [fechaFactura, setFechaFactura] = useState('-');
  const { currentCliente, setCurrentCliente } = useContext(ClienteContext);
  const { setRecargarListaCreditos } = useContext(CreditoContext);
  // Productos
  const {
    productos,
    setProductos,
    productosTemp,
    setProductosTemp,
    productosTemp2
  } = useContext(ProductosContext);

  const { setIsReload } = useContext(EstadisticasContext);

  const [observacion, setObservacion] = useState('');
  const [productosFactura, setProductosFactura] = useState([]);
  const [credito, setCredito] = useState(false);
  const [creditoFP, setCreditoFP] = useState(false);
  const [permitirBotonCredito, setPermitirBotonCredito] = useState(true);
  const [numeroItems, SetNumeroItems] = useState(1);
  const [formasPago, setFormasPago] = useState({});
  const [reloadProforma, setReloadProforma] = useState(true);
  const [proformas, setProformas] = useState([]);
  const [proformasTemp, setProformasTemp] = useState([]);

  const eliminarProforma = async (proforma) => {
    const response = await API.post(END_POINT.eliminarProforma + proforma.id);
    setReloadProforma(true);
    return response.data;
  };

  const setDefaultDataInvoice = (objeto) => {
    const resultado = objeto.detalles_proforma.map((detalle) => {
      const {
        cantidad,
        producto_id: id,
        producto: {
          nombre,
          precio_publico,
          precio_tecnico,
          precio_distribuidor,
          stock
        }
      } = detalle;

      const totalBruto = cantidad * precio_publico;
      const total = obtienePrecioBruto(totalBruto); // Calcula el total con base en alguna fórmula

      return {
        cantidad,
        id,
        nombre,
        precio_publico,
        precio_tecnico,
        precio_distribuidor,
        total,
        totalBruto,
        tipoPrecio: 'publico',
        stock
      };
    });
    setObservacion(objeto.observacion);
    setProductosFactura(resultado);
    return objeto.cliente;
  };

  const [totales, setTotales] = useState({
    subtotal: 0,
    iva: 0,
    total: 0
  });

  const [fechaEmision, setFechaEmision] = useState(
    date.format(now, 'YYYY-MM-DD')
  );
  const [fechaVencimiento, setFechaVencimiento] = useState(
    date.format(now, 'YYYY-MM-DD')
  );

  const [currentPrecio, setCurrentPrecio] = useState('publico');

  var totalParcial = 0;

  const redondear = (valor) => {
    return trunc(valor, 4);
  };
  const obtienePrecioBruto = (precioNeto) => {
    return redondear(precioNeto / 1.12);
  };

  const tieneStock = async (producto) => {
    let hasStock = true;
    await productos.map((item) => {
      if (item.id == producto.id) {
        if (item.stock === 0) {
          hasStock = false;
        }
      }
    });
    return hasStock;
  };

  const actualizarStockProductosCantidad = async (producto, numItems = 1) => {
    var productoNuevo = [];
    var productoReturn = [];
    const nuevoListado = productosTemp2.map((item) => {
      if (item.id == producto.id) {
        productoNuevo = {
          ...item,
          stock: item.stock - numItems
        };

        productoReturn = {
          ...item,
          stock: item.stock - numItems
        };
      } else
        productoNuevo = {
          ...item,
          stock: item.stock
        };

      return productoNuevo;
    });

    setProductos(nuevoListado);
    setProductosTemp(nuevoListado);
    return productoReturn;
  };
  const actualizarStockProductos = async (producto, numItems = 1) => {
    var productoNuevo = [];
    var productoReturn = [];
    const nuevoListado = productos.map((item) => {
      if (item.id == producto.id) {
        productoNuevo = {
          ...item,
          stock: item.stock - numItems
        };

        productoReturn = {
          ...item,
          stock: item.stock - numItems
        };
      } else
        productoNuevo = {
          ...item,
          stock: item.stock
        };

      return productoNuevo;
    });

    setProductos(nuevoListado);
    setProductosTemp(nuevoListado);
    return productoReturn;
  };

  const actualizarStockProductosGPT = async (producto, numItems = 1) => {
    const nuevoListado = productos.reduce((listaActualizada, item) => {
      if (item.id === producto.id) {
        const productoNuevo = {
          ...item,
          stock: item.stock - numItems
        };
        return [...listaActualizada, productoNuevo];
      }
      return [...listaActualizada, item];
    }, []);
    // alert(JSON.stringify(nuevoListado));
    setProductos(nuevoListado);
    setProductosTemp(nuevoListado);

    const productoReturn = []; // nuevoListado.find((item) => item.id === producto.id);

    return productoReturn;
  };

  const actualizarStockProductosGPT4 = useCallback(
    async (producto, numItems = 1) => {
      const nuevoListado = productos.reduce((listaActualizada, item) => {
        if (item.id === producto.id) {
          const productoActualizado = {
            ...item,
            stock: item.stock - numItems
          };
          return [...listaActualizada, productoActualizado];
        }
        return [...listaActualizada, item];
      }, []);

      setProductos(nuevoListado);
      setProductosTemp(nuevoListado);

      // const productoActualizado = nuevoListado.find(
      //   (item) => item.id === producto.id
      // );

      return [];
    },
    [productos]
  );

  const restarStockProductos = async (producto, numItems = 1) => {
    var productoNuevo = [];
    var productoReturn = [];
    const nuevoListado = productos.map((item) => {
      if (item.id == producto.id) {
        productoNuevo = {
          ...item,
          stock: item.stock + numItems
        };

        productoReturn = {
          ...item,
          stock: item.stock + numItems
        };
      } else
        productoNuevo = {
          ...item,
          stock: item.stock
        };

      return productoNuevo;
    });

    setProductos(nuevoListado);
    setProductosTemp(nuevoListado);
    return productoReturn;
  };
  const agregarProductoFactura = async (producto) => {
    if (+producto.stock <= 0) {
      alertify.error('El producto no tiene Stock', 2);
      return;
    }
    setPermitirBotonCredito(true); // Cada vez que añaden un producto, todas las formas de pago se reestablecen, entonces tambien debo permitir que el boron de ¿es credito? se pueda activar.!!

    if (currentPrecio === 'publico') totalParcial = 1 * producto.precio_publico;

    if (currentPrecio === 'tecnico') totalParcial = 1 * producto.precio_tecnico;

    if (currentPrecio === 'mayorista')
      totalParcial = 1 * producto.precio_distribuidor;

    const newProduct = {
      cantidad: 1,
      id: producto.id,
      nombre: producto.nombre,
      precio_publico: producto.precio_publico,
      precio_tecnico: producto.precio_tecnico,
      precio_distribuidor: producto.precio_distribuidor,
      total: obtienePrecioBruto(totalParcial),
      totalBruto: totalParcial,
      tipoPrecio: currentPrecio,
      stock: producto.stock
    };

    var existe = false;
    // console.log('añadir', newProduct);

    await productosFactura.map((product) => {
      if (
        product.id === newProduct.id &&
        product.tipoPrecio === newProduct.tipoPrecio
      ) {
        existe = true;
        console.log('Existe');
      }
    });
    if (existe) {
      alertify.error('El producto ya se encuentra en la factura.', 2);
      return;
    }

    const nuebo = await actualizarStockProductosGPT(newProduct);
    // const nuebo = await actualizarStockProductosGPT4(newProduct);

    if (!existe) {
      // console.log('Se añadio', newProduct);
      setProductosFactura([...productosFactura, newProduct]);

      calcularTotalesFactura(productosFactura);
    } else {
      sumarStockProductoFactura(newProduct);
      calcularTotalesFactura(productosFactura);
    }
  };

  const resetearStock = async (producto, cantidad) => {
    var productoNuevo = [];
    var productoReturn = [];
    const nuevoListado = productosTemp2.map((item) => {
      if (item.id == producto.id) {
        productoNuevo = {
          ...item,
          stock: item.stock - parseInt(cantidad)
        };
      } else
        productoNuevo = {
          ...item,
          stock: item.stock
        };

      return productoNuevo;
    });

    setProductos(nuevoListado);
    setProductosTemp(nuevoListado);
    return productoReturn;
  };
  const eliminarProductoFactura = async (objProducto, cantidad) => {
    resetearStock(objProducto, cantidad);

    const results = productosFactura.filter((producto) => {
      return !(
        producto.id === objProducto.id &&
        producto.tipoPrecio === objProducto.tipoPrecio
      );
    });
    setProductosFactura(results);
  };

  const sumarStockProductoFacturaCantidad = async (
    prm_Producto,
    numItems = 1
  ) => {
    // if (+prm_Producto.stock <= 0) {
    //   alertify.error('El producto no tiene Stock', 2);
    //   return;
    // }
    // alert(JSON.stringify(prm_Producto));

    const tiene = await tieneStock(prm_Producto);

    if (!tiene) {
      alertify.error('Ya no quedan mas unidades para este producto.', 2);
      return;
    }

    const nuebo = await actualizarStockProductos(prm_Producto, numItems);

    // SetNumeroItems(numeroItems + numItems);
    let totalParcial = 0;
    const results = productosFactura.map((producto) => {
      if (
        producto.id === prm_Producto.id &&
        producto.tipoPrecio === prm_Producto.tipoPrecio
      ) {
        if (producto.tipoPrecio === 'publico')
          totalParcial = producto.precio_publico;

        if (producto.tipoPrecio === 'tecnico')
          totalParcial = producto.precio_tecnico;

        if (producto.tipoPrecio === 'mayorista')
          totalParcial = producto.precio_distribuidor;

        return {
          ...producto,
          cantidad: +numItems,

          total: obtienePrecioBruto(trunc(+numItems * totalParcial, 4)),
          totalBruto: trunc(+numItems * totalParcial, 4)
        };
      }
      return producto;
    });

    setProductosFactura(results);
  };

  const actualizarProductosFactura = (prm_Producto, canActual) => {
    let totalParcial = 0;
    const results = productosFactura.map((producto) => {
      if (
        producto.id === prm_Producto.id &&
        producto.tipoPrecio === prm_Producto.tipoPrecio
      ) {
        if (producto.tipoPrecio === 'publico')
          totalParcial = producto.precio_publico;

        if (producto.tipoPrecio === 'tecnico')
          totalParcial = producto.precio_tecnico;

        if (producto.tipoPrecio === 'mayorista')
          totalParcial = producto.precio_distribuidor;

        return {
          ...producto,
          cantidad: canActual,

          total: obtienePrecioBruto(trunc(canActual * totalParcial, 4)),
          totalBruto: trunc(canActual * totalParcial, 4)
        };
      }
      return producto;
    });

    setProductosFactura(results);
  };
  const sumarStockProductoFactura = async (prm_Producto, numItems = 1) => {
    // if (+prm_Producto.stock <= 0) {
    //   alertify.error('El producto no tiene Stock', 2);
    //   return;
    // }
    // alert(JSON.stringify(prm_Producto));

    const tiene = await tieneStock(prm_Producto);

    if (!tiene) {
      alertify.error('Ya no quedan mas unidades para este producto.', 2);
      return;
    }

    const nuebo = await actualizarStockProductos(prm_Producto, numItems);

    // SetNumeroItems(numeroItems + numItems);
    let totalParcial = 0;
    const results = productosFactura.map((producto) => {
      if (
        producto.id === prm_Producto.id &&
        producto.tipoPrecio === prm_Producto.tipoPrecio
      ) {
        if (producto.tipoPrecio === 'publico')
          totalParcial = producto.precio_publico;

        if (producto.tipoPrecio === 'tecnico')
          totalParcial = producto.precio_tecnico;

        if (producto.tipoPrecio === 'mayorista')
          totalParcial = producto.precio_distribuidor;

        return {
          ...producto,
          cantidad: producto.cantidad + 1,

          total: obtienePrecioBruto(
            trunc((producto.cantidad + 1) * totalParcial, 4)
          ),
          totalBruto: trunc((producto.cantidad + 1) * totalParcial, 4)
        };
      }
      return producto;
    });

    setProductosFactura(results);
  };

  const restarStockProductoFactura = async (prm_Producto, numItems = 1) => {
    const results = productosFactura.map((producto) => {
      if (
        producto.id === prm_Producto.id &&
        producto.tipoPrecio === prm_Producto.tipoPrecio
      ) {
        if (producto.cantidad > 1) {
          restarStockProductos(prm_Producto, numItems);
          SetNumeroItems(numeroItems - numItems);

          if (producto.tipoPrecio === 'publico')
            totalParcial = producto.precio_publico;

          if (producto.tipoPrecio === 'tecnico')
            totalParcial = producto.precio_tecnico;

          if (producto.tipoPrecio === 'mayorista')
            totalParcial = producto.precio_distribuidor;

          return {
            ...producto,
            cantidad: producto.cantidad - 1,
            total: obtienePrecioBruto(
              trunc((producto.cantidad - 1) * totalParcial, 4)
            ),
            totalBruto: trunc((producto.cantidad - 1) * totalParcial, 4)
          };
        }
      }
      return producto;
    });

    setProductosFactura(results);
  };

  function trunc(x, posiciones = 0) {
    var s = x.toString();
    var l = s.length;
    var decimalLength = s.indexOf('.') + 1;
    var numStr = s.substr(0, decimalLength + posiciones);
    return Number(numStr);
  }
  const calcularTotalesFactura = async () => {
    console.log('calcularTotalesFactura...', productosFactura);
    var subtotal = 0;
    var iva = 0;
    var total = 0;
    var subTotalBruto = 0;
    await productosFactura.map((producto) => {
      subtotal = subtotal + producto.total;
      subTotalBruto = subTotalBruto + producto.totalBruto;
    });

    //   iva = Math.round(subtotal * 0.12 * 100) / 100;
    iva = trunc(subtotal * 0.12, 4);

    // total = Math.round((subtotal + iva) * 100) / 100;
    total = subTotalBruto;
    setTotales({
      subtotal: trunc(subtotal, 4),
      iva,
      total
    });
  };

  const guardarComoProforma = async () => {
    const detalles = productosFactura.map((detalle) => {
      return {
        producto_id: detalle.id,
        cantidad: detalle.cantidad,
        subtotal: detalle.totalBruto,
        precio_tipo: detalle.tipoPrecio
      };
    });

    var proforma = {
      cabecera: {
        cliente_id: currentCliente.id,
        usuario_id: localStorage.getItem('user_id'),
        forma_pago_id: 1,
        fecha_emision: fechaEmision,
        fecha_vencimiento: fechaVencimiento,

        subtotal: totales.subtotal,
        iva: totales.iva,
        total: totales.total,
        observacion: observacion,
        estado: 'pendiente'
      },
      detalle: [...detalles]
    };

    //alert(JSON.stringify(proforma));

    const response = await API.post(END_POINT.guardarProforma, proforma);
    setReloadProforma(true);
    return {
      status: 200,
      mensaje: 'Proforma Guardada',
      codigoFac: response?.data?.proforma?.id
    };
  };
  const guardarComoCredito = async () => {
    const now = new Date();

    var fechaCredito = date.format(now, 'YYYY-MM-DD');
    var detalle = [];

    const credito = {
      cabecera: {
        cliente_id: currentCliente.id,
        fecha: fechaCredito,
        detalle: observacion === '' ? 'CREDITO' : observacion,
        saldo: totales.total,
        total: totales.total
      },
      detalle,
      formasPago: creditoFP ? formasPago : {}
    };

    const respuesta = await API.post(END_POINT.guardarCredito, credito);

    return respuesta.data;
  };

  //
  // Guardar factura.

  const guardarFactura = async () => {
    if (productosFactura.length < 1)
      return { status: 500, mensaje: 'No ha seleccionado productos aún.' };

    if (currentCliente.cedula === '')
      return { status: 500, mensaje: 'Seleccione un cliente' };
    if (esProforma) {
      const responseProforma = await guardarComoProforma();
      return responseProforma;
    }

    var mensaje_res = 'Factura Guardada';
    var credito_id = -1;

    if (credito) {
      const respuesta = await guardarComoCredito();
      if (respuesta.estado === 200) {
        credito_id = respuesta.credito.id;

        mensaje_res = 'Factura Guardada como Crédito';
      } else {
        mensaje_res = 'Error al guardar el credito.';
      }
    }

    const detalles = productosFactura.map((detalle) => {
      return {
        producto_id: detalle.id,
        cantidad: detalle.cantidad,
        subtotal: detalle.totalBruto,
        precio_tipo: detalle.tipoPrecio
      };
    });
    const now = new Date();

    var fechaFactura = date.format(now, 'YYYY-MM-DD');

    var factura = {
      cabecera: {
        cliente_id: currentCliente.id,
        fecha: fechaFactura,
        subtotal: totales.subtotal,
        iva: totales.iva,
        total: totales.total,
        observacion: observacion,
        es_credito: credito,
        credito_id: credito_id,
        estado: credito ? 'credito' : 'cerrada'
      },
      detalle: [...detalles],
      formasPago: formasPago
    };

    const response = await API.post(END_POINT.guardarFactura, factura);

    if (response.data.estado !== 200) {
      return { status: 500, mensaje: response.data?.Message };
    }

    setFactura_id(response.data.factura.id); // New
    setFechaFactura(response.data.factura.fecha);

    setIsReload(true); // ReloadEstadisticas.

    if (credito) {
      setRecargarListaCreditos(true);
    }
    // setProductosFactura([]);
    // setObservacion('');
    // setCurrentCliente({
    //   cedula: '',
    //   nombres: ''
    // });

    return {
      status: 200,
      mensaje: mensaje_res,
      codigoFac: response.data.factura.id
    };
    // console.log(response)
  };

  const fn_obtenerFactura = async (idFactura) => {
    const response = await API.get(END_POINT.obtenerFactura + idFactura);
    setFactura(response.data);
    return { codigo: 200, mensaje: 'Ok', factura: response.data };
  };

  const obtenerProformas = async () => {
    const response = await API.get(END_POINT.obtenerProformas);
    setProformas(response.data);
    setProformasTemp(response.data);
  };

  useEffect(() => {
    calcularTotalesFactura();

    if (reloadProforma) {
      obtenerProformas();
      setReloadProforma(false);
    }
  }, [productosFactura, reloadProforma]);

  return (
    <>
      <FacturaContext.Provider
        value={{
          productosFactura,
          setProductosFactura,
          agregarProductoFactura,
          sumarStockProductoFactura,
          restarStockProductoFactura,
          eliminarProductoFactura,
          totales,
          setObservacion,
          observacion,
          guardarFactura,
          currentPrecio,
          setCurrentPrecio,
          credito,
          setCredito,
          factura_id,
          setFactura_id,
          fechaFactura,
          factura,
          setFactura,
          fn_obtenerFactura,
          numeroItems,
          SetNumeroItems,
          sumarStockProductoFacturaCantidad,
          productos,
          actualizarStockProductosCantidad,
          calcularTotalesFactura,
          actualizarProductosFactura,
          formasPago,
          setFormasPago,
          setCreditoFP,
          creditoFP,
          permitirBotonCredito,
          setPermitirBotonCredito,
          esProforma,
          setEsProforma,
          fechaEmision,
          setFechaEmision,
          fechaVencimiento,
          setFechaVencimiento,
          reloadProforma,
          setReloadProforma,
          proformas,
          setProformas,
          proformasTemp,
          setProformasTemp,
          setDefaultDataInvoice,
          eliminarProforma
        }}
      >
        {props.children}
      </FacturaContext.Provider>
    </>
  );
};

export default FacturaProvider;
