import React, { useContext, useEffect, useState } from 'react';
import {
  makeStyles,
  Typography,
  Grid,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  CircularProgress,
  colors
} from '@material-ui/core';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import { ClienteContext } from '../../../context/ClienteContext';
import { FacturaContext } from '../../../context/FacturaContext';
import SelectCliente from '../../../components/SelectCliente/SelectCliente';
import Swal from 'sweetalert2';
import API from '../../../Environment/config';
import ModalFechaCredito from './ModalFechaCredito';

const formatCurrency = (n) => {
  if (isNaN(n) || n === null) return '$0.00';
  return '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const useStyles = makeStyles((theme) => ({
  infoLabel: {
    fontSize: 12,
    color: colors.grey[500],
    fontWeight: 500
  },
  infoValue: {
    fontSize: 13,
    color: colors.grey[800],
    fontWeight: 600
  },
  columnHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.grey[500],
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '8px 4px',
    textAlign: 'center'
  },
  btnNuevaVenta: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 12,
    borderRadius: 6,
    color: colors.red[600],
    borderColor: colors.red[300],
    '&:hover': {
      backgroundColor: colors.red[50],
      borderColor: colors.red[400]
    }
  }
}));

export default function HeadFactura({ defaultCliente }) {
  const classes = useStyles();
  const { currentCliente, setCurrentCliente } = useContext(ClienteContext);
  const {
    credito,
    setCredito,
    permitirBotonCredito,
    esProforma,
    limpiarFactura,
    productosFactura,
    setFechaLimiteCredito
  } = useContext(FacturaContext);

  const [mostrarModalFecha, setMostrarModalFecha] = useState(false);
  const [verificandoCreditos, setVerificandoCreditos] = useState(false);

  const handleChange = async (event) => {
    if (!permitirBotonCredito) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Revise las formas de pago declaradas.'
      });
      return;
    }

    const activarCredito = event.target.checked;

    if (!activarCredito) {
      setCredito(false);
      return;
    }

    // Verificar creditos pendientes del cliente
    if (!currentCliente.id) {
      setMostrarModalFecha(true);
      return;
    }

    try {
      setVerificandoCreditos(true);
      const resp = await API.get(`api/creditos/pendientes/cliente/${currentCliente.id}`);
      const data = resp.data;

      if (data.cantidad > 0) {
        let filasHTML = data.creditos.map((c) =>
          `<tr>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;font-size:12px;">${c.fecha}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;">${c.detalle || '-'}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;font-size:12px;">${formatCurrency(c.total)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;font-size:12px;">${formatCurrency(c.abono)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;font-size:12px;color:#d32f2f;font-weight:600;">${formatCurrency(c.saldo)}</td>
          </tr>`
        ).join('');

        const htmlContent = `
          <div style="text-align:left;">
            <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:10px 14px;border-radius:4px;margin-bottom:14px;">
              <div style="font-weight:700;color:#e65100;font-size:14px;">
                Este cliente tiene ${data.cantidad} credito${data.cantidad > 1 ? 's' : ''} pendiente${data.cantidad > 1 ? 's' : ''}
              </div>
              <div style="color:#bf360c;font-size:13px;margin-top:4px;">
                Deuda total: <strong>${formatCurrency(data.totalDeuda)}</strong>
              </div>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:12px;">
                <thead>
                  <tr style="background:#f5f5f5;">
                    <th style="padding:8px 10px;text-align:center;font-weight:600;color:#555;font-size:11px;">Fecha</th>
                    <th style="padding:8px 10px;text-align:left;font-weight:600;color:#555;font-size:11px;">Descripcion</th>
                    <th style="padding:8px 10px;text-align:right;font-weight:600;color:#555;font-size:11px;">Total</th>
                    <th style="padding:8px 10px;text-align:right;font-weight:600;color:#555;font-size:11px;">Abonado</th>
                    <th style="padding:8px 10px;text-align:right;font-weight:600;color:#555;font-size:11px;">Saldo</th>
                  </tr>
                </thead>
                <tbody>${filasHTML}</tbody>
                <tfoot>
                  <tr style="background:#fafafa;">
                    <td colspan="4" style="padding:8px 10px;text-align:right;font-weight:700;font-size:12px;">TOTAL PENDIENTE:</td>
                    <td style="padding:8px 10px;text-align:right;font-weight:700;color:#d32f2f;font-size:13px;">${formatCurrency(data.totalDeuda)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>`;

        const result = await Swal.fire({
          title: 'Créditos pendientes detectados',
          html: htmlContent,
          icon: 'warning',
          width: 620,
          showCancelButton: true,
          confirmButtonText: 'Continuar con crédito',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#ff9800',
          cancelButtonColor: '#9e9e9e'
        });

        if (result.isConfirmed) {
          setMostrarModalFecha(true);
        }
        // Si cancela, el switch no se activa
      } else {
        setMostrarModalFecha(true);
      }
    } catch {
      setMostrarModalFecha(true);
    } finally {
      setVerificandoCreditos(false);
    }
  };

  const handleNuevaVenta = () => {
    if (productosFactura.length === 0) {
      limpiarFactura();
      return;
    }
    Swal.fire({
      title: 'Nueva Venta',
      text: 'Se descartará la factura actual. ¿Está seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: 'Sí, nueva venta',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        limpiarFactura();
      }
    });
  };

  var today = new Date(),
    date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();

  useEffect(() => {
    if (defaultCliente?.cedula !== undefined) {
      setCurrentCliente(defaultCliente);
    }
  }, [defaultCliente]);

  return (
    <div>
      <ModalFechaCredito
        open={mostrarModalFecha}
        onConfirmar={(fecha) => {
          setFechaLimiteCredito(fecha);
          setCredito(true);
          setMostrarModalFecha(false);
        }}
        onCancelar={() => {
          setMostrarModalFecha(false);
          // El switch no llega a activarse
        }}
      />

      {/* Título + Switch crédito + Nueva Venta */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography
          variant="h6"
          style={{ fontWeight: 700, color: colors.grey[800] }}
        >
          {esProforma ? 'Proforma' : 'Facturación'}
        </Typography>

        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
          <Button
            variant="outlined"
            size="small"
            className={classes.btnNuevaVenta}
            onClick={handleNuevaVenta}
            startIcon={<DeleteSweepIcon fontSize="small" />}
          >
            Nueva Venta (F8)
          </Button>

          {!esProforma && (
            <FormControlLabel
              control={
                verificandoCreditos
                  ? <CircularProgress size={20} style={{ margin: '0 9px' }} />
                  : (
                    <Switch
                      checked={credito}
                      onChange={handleChange}
                      name="credito"
                      color="primary"
                      size="small"
                      disabled={verificandoCreditos}
                    />
                  )
              }
              label={
                <Typography variant="body2" style={{ fontSize: 13, color: verificandoCreditos ? colors.grey[400] : 'inherit' }}>
                  {verificandoCreditos ? 'Verificando...' : 'Crédito'}
                </Typography>
              }
            />
          )}
        </Box>
      </Box>

      {/* Cliente + Info */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          {defaultCliente?.cedula !== undefined ? (
            <SelectCliente
              defaultCliete={defaultCliente}
              concatenarCedula={true}
            />
          ) : (
            <SelectCliente concatenarCedula={true} />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            p={1.5}
            style={{
              backgroundColor: '#f8f9fc',
              borderRadius: 8,
              border: '1px solid #e8e8e8'
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <span className={classes.infoLabel}>Fecha</span>
                <br />
                <span className={classes.infoValue}>{date}</span>
              </Grid>
              <Grid item xs={4}>
                <span className={classes.infoLabel}>CI</span>
                <br />
                <span className={classes.infoValue}>
                  {currentCliente.cedula || '-'}
                </span>
              </Grid>
              <Grid item xs={4}>
                <span className={classes.infoLabel}>Telf.</span>
                <br />
                <span className={classes.infoValue}>
                  {currentCliente.telefono || '-'}
                </span>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Cabecera de columnas */}
      <Box mt={2}>
        <Divider />
        <Grid container spacing={0}>
          <Grid item xs={1}>
            <div className={classes.columnHeader}></div>
          </Grid>
          <Grid item xs={2}>
            <div className={classes.columnHeader}>Cant.</div>
          </Grid>
          <Grid item xs={5}>
            <div className={classes.columnHeader} style={{ textAlign: 'left' }}>
              Producto
            </div>
          </Grid>
          <Grid item xs={2}>
            <div className={classes.columnHeader}>P. Unit.</div>
          </Grid>
          <Grid item xs={2}>
            <div className={classes.columnHeader}>Total</div>
          </Grid>
        </Grid>
        <Divider />
      </Box>
    </div>
  );
}
