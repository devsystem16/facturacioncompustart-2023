import React, { useState, useContext } from 'react';
import { TextField, Button } from '@material-ui/core';
import date from 'date-and-time';
import { PeriodoContext } from '../../../context/PeriodoContext';
import { EstadisticasContext } from '../../../context/EstadisticasContext';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading/Loading';

import NumberFormatCustom from '../../../components/ValidationCurrency/ValidationCurrency';

import alertify from 'alertifyjs';
const RegistroPeriodoForm = () => {
  const [observaciones, setObservaciones] = useState('');
  const [fondoAsignado, setFondoAsignado] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = date.format(new Date(), 'YYYY-MM-DD'); //  HH:mm:ss
  const { setPeriodoActivo, crearPeriodo } = useContext(PeriodoContext);
  const { setIsReload } = useContext(EstadisticasContext);
  const handleGuardarClick = async () => {
    if (fondoAsignado <= 0) {
      alertify.error('El fondo asignado debe ser mayor a cero', 2);

      return;
    }

    if (!observaciones) {
      alertify.error('Por favor, ingrese las observaciones', 2);

      return;
    }

    const periodoJson = {
      fecha_apertura: currentDate,
      usuario_id_apertura: localStorage.getItem('user_id'),
      estado: 'Abierto',
      fondo_asignado: fondoAsignado,
      observaciones: observaciones
    };
    setIsLoading(true);
    const response = await crearPeriodo(periodoJson);
    setIsLoading(false);
    if (response.codigo !== 201) {
      Swal.fire(response.message, '', 'warning');
      return;
    }

    Swal.fire(response.message, '', 'success');
    setIsReload(true);
    setPeriodoActivo(true);
    setObservaciones('');
    setFondoAsignado(0);
  };

  return (
    <div>
      <Loading
        text="Guardando.."
        open={isLoading}
        setOpen={setIsLoading}
      ></Loading>
      <h2>Formulario de Registro de Periodo</h2>
      <form>
        <div>
          <TextField
            label="Fecha de Apertura"
            disabled
            defaultValue={currentDate}
          />
        </div>

        <div>
          <TextField
            label="Fondo Asignado"
            value={fondoAsignado}
            onChange={(e) => setFondoAsignado(e.target.value)}
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
        </div>

        <div>
          <TextField
            label="Observaciones"
            multiline
            rows={4}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
        <br></br>
        <hr></hr>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGuardarClick}
        >
          Guardar
        </Button>
      </form>
    </div>
  );
};

export default RegistroPeriodoForm;
