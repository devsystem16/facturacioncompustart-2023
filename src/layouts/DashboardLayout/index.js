import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import PagoPendienteBanner, { BANNER_HEIGHT } from '../../components/PagoPendienteBanner';
import PAYMENT_CONFIG from '../../Environment/payment';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: PAYMENT_CONFIG.pendiente ? 64 + BANNER_HEIGHT : 64,
    transition: 'padding-left 225ms cubic-bezier(0, 0, 0.2, 1)'
  },
  wrapperShift: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDesktopNavOpen, setDesktopNavOpen] = useState(true);

  return (
    <div className={classes.root}>
      <TopBar
        onMobileNavOpen={() => setMobileNavOpen(true)}
        onDesktopNavToggle={() => setDesktopNavOpen(!isDesktopNavOpen)}
      />
      <PagoPendienteBanner />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        openDesktop={isDesktopNavOpen}
      />
      <div className={`${classes.wrapper} ${isDesktopNavOpen ? classes.wrapperShift : ''}`}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
