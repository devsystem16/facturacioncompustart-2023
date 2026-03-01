import React, { useContext } from 'react';
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
  Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';
import alertify from 'alertifyjs';
import { GastosContext } from '../../context/GastosContext';
import { LoginContext } from '../../context/LoginContext';

const TablaCategorias = ({ setCategoriaEditar }) => {
  const { categorias, eliminarCategoria, setRecargarCategorias } =
    useContext(GastosContext);
  const { tienePermiso } = useContext(LoginContext);

  const handleEditar = (categoria) => {
    setCategoriaEditar(categoria);
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: 'Eliminar categoría',
      text: '¿Está seguro de eliminar esta categoría?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const resp = await eliminarCategoria(id);
          if (resp.codigo === 200) {
            alertify.success('Categoría eliminada', 2);
            setRecargarCategorias(true);
          } else {
            alertify.error(resp.Message || 'Error al eliminar', 2);
          }
        } catch (error) {
          alertify.error('Error al eliminar categoría', 2);
        }
      }
    });
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: 16 }}>
      <Typography variant="h6" style={{ padding: 16 }}>
        Categorías de Gastos
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Color</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categorias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No hay categorías registradas
              </TableCell>
            </TableRow>
          ) : (
            categorias.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.nombre}</TableCell>
                <TableCell>{cat.descripcion}</TableCell>
                <TableCell>
                  <Chip
                    label={cat.color}
                    style={{ backgroundColor: cat.color, color: '#fff' }}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {tienePermiso('gastos.categorias-editar') && (
                    <IconButton size="small" onClick={() => handleEditar(cat)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {tienePermiso('gastos.categorias-eliminar') && (
                    <IconButton size="small" onClick={() => handleEliminar(cat.id)}>
                      <DeleteIcon fontSize="small" />
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

export default TablaCategorias;
