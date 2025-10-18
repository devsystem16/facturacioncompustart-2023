import React, { useRef } from "react";
import {
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useReactToPrint } from "react-to-print";

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(4),
    backgroundColor: "#ffffff",
    borderRadius: theme.spacing(1),
    border: "1px solid #ccc",
  },
  header: {
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
  dataBox: {
    padding: theme.spacing(2),
    border: "1px solid #ccc",
    borderRadius: theme.spacing(1),
    backgroundColor: "#f9f9f9",
  },
  tableHead: {
    backgroundColor: "#f0f0f0",
  },
  tableRow: {
    "&:nth-of-type(even)": {
      backgroundColor: "#fdfdfd",
    },
    "&:nth-of-type(odd)": {
      backgroundColor: "#f7f7f7",
    },
  },
  totalsBox: {
    padding: theme.spacing(3),
    minWidth: 200,
    border: "1px solid #ccc",
    borderRadius: theme.spacing(1),
    backgroundColor: "#f9f9f9",
  },
  observationsBox: {
    padding: theme.spacing(2),
    border: "1px solid #ccc",
    borderRadius: theme.spacing(1),
    backgroundColor: "#f9f9f9",
    minHeight: 60,
  },
  footer: {
    textAlign: "center",
    marginTop: theme.spacing(3),
    color: "#666",
  },
  printButton: {
    display: "block",
    margin: theme.spacing(2, "auto"),
  },
}));

const ViewProforma = ({ proforma }) => {
  const classes = useStyles();
  const proformaRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => proformaRef.current,
    documentTitle: `Proforma-${proforma?.id || "SinID"}`,
  });

  if (!proforma) {
    return (
      <Paper className={classes.paperContainer} elevation={3}>
        <Box className={classes.header}>
          <Typography variant="h6" color="textSecondary">
            No hay proforma para mostrar
          </Typography>
        </Box>
      </Paper>
    );
  }

  const subtotal = proforma.subtotal || 0;
  const iva = proforma.iva || 0;
  const total = proforma.total || 0;

  return (
    <>
      {/* <Button
        variant="contained"
        color="primary"
        className={classes.printButton}
        onClick={handlePrint}
      >
        Imprimir
      </Button> */}

      <div ref={proformaRef}>
        <Paper className={classes.paperContainer} elevation={3}>
          {/* Encabezado */}
          <Box className={classes.header}>
            <Typography variant="h4" style={{ fontWeight: "bold" }}>
              PROFORMA
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Documento no válido como factura oficial
            </Typography>
          </Box>

          {/* Datos Generales */}
          <Grid container spacing={3} style={{ marginBottom: 16 }}>
            <Grid item xs={6}>
              <Box className={classes.dataBox}>
                <Typography variant="body2" gutterBottom>
                  <strong>Fecha de Emisión:</strong> {proforma.fecha_emision}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Fecha de Vencimiento:</strong> {proforma.fecha_vencimiento}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha de Creación:</strong> {proforma.created_at}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className={classes.dataBox}>
                <Typography variant="body2" gutterBottom>
                  <strong>Cliente:</strong> {proforma.cliente?.nombres || "-"}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Cédula:</strong> {proforma.cliente?.cedula || "-"}
                </Typography>
                <Typography variant="body2">
                  <strong>Teléfono:</strong> {proforma.cliente?.telefono || "-"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Detalles */}
          <TableContainer component={Paper} style={{ marginBottom: 16, border: "1px solid #ccc" }}>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell align="center"><strong>Cant</strong></TableCell>
                  <TableCell><strong>Producto</strong></TableCell>
                  <TableCell align="right"><strong>Precio Unit.</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proforma.detalles_proforma?.map((item, index) => (
                  <TableRow key={index} className={classes.tableRow}>
                    <TableCell align="center">{item.cantidad}</TableCell>
                    <TableCell>{item.producto?.nombre || "-"}</TableCell>
                    <TableCell align="right">${item.producto?.precio_publico?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell align="right">
                      ${(item.subtotal?.toFixed(2)) || "0.00"}
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay detalles para mostrar
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totales */}
          <Box display="flex" justifyContent="flex-end" style={{ marginBottom: 16 }}>
            <Box className={classes.totalsBox}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="textSecondary">Subtotal:</Typography>
                <Typography variant="body2" style={{ fontWeight: "bold" }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="textSecondary">IVA (15%):</Typography>
                <Typography variant="body2" style={{ fontWeight: "bold" }}>
                  ${iva.toFixed(2)}
                </Typography>
              </Box>
              <Divider style={{ margin: "8px 0" }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>Total:</Typography>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Observaciones */}
          <Box mb={4}>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }} gutterBottom>
              Observaciones:
            </Typography>
            <Box className={classes.observationsBox}>
              <Typography variant="body2">{proforma.observacion || "N/A"}</Typography>
            </Box>
          </Box>

          {/* Pie de página */}
          <Box className={classes.footer}>
            <Typography variant="caption">Documento generado automáticamente — Ecuador</Typography>
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default ViewProforma;
