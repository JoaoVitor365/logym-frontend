// src/components/Input/Input.jsx
import React from 'react';

// O componente Input agora aceita uma prop 'className'
function Input({ label, type, id, name, placeholder, value, onChange, className, ...props }) {
  return (
    // Aplica a prop 'className' diretamente ao div.input-group
    <div className={`input-group ${className || ''}`}>
      <label htmlFor={id} className="input-label">{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field" // Esta classe já existe no seu CSS
        {...props} // Passa quaisquer outras props (como 'min', 'max', etc.)
        // REMOVA o 'required' daqui se ele estiver sendo passado como prop,
        // pois vamos gerenciar a obrigatoriedade via JS.
        // Se você não tiver passado 'required' como prop, não precisa se preocupar.
      />
    </div>
  );
}

export default Input;