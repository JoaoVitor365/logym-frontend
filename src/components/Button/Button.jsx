import React from 'react';

function Button({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${className}`} // Exemplo de classe CSS
    >
      {children}
    </button>
  );
}

export default Button;