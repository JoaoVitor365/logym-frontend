// src/pages/Admin/AdminSharedComponents.jsx
import React from 'react';

export function InfoInline({ label, value }) {
  return (
    <div className="admin-info">
      <strong className="admin-info__label">{label}</strong>
      <span className="admin-info__value">{value || 'Não informado'}</span>
    </div>
  );
}

export function StatusBadge({ status }) {
  const ativo = status === 'ATIVO' || status === 'ATIVA';
  const suspenso = status === 'SUSPENSO' || status === 'SUSPENSA';

  return (
    <span className={`admin-status-badge ${ativo ? 'admin-status-badge--active' : suspenso ? 'admin-status-badge--suspended' : 'admin-status-badge--inactive'}`}>
      {status}
    </span>
  );
}
