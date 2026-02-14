import React, { createContext, useState, useEffect } from 'react';
import API from '../Environment/config';

export const UsuariosContext = createContext();

const END_POINT = {
  usuarios: 'api/usuarios',
  cambiarPassword: 'api/usuarios',
  tiposUsuario: 'api/usuarios/tipos/listado'
};

const UsuariosProvider = (props) => {
  const [usuarios, setUsuarios] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [recargarUsuarios, setRecargarUsuarios] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    cargarTiposUsuario();
  }, []);

  useEffect(() => {
    if (recargarUsuarios) {
      cargarUsuarios();
      setRecargarUsuarios(false);
    }
  }, [recargarUsuarios]);

  const cargarUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(END_POINT.usuarios);
      setUsuarios(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarTiposUsuario = async () => {
    try {
      const response = await API.get(END_POINT.tiposUsuario);
      setTiposUsuario(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar tipos de usuario:', error);
    }
  };

  const crearUsuario = async (usuario) => {
    const response = await API.post(END_POINT.usuarios, usuario);
    return response.data;
  };

  const actualizarUsuario = async (id, usuario) => {
    const response = await API.put(END_POINT.usuarios + '/' + id, usuario);
    return response.data;
  };

  const eliminarUsuario = async (id) => {
    const response = await API.delete(END_POINT.usuarios + '/' + id);
    return response.data;
  };

  const cambiarPassword = async (id, data) => {
    const response = await API.put(
      END_POINT.cambiarPassword + '/' + id + '/cambiar-password',
      data
    );
    return response.data;
  };

  return (
    <UsuariosContext.Provider
      value={{
        usuarios,
        tiposUsuario,
        isLoading,
        recargarUsuarios,
        setRecargarUsuarios,
        cargarUsuarios,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
        cambiarPassword
      }}
    >
      {props.children}
    </UsuariosContext.Provider>
  );
};

export default UsuariosProvider;
