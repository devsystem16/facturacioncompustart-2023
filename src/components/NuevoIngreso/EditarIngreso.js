import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputMoneda from '../InputMoneda';
import { ClienteContext } from '../../context/ClienteContext';
import { TecnicoContext } from '../../context/TecnicoContext';
import { IngresoContext } from '../../context/IngresoContext';
import { EstadisticasContext } from '../../context/EstadisticasContext';
import { Box, Button } from '@material-ui/core';
import date from 'date-and-time';
import SelectCliente from '../../../src/components/SelectCliente/SelectCliente';
import SelectTecnico from '../../../src/components/SelectTecnico/SelectTecnico';
import EditarEstadoIngreso from '../../components/EstadoIngreso/EditarEstadoIngreso';
import alertify from 'alertifyjs';
import Permisos from '../../Environment/Permisos.json';
// public\css\bootstrap.min.css
// import 'publiccss\bootstrap.min.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField1: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '36ch'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch'
  },
  textFieldFecha: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
    width: '27ch'
  },
  btn: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default function EditarIngreso({ fn_cerrarModal }) {
  const classes = useStyles();

  const { currentCliente, setCurrentCliente } = useContext(ClienteContext);
  const { currentTecnico } = useContext(TecnicoContext);
  const { setIsReload } = useContext(EstadisticasContext);
  const {
    actualizarIngreso,

    setsINew,
    setReload,
    state,
    datosImpresion,
    setState
  } = useContext(IngresoContext);

  const now = new Date(datosImpresion?.orden?.fecha);

  const [fechaIngreso, setFechaIngreso] = useState(
    date.format(now, 'YYYY-MM-DD HH:mm:ss')
  );

  const [equipo, setEquipo] = useState(datosImpresion?.orden?.equipo);
  const [marca, setMarca] = useState(datosImpresion?.orden?.marca);
  const [modelo, setModelo] = useState(datosImpresion?.orden?.modelo);
  const [serie, setSerie] = useState(datosImpresion?.orden?.serie);
  const [falla, setFalla] = useState(datosImpresion?.orden?.falla);
  const [trabajo, setTrabajo] = useState(datosImpresion?.orden?.trabajo);
  const [updateWork, setUpdateWork] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const [observacion, setObservacion] = useState(
    datosImpresion?.orden?.observacion
  );

  const [total, setTotal] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [abono, setAbono] = useState(0);

  const verificarPermiso = (/*perfil, opcion*/) => {
    console.log();
    // var arr = [];
    // Object.keys(Permisos).forEach(function (key) {
    //   console.log(key);
    //   arr.push(Permisos[key]);
    // });
    // console.log(arr);
  };

  useEffect(() => {
    console.log('redner Editar ingreso.');

    setCurrentCliente({
      cedula: '',
      nombres: '-SELECCIONE-'
    });
    setState({
      camara: datosImpresion?.orden?.camara,
      teclado: datosImpresion?.orden?.teclado,
      microfono: datosImpresion?.orden?.microfono,
      parlantes: datosImpresion?.orden?.parlantes
    });

    return () => {
      console.log('Se desmonto el componente.');

      setCurrentCliente({
        cedula: '',
        telefono: ''
      });
    };
  }, [saldo]);

  const calcularSaldo_total = (valor) => {
    setTotal(+valor);
    setSaldo(+valor - +abono);
  };
  const calcularSaldo_abono = (valor) => {
    setAbono(+valor);
    setSaldo(+total - +valor);
  };

  const actializarIngreso = async () => {
    if (datosImpresion?.orden?.id === undefined) {
      alertify.error('No seleccionó ningún ingreso', 2);
      return;
    }

    var validar = validarCampos();

    if (!validar.estado) {
      alertify.error(validar.mensaje, 2);
      return;
    }

    setIsloading(true);

    var usuario_id = 1;
    if (localStorage.getItem('user_id') !== null) {
      usuario_id = localStorage.getItem('user_id');
    }

    let cliente = {};
    let user_update_work = {};
    if (currentCliente.cedula !== '') {
      cliente = { cliente_id: currentCliente.id };
    }

    if (updateWork) {
      user_update_work = { user_update_work: usuario_id };
    }

    const myOrden = {
      id: datosImpresion?.orden?.id,
      ...cliente,
      usuario_id: usuario_id,
      fecha: fechaIngreso,
      equipo,
      marca,
      modelo,
      serie,
      falla,
      trabajo,
      observacion,
      camara: state.camara,
      teclado: state.teclado,
      microfono: state.microfono,
      parlantes: state.parlantes,
      last_user_update: usuario_id,
      ...user_update_work
    };

    const response = await actualizarIngreso(myOrden);
    setIsloading(false);

    if (response.code !== 200) {
      alertify.error(response.mensaje, 2);
      return;
    }
    alertify.success(response.mensaje, 2);
    setIsReload(true);
    setReload(true);

    fn_cerrarModal();
  };

  const cancelar = () => {
    // setIsNew(false);
  };

  const fn_actualizarTrabajo = (e) => {
    setUpdateWork(true);
    setTrabajo(e.target.value);
  };

  const validarCampos = () => {
    if (equipo === '') return { estado: false, mensaje: 'Ingrese el equipo' };
    if (marca === '') return { estado: false, mensaje: 'Ingrese la marca' };
    if (modelo === '') return { estado: false, mensaje: 'Ingrese el modelo' };
    if (serie === '') return { estado: false, mensaje: 'Ingrese la serie' };
    if (fechaIngreso === '')
      return { estado: false, mensaje: 'Ingrese la Fecha' };

    // if (falla === '') return { estado: false, mensaje: 'Ingrese la falla' };
    // if (total === 0 || total === '0')
    //   return { estado: false, mensaje: 'Total inválido, no puede ser 0' };

    // if (currentCliente.id === undefined)
    //   return { estado: false, mensaje: 'Seleccione el cliente' };

    return { estado: true, mensaje: 'OK' };
  };

  return (
    <>
      <div className={classes.root}>
        <div>
          <center>
            <h3>Actualizar Ingreso N° {datosImpresion?.orden?.id}</h3>
          </center>
          <hr />
          <br />
          <div className={classes.root}>
            <TextField
              id="fecha"
              label="Fecha Ingreso"
              type="datetime-local"
              // type="date"
              onChange={(e) => setFechaIngreso(e.target.value)}
              defaultValue={fechaIngreso}
              className={classes.textFieldFecha}
              disabled={
                !Permisos[localStorage.getItem('tipo_usuario')]['fecha']
              }
              InputLabelProps={{
                shrink: true
              }}
            />
            <SelectCliente
              ancho={400}
              selectInactive={
                !Permisos[localStorage.getItem('tipo_usuario')]['cliente']
              }
              disabled={true}
              concatenarCedula={true}
              defaultCliete={{
                id_cliente: datosImpresion?.orden?.cliente_id,
                cedula: datosImpresion?.cliente?.cedula,
                nombres: datosImpresion?.cliente?.nombres
              }}
            />
          </div>
          <TextField
            required
            label="Equipo"
            disabled={!Permisos[localStorage.getItem('tipo_usuario')]['equipo']}
            id="margin-none"
            defaultValue={datosImpresion?.orden?.equipo}
            onChange={(e) => setEquipo(e.target.value)}
            className={classes.textField1}
            helperText="P. Ej. CPU"
          />
          <TextField
            required
            label="Marca"
            disabled={!Permisos[localStorage.getItem('tipo_usuario')]['marca']}
            id="margin-none"
            defaultValue={datosImpresion?.orden?.marca}
            onChange={(e) => setMarca(e.target.value)}
            className={classes.textField1}
            // helperText="P. Ej. DELL"
          />
          <TextField
            required
            label="Modelo"
            id="margin-none"
            disabled={!Permisos[localStorage.getItem('tipo_usuario')]['modelo']}
            defaultValue={datosImpresion?.orden?.modelo}
            onChange={(e) => setModelo(e.target.value)}
            className={classes.textField1}
            helperText=""
          />
          <TextField
            required
            label="Serie"
            id="margin-none"
            defaultValue={datosImpresion?.orden?.serie}
            disabled={!Permisos[localStorage.getItem('tipo_usuario')]['serie']}
            onChange={(e) => setSerie(e.target.value)}
            className={classes.textField1}
            helperText=""
          />

          <EditarEstadoIngreso
            inactivo={!Permisos[localStorage.getItem('tipo_usuario')]['serie']}
          ></EditarEstadoIngreso>
          <TextField
            id="standard-full-width"
            onChange={(e) => setFalla(e.target.value)}
            label="Falla"
            disabled={!Permisos[localStorage.getItem('tipo_usuario')]['falla']}
            defaultValue={datosImpresion?.orden?.falla}
            style={{ margin: 8, width: '90%' }}
            placeholder=""
            multiline
            helperText="P. Ej. No enciende"
            //   fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="standard-full-width"
            onChange={(e) => fn_actualizarTrabajo(e)}
            label="Trabajo"
            disabled={
              !Permisos[localStorage.getItem('tipo_usuario')]['trabajo']
            }
            defaultValue={datosImpresion?.orden?.trabajo}
            style={{ margin: 8, width: '90%', fontSize: '50' }}
            placeholder=""
            multiline
            helperText="P. Ej. Se reparó circuito"
            //   fullWidth
            margin="normal"
            InputProps={{ style: { fontSize: 25 } }}
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>
        <div>
          <TextField
            id="filled-full-width"
            label="Observación"
            disabled={
              !Permisos[localStorage.getItem('tipo_usuario')]['observacion']
            }
            defaultValue={datosImpresion?.orden?.observacion}
            style={{ margin: '3px 10px 3px 3px', width: '425px' }}
            placeholder=""
            helperText=""
            fullWidth
            margin="normal"
            onChange={(e) => setObservacion(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            variant="filled"
          />
        </div>

        <div>
          {/* <SelectTecnico ancho={300} />  */}
          <TextField
            disabled
            id="standard-disabled"
            label="Usuario"
            value={localStorage.getItem('nombres')}
          />
        </div>
      </div>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          className={classes.btn}
          disabled={isLoading}
          onClick={fn_cerrarModal}
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          disabled={isLoading}
          variant="contained"
          onClick={actializarIngreso}
        >
          {isLoading ? 'Actualizando...' : 'Guardar'}
        </Button>
      </Box>
    </>
  );
}
