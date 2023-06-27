import React, { useState, useEffect, useContext } from 'react';
import './tabla.css';
import TextField from '@material-ui/core/TextField';
import API from '../../Environment/config';
import Permisos from '../../Environment/Permisos.json';

import DeleteIcon from '@material-ui/icons/Delete';
import Loading from '../../components/Loading/Loading';
import { formatCurrency } from '../../Environment/utileria';
import { PeriodoContext } from '../../context/PeriodoContext';

const Table = ({ titulo = 'Listado', denominaciones, setDenominaciones }) => {
  const { totalRetiros, setTotalRetiros } = useContext(PeriodoContext);

  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const data = [
    { id: 1, name: 'John Doe', age: 30, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 25, city: 'London' },
    { id: 3, name: 'Bob Johnson', age: 40, city: 'Paris' }
  ];

  const calularTotal = (array) => {
    let sumaValorRetiro = 0;
    array.forEach((item) => {
      sumaValorRetiro += item.valorRetiro;
    });
    setTotalRetiros(formatCurrency(sumaValorRetiro));
  };
  useEffect(() => {
    calularTotal(denominaciones);
  }, [denominaciones]);

  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(filter.toLowerCase()) ||
      row.city.toLowerCase().includes(filter.toLowerCase())
  );

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = filteredData.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const eliminar = async (idRetiro) => {
    setIsLoading(true);
    const response = await API.post('/api/retiros/eliminar/retiro/' + idRetiro);

    setDenominaciones(response.data.data);
    calularTotal(response.data.data);
    setIsLoading(false);
  };

  return (
    <div className="tablaComponent">
      <Loading
        text="Eliminando..."
        open={isLoading}
        setOpen={setIsLoading}
      ></Loading>
      <h2> {titulo} </h2>
      <TextField
        className="txt-filter"
        style={{ textAlign: 'left' }}
        id="standard-basic"
        label="Buscar"
        type="text"
        value={filter}
        onChange={handleFilterChange}
        // placeholder="Filter table"
      />

      <table className="table-container">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              ID{' '}
              {sortConfig.key === 'id' && (
                <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th onClick={() => handleSort('name')}>
              Valor Retiro{' '}
              {sortConfig.key === 'name' && (
                <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th onClick={() => handleSort('age')}>
              Por Concepto de{' '}
              {sortConfig.key === 'age' && (
                <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th onClick={() => handleSort('city')}>
              Observaciones{' '}
              {sortConfig.key === 'city' && (
                <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {denominaciones.map((retiros) => {
            return (
              <tr key={retiros.id}>
                <td>{retiros.id}</td>
                <td>{formatCurrency(retiros.valorRetiro)}</td>
                <td>{retiros.concepto}</td>
                <td>{retiros.observacion}</td>
                <td>
                  {Permisos[localStorage.getItem('tipo_usuario')][
                    'eliminar-retiros'
                  ] && (
                    <DeleteIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => eliminar(retiros.id)}
                    ></DeleteIcon>
                  )}
                </td>
              </tr>
            );
          })}

          <tr key="KK01">
            <td colSpan={'2'} style={{ textAlign: 'center' }}>
              <h2> Total: {totalRetiros}</h2>
            </td>
            <td colspan="3"> </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
