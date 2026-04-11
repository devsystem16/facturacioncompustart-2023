import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';

import Logo from '../../components/Logo';
const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  dateTime: {
    fontSize: 16,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '0.3px',
    lineHeight: 1.4,
    textAlign: 'center'
  }
}));

const TopBar = ({ className, onMobileNavOpen, onDesktopNavToggle, ...rest }) => {
  const classes = useStyles();
  const [notifications] = useState([]);
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const logut = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('nombres');
    localStorage.removeItem('tipousuario_id');
  };

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <Hidden mdDown>
          <IconButton color="inherit" onClick={onDesktopNavToggle} edge="start">
            <MenuIcon />
          </IconButton>
        </Hidden>
        <RouterLink to="/app/dashboard">
          <Logo />
        </RouterLink>

        <Box flexGrow={1} />
        <Hidden mdDown>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mr={1}>
            <Typography className={classes.dateTime}>
              {ahora.toLocaleDateString('es-EC', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </Typography>
            <Typography className={classes.dateTime}>
              {ahora.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Typography>
          </Box>
          <IconButton color="inherit">
            <RouterLink
              to="/"
              alt="Salir"
              title="Salir"
              style={{ color: 'white' }}
              onClick={logut}
            >
              <InputIcon />
            </RouterLink>
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
  onDesktopNavToggle: PropTypes.func
};

export default TopBar;
