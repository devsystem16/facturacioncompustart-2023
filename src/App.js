import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
// import GlobalStyles from 'src/components/GlobalStyles';

import GlobalStyles from '../src/components/GlobalStyles';
import '../src/mixins/chartjs';
import theme from '../src/theme';
import routes from '../src/routes';

const App = () => {
  const routing = useRoutes(routes);
  const navigate = useNavigate();

  if (localStorage.getItem('login') !== null) {
    var hoy = new Date();

    var h = hoy.getHours() > 9 ? hoy.getHours() : '0' + hoy.getHours();
    var m = hoy.getMinutes() > 9 ? hoy.getMinutes() : '0' + hoy.getMinutes();
    var s = hoy.getSeconds() > 9 ? hoy.getSeconds() : '0' + hoy.getSeconds();

    var hora = h + ':' + m + ':' + s;

    var hora_inicio = localStorage.getItem('hora_inicio');
    var hora_fin = localStorage.getItem('hora_fin');

    if (hora >= hora_inicio && hora <= hora_fin) {
    } else {
      navigate('/login', { replace: true });
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
