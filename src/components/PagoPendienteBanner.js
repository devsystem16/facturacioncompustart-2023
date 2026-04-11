import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import PAYMENT_CONFIG from '../Environment/payment';

export const BANNER_HEIGHT = 44;

const useStyles = makeStyles(() => ({
  banner: {
    position: 'fixed',
    top: 64,
    left: 0,
    right: 0,
    zIndex: 1099,
    height: BANNER_HEIGHT,
    backgroundColor: '#b45309',
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.06) 20px, rgba(0,0,0,0.06) 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
    borderBottom: '1px solid #92400e',
  },
  icon: {
    color: '#fef3c7',
    fontSize: 20,
    flexShrink: 0,
  },
  text: {
    color: '#fef3c7',
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
    lineHeight: 1.3,
    textAlign: 'center',
  },
  contacto: {
    color: '#fde68a',
    fontWeight: 700,
    marginLeft: 6,
    textDecoration: 'underline',
  }
}));

const PagoPendienteBanner = () => {
  const classes = useStyles();

  if (!PAYMENT_CONFIG.pendiente) return null;

  return (
    <Box className={classes.banner}>
      <WarningIcon className={classes.icon} />
      <Typography className={classes.text}>
        {PAYMENT_CONFIG.mensaje}
        {PAYMENT_CONFIG.contacto && (
          <span className={classes.contacto}>{PAYMENT_CONFIG.contacto}</span>
        )}
      </Typography>
      <WarningIcon className={classes.icon} />
    </Box>
  );
};

export default PagoPendienteBanner;
