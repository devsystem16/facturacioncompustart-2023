import { useContext, useEffect } from 'react';
import Swal from 'sweetalert2';

import { PeriodoContext } from '../context/PeriodoContext';

const VerificarAperturaPeriodo = () => {
  const { verificarPeriodoActivo, cerrarPeriodo } = useContext(PeriodoContext);

  // const lc_cerrarPeriodo = async (id) => {
  //   const resulta = await cerrarPeriodo();
  // };
  useEffect(() => {
    const fetchPeriodo = async () => {
      const periodo = await verificarPeriodoActivo();

      if (periodo.estado === 'periodo-anterior-activo') {
        // Swal.fire(periodo.message);

        Swal.fire({
          title: periodo.message,
          showDenyButton: true,
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: 'Cerrar este periodo',
          denyButtonText: `Continuar en este periodo`
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await cerrarPeriodo(periodo.periodo);
            console.log(response);
            Swal.fire('Periodo Cerrado!', '', 'success');
          } else if (result.isDenied) {
            Swal.fire('Se seguirá facturando en este periodo', '', 'info');
          }
        });
      }
    };

    fetchPeriodo();
  }, []);

  // Resto del código del componente...

  return null;
};

export default VerificarAperturaPeriodo;
