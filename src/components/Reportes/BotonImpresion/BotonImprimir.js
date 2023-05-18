import React, { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/Print';
import Boton from './Boton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: '2rem',
    right: '2rem'
  }
}));

const BotonImprimir = ({ ComponentToPrint }) => {
  const componentRef = useRef();
  const fn_imprimir = useReactToPrint({
    content: () => componentRef.current
  });
  useEffect(() => {}, []);
  const classes = useStyles();
  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={fn_imprimir}
      >
        <PrintIcon />
      </Fab>

      <div style={{ display: 'none' }}>
        <ContenedorComponent ref={componentRef} component={ComponentToPrint} />
      </div>
    </div>
  );
};
export default BotonImprimir;

const ContenedorComponent = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <props.component></props.component>
    </div>
  );
});
