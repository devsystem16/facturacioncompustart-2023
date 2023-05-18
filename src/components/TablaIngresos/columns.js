import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
    visible: false
  },

  {
    field: 'cliente',
    headerName: 'Cliente',
    width: 300,
    visible: true,
    editable: false,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },

  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 130,
    editable: true
  },

  {
    field: 'observacion',
    headerName: 'Observación',
    // type: 'number',
    width: 315,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },

  {
    field: 'factura_relacionada',
    headerName: 'Fac.',
    // type: 'number',
    width: 115,
    editable: false
  },

  // {
  //   field: 'total',
  //   headerName: 'Total',
  //   // type: 'number',
  //   width: 115,
  //   editable: false
  // },
  // {
  //   field: 'abono',
  //   headerName: 'Abono',
  //   // type: 'number',
  //   width: 119,
  //   editable: false
  // },

  // {
  //   field: 'saldo',
  //   headerName: 'Saldo',
  //   // type: 'number',
  //   width: 115,
  //   editable: false
  // },
  {
    field: 'equipo',
    headerName: 'Equipo',
    width: 200,
    editable: true
  },
  {
    field: 'marca',
    headerName: 'Marca',
    width: 140,
    editable: true
  },
  {
    field: 'modelo',
    headerName: 'Modelo',
    width: 160,
    editable: true
  },

  {
    field: 'serie',
    headerName: 'Serie',
    width: 200,
    visible: true,
    editable: false,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },

  {
    field: 'falla',
    headerName: 'Falla',
    // type: 'number',
    width: 440,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },
  {
    field: 'trabajo',
    headerName: 'Trabajo',
    // type: 'number',
    width: 440,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },

  {
    field: 'update_work',
    headerName: 'Actualizó trabajo',
    // type: 'number',
    width: 200,
    editable: false
  }
];
