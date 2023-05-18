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
    width: 130,
    editable: true
  },
  {
    field: 'nombres',
    headerName: 'Nombres',
    width: 300,
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
    field: 'correo',
    headerName: 'Correo',
    width: 250,
    editable: true
  },
  {
    field: 'telefono',
    headerName: 'Teléfono',
    width: 250,
    editable: true
  },
  {
    field: 'direccion',
    headerName: 'Dirección',
    // type: 'number',
    width: 400,
    editable: true
  },
  {
    field: 'observacion',
    headerName: 'Observación',
    // type: 'number',
    width: 350,
    editable: true
  }
];
