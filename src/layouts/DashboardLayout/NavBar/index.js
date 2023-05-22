import React, { useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LoginContext } from '../../../context/LoginContext';

import {
  Avatar,
  Box,
  // Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Airplay as Billing,
  Edit as EditIconF,
  Smartphone,
  Clipboard as iconoFacturas,
  FileText as proformaIcon
} from 'react-feather';
import NavItem from './NavItem';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: 'Senior Developer',
  name: 'Mychael'
};

// const items = [
//   {
//     href: '/app/dashboard',
//     icon: 'BarChartIcon',
//     title: 'Dashboard'
//   },
//   {
//     href: '/app/puntoventa',
//     icon: Billing,
//     title: 'Punto de Venta'
//   },
//   {
//     href: '/app/ingreso',
//     icon: Smartphone,
//     title: 'Ingreso'
//   },
//   {
//     href: '/app/customers',
//     icon: UsersIcon,
//     title: 'Cientes'
//   },
//   {
//     href: '/app/products',
//     icon: ShoppingBagIcon,
//     title: 'Productos'
//   },

//   {
//     href: '/app/creditos',
//     icon: EditIconF,
//     title: 'Creditos'
//   },
//   {
//     href: '/app/facturas',
//     icon: iconoFacturas,
//     title: 'Facturas'
//   }

// ,{
//   href: '/app/accounts',
//   icon: UserIcon,
//   title: 'Cuenta'
// },
// {
//   href: '/app/settings',
//   icon: SettingsIcon,
//   title: 'Settings'
// }
// ,
// {
//   href: '/login',
//   icon: LockIcon,
//   title: 'Login'
// }
// ,
// {
//   href: '/register',
//   icon: UserPlusIcon,
//   title: 'Register'
// }
// ,
// {
//   href: '/404',
//   icon: AlertCircleIcon,
//   title: 'Error'
// }
// ];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const { userloggin, items } = useContext(LoginContext);
  const classes = useStyles();
  const location = useLocation();

  const obtenerIcono = (nombreIcono) => {
    if (nombreIcono === 'BarChartIcon') return BarChartIcon;
    if (nombreIcono === 'Billing') return Billing;
    if (nombreIcono === 'Smartphone') return Smartphone;
    if (nombreIcono === 'UsersIcon') return UsersIcon;
    if (nombreIcono === 'ShoppingBagIcon') return ShoppingBagIcon;
    if (nombreIcono === 'EditIconF') return EditIconF;
    if (nombreIcono === 'iconoFacturas') return iconoFacturas;
    if (nombreIcono === 'proformaIcon') return proformaIcon;
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={'https://quevedo2023.s3.us-east-2.amazonaws.com/avatar_6.png'}
          to="/app/account"
        />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {userloggin.name === 'Facturacion'
            ? localStorage.getItem('nombres')
            : userloggin.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {userloggin.jobTitle === 'Facturacion'
            ? localStorage.getItem('tipo_usuario')
            : userloggin.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={obtenerIcono(item.icon)}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
