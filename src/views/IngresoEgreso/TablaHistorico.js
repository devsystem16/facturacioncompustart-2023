import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Card, Typography, Box } from '@material-ui/core';
import API from '../../Environment/config';
import { formatCurrency } from '../../Environment/utileria';
import moment from 'moment';

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
            return formatCurrency(params.value);
        }
    },
    {
        field: 'observacion',
        headerName: 'Observación',
        flex: 1,
        minWidth: 200
    }
];

export default function TablaHistorico() {
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

    return (
        <Card style={{ marginTop: 20, padding: 10 }}>
            <Box mb={2}>
                <Typography variant="h6" component="h3">
                    Histórico (Últimos 30 días)
                </Typography>
            </Box>
            <div style={{ width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    autoHeight
                    loading={loading}
                    disableSelectionOnClick
                />
            </div>
        </Card>
    );
}
