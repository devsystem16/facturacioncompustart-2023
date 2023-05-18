import React, { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';

import PrintIcon from '@material-ui/icons/Print';
const PrintComponent = ({ ComponentToPrint }) => {
  const pageStyle = `
  @media print {
    html,
    body {
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
   }

   .verticalText1 {
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    width: 3%;  
    }
`;

  const componentRef = useRef();
  const fn_imprimir = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle
  });

  useEffect(() => {}, []);

  return (
    <div>
      <PrintIcon
        title="Imprimir"
        style={{ cursor: 'pointer' }}
        onClick={fn_imprimir}
      />

      <div style={{ display: 'none' }}>
        <ContenedorComponent ref={componentRef} component={ComponentToPrint} />
      </div>
    </div>
  );
};
export default PrintComponent;

const ContenedorComponent = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <props.component></props.component>
    </div>
  );
});
