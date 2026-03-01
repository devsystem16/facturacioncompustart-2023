import React, { useEffect, useContext, useState } from 'react';
import { Box } from '@material-ui/core';
import { ContabilidadContext } from '../../context/ContabilidadContext';
import FiltrosAsientos from './FiltrosAsientos';
import TablaAsientos from './TablaAsientos';
import ModalCrearAsiento from './ModalCrearAsiento';
import ModalDetalleAsiento from './ModalDetalleAsiento';

const AsientosContables = () => {
  const { obtenerAsientos, obtenerCuentasDetalle } = useContext(ContabilidadContext);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    obtenerAsientos();
    obtenerCuentasDetalle();
  }, []);

  const handleNuevo = () => {
    setAsientoSeleccionado(null);
    setModoEdicion(false);
    setModalCrear(true);
  };

  const handleVer = (asiento) => {
    setAsientoSeleccionado(asiento);
    setModalDetalle(true);
  };

  const handleEditar = (asiento) => {
    setAsientoSeleccionado(asiento);
    setModoEdicion(true);
    setModalCrear(true);
  };

  return (
    <Box>
      <FiltrosAsientos onNuevo={handleNuevo} />
      <Box mt={2}>
        <TablaAsientos
          onVer={handleVer}
          onEditar={handleEditar}
        />
      </Box>

      <ModalCrearAsiento
        open={modalCrear}
        onClose={() => { setModalCrear(false); setAsientoSeleccionado(null); }}
        asiento={modoEdicion ? asientoSeleccionado : null}
      />

      <ModalDetalleAsiento
        open={modalDetalle}
        onClose={() => { setModalDetalle(false); setAsientoSeleccionado(null); }}
        asientoId={asientoSeleccionado?.id}
      />
    </Box>
  );
};

export default AsientosContables;
