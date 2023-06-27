import { useNavigate } from 'react-router-dom';

export const formatCurrency = (number) => {
  try {
    if (number === undefined || number === null) return 0;
    return `$ ${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  } catch (error) {
    return number;
  }
};

export const formatCurrencySimple = (number) => {
  try {
    if (number === undefined || number === null) return 0;
    return `${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  } catch (error) {
    return number;
  }
};

export const formatoFecha = (fecha) => {
  return '';
};

export const ComponentIniciarPeriodo = () => {
  const navigate = useNavigate();
  const handleRedireccionar = () => {
    navigate('/app/puntoventa', { replace: true });
  };
  return (
    <div>
      <h1>
        Es necesario iniciar el periodo,{' '}
        <strong
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={handleRedireccionar}
        >
          Crear Nuevo Periodo
        </strong>
      </h1>
    </div>
  );
};

// export default API;
