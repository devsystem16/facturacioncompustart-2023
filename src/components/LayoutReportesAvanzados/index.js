import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ReporteUtilidades from './ReporteUtilidades';
import ReporteInventarioValorizado from './ReporteInventarioValorizado';
import ReporteCuentasPorCobrar from './ReporteCuentasPorCobrar';
import ReporteVentasPorProducto from './ReporteVentasPorProducto';
import ReporteVentasPorCliente from './ReporteVentasPorCliente';
import ReporteComparativoMensual from './ReporteComparativoMensual';

import ReportesAvanzadosProvider from '../../context/ReportesAvanzadosContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 200
  }
}));

export default function LayoutReportesAvanzados() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ReportesAvanzadosProvider>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Reportes avanzados"
          className={classes.tabs}
        >
          <Tab label="Utilidades" {...a11yProps(0)} />
          <Tab label="Inventario Valorizado" {...a11yProps(1)} />
          <Tab label="Cuentas por Cobrar" {...a11yProps(2)} />
          <Tab label="Ventas por Producto" {...a11yProps(3)} />
          <Tab label="Ventas por Cliente" {...a11yProps(4)} />
          <Tab label="Comparativo Mensual" {...a11yProps(5)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <ReporteUtilidades />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ReporteInventarioValorizado />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ReporteCuentasPorCobrar />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ReporteVentasPorProducto />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <ReporteVentasPorCliente />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <ReporteComparativoMensual />
        </TabPanel>
      </div>
    </ReportesAvanzadosProvider>
  );
}
