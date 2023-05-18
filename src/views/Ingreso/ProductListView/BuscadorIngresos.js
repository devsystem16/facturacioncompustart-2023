import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import NuevoIngreso from '../../../components/NuevoIngreso/NuevoIngreso';
import clsx from 'clsx';
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
import { Search as SearchIcon } from 'react-feather';
import DeleteIcon from '@material-ui/icons/Delete';

import { IngresoContext } from '../../../context/IngresoContext';
import PrintIcon from '@material-ui/icons/Print';
import Panorama from '@material-ui/icons/Visibility';
import ModalFacturaIgreso from '../../../../src/components/NuevoIngreso/ModalFacturaIgreso';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const BuscadorIngresos = ({ className, ...rest }) => {
  const classes = useStyles();

  const [disablebotones, setDisablebotones] = useState({
    imprimir: false,
    eliminar: false,
    nuevoIngreso: false
  });

  const verificarAccesos = () => {
    if (localStorage.getItem('tipo_usuario') === null) return;

    if (localStorage.getItem('tipo_usuario') === 'ATENCION AL PUBLICO') {
      setDisablebotones({
        ...disablebotones,
        eliminar: true
      });
    }

    if (localStorage.getItem('tipo_usuario') === 'TECNICO') {
      setDisablebotones({
        ...disablebotones,
        imprimir: true,
        eliminar: true,
        nuevoIngreso: true
      });
    }
  };
  const {
    setOrdenesTemp,
    ordenes,
    isNew,
    setIsNew,
    datosImpresion,
    EventoImprimirReact,
    eliminarOrden,
    definirFactura,
    setOpenModalIngreso
  } = useContext(IngresoContext);

  // const [ordenImprimir, setOrdenImprimir] = useState(datosImpresion);

  const verIngreso = () => {
    setOpenModalIngreso(true);
  };

  const filrarIngresos = (e) => {
    const results = ordenes.filter((orden) => {
      // const itemData = orden.equipo.toUpperCase();
      // const textData = e.target.value.toUpperCase();

      const itemData1 = orden.cliente.toUpperCase();
      const textData1 = e.target.value.toUpperCase();

      // const itemData3 = orden.marca.toUpperCase();
      // const textData3 = e.target.value.toUpperCase();

      // const itemData4 = orden.modelo.toUpperCase();
      // const textData4 = e.target.value.toUpperCase();

      const itemData5 = orden.id.toString().toUpperCase();
      const textData5 = e.target.value.toString().toUpperCase();
      return (
        // itemData.indexOf(textData) > -1 ||
        itemData1.indexOf(textData1) > -1 ||
        // itemData3.indexOf(textData3) > -1 ||
        // itemData4.indexOf(textData4) > -1 ||
        itemData5.toString().indexOf(textData5) > -1
      );
    });
    setOrdenesTemp(results);
  };

  const fn_nuevoProducto = () => {
    setIsNew(true);
  };

  const fn_guardar = () => {
    setIsNew(false);
  };

  useEffect(() => {
    console.log('COMPONENTE', datosImpresion);
    verificarAccesos();
  }, [datosImpresion]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        {isNew ? null : definirFactura ? (
          <ModalFacturaIgreso IsguardarFactura={true} />
        ) : null}

        {isNew ? null : (
          <Button
            variant="contained"
            color="secondary"
            className={classes.exportButton}
            startIcon={<Panorama />}
            title="Ver/Editar Ingreso"
            onClick={verIngreso}
          >
            Ver
          </Button>
        )}
        {isNew ? null : (
          <Button
            variant="contained"
            color="secondary"
            className={classes.exportButton}
            startIcon={<PrintIcon />}
            onClick={EventoImprimirReact}
            disabled={disablebotones.imprimir}
          >
            Imprimir
          </Button>
        )}

        {/* {
  localStorage.getItem('tipo_usuario') === "ATENCION AL PUBLICO" ? null : 
} */}
        {isNew ? null : (
          <Button
            variant="contained"
            style={{ backgroundColor: 'rgb(154, 0, 54)' }}
            color="secondary"
            className={classes.exportButton}
            disabled={disablebotones.eliminar}
            onClick={eliminarOrden}
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        )}

        {isNew ? null : (
          <Button
            color="primary"
            variant="contained"
            onClick={fn_nuevoProducto}
            disabled={disablebotones.nuevoIngreso}
          >
            Nuevo Ingreso
          </Button>
        )}
      </Box>
      <Box mt={3}>
        <Card>
          {isNew ? (
            <NuevoIngreso />
          ) : (
            <Buscador filrarIngresos={filrarIngresos} />
          )}
        </Card>
      </Box>
    </div>
  );
};

const Buscador = ({ filrarIngresos }) => {
  return (
    <CardContent>
      <Box maxWidth={500}>
        <TextField
          fullWidth
          onChange={filrarIngresos}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          placeholder="Buscar ingreso"
          variant="outlined"
        />
      </Box>
    </CardContent>
  );
};

export default BuscadorIngresos;
