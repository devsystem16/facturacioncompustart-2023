import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  makeStyles
} from '@material-ui/core';

import Page from '../../../components/Page';
import BuscadorProducto from './BuscadorProducto';
import TablaProductos from '../../../components/TablaProductos/TablaProductos';
import TabUtilidad from './TabUtilidad';

import { ProductosContext } from '../../../context/ProductosContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}

const ProductList = () => {
  const classes = useStyles();
  const { productos } = useContext(ProductosContext);
  const [tabValue, setTabValue] = useState(0);

  return (
    <Page className={classes.root} title="Productos">
      <Container maxWidth={false}>
        <Paper style={{ marginBottom: 8 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Productos" />
            <Tab label="Utilidad" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <BuscadorProducto />
          <Box mt={3}>
            <TablaProductos />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TabUtilidad />
        </TabPanel>
      </Container>
    </Page>
  );
};

export default ProductList;
