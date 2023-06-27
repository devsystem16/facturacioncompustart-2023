import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import ProductosProvider from './context/ProductosContext';
import FacturaProvider from './context/FacturaContext';
import ClienteProvider from './context/ClienteContext';
import IngresoProvider from './context/IngresoContext';
import TecnicoProvider from './context/TecnicoContext';
import CreditoProvider from './context/CreditoContext';
import EstadisticasProvider from './context/EstadisticasContext';
import LoginProvider from './context/LoginContext';
import PeriodoProvider from './context/PeriodoContext';

ReactDOM.render(
  <BrowserRouter>
    <LoginProvider>
      <PeriodoProvider>
        <EstadisticasProvider>
          <TecnicoProvider>
            <ProductosProvider>
              <ClienteProvider>
                <IngresoProvider>
                  <CreditoProvider>
                    <FacturaProvider>
                      <App />
                    </FacturaProvider>
                  </CreditoProvider>
                </IngresoProvider>
              </ClienteProvider>
            </ProductosProvider>
          </TecnicoProvider>
        </EstadisticasProvider>
      </PeriodoProvider>
    </LoginProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
