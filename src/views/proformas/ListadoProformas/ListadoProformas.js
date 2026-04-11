import './ListadoProformas.css';
import React, { useContext, useState, useRef } from 'react';
import { FacturaContext } from '../../../context/FacturaContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import PrintIco from '@material-ui/icons/Print';
import { LoginContext } from '../../../context/LoginContext';
import ViewProforma  from '../disenioProformaPrint/ViewProforma';
import PrintIcon from '@material-ui/icons/Print';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
 
import { TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

 
import { Box,  Dialog, DialogContent, DialogTitle, Button } from "@material-ui/core";
 
 
 
 
import { useReactToPrint } from 'react-to-print';



const ListadoProformas = () => {
  const { proformas, fn_obtenerProforma, proforma, eliminarProforma } = useContext(FacturaContext);

  const [filtro, setFiltro] = useState('');
  const [abrirModal, setAbrirModal] = useState(false);
  const componenteImprimirRef = useRef();

  const handleFiltroChange = (event) => setFiltro(event.target.value);

  const proformasFiltradas = proformas.filter((p) => {
    const palabrasFiltro = filtro.toLowerCase().split(' ');
    const nombresCliente = p.cliente?.nombres?.toLowerCase() || '';
    const cedulaCliente = p.cliente?.cedula?.toLowerCase() || '';

    return palabrasFiltro.every((palabra) =>
      nombresCliente.includes(palabra) || cedulaCliente.includes(palabra)
    );
  });

  // Función para abrir modal y cargar la proforma
  const handleAbrirModal = async (proformaId) => {
    await fn_obtenerProforma(proformaId); // Se asegura de cargar la proforma
    setAbrirModal(true);
  };

  const handleCerrarModal = () => setAbrirModal(false);

  // Función para imprimir usando react-to-print
  const handleImprimir = useReactToPrint({
    content: () => componenteImprimirRef.current,
  });

  return (
    <div>
      <center>
        <h2>Listado de proformas</h2>
      </center>

      <TextField
        fullWidth
        onChange={handleFiltroChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon fontSize="small" color="action">
                <SearchIcon />
              </SvgIcon>
            </InputAdornment>
          )
        }}
        placeholder="Buscar Proforma"
        variant="outlined"
        style={{ marginBottom: 20 }}
      />

      <hr />

      <table className="tablaListadoProformas">
        <thead>
          <tr>
            <th>N°</th>
            <th>Cédula</th>
            <th style={{ width: "100px" }}>Nombres</th>
            <th>Fecha Emisión</th>
            <th>Fecha Vencimiento</th>
            <th>Sub Total</th>
            <th>Iva</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {proformasFiltradas.map((p) => (
            <Row
              key={p.id}
              proforma={p}
              eliminarProforma={eliminarProforma}
              fn_obtenerProforma={fn_obtenerProforma}
              handleAbrirModal={handleAbrirModal} // <-- Pasamos la función al Row
            />
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Dialog open={abrirModal} onClose={handleCerrarModal} maxWidth="md" fullWidth>
        <DialogTitle>Vista Previa de Proforma</DialogTitle>
        <DialogContent>
          <div ref={componenteImprimirRef}>
            <ViewProforma proforma={proforma} />
          </div>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={handleImprimir} style={{ marginRight: 10 }}>
              Imprimir
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCerrarModal}>
              Cerrar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListadoProformas;



 const Row = ({ proforma, eliminarProforma, fn_obtenerProforma, handleAbrirModal }) => {
  const { setPestaniaActiva, tienePermiso } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleRedireccionar = async (proforma) => {
    // Obtener datos frescos de la proforma con stock actualizado
    const proformaActualizada = await fn_obtenerProforma(proforma.id);
    const detalles = proformaActualizada?.detalles_proforma || [];

    const productosSinStock = detalles.filter(
      (detalle) => +detalle.producto?.stock <= 0
    );

    if (productosSinStock.length > 0) {
      const listaHtml = productosSinStock
        .map(
          (d) =>
            `<li style="text-align:left; margin-bottom:4px;">
              <strong>${d.producto?.nombre}</strong> — Stock: ${d.producto?.stock}
            </li>`
        )
        .join('');

      Swal.fire({
        icon: 'warning',
        title: 'Productos sin stock',
        html: `<p>No se puede facturar. Los siguientes productos tienen stock en 0:</p>
               <ul style="list-style:none; padding:0; margin-top:10px;">${listaHtml}</ul>
               <p style="margin-top:10px;">Debe aumentar el stock de estos productos antes de facturar.</p>`,
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setPestaniaActiva('Punto de Venta');
    navigate('/app/puntoventa', { state: { proforma: proformaActualizada }, replace: true });
  };

  const eliminar = (proforma) => {
    Swal.fire({
      title: '¿Está seguro de eliminar la proforma?',
      showDenyButton: true,
      confirmButtonText: 'Sí, eliminar',
      denyButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await eliminarProforma(proforma);

        if (response?.estado === 200) {
          Swal.fire(response.Message, '', 'success');
        } else {
          Swal.fire(response.Message, '', 'warning');
        }
      }
    });
  };

  // ✅ Ahora solo delega al padre la responsabilidad de cargar y mostrar la proforma
  const imprimirProforma = () => {
    handleAbrirModal(proforma.id);
  };

  return (
    <tr key={`row_${proforma.id}`}>
      <td>{proforma.id}</td>
      <td>{proforma.cliente?.cedula || '-'}</td>
      <td>{proforma.cliente?.nombres || '-'}</td>
      <td>{proforma.fecha_emision}</td>
      <td>{proforma.fecha_vencimiento}</td>
      <td>{formatCurrency(trunc(proforma.subtotal, 4))}</td>
      <td>{formatCurrency(trunc(proforma.iva, 4))}</td>
      <td>{formatCurrency(trunc(proforma.total, 4))}</td>
      <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <PrintIcon
          titleAccess="Reimprimir Proforma"
          onClick={imprimirProforma}
          style={{ cursor: 'pointer', color: '#1976d2' }}
        />
        {tienePermiso('puntoventa.facturar') && (
          <LocalAtmIcon
            titleAccess="Facturar desde Proforma"
            onClick={() => handleRedireccionar(proforma)}
            style={{ cursor: 'pointer', color: '#43a047' }}
          />
        )}
        {tienePermiso('proformas.eliminar') && (
          <DeleteForeverIcon
            titleAccess="Eliminar Proforma"
            onClick={() => eliminar(proforma)}
            style={{ cursor: 'pointer', color: '#e53935' }}
          />
        )}
      </td>
    </tr>
  );
};

function trunc(x, posiciones = 0) {
  var s = x.toString();
  var l = s.length;
  var decimalLength = s.indexOf('.') + 1;
  var numStr = s.substr(0, decimalLength + posiciones);
  return Number(numStr);
}

const formatCurrency = (number) => {
  return `$ ${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
