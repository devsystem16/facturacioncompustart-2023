import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card } from '@material-ui/core';
import columns from './columns';
import columnsAtencionPublico from './ColumnsAtencionPublico';
import ColumnsTecnico from './ColumnsTecnico';

import alertify from 'alertifyjs';
import ModalAbonoIngreso from '../../components/TablaIngresos/ModalAbonoIngreso';
import ModalTotal from '../../components/TablaIngresos/ModalTotal';
import ModalVerIngreso from '../../components/ModalVerIngreso/ModalVerIngreso';

import { IngresoContext } from '../../context/IngresoContext';
import { LoginContext } from '../../context/LoginContext';

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
    setDefinirFactura,
    filtroEstado
  } = React.useContext(IngresoContext);
  const { setEdicionActiva, tienePermiso } = React.useContext(LoginContext);

  const verificarAccesosGRID = () => {
    const tipo = localStorage.getItem('tipo_usuario');
    if (tipo === 'ATENCION AL PUBLICO') {
      setColumnas(columnsAtencionPublico);
    }
    if (tipo === 'TECNICO') {
      setColumnas(ColumnsTecnico);
    }
  };

  React.useEffect(() => {
    verificarAccesosGRID();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEdicionActiva(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Aplicar filtro de estado sobre ordenesTemp
  const ordenesFiltradas = React.useMemo(() => {
    if (filtroEstado === 'todos') return ordenesTemp;
    return ordenesTemp.filter((o) => o.estado_reparacion === filtroEstado);
  }, [ordenesTemp, filtroEstado]);

  const editarIngreso = (ingreso) => {
    var field = ingreso.field;
    var IngresoNuevo = [];

    const nuevoListado = ordenes.map((item) => {
      if (item.id === ingreso.id) {
        if (field === 'fecha')
          IngresoNuevo = { ...item, fecha: ingreso?.value };
        if (field === 'equipo')
          IngresoNuevo = { ...item, equipo: ingreso?.value };
        if (field === 'marca')
          IngresoNuevo = { ...item, marca: ingreso?.value };
        if (field === 'modelo')
          IngresoNuevo = { ...item, modelo: ingreso?.value };
        if (field === 'falla')
          IngresoNuevo = { ...item, falla: ingreso?.value };
        if (field === 'trabajo')
          IngresoNuevo = {
            ...item,
            user_update_work: localStorage.getItem('user_id'),
            trabajo: ingreso?.value
          };
        if (field === 'total')
          IngresoNuevo = { ...item, total: ingreso?.value };
        if (field === 'abono')
          IngresoNuevo = { ...item, abono: ingreso?.value };
        if (field === 'observacion')
          IngresoNuevo = { ...item, observacion: ingreso?.value };
        if (field === 'serie')
          IngresoNuevo = { ...item, serie: ingreso?.value };

        updateIngresoDB(IngresoNuevo, field);
        setEdicionActiva(false);
        return IngresoNuevo;
      }
      return item;
    });
    setOrdenes(nuevoListado);
  };

  const fn_abonarIngreso = (event) => {
    if (event.field === 'abono') {
      if (!tienePermiso('ingresos.abonar')) {
        alertify.error('No tiene permisos para realizar esta acción.', 2);
        return;
      }
      SetIsOpenModalIngreso(true);
    }
    if (event.field === 'total') {
      if (!tienePermiso('ingresos.editar-total')) {
        alertify.error('No tiene permisos para realizar esta acción.', 2);
        return;
      }
      SetIsOpenModalTotal(true);
    }
  };

  const updateIngresoDB = async (ingreso, campo) => {
    setTableIsLoading(true);
    const result = await actualizarIngreso(ingreso);
    setTableIsLoading(false);

    if (result.code !== 200) {
      alertify.error(result.mensaje, 2);
      return;
    }

    alertify.success(result.mensaje, 2);
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

  const marcarCambios = (params, event) => {
    if (params.colDef.editable) setEdicionActiva(true);
  };

  return (
    <Card>
      <ModalAbonoIngreso />
      <ModalTotal />
      <ModalVerIngreso />
      <div style={{ height: 400, width: '100%', cursor: 'pointer' }}>
        <DataGrid
          rows={ordenesFiltradas}
          columns={columnas}
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
          onCellDoubleClick={(params, event) => {
            marcarCambios(params, event);
          }}
        />
      </div>
    </Card>
  );
}
