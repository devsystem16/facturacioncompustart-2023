import React, { useState, useContext } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Box,
  InputAdornment,
  makeStyles
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import API from '../../Environment/config';
import Loading from '../../components/Loading/Loading';
import NumberFormatCustom from '../../components/ValidationCurrency/ValidationCurrency';
import { LoginContext } from '../../context/LoginContext';

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    display: 'flex',
    alignItems: 'center'
  }
}));

export default function FormularioIngreso({ setDenominaciones }) {
  const classes = useStyles();
  const { tienePermiso } = useContext(LoginContext);

  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [observation, setObservation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const formInvalido = !amount || !concept;

  return (
    <Card>
      <CardContent>
        <Loading
          text="Procesando..."
          open={isLoading}
          setOpen={setIsLoading}
        />
        <Box display="flex" alignItems="center" mb={2}>
          <AddCircleOutlineIcon style={{ marginRight: 8, color: '#3f51b5' }} />
          <Typography variant="h5">Registrar Nuevo Gasto</Typography>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Valor del retiro"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputComponent: NumberFormatCustom
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Por concepto de"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Observación"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <div className={classes.buttonGroup}>
              {tienePermiso('retiros.crear') && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={añadirRetiro}
                  disabled={formInvalido}
                >
                  Añadir gasto
                </Button>
              )}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
