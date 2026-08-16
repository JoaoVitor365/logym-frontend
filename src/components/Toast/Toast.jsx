// src/components/Toast/Toast.jsx
import React, { useEffect } from 'react';

function Toast({ open, message, variant = 'success', onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const timer = setTimeout(() => {
      onClose?.();
    }, 3500);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <div className={`toast toast-${variant}`} role={role}>
      <span>{message}</span>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Fechar mensagem"
      >
        x
      </button>
    </div>
  );
}

export default Toast;
