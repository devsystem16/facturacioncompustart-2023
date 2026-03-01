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
    field: 'cedula',
    headerName: 'Cédula',
    width: 150,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue || ''}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },
  {
    field: 'nombres',
    headerName: 'Nombres',
    width: 280,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue || ''}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },
  {
    field: 'correo',
    headerName: 'Correo',
    width: 230,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue || ''}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },
  {
    field: 'telefono',
    headerName: 'Teléfono',
    width: 150,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue || ''}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },
  {
    field: 'direccion',
    headerName: 'Dirección',
    width: 300,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue || ''}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  },
  {
    field: 'observacion',
    headerName: 'Observación',
    width: 300,
    editable: true,
    renderCell: (cellValues) => {
      return (
        <Tooltip title={cellValues.formattedValue || ''}>
          <span className="table-cell-trucate">
            {cellValues.formattedValue}
          </span>
        </Tooltip>
      );
    }
  }
];
