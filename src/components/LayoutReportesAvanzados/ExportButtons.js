import React, { useContext } from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { ReportesAvanzadosContext } from '../../context/ReportesAvanzadosContext';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1)
  }
}));

const ExportButtons = ({ tipoReporte, fechaDesde, fechaHasta }) => {
  const classes = useStyles();
  const { exportarExcel, exportarPdf } = useContext(ReportesAvanzadosContext);

  return (
    <Box display="flex" justifyContent="flex-end" mt={2}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<GetAppIcon />}
        className={classes.button}
        onClick={() => exportarExcel(tipoReporte, fechaDesde, fechaHasta)}
      >
        Excel
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<PictureAsPdfIcon />}
        onClick={() => exportarPdf(tipoReporte, fechaDesde, fechaHasta)}
      >
        PDF
      </Button>
    </Box>
  );
};

export default ExportButtons;
