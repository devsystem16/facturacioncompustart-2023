import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { ClienteContext } from '../../../context/ClienteContext';

import { Search as SearchIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  marginRight: theme.spacing(1),
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();

  const [disablebotones, setDisablebotones] = useState({
    eliminar: false,
    nuevoCliente: false
  });

  const { setIsNewClient, filtrar, eliminarCliente, deleteCliente } =
    useContext(ClienteContext);

  useEffect(() => {
    verificarAccesos();
  }, []);

  const verificarAccesos = () => {
    if (localStorage.getItem('tipo_usuario') === null) return;

    if (localStorage.getItem('tipo_usuario') === 'ATENCION AL PUBLICO') {
      setDisablebotones({
        ...disablebotones,
        eliminar: true
      });
    }
  };

  const deleteCustomer = () => {
    if (deleteCliente?.id === undefined) return;

    Swal.fire({
      title: '¿Está seguro de eliminar el cliente?',
      showDenyButton: true,
      confirmButtonText: `si, eliminar`,
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        eliminarCliente();
      }
    });
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          style={{ backgroundColor: 'rgb(154, 0, 54)' }}
          color="secondary"
          className={classes.exportButton}
          startIcon={<DeleteIcon />}
          disabled={disablebotones.eliminar}
          onClick={deleteCustomer}
        >
          Eliminar
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setIsNewClient(true)}
        >
          Nuevo Cliente
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                onChange={filtrar}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Buscar Cliente"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
