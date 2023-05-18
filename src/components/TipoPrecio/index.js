import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import green from '@material-ui/core/colors/green';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { FacturaContext } from '../../context/FacturaContext';

const useStyles = makeStyles({
  root: {
    color: green[600],
    '&$checked': {
      color: green[500]
    }
  },
  checked: {}
});

function RadioButtons() {
  const { currentPrecio, setCurrentPrecio } = useContext(FacturaContext);
  const classes = useStyles();

  function handleChange(event) {
    setCurrentPrecio(event.target.value);
    console.log(event.target.value);
  }

  return (
    <div>
      <Radio
        checked={currentPrecio === 'publico'}
        onChange={handleChange}
        value="publico"
        name="radio-button-demo"
        aria-label="A"
      />
      P. Público
      <Radio
        checked={currentPrecio === 'tecnico'}
        onChange={handleChange}
        value="tecnico"
        name="radio-button-demo"
        aria-label="B"
      />
      P. Técnico
      <Radio
        checked={currentPrecio === 'mayorista'}
        onChange={handleChange}
        value="mayorista"
        name="radio-button-demo"
        aria-label="C"
        classes={{
          root: classes.root,
          checked: classes.checked
        }}
      />
      P. Mayorista
    </div>
  );
}

export default RadioButtons;
