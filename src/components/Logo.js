import React from 'react';

const Logo = (props) => {
  return (
    <img
      style={{
        width: '90%',
        height: '60px',
        margin: '0',
        padding: '0',
        borderRadius: '10px'
      }}
      alt="Logo"
      src="https://quevedo2023.s3.us-east-2.amazonaws.com/compustart.png"
      {...props}
    />
  );
};

export default Logo;
