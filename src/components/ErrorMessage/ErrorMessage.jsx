// src/components/ErrorMessage/ErrorMessage.jsx
import React from 'react';

function ErrorMessage({ message }) {
  if (!message) return null; // Não renderiza se não houver mensagem

  return (
    <p className="error-message">
      {message}
    </p>
  );
}

export default ErrorMessage;