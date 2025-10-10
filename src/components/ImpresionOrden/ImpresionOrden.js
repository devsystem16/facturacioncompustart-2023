import React, { forwardRef } from 'react';
import logo from '../../assets/LogoIngreso.PNG';

const ImpresionOrden = forwardRef(({ datosImpresion }, ref) => {
  const { orden, cliente, tecnico } = datosImpresion || {};

  if (!orden) return null;

  const renderCheck = (condicion) => (
    condicion === 1 ? (
      <span style={{ fontWeight: 'bold' }}>✔️</span>
    ) : (
      <span style={{ color: 'red', fontWeight: 'bold' }}>✖️</span>
    )
  );

  const styles = {
    container: {
      width: '100%',
      color: 'black',
      marginLeft: '19px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px'
    },
    table: {
      width: '500px',
      borderCollapse: 'collapse',
      marginTop: '10px'
    },
    hr: {
      borderBottom: '2px dotted black',
      width: '100%'
    },
    hrLight: {
      borderBottom: '1px dotted black',
      width: '100%'
    }
  };

  return (
    <div ref={ref} style={styles.container}>
      <img src={logo} alt="Logo" className="imagenImpresion" />
      <center>
        <h3>INGRESO N° {orden.id}</h3>
      </center>

      <table style={styles.table}>
        <tbody>
          <tr>
            <td><strong>Nombre</strong></td>
            <td colSpan={3}>{cliente?.nombres || ''}</td>
          </tr>

          <tr>
            <td><strong>Cédula</strong></td>
            <td>{cliente?.cedula || ''}</td>
            <td><strong>Teléfono</strong></td>
            <td>{cliente?.telefono || ''}</td>
          </tr>

          <tr>
            <td><strong>Equipo</strong></td>
            <td>{orden.equipo}</td>
            <td><strong>N° Serie</strong></td>
            <td>{orden.serie}</td>
          </tr>

          <tr>
            <td><strong>Marca</strong></td>
            <td>{orden.marca}</td>
            <td><strong>Fecha Ingreso</strong></td>
            <td>{orden.fecha}</td>
          </tr>

          <tr>
            <td><strong>Modelo</strong></td>
            <td colSpan={3}>{orden.modelo}</td>
          </tr>

          <tr>
            <td colSpan={4}><hr style={styles.hr} /></td>
          </tr>

          {/* <tr>
            <td>{renderCheck(orden.camara)} Cámara</td>
            <td>{renderCheck(orden.teclado)} Teclado</td>
            <td colSpan={2}></td>
          </tr> */}

          {/* <tr>
            <td>{renderCheck(orden.microfono)} Micrófono</td>
            <td>{renderCheck(orden.parlantes)} Parlantes</td>
            <td colSpan={2}></td>
          </tr> */}

          <tr>
            <td><strong>Falla</strong></td>
            <td colSpan={3}>{orden.falla}</td>
          </tr>

          <tr>
            <td><strong>Observación</strong></td>
            <td colSpan={3}>{orden.observacion}</td>
          </tr>

          <tr>
            <td>Total: ${orden.total}</td>
            <td>Abono: ${orden.abono}</td>
            <td>Saldo: ${orden.saldo}</td>
            <td></td>
          </tr>

          <tr>
          <td colSpan={4} style={{ textAlign: 'justify', lineHeight: '1.4' }}>
            <hr style={styles.hrLight} />
            <strong>Nota:</strong>{' '}
            Estimado cliente, pasado los <strong>60 días</strong> no nos
            responsabilizamos por el estado de su equipo.
            <br />
            <strong>Revisión mínima:</strong> $5 dólares &nbsp; | &nbsp;
            <strong>Revisión electrónica:</strong> $10 dólares.
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  );
});

export default ImpresionOrden;
