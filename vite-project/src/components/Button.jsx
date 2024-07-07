import React from 'react';

const Button = ({ type, onClick, value, className }) => {
    return (
      <button type={type} onClick={onClick} className={className}>
        {value}
      </button>
    );
  };
  
  export default Button;