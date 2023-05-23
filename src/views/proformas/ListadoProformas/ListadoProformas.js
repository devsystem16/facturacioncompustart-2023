import './ListadoProformas.css';
import React, { useContext, useState } from 'react';
import { FacturaContext } from '../../../context/FacturaContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

const ListadoProformas = () => {
  const { proformas, proformasTemp, eliminarProforma } =
    useContext(FacturaContext);
  const [filtro, setFiltro] = useState('');

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const proformasFiltradas = proformas.filter((proforma) => {
    const palabrasFiltro = filtro.toLowerCase().split(' ');

    return palabrasFiltro.every((palabra) => {
      const nombresCliente = proforma.cliente.nombres.toLowerCase();
      const cedulaCliente = proforma.cliente.cedula.toLowerCase();

      return (
        nombresCliente.includes(palabra) || cedulaCliente.includes(palabra)
      );
    });
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
      />
      <br></br> <br></br>
      <hr></hr>
      <table className="tablaListadoProformas">
        <thead>
          <tr>
            <th>N°</th>
            <th>Cédula</th>
            <th>Nombres</th>
            <th> Fecha Emisión</th>
            <th>Fecha Vencimiento</th>
            <th>Sub Total</th>
            <th>Iva</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {proformasFiltradas.map((proforma) => {
            return (
              <Row
                key={proforma.id}
                eliminarProforma={eliminarProforma}
                proforma={proforma}
              ></Row>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoProformas;
const Row = ({ proforma, eliminarProforma }) => {
  const navigate = useNavigate();
  const handleRedireccionar = (proforma) => {
    navigate('/app/puntoventa', { state: { proforma }, replace: true });
  };

  const eliminar = (proforma) => {
    Swal.fire({
      title: '¿Está seguro de eliminar la proforma?',
      showDenyButton: true,
      confirmButtonText: `Si, Eliminar`,
      denyButtonText: `Cancelar`
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
  return (
    <tr key={`row_${proforma.id}`}>
      <td> {proforma.id}</td>
      <td> {proforma.cliente.cedula}</td>
      <td> {proforma.cliente.nombres}</td>
      <td>{proforma.fecha_emision} </td>
      <td>{proforma.fecha_vencimiento} </td>
      <td>{formatCurrency(trunc(proforma.subtotal, 4))} </td>

      <td>{formatCurrency(trunc(proforma.iva, 4))} </td>
      <td>{formatCurrency(trunc(proforma.total, 4))} </td>
      <td>
        <LocalAtmIcon
          style={{ cursor: 'pointer' }}
          onClick={() => handleRedireccionar(proforma)}
        ></LocalAtmIcon>
        <DeleteForeverIcon
          onClick={() => eliminar(proforma)}
          style={{ cursor: 'pointer' }}
        ></DeleteForeverIcon>
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
