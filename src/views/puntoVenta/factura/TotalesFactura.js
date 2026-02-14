import React, { useContext } from 'react';
import { makeStyles, Box, Typography, Divider, colors } from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import BotonGuardarFactura from '../../../components/BotonGuardarFactura';

import { FacturaContext } from '../../../context/FacturaContext';
import { formatCurrency } from '../../../Environment/utileria';

import FormasPago from './FormasPago';

const useStyles = makeStyles((theme) => ({
  totalesWrapper: {
    marginTop: 8
  },
  totalesRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 12px'
  },
  totalesLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.grey[600]
  },
  totalesValue: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.grey[800]
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#eef0ff',
    borderRadius: 6,
    marginTop: 4
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: '#3f51b5'
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#3f51b5'
  },
  observacionArea: {
    width: '100%',
    fontSize: 12,
    fontFamily: 'inherit',
    padding: '8px 10px',
    border: '1px solid #e0e0e0',
    borderRadius: 6,
    outline: 'none',
    resize: 'vertical',
    backgroundColor: '#fafbfc',
    '&:focus': {
      borderColor: '#3f51b5',
      backgroundColor: '#fff'
    }
  },
  footerSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 10
  }
}));

export default function TotalesFactura({ totales }) {
  const classes = useStyles();

  const { observacion, setObservacion, formasPago, setFormasPago, esProforma } =
    useContext(FacturaContext);

  const asignarObs = (e) => {
    setObservacion(e.target.value);
  };

  return (
    <div className={classes.totalesWrapper}>
      <Divider />

      <Box mt={1}>
        {/* Subtotal */}
        <div className={classes.totalesRow}>
          <Typography className={classes.totalesLabel}>Subtotal</Typography>
          <Typography className={classes.totalesValue}>
            {formatCurrency(totales.subtotal)}
          </Typography>
        </div>

        {/* IVA */}
        <div className={classes.totalesRow}>
          <Typography className={classes.totalesLabel}>IVA 15%</Typography>
          <Typography className={classes.totalesValue}>
            {formatCurrency(totales.iva)}
          </Typography>
        </div>

        {/* Total */}
        <div className={classes.totalRow}>
          <Typography className={classes.totalLabel}>TOTAL</Typography>
          <Typography className={classes.totalValue}>
            {totales.total > 0 && !esProforma ? (
              <FormasPago
                formasPago={formasPago}
                setFormasPago={setFormasPago}
                TotalFactura={`${formatCurrency(totales.total)}`}
              />
            ) : (
              `$ ${totales.total}`
            )}
          </Typography>
        </div>
      </Box>

      {/* Footer: Observaciones + Botón */}
      <Box className={classes.footerSection} mt={1.5}>
        <Box flexGrow={1}>
          <TextareaAutosize
            value={observacion}
            onChange={asignarObs}
            rowsMin={2}
            rowsMax={4}
            placeholder="Observaciones..."
            className={classes.observacionArea}
          />
        </Box>
        <Box flexShrink={0} pt={0.5}>
          <BotonGuardarFactura />
        </Box>
      </Box>
    </div>
  );
}
