import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Loading from '../Loading/Loading';
const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function SelectLimit({ onChangeData, data, setData }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = async (event) => {
    setData(event.target.value);
    setIsLoading(true);
    const response = await onChangeData('', event.target.value);
    setIsLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Loading
        text="Obteniendo.."
        open={isLoading}
        seOpen={setIsLoading}
      ></Loading>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Limite</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={data}
          onChange={handleChange}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={40}>40</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
