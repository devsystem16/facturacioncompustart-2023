import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../src/layouts/DashboardLayout';
import MainLayout from '../src/layouts/MainLayout';
import AccountView from '../src/views/account/AccountView';
import CustomerListView from '../src/views/customer/CustomerListView';
import DashboardView from '../src/views/reports/DashboardView';
import LoginView from '../src/views/auth/LoginView';
import NotFoundView from '../src/views/errors/NotFoundView';
import ProductListView from '../src/views/product/ProductListView';
import RegisterView from '../src/views/auth/RegisterView';
import SettingsView from '../src/views/settings/SettingsView';
import PuntoVenta from './views/puntoVenta';

import Creditos from '../src/views/creditos';
import Ingreso from './views/Ingreso/ProductListView/index';

import ListadoFacturas from '../src/components/ListadoFacturas/ListadoFacturas';
import LayoutPedidos from '../src/components/LayoutPedidos/';
import LayoutReportes from '../src/components/LayoutReportes';

import Proformas from '../src/views/proformas';
import IngresoEgreso from '../src/views/IngresoEgreso';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'puntoventa', element: <PuntoVenta /> },
      { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'products', element: <ProductListView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: 'creditos', element: <Creditos /> },

      { path: 'ingreso', element: <Ingreso /> },
      { path: 'facturas', element: <ListadoFacturas /> },
      { path: 'pedidos', element: <LayoutPedidos /> },
      { path: 'reportes', element: <LayoutReportes /> },
      { path: 'proformas', element: <Proformas /> },

      { path: 'ingresoEgreso', element: <IngresoEgreso /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
