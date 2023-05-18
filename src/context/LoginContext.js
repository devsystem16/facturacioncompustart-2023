import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';

import API from '../Environment/config';

export const LoginContext = createContext();

const END_POINT = {
  login: 'api/usuarios/acceso/login',
  obtenerAccesos: 'api/pantallapos/acceso/obtener-acceso'
};

const LoginProvider = (props) => {
  const [isReload, setIsReload] = useState(true);
  const [items, setItems] = useState([
    // {
    //   href: '/app/dashboard',
    //   icon: 'BarChartIcon',
    //   title: 'Cargando...'
    // }
    // {
    //   href: '/app/puntoventa',
    //   icon: 'Billing',
    //   title: 'Punto de Venta'
    // },
    // {
    //   href: '/app/ingreso',
    //   icon: 'Smartphone',
    //   title: 'Ingreso'
    // },
    // {
    //   href: '/app/customers',
    //   icon: 'UsersIcon',
    //   title: 'Cientes'
    // },
    // {
    //   href: '/app/products',
    //   icon: 'ShoppingBagIcon',
    //   title: 'Productos'
    // },
    // {
    //   href: '/app/creditos',
    //   icon: 'EditIconF',
    //   title: 'Creditos'
    // },
    // {
    //   href: '/app/facturas',
    //   icon: 'iconoFacturas',
    //   title: 'Facturas'
    // }
  ]);

  const [credenciales, setCredenciales] = useState({
    login: 0,
    usuario: '',
    nombres: '',
    tipo: ''
  });
  const [userloggin, setUserloggin] = useState({
    avatar: '/static/images/avatars/avatar_6.png',
    jobTitle: 'Facturacion',
    name: 'Facturacion'
  });

  useEffect(() => {
    if (localStorage.getItem('tipousuario_id') !== null) {
      obtenerAccesos(localStorage.getItem('tipousuario_id'));
    }

    if (isReload) {
    }
  }, [isReload]);

  const obtenerAccesos = async (tipoUsuario) => {
    const response = await API.get(
      END_POINT.obtenerAccesos + '/' + tipoUsuario
    );

    setItems(response.data);
  };
  const login = async (usuario) => {
    const response = await API.post(END_POINT.login, usuario);

    if (response.data.login === 1) {
      const res = await obtenerAccesos(response.data.tipousuario_id);
    }

    return response.data;
    // setCredenciales(response.data);
  };

  return (
    <>
      <LoginContext.Provider
        value={{
          isReload,
          setIsReload,
          login,
          credenciales,
          setCredenciales,
          userloggin,
          setUserloggin,
          items
        }}
      >
        {props.children}
      </LoginContext.Provider>
    </>
  );
};

export default LoginProvider;
