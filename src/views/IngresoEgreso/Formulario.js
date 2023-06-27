import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import API from '../../Environment/config';
import Loading from '../../components/Loading/Loading';
import NumberFormatCustom from '../../components/ValidationCurrency/ValidationCurrency';
import Permisos from '../../Environment/Permisos.json';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: '25ch'
  }
}));

export default function InputAdornments({ setDenominaciones }) {
  const classes = useStyles();

  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [observation, setObservation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleConceptChange = (event) => {
    setConcept(event.target.value);
  };

  const handleObservationChange = (event) => {
    setObservation(event.target.value);
  };

  const añadirRetiro = async () => {
    setIsLoading(true);
    const data = {
      estacion_id: '1',
      periodo_id: localStorage.getItem('periodo_id'),
      concepto: concept,
      valorRetiro: amount,
      observacion: observation
    };
    const response = await API.post('api/retiros', data);
    setDenominaciones(response.data.data);

    setObservation('');
    setConcept('');
    setAmount('');
    setIsLoading(false);
  };

  return (
    <div className={classes.root}>
      <Loading
        text="Procesando..."
        open={isLoading}
        setOpen={setIsLoading}
      ></Loading>
      <div>
        <TextField
          label="Valor del retiro"
          id="amount"
          value={amount}
          className={clsx(classes.margin, classes.textField)}
          onChange={handleAmountChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputComponent: NumberFormatCustom
          }}
        />
        <TextField
          label="Por concepto de"
          id="concept"
          value={concept}
          onChange={handleConceptChange}
          className={clsx(classes.margin, classes.textField)}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>
          }}
        />

        <TextField
          label="Observación"
          id="observation"
          value={observation}
          onChange={handleObservationChange}
          className={clsx(classes.margin, classes.textField)}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>
          }}
        />
      </div>

      {Permisos[localStorage.getItem('tipo_usuario')]['registrar-retiros'] && (
        <Button variant="contained" color="primary" onClick={añadirRetiro}>
          Añadir gasto
        </Button>
      )}

      <div></div>
    </div>
  );
}
