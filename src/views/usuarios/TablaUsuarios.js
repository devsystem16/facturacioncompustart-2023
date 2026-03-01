import React, { useContext, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  TextField,
  Box,
  colors
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';
import alertify from 'alertifyjs';
import { UsuariosContext } from '../../context/UsuariosContext';
import { LoginContext } from '../../context/LoginContext';

const TablaUsuarios = ({ setUsuarioEditar }) => {
  const { usuarios, eliminarUsuario, setRecargarUsuarios } =
    useContext(UsuariosContext);
  const { tienePermiso } = useContext(LoginContext);

  const [filtro, setFiltro] = useState('');

  const handleEditar = (usuario) => {
    setUsuarioEditar(usuario);
  };

  const handleEliminar = (usuario) => {
    Swal.fire({
      title: 'Eliminar usuario',
      text: `¿Está seguro de eliminar a "${usuario.nombres}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const resp = await eliminarUsuario(usuario.id);
          if (resp.codigo === 200) {
            alertify.success('Usuario eliminado', 2);
            setRecargarUsuarios(true);
          } else {
            alertify.error(resp.Message || 'Error al eliminar', 2);
          }
        } catch (error) {
          alertify.error('Error al eliminar usuario', 2);
        }
      }
    });
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = filtro.toLowerCase();
    return (
      (u.nombres || '').toLowerCase().includes(texto) ||
      (u.usuario || '').toLowerCase().includes(texto) ||
      (u.tipo || '').toLowerCase().includes(texto)
    );
  });

  const getTipoColor = (tipo) => {
    if (!tipo) return colors.grey[500];
    const t = tipo.toLowerCase();
    if (t.includes('admin')) return '#3f51b5';
    if (t.includes('vendedor')) return colors.green[600];
    return colors.blue[500];
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: 16 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h6">Usuarios del Sistema</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Buscar usuario..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ width: 250 }}
        />
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: '#f5f6fa' }}>
            <TableCell style={{ fontWeight: 600 }}>Nombre</TableCell>
            <TableCell style={{ fontWeight: 600 }}>Usuario</TableCell>
            <TableCell style={{ fontWeight: 600 }}>Tipo</TableCell>
            <TableCell style={{ fontWeight: 600 }}>Horario</TableCell>
            <TableCell style={{ fontWeight: 600 }}>Fecha Creación</TableCell>
            <TableCell align="center" style={{ fontWeight: 600 }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuariosFiltrados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography
                  variant="body2"
                  style={{ color: colors.grey[500], padding: 16 }}
                >
                  No se encontraron usuarios
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            usuariosFiltrados.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.nombres}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{ fontFamily: 'monospace', fontSize: 13 }}
                  >
                    {user.usuario}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.tipo || 'Sin tipo'}
                    size="small"
                    style={{
                      backgroundColor: getTipoColor(user.tipo),
                      color: '#fff',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" style={{ fontSize: 12 }}>
                    {user.hora_inicio || '--:--'} - {user.hora_fin || '--:--'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" style={{ fontSize: 12 }}>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {tienePermiso('usuarios.editar') && (
                    <IconButton
                      size="small"
                      onClick={() => handleEditar(user)}
                      title="Editar"
                    >
                      <EditIcon fontSize="small" style={{ color: '#3f51b5' }} />
                    </IconButton>
                  )}
                  {tienePermiso('usuarios.eliminar') && (
                    <IconButton
                      size="small"
                      onClick={() => handleEliminar(user)}
                      title="Eliminar"
                    >
                      <DeleteIcon
                        fontSize="small"
                        style={{ color: colors.red[400] }}
                      />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaUsuarios;
