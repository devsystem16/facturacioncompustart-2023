import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import API from '../../Environment/config';
import { DateRangeRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '90%'
  }
}));

export default function SelectJS({
  path_api,
  value,
  setValue,
  title = '*Seleccione*'
}) {
  const classes = useStyles();
  const [age, setAge] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [datos, setDatos] = useState([]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const findDefault = (array) => {
    return array.find((dato) => dato?.default === 1);
  };

  //   const user = findUserById(userId);

  const loadData = async () => {
    const response = await API.get(path_api);
    const datoDefault = findDefault(response?.data);
    setValue(datoDefault.id);
    setDatos(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">{title} </InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          style={{ paddingTop: '16px' }}
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={value}
          //   defaultValue={1}
          onChange={handleChange}
        >
          {datos.map((dato, index) => {
            return (
              <MenuItem key={index} value={dato.id}>
                {' '}
                {dato.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
