// src/pages/Admin/AdminReviewsSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button/Button';
import { InfoInline, StatusBadge } from './AdminSharedComponents';
import { getStatusLabel } from './adminFormatters';

function AdminReviewsSection({ avaliacoes, onSuspenderAvaliacao, onReativarAvaliacao }) {
  const formatarNota = (nota) => Number(nota || 0).toFixed(1);

  const renderEstrelas = (nota) => {
    const valor = Math.round(Number(nota || 0));
    return '★'.repeat(valor) + '☆'.repeat(Math.max(0, 5 - valor));
  };

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">Avaliações cadastradas</h2>

      {avaliacoes.length === 0 ? (
        <p>Nenhuma avaliação encontrada.</p>
      ) : (
        <div className="admin-list-scroll">
          {avaliacoes.map((avaliacao) => {
            const estaAtiva = avaliacao.statusAvaliacao === 'ATIVO';
            const estaSuspensa = avaliacao.statusAvaliacao === 'SUSPENSA';
            const itens = Array.isArray(avaliacao.itens) ? avaliacao.itens : [];

            return (
              <div key={avaliacao.id} className="admin-list-item">
                <div className="admin-review-grid">
                  <div>
                    <strong className="admin-list-item__title">
                      {avaliacao.academiaNome || `Academia #${avaliacao.academiaId}`}
                    </strong>
                    <span className="admin-list-item__subtitle">Avaliação ID: {avaliacao.id}</span>
                  </div>

                  <InfoInline label="Usuário" value={avaliacao.usuarioNome || `Usuário #${avaliacao.usuarioId}`} />
                  <InfoInline label="Nota média" value={formatarNota(avaliacao.nota)} />
                  <InfoInline label="Status" value={<StatusBadge status={getStatusLabel(avaliacao.statusAvaliacao)} />} />
                </div>

                <div className="admin-review-comment">
                  <strong>Critérios avaliados</strong>

                  {itens.length === 0 ? (
                    <p>Detalhes dos critérios não disponíveis.</p>
                  ) : (
                    <div className="admin-review-items">
                      {itens.map((item) => (
                        <div key={item.itemId} className="admin-review-item-row">
                          <span>{item.itemNome}</span>
                          <strong className="admin-review-item-stars">
                            {renderEstrelas(item.nota)} <span>({formatarNota(item.nota)})</span>
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {estaSuspensa && (
                  <div className="admin-warning-box">
                    Esta avaliação está suspensa. Ela não aparece para outros usuários e não conta na média da academia.
                  </div>
                )}

                <div className="admin-actions-row">
                  <Link to={`/academia/${avaliacao.academiaId}`} style={{ textDecoration: 'none' }}>
                    <Button type="button" className="button-primary">Ver academia</Button>
                  </Link>

                  {estaAtiva ? (
                    <Button type="button" className="button-cancel" onClick={() => onSuspenderAvaliacao(avaliacao.id)}>
                      Suspender avaliação
                    </Button>
                  ) : (
                    <Button type="button" className="button-primary" onClick={() => onReativarAvaliacao(avaliacao.id)}>
                      Reativar avaliação
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

export default AdminReviewsSection;
