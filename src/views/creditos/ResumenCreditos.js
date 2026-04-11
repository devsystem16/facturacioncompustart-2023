import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  colors
} from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { formatCurrencySimple } from '../../Environment/utileria';

const tarjetas = [
  {
    key: 'vencido',
    label: 'Vencidos',
    icon: <ErrorOutlineIcon style={{ fontSize: 22 }} />,
    bg: '#ffebee',
    border: colors.red[400],
    iconColor: colors.red[600],
    textColor: colors.red[800]
  },
  {
    key: 'por_vencer',
    label: 'Por vencer',
    icon: <AccessTimeIcon style={{ fontSize: 22 }} />,
    bg: '#fff8e1',
    border: colors.orange[400],
    iconColor: colors.orange[700],
    textColor: colors.orange[900]
  },
  {
    key: 'sin_fecha',
    label: 'Sin fecha límite',
    icon: <HelpOutlineIcon style={{ fontSize: 22 }} />,
    bg: '#f5f5f5',
    border: colors.grey[400],
    iconColor: colors.grey[600],
    textColor: colors.grey[800]
  }
];

export default function ResumenCreditos({ resumen, filtroEstado, setFiltroEstado }) {
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" style={{ gap: 12, marginBottom: 16 }}>
      {tarjetas.map(({ key, label, icon, bg, border, iconColor, textColor }) => {
        const data = resumen[key] || { total: 0, saldo: 0 };
        const activo = filtroEstado === key;
        return (
          <Card
            key={key}
            onClick={() => setFiltroEstado(activo ? 'todos' : key)}
            style={{
              cursor: 'pointer',
              borderLeft: `4px solid ${border}`,
              backgroundColor: activo ? bg : '#fff',
              boxShadow: activo ? `0 0 0 2px ${border}` : undefined,
              minWidth: 170,
              flex: '1 1 170px',
              maxWidth: 240,
              transition: 'box-shadow 0.15s'
            }}
          >
            <CardContent style={{ padding: '12px 16px' }}>
              <Box display="flex" alignItems="center" style={{ gap: 8, marginBottom: 4 }}>
                <span style={{ color: iconColor }}>{icon}</span>
                <Typography
                  variant="overline"
                  style={{ color: textColor, fontWeight: 700, lineHeight: 1.2 }}
                >
                  {label}
                </Typography>
              </Box>
              <Typography variant="h6" style={{ color: textColor, fontWeight: 800 }}>
                {data.total}
                <Typography
                  component="span"
                  variant="caption"
                  style={{ color: textColor, marginLeft: 4, fontWeight: 400 }}
                >
                  crédito(s)
                </Typography>
              </Typography>
              <Typography variant="caption" style={{ color: textColor }}>
                $ {formatCurrencySimple(data.saldo)}
              </Typography>
            </CardContent>
          </Card>
        );
      })}

      {filtroEstado !== 'todos' && (
        <Button
          size="small"
          variant="outlined"
          onClick={() => setFiltroEstado('todos')}
          style={{ textTransform: 'none', alignSelf: 'center' }}
        >
          Ver todos
        </Button>
      )}
    </Box>
  );
}
