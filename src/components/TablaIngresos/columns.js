import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const estadoStyle = {
  pendiente: { backgroundColor: '#fff3e0', color: '#e65100', label: 'Pendiente' },
  en_proceso: { backgroundColor: '#e3f2fd', color: '#1565c0', label: 'En Proceso' },
  completado: { backgroundColor: '#e8f5e9', color: '#2e7d32', label: 'Completado' },
  entregado: { backgroundColor: '#f3e5f5', color: '#7b1fa2', label: 'Entregado' }
};

export default [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
    visible: false
  },
  {
    field: 'estado_reparacion',
    headerName: 'Estado',
    width: 120,
    editable: false,
    renderCell: (params) => {
      const s = estadoStyle[params.value] || estadoStyle['pendiente'];
      return (
        <span style={{ backgroundColor: s.backgroundColor, color: s.color, padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
          {s.label}
        </span>
      );
    }
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
    field: 'telefono_cliente',
    headerName: 'Telf.',
    width: 130,
    editable: false
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
