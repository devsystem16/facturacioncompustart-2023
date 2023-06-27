import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import BotonGuardarFactura from '../../../components/BotonGuardarFactura';

import { FacturaContext } from '../../../context/FacturaContext';
import { formatCurrency } from '../../../Environment/utileria';

import FormasPago from './FormasPago';
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(0),
    fontSize: '12px'
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1)
  },
  paperRight: {
    padding: theme.spacing(1),
    textAlign: 'Right',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1)
  },
  divider: {
    margin: theme.spacing(2, 0)
  }
}));

export default function RowFactura({ totales }) {
  const classes = useStyles();

  const { observacion, setObservacion, formasPago, setFormasPago, esProforma } =
    useContext(FacturaContext);

  const asignarObs = (e) => {
    setObservacion(e.target.value);
  };

  return (
    <div>
      <Divider className={classes.divider} />

      <div className={classes.container}>
        <div style={{ gridColumnEnd: 'span 8', height: '24px' }}>
          <Paper className={classes.paperRight}>SUBTOTAL: </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}>
            {formatCurrency(totales.subtotal)}
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 8' }}>
          <Paper className={classes.paperRight}>IVA 12%: </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper className={classes.paper}>{formatCurrency(totales.iva)}</Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 8' }}>
          <Paper className={classes.paperRight}>TOTAL: </Paper>
        </div>
        <div style={{ gridColumnEnd: 'span 4' }}>
          <Paper
            className={classes.paper}
            style={{ fontWeight: 'bold', fontSize: '14px' }}
          >
            {totales.total > 0 && !esProforma ? (
              <FormasPago
                formasPago={formasPago}
                setFormasPago={setFormasPago}
                TotalFactura={`${formatCurrency(totales.total)}`}
              ></FormasPago>
            ) : (
              `$ ${totales.total}`
            )}
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 9' }}>
          <Paper className={classes.paperRight} style={{ textAlign: 'left' }}>
            <TextareaAutosize
              value={observacion}
              defaultValue={observacion}
              onChange={asignarObs}
              style={{ width: '100%' }}
              aria-label="minimum height"
              rows={3}
              placeholder="Observaciones"
            />
          </Paper>
        </div>

        <div style={{ gridColumnEnd: 'span 3', textAlign: 'center' }}>
          <BotonGuardarFactura />
        </div>
      </div>
    </div>
  );
}
