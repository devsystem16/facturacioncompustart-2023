import React, { useState, useEffect, useContext } from 'react';
import './tabla.css';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import API from '../../Environment/config';
import Permisos from '../../Environment/Permisos.json';
import Loading from '../../components/Loading/Loading';
import { formatCurrency } from '../../Environment/utileria';
import { PeriodoContext } from '../../context/PeriodoContext';

const Table = ({ titulo = 'Listado', denominaciones, setDenominaciones }) => {
  const { totalRetiros, setTotalRetiros } = useContext(PeriodoContext);

  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Calcula el total de retiros
  const calcularTotal = (array) => {
    const sumaValorRetiro = array.reduce((acc, item) => acc + item.valorRetiro, 0);
    setTotalRetiros(formatCurrency(sumaValorRetiro));
  };

  useEffect(() => {
    calcularTotal(denominaciones);
  }, [denominaciones]);

  // Manejo de filtro
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Manejo de ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtra y ordena las denominaciones
  const filteredData = denominaciones.filter((row) =>
    row.concepto?.toLowerCase().includes(filter.toLowerCase()) ||
    row.observacion?.toLowerCase().includes(filter.toLowerCase()) ||
    row.valorRetiro?.toString().includes(filter)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Eliminar un retiro
  const eliminar = async (idRetiro) => {
    setIsLoading(true);
    try {
      const response = await API.post(`/api/retiros/eliminar/retiro/${idRetiro}`);
      setDenominaciones(response.data.data);
      calcularTotal(response.data.data);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tablaComponent">
      <Loading text="Eliminando..." open={isLoading} setOpen={setIsLoading} />
      <h2>{titulo}</h2>

      <TextField
        className="txt-filter"
        style={{ textAlign: 'left' }}
        label="Buscar"
        type="text"
        value={filter}
        onChange={handleFilterChange}
      />

      <table className="table-container">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              ID {sortConfig.key === 'id' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th onClick={() => handleSort('valorRetiro')}>
              Valor Retiro {sortConfig.key === 'valorRetiro' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th onClick={() => handleSort('concepto')}>
              Por Concepto de {sortConfig.key === 'concepto' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th onClick={() => handleSort('observacion')}>
              Observaciones {sortConfig.key === 'observacion' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((retiro) => (
            <tr key={retiro.id}>
              <td>{retiro.id}</td>
              <td>{formatCurrency(retiro.valorRetiro)}</td>
              <td>{retiro.concepto}</td>
              <td>{retiro.observacion}</td>
              <td>
                {Permisos[localStorage.getItem('tipo_usuario')]['eliminar-retiros'] && (
                  <DeleteIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => eliminar(retiro.id)}
                  />
                )}
              </td>
            </tr>
          ))}

          <tr key="total">
            <td colSpan={2} style={{ textAlign: 'center' }}>
              <h2>Total: {totalRetiros}</h2>
            </td>
            <td colSpan={3}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
