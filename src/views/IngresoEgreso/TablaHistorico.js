import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  makeStyles
} from '@material-ui/core';
import HistoryIcon from '@material-ui/icons/History';
import API from '../../Environment/config';
import { formatCurrency } from '../../Environment/utileria';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  dataGrid: {
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f5f6fa',
      borderBottom: '2px solid #e0e0e0'
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#f8f9ff'
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid #f0f0f0'
    }
  }
}));

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'fecha_hora',
    headerName: 'Fecha / Hora',
    width: 200,
    renderCell: (params) => {
      return moment(params.value).format('DD/MM/YYYY HH:mm:ss');
    }
  },
  {
    field: 'valorRetiro',
    headerName: 'Valor',
    width: 150,
    renderCell: (params) => {
      return (
        <Chip
          label={formatCurrency(params.value)}
          size="small"
          style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
        />
      );
    }
  },
  {
    field: 'concepto',
    headerName: 'Concepto',
    width: 200
  },
  {
    field: 'observacion',
    headerName: 'Observación',
    flex: 1,
    minWidth: 200
  }
];

export default function TablaHistorico() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistorico = async () => {
    setLoading(true);
    try {
      const response = await API.get('api/retiros/ultimos-30-dias');
      if (response.data && response.data.data) {
        setRows(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching historial:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, []);

  const totalHistorico = rows.reduce((acc, item) => acc + (item.valorRetiro || 0), 0);

  return (
    <Card className={classes.card}>
      <CardContent>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={2}>
          <Box display="flex" alignItems="center">
            <HistoryIcon style={{ marginRight: 8, color: '#3f51b5' }} />
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              Histórico (Últimos 30 días)
            </Typography>
            <Chip
              label={`${rows.length} registros`}
              size="small"
              style={{ marginLeft: 12, backgroundColor: '#e8eaf6', color: '#3f51b5' }}
            />
          </Box>
        </Box>

        {/* DataGrid */}
        <div style={{ width: '100%' }}>
          <DataGrid
            className={classes.dataGrid}
            rows={rows}
            columns={columns}
            pageSize={10}
            autoHeight
            loading={loading}
            disableSelectionOnClick
          />
        </div>

        {/* Footer total */}
        {rows.length > 0 && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Chip
              label={`Total últimos 30 días: ${formatCurrency(totalHistorico)}`}
              style={{
                backgroundColor: '#1a237e',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '4px 8px'
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
