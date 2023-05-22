import './ListadoProformas.css';
import React, { useContext } from 'react';
import { FacturaContext } from '../../../context/FacturaContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { useNavigate } from 'react-router-dom';

const ListadoProformas = () => {
  const { proformas, proformasTemp } = useContext(FacturaContext);

  return (
    <div>
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
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {proformas.map((proforma) => {
            return <Row key={proforma.id} proforma={proforma}></Row>;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoProformas;
const Row = ({ proforma }) => {
  const navigate = useNavigate();
  const handleRedireccionar = (proforma) => {
    navigate('/app/puntoventa', { state: { proforma }, replace: true });
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
        <DeleteForeverIcon style={{ cursor: 'pointer' }}></DeleteForeverIcon>
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
