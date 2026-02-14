import React, { useContext, useEffect } from 'react';
import {
  makeStyles,
  Typography,
  Grid,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  colors
} from '@material-ui/core';
import { ClienteContext } from '../../../context/ClienteContext';
import { FacturaContext } from '../../../context/FacturaContext';
import SelectCliente from '../../../components/SelectCliente/SelectCliente';
import Swal from 'sweetalert2';

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
  }
}));

export default function HeadFactura({ defaultCliente }) {
  const classes = useStyles();
  const { currentCliente, setCurrentCliente } = useContext(ClienteContext);
  const { credito, setCredito, permitirBotonCredito, esProforma } =
    useContext(FacturaContext);

  const handleChange = (event) => {
    if (!permitirBotonCredito) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Revise las formas de pago declaradas.'
      });
      return;
    }
    setCredito(event.target.checked);
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
      {/* Título + Switch crédito */}
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

        {!esProforma && (
          <FormControlLabel
            control={
              <Switch
                checked={credito}
                onChange={handleChange}
                name="credito"
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" style={{ fontSize: 13 }}>
                Crédito
              </Typography>
            }
          />
        )}
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
