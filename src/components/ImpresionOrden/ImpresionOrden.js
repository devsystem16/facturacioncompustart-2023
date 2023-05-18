import React, { useContext, useRef, useEffect, useState } from 'react';
import logo from '../../assets/LogoIngreso.PNG';
import { makeStyles } from '@material-ui/core/styles';

const ImpresionOrden = React.forwardRef((props, ref) => {
  const { orden, cliente, tecnico } = props.datosImpresion;

  if (orden === undefined) return;

  // console.log('LLEGO, ', orden);
  return (
    <div ref={ref}>
      <div
        style={{
          width: '100%',
          color: 'black',
          marginLeft: '19px'
        }}
      >
        <img className="imagenImpresion" src={logo} />
        <center>
          <h3>INGRESO N° {orden.id} </h3>
        </center>

        <table style={{ width: '500px' }}>
          <tr>
            <td>
              <strong>Nombre </strong>
            </td>
            <td colspan="3"> {cliente.nombres}</td>
          </tr>

          <tr>
            <td>
              <strong>Cédula </strong>
            </td>
            <td> {cliente.cedula}</td>
            <td>
              <strong>Teléfono </strong>
            </td>
            <td> {cliente.telefono}</td>
          </tr>

          <tr>
            <td>
              <strong>Equipo </strong>
            </td>
            <td> {orden.equipo}</td>
            <td>
              <strong>N° Serie </strong>
            </td>
            <td> {orden.serie}</td>
          </tr>

          <tr>
            <td>
              <strong>Marca </strong>
            </td>
            <td>{orden.marca}</td>
            <td>
              <strong>Fecha Ingreso </strong>
            </td>
            <td>{orden.fecha}</td>
          </tr>

          <tr>
            <td>
              <strong>Modelo </strong>
            </td>
            <td colspan="3">{orden.modelo}</td>
          </tr>

          {/* <tr>
            <td>
              <strong>Observación </strong>
            </td>
            <td colspan="3">{orden.observacion}</td>
          </tr> */}

          <tr>
            <td colspan="4">
              <hr style={{ borderBottom: '2px dotted black', width: '100%' }} />
            </td>
          </tr>

          <tr>
            <td>
              {orden.camara === 1 ? (
                <input
                  type="checkbox"
                  id="camara"
                  name="name"
                  checked="checked"
                />
              ) : (
                <label style={{ border: '1px solid red', color: 'red' }}>
                  X
                </label>
              )}{' '}
              Cámara
            </td>
            <td>
              {orden.teclado === 1 ? (
                <input
                  type="checkbox"
                  id="camara"
                  name="name"
                  checked="checked"
                />
              ) : (
                <label style={{ border: '1px solid red', color: 'red' }}>
                  X
                </label>
              )}{' '}
              Teclado
            </td>
            <td colspan="2"></td>
          </tr>

          <tr>
            <td>
              {orden.microfono === 1 ? (
                <input
                  type="checkbox"
                  id="camara"
                  name="name"
                  checked="checked"
                />
              ) : (
                <label style={{ border: '1px solid red', color: 'red' }}>
                  X
                </label>
              )}{' '}
              Micrófono
            </td>
            <td>
              {orden.parlantes === 1 ? (
                <input
                  type="checkbox"
                  id="camara"
                  name="name"
                  checked="checked"
                />
              ) : (
                <label style={{ border: '1px solid red', color: 'red' }}>
                  X
                </label>
              )}{' '}
              Parlantes
            </td>
            <td colspan="2"></td>
          </tr>

          <tr>
            <td>
              <strong>Falla </strong>
            </td>
            <td colspan="3"> {orden.falla}</td>
          </tr>

          <tr>
            <td>
              <strong>Observación </strong>
            </td>
            <td colspan="3">{orden.observacion}</td>
          </tr>

          {/* <tr>
            <td>
              <strong>Trabajo </strong>
            </td>
            <td colspan="3">{orden.trabajo}</td>
          </tr> */}

          <tr>
            <td>Total : ${orden.total}</td>
            <td>Abono: ${orden.abono}</td>
            <td> Saldo: ${orden.saldo} </td>
            <td></td>
          </tr>

          {/* <tr>
            <td>
              <strong>Ingresado por: </strong>
            </td>
            <td colspan="3"> {tecnico.nombres} </td>
          </tr> */}
          <tr>
            <td colspan="4" style={{ textAlign: 'justify' }}>
              <hr style={{ borderBottom: '1px dotted black', width: '100%' }} />
              <strong>Nota: </strong> Estimado cliente, pasado los 60 días no
              nos responsabilizamos por el estado de su equipo. Revisión minima
              $5 dolares.{' '}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
});

export default ImpresionOrden;
