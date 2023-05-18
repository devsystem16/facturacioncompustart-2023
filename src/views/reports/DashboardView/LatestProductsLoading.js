import React from 'react';
import clsx from 'clsx';

import LinearProgress from '@material-ui/core/LinearProgress';
import { Card, CardHeader, Divider, List, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
});

const LatestProductsLoading = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader subtitle={`0 in total`} title="Productos con stock bajo" />
      <Divider />
      <List>
        <LinearProgress />
      </List>
      <Divider />
    </Card>
  );
};

export default LatestProductsLoading;
