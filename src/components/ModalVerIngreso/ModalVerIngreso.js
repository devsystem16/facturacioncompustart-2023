import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TextField } from '@material-ui/core';

import { IngresoContext } from '../../context/IngresoContext';
import Formulario from './Formulario';
import EditarIngreso from '../NuevoIngreso/EditarIngreso';
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalVerIngreso = ({ orden }) => {
  const classes = useStyles();

  const { openModalIngreso, setOpenModalIngreso } = useContext(IngresoContext);

  const handleClose = () => {
    setOpenModalIngreso(false);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={openModalIngreso}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Actualización de ingresos
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClose}>
              guardar
            </Button> */}
          </Toolbar>
        </AppBar>

        <EditarIngreso fn_cerrarModal={handleClose} />
        {/* <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />

            <TextField
              fullWidth
              placeholder="Buscar Orden"
              // variant="outlined"
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List> */}
      </Dialog>
    </div>
  );
};

export default ModalVerIngreso;
