import axios from 'axios';

export const formatCurrency = (number) => {
  if (number === undefined || number === null) return 0;
  return `$ ${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatCurrencySimple = (number) => {
  if (number === undefined || number === null) return 0;
  return `${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// export default API;
