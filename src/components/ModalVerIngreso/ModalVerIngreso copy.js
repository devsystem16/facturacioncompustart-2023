import React, { useContext, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { IngresoContext } from '../../context/IngresoContext';
import Formulario from './Formulario';
const ModalVerIngreso = ({ orden }) => {
  const { openModalIngreso, datosImpresion, setOpenModalIngreso } =
    useContext(IngresoContext);

  const handleClose = () => {
    setOpenModalIngreso(false);
  };

  return (
    <div>
      <Dialog
        open={openModalIngreso}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Detalles del Ingreso</DialogTitle>

        <Formulario />
        {/* 
        <DialogContent>
          <DialogContentText>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' }
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  required
                  id="standard-required"
                  label="Required"
                  defaultValue={datosImpresion?.cliente?.nombres}
                  variant="standard"
                />
                <TextField
                  disabled
                  id="standard-disabled"
                  label="Disabled"
                  defaultValue="Hello World"
                  variant="standard"
                />
                <TextField
                  id="standard-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                />
                <TextField
                  id="standard-read-only-input"
                  label="Read Only"
                  defaultValue="Hello World"
                  InputProps={{
                    readOnly: true
                  }}
                  variant="standard"
                />
                <TextField
                  id="standard-number"
                  label="Number"
                  type="number"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="standard"
                />
                <TextField
                  id="standard-search"
                  label="Search field"
                  type="search"
                  variant="standard"
                />
                <TextField
                  id="standard-helperText"
                  label="Helper text"
                  defaultValue="Default Value"
                  helperText="Some important text"
                  variant="standard"
                />
              </div>
            </Box>
          </DialogContentText>
        </DialogContent> */}

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Aceptar
          </Button>
          {/* <Button
            color="primary"
          >
            Guardar
          </Button> */}
        </DialogActions>
        {/* {isLoading ? <LinearProgress /> : null} */}
      </Dialog>
    </div>
  );
};

export default ModalVerIngreso;
