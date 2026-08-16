import React, { useEffect, useId, useRef } from 'react';

function ConfirmModal({
  open,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel
}) {
  const titleId = useId();
  const messageId = useId();
  const cancelButtonRef = useRef(null);
  const variantClass = ['danger', 'warning'].includes(variant) ? variant : 'default';

  useEffect(() => {
    if (!open) return;

    cancelButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loading) {
        onCancel?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, loading, onCancel]);

  if (!open) {
    return null;
  }

  const handleCancel = () => {
    if (!loading) {
      onCancel?.();
    }
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm?.();
    }
  };

  return (
    <div className="confirm-modal-overlay">
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? messageId : undefined}
      >
        <div className={`confirm-modal__marker confirm-modal__marker--${variantClass}`} />

        <div className="confirm-modal__content">
          <h2 id={titleId} className="confirm-modal__title">
            {title}
          </h2>

          {message && (
            <p id={messageId} className="confirm-modal__message">
              {message}
            </p>
          )}
        </div>

        <div className="confirm-modal__actions">
          <button
            type="button"
            ref={cancelButtonRef}
            className="confirm-modal__button confirm-modal__button--cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`confirm-modal__button confirm-modal__button--confirm confirm-modal__button--${variantClass}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
