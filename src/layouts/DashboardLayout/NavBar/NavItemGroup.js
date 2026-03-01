import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  Button,
  Collapse,
  makeStyles
} from '@material-ui/core';
import { ChevronDown, ChevronRight } from 'react-feather';
import { LoginContext } from '../../../context/LoginContext';
import NavItem from './NavItem';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%',
    transition: 'background-color 0.3s ease'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto'
  },
  childrenList: {
    paddingTop: 0,
    paddingBottom: 0
  }
}));

const NavItemGroup = ({ title, icon: Icon, children, obtenerIcono }) => {
  const classes = useStyles();
  const { pestaniaActiva } = useContext(LoginContext);

  const childTitles = children.map((c) => c.title);
  const isChildActive = childTitles.includes(pestaniaActiva);

  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <ListItem className={classes.item} disableGutters>
        <Button className={classes.button} onClick={handleToggle}>
          {Icon && <Icon className={classes.icon} size="20" />}
          <span className={classes.title}>{title}</span>
          {open ? <ChevronDown size="16" /> : <ChevronRight size="16" />}
        </Button>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.childrenList} disablePadding>
          {children.map((child) => (
            <NavItem
              key={child.title}
              href={child.href}
              title={child.title}
              icon={obtenerIcono(child.icon)}
              nested
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

NavItemGroup.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.array.isRequired,
  obtenerIcono: PropTypes.func.isRequired
};

export default NavItemGroup;
