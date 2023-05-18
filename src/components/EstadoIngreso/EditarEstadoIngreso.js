import React, { useContext } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { IngresoContext } from '../../context/IngresoContext';
export default function EstadoIngreso({ inactivo = false }) {
  const { state, setState, datosImpresion } = useContext(IngresoContext);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <FormControl component="fieldset" style={{ marginLeft: '65px' }}>
      <FormLabel component="legend">Estado del equipo</FormLabel>
      <FormGroup>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  disabled={inactivo}
                  checked={datosImpresion?.orden?.camara}
                  onChange={handleChange}
                  name="camara"
                />
              }
              label="Cámara"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  disabled={inactivo}
                  checked={datosImpresion?.orden?.teclado}
                  onChange={handleChange}
                  name="teclado"
                />
              }
              label="Teclado"
            />
          </Grid>
        </Grid>

        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  disabled={inactivo}
                  checked={datosImpresion?.orden?.microfono}
                  onChange={handleChange}
                  name="microfono"
                />
              }
              label="Microfono"
            />
          </Grid>

          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  disabled={inactivo}
                  checked={datosImpresion?.orden?.parlantes}
                  onChange={handleChange}
                  name="parlantes"
                />
              }
              label="Parlantes"
            />
          </Grid>
          {/* <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={state.pantalla}
                  onChange={handleChange}
                  name="pantalla"
                />
              }
              label="Pantalla"
            />
          </Grid> */}
        </Grid>
      </FormGroup>
    </FormControl>
  );
}
