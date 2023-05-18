import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card } from '@material-ui/core';
import columns from './columns';
import columnsAtencionPublico from './ColumnsAtencionPublico';
import ColumnsTecnico from './ColumnsTecnico';
import axios from 'axios';

import alertify from 'alertifyjs';
import { Paper, TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import ModalAbonoIngreso from '../../components/TablaIngresos/ModalAbonoIngreso';
import ModalTotal from '../../components/TablaIngresos/ModalTotal';
import ModalVerIngreso from '../../components/ModalVerIngreso/ModalVerIngreso';

import { IngresoContext } from '../../context/IngresoContext';

export default function TablaIngresos() {
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
  const [columnas, setColumnas] = React.useState(columns);
  const {
    ordenes,
    ordenesTemp,
    actualizarIngreso,
    setReload,
    PrepararDatosImpresion,
    SetIsOpenModalIngreso,
    SetIsOpenModalTotal,
    setOrdenes,
    setDefinirFactura
  } = React.useContext(IngresoContext);

  // const [reloadThis, setReloadThis] = React.useState(1);

  const verificarAccesosGRID = () => {
    if (localStorage.getItem('tipo_usuario') === 'ATENCION AL PUBLICO') {
      setColumnas(columnsAtencionPublico);
    }
    if (localStorage.getItem('tipo_usuario') === 'TECNICO') {
      setColumnas(ColumnsTecnico);
    }
  };

  React.useEffect(() => {
    verificarAccesosGRID();
  }, []);

  const editarIngreso = (ingreso) => {
    var field = ingreso.field;
    var IngresoNuevo = [];

    const nuevoListado = ordenes.map((item) => {
      if (item.id === ingreso.id) {
        if (field === 'fecha')
          IngresoNuevo = {
            ...item,

            fecha: ingreso?.value
          };
        if (field === 'equipo')
          IngresoNuevo = {
            ...item,
            equipo: ingreso?.value
          };
        if (field === 'marca')
          IngresoNuevo = {
            ...item,
            marca: ingreso?.value
          };
        if (field === 'modelo')
          IngresoNuevo = {
            ...item,
            modelo: ingreso?.value
          };
        if (field === 'falla')
          IngresoNuevo = {
            ...item,
            falla: ingreso?.value
          };
        if (field === 'trabajo')
          IngresoNuevo = {
            ...item,
            user_update_work: localStorage.getItem('user_id'),
            trabajo: ingreso?.value
          };
        if (field === 'total')
          IngresoNuevo = {
            ...item,
            total: ingreso?.value
          };
        if (field === 'abono')
          IngresoNuevo = {
            ...item,
            abono: ingreso?.value
          };
        if (field === 'observacion')
          IngresoNuevo = {
            ...item,
            observacion: ingreso?.value
          };

        updateIngresoDB(IngresoNuevo, field);
        console.log('Ingreso Nuevo', IngresoNuevo);
        return IngresoNuevo;
      }
      return item;
    });
    setOrdenes(nuevoListado);
    // setProductos(nuevoListado);
    // setProductosTemp(nuevoListado);
  };

  const fn_abonarIngreso = (event) => {
    // console.log('evento fikla', event.colDef.editable);
    if (event.field === 'abono') {
      // if (localStorage.getItem('tipo_usuario') === 'ATENCION AL PUBLICO') {
      //   alertify.error('No tiene permisos para realizar esta acción.', 2);
      //   return;
      // }
      if (localStorage.getItem('tipo_usuario') === 'TECNICO') {
        alertify.error('No tiene permisos para realizar esta acción.', 2);
        return;
      }

      SetIsOpenModalIngreso(true);
    }
    if (event.field === 'total') {
      if (localStorage.getItem('tipo_usuario') === 'ADMINISTRADOR') {
        SetIsOpenModalTotal(true);
      } else {
        alertify.error('No tiene permisos para realizar esta acción.', 2);
      }
    }
  };

  const updateIngresoDB = async (ingreso, campo) => {
    if (campo === 'abono') {
    }

    setTableIsLoading(true);
    const result = await actualizarIngreso(ingreso);
    setTableIsLoading(false);

    if (result.code !== 200) {
      alertify.error(result.mensaje, 2);
      return;
    }

    // setReload(true);
    alertify.success(result.mensaje, 2);
    // console.log(result);
  };

  const fn_onEditRowsModelChange = (dato) => {
    console.log(dato);
  };

  const buscarOrden = (id) => {
    return ordenesTemp.find((ordenActual) => ordenActual.id === id);
  };

  const filaSeleccionada = (parameters) => {
    if (parameters.length < 1) return;

    var orden = buscarOrden(parameters[0]);
    localStorage.setItem('idIngreso', orden?.id);
    if (
      orden.factura_relacionada !== undefined &&
      orden.factura_relacionada !== null &&
      orden.factura_relacionada !== -1
    ) {
      setDefinirFactura(false);
    } else {
      setDefinirFactura(true);
    }
    PrepararDatosImpresion(orden);
  };

  const handleRowSelected = (selection) => {
    console.log(selection);
  };
  return (
    <Card>
      <ModalAbonoIngreso></ModalAbonoIngreso>
      <ModalTotal />
      <ModalVerIngreso />
      <div style={{ height: 360, width: '100%', cursor: 'pointer' }}>
        <DataGrid
          rows={ordenesTemp}
          columns={columnas}
          datasets="Commodity"
          onCellEditCommit={(params) => {
            editarIngreso(params);
          }}
          pageSize={10}
          checkboxSelection={false}
          disableSelectionOnClick={false}
          rowHeight={23}
          loading={tableIsLoading}
          onSelectionModelChange={(row) => {
            filaSeleccionada(row);
          }}
        />
      </div>
    </Card>
  );
}
