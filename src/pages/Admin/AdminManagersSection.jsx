// src/pages/Admin/AdminManagersSection.jsx
import React from 'react';

import { StatusBadge } from './AdminSharedComponents';
import { formatarCPF, formatarData, getStatusLabel } from './adminFormatters';

function AdminManagersSection({ gerentes }) {
  return (
    <section className="admin-section admin-managers-section">
      <div className="admin-section__heading admin-records-heading">
        <div>
          <span className="admin-section__eyebrow">Contas de gestão</span>
          <h2 className="admin-section__title">Gerentes cadastrados</h2>
        </div>
        <span className="admin-records-count">{gerentes.length} {gerentes.length === 1 ? 'completo' : 'completos'}</span>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Nascimento</th>
              <th>E-mail vinculado</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {gerentes.length === 0 ? (
              <tr>
                <td colSpan="7">Nenhum gerente encontrado.</td>
              </tr>
            ) : (
              gerentes.map((gerente) => (
                <tr key={gerente.id}>
                  <td>{gerente.id}</td>
                  <td>{gerente.nome || gerente.usuario?.nome || 'Não informado'}</td>
                  <td>{formatarCPF(gerente.cpf)}</td>
                  <td>{gerente.telefone || 'Não informado'}</td>
                  <td>{formatarData(gerente.dataNascimento)}</td>
                  <td>{gerente.usuario?.username || 'Não informado'}</td>
                  <td><StatusBadge status={getStatusLabel(gerente.statusGerente || 'ATIVO')} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminManagersSection;
