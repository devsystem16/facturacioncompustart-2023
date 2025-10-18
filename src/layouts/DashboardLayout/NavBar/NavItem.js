import React, { useContext } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles
} from '@material-ui/core';
import { LoginContext } from '../../../context/LoginContext';

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
  active: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  selected: {
    backgroundColor: '#1c384d',
    color: '#fff',
    '& $icon': {
      color: '#fff'
    },
    '& $title': {
      fontWeight: 600
    },
    '&:hover': {
      backgroundColor: '#1f425b'
    }
  }
}));

const NavItem = ({
  className,
  href,
  icon: Icon,
  title,
  ...rest
}) => {
  const classes = useStyles();
  const {
    edicionActiva,
    pestaniaActiva,
    setPestaniaActiva
  } = useContext(LoginContext);

  const handleClick = () => {
    if (!edicionActiva && setPestaniaActiva) {
      setPestaniaActiva(title);
    }
  };

  const isActive = pestaniaActiva === title;

  return (
    <ListItem
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button
        disabled={edicionActiva}
        onClick={handleClick}
        className={clsx(classes.button, {
          [classes.selected]: isActive
        })}
        component={RouterLink}
        to={href}
      >
        {Icon && (
          <Icon
            className={classes.icon}
            size="20"
          />
        )}
        <span className={classes.title}>{title}</span>
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavItem;
