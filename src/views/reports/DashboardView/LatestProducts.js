import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import LatestProductsLoading from './LatestProductsLoading';
import MenuContextProducto from '../../../components/MenuContextProducto/MenuContextProducto';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { EstadisticasContext } from '../../../context/EstadisticasContext';
const data = [
  {
    id: uuid(),
    name: 'Dropbox',
    imageUrl: '/static/images/products/product_1.png',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Medium Corporation',
    imageUrl: '/static/images/products/product_2.png',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Slack',
    imageUrl: '/static/images/products/product_3.png',
    updatedAt: moment().subtract(3, 'hours')
  },
  {
    id: uuid(),
    name: 'Lyft',
    imageUrl: '/static/images/products/product_4.png',
    updatedAt: moment().subtract(5, 'hours')
  },
  {
    id: uuid(),
    name: 'GitHub',
    imageUrl: '/static/images/products/product_5.png',
    updatedAt: moment().subtract(9, 'hours')
  }
];

const useStyles = makeStyles({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
});

const LatestProducts = ({ className, ...rest }) => {
  const classes = useStyles();
  const [products] = useState(data);
  const { reporte } = useContext(EstadisticasContext);
  if (reporte.stockBajo === undefined) return <LatestProductsLoading />;
  else
    return (
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader
          subtitle={`${products.length} in total`}
          title="Productos con stock bajo"
        />
        <Divider />
        <List>
          {reporte.stockBajo.map((product, i) => (
            <ListItem
              divider={i < reporte.stockBajo.length - 1}
              key={product.id}
            >
              <ListItemAvatar>
                <Avatar title="Stock">{product.stock}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={product.nombre}
                secondary={`Stock: ${product.stock}`}
              />

              <IconButton edge="end" size="small">
                {/* <MenuContextProducto
                  idProducto={product.id}
                  stock={product.stock}
                /> */}
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          {/* <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            View all
          </Button> */}
        </Box>
      </Card>
    );
};

LatestProducts.propTypes = {
  className: PropTypes.string
};

export default LatestProducts;
