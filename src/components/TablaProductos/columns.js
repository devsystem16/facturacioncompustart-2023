import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';

export default [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
    visible: false
  },
  {
    field: 'stock',
    headerName: 'Stock',
    // type: 'number',
    width: 115,
    editable: true
  },
  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 420,
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
    width: 140,
    editable: true
  },
  {
    field: 'precio_tecnico',
    headerName: 'P. Técnico',
    width: 160,
    editable: true
  },

  {
    field: 'precio_distribuidor',
    headerName: 'P. Mayorista',
    // type: 'number',
    width: 170,
    editable: true
  },
  {
    field: 'precio_compra',
    headerName: 'P. compra',
    // type: 'number',
    width: 140,
    editable: true
  },

  {
    field: 'codigo_barra',
    headerName: 'Cod. Barra',
    // type: 'number',
    width: 315,
    editable: true
  },
  {
    field: 'descripcion',
    headerName: 'Descripción',
    width: 200,
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
  }
];
