import React, { useState, useContext } from 'react';
import { Box, Tabs, Tab } from '@material-ui/core';
import { LoginContext } from '../../context/LoginContext';
import LibroDiario from './reportes/LibroDiario';
import LibroMayor from './reportes/LibroMayor';
import BalanceComprobacion from './reportes/BalanceComprobacion';
import BalanceGeneral from './reportes/BalanceGeneral';
import EstadoResultados from './reportes/EstadoResultados';

const ReportesContables = () => {
  const { tienePermiso } = useContext(LoginContext);
  const [subTab, setSubTab] = useState(0);

  const reportes = [];
  if (tienePermiso('contabilidad.reportes-libro-diario')) reportes.push({ label: 'Libro Diario', component: <LibroDiario /> });
  if (tienePermiso('contabilidad.reportes-libro-mayor')) reportes.push({ label: 'Libro Mayor', component: <LibroMayor /> });
  if (tienePermiso('contabilidad.reportes-balance-comprobacion')) reportes.push({ label: 'Balance Comprobación', component: <BalanceComprobacion /> });
  if (tienePermiso('contabilidad.reportes-balance-general')) reportes.push({ label: 'Balance General', component: <BalanceGeneral /> });
  if (tienePermiso('contabilidad.reportes-estado-resultados')) reportes.push({ label: 'Estado Resultados', component: <EstadoResultados /> });

  if (reportes.length === 0) return <Box p={2}>No tiene permisos para ver reportes</Box>;

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(e, v) => setSubTab(v)}
        indicatorColor="secondary"
        textColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {reportes.map((r, i) => (
          <Tab key={i} label={r.label} />
        ))}
      </Tabs>
      <Box mt={2}>
        {reportes[subTab]?.component}
      </Box>
    </Box>
  );
};

export default ReportesContables;
