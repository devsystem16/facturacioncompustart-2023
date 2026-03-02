import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';

export default [
  {
    field: 'id',
    headerName: 'ID',
    width: 89,
    visible: true
  },
  {
    field: 'stock',
    headerName: 'Stock',
    // type: 'number',
    flex: 0.6,
    minWidth: 80,
    editable: true
  },
  {
    field: 'nombre',
    headerName: 'Nombre',
    flex: 1.5,
    minWidth: 200,
    editable: true,

    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue}>
          <span
            className="table-cell-trucate"
          // style={{
          //   backgroundColor: 'red',
          //   wordWrap: 'break-word'
          // }}
          >
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },
  {
    field: 'precio_publico',
    headerName: 'P. Público',
    flex: 0.8,
    minWidth: 100,
    editable: true,
    valueFormatter: (params) => Number(params.value).toFixed(2)
  },
  {
    field: 'precio_tecnico',
    headerName: 'P. Técnico',
    flex: 0.8,
    minWidth: 100,
    editable: true,
    valueFormatter: (params) => Number(params.value).toFixed(2)
  },

  {
    field: 'precio_distribuidor',
    headerName: 'P. Mayorista',
    // type: 'number',
    flex: 0.8,
    minWidth: 100,
    editable: true,
    valueFormatter: (params) => Number(params.value).toFixed(2)
  },
  {
    field: 'precio_compra',
    headerName: 'P. compra',
    // type: 'number',
    flex: 0.8,
    minWidth: 100,
    editable: true,
    valueFormatter: (params) => Number(params.value).toFixed(2)
  },

  {
    field: 'codigo_barra',
    headerName: 'Cod. Barra',
    // type: 'number',
    flex: 1,
    minWidth: 130,
    editable: true
  },
  {
    field: 'proveedor_codigo',
    headerName: 'Proveedor',
    flex: 1.2,
    minWidth: 150,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue || ''}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue || '-'}
          </span>
        </Tooltip>
      );
    }
  }
];
