// src/pages/Admin/AdminAcademiesSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button/Button';
import { InfoInline, StatusBadge } from './AdminSharedComponents';
import { formatarCNPJ, formatarNota, getNomeGerente, getStatusLabel } from './adminFormatters';

function AdminAcademiesSection({ academias, onSuspenderAcademia, onReativarAcademia }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__title">Academias cadastradas</h2>

      {academias.length === 0 ? (
        <p>Nenhuma academia encontrada.</p>
      ) : (
        <div className="admin-list-scroll">
          {academias.map((academia) => {
            const estaAtiva = academia.statusAcademia === 'ATIVO';

            return (
              <div key={academia.id} className="admin-list-item">
                <div className="admin-academy-grid">
                  <div>
                    <strong className="admin-list-item__title">{academia.nome}</strong>
                    <span className="admin-list-item__subtitle">ID: {academia.id}</span>
                  </div>

                  <InfoInline label="Status" value={<StatusBadge status={getStatusLabel(academia.statusAcademia)} />} />
                  <InfoInline label="Nota" value={formatarNota(academia.nota)} />
                  <InfoInline label="Cidade" value={`${academia.cidade || 'Não informado'} - ${academia.estado || ''}`} />
                  <InfoInline label="Gerente" value={getNomeGerente(academia)} />
                  <InfoInline label="CNPJ" value={formatarCNPJ(academia.cnpj)} />
                </div>

                <div className="admin-actions-row">
                  <Link to={`/academia/${academia.id}`} style={{ textDecoration: 'none' }}>
                    <Button type="button" className="button-primary">Ver detalhes</Button>
                  </Link>

                  {estaAtiva ? (
                    <Button type="button" className="button-cancel" onClick={() => onSuspenderAcademia(academia.id)}>
                      Suspender
                    </Button>
                  ) : (
                    <Button type="button" className="button-primary" onClick={() => onReativarAcademia(academia.id)}>
                      Reativar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AdminAcademiesSection;
