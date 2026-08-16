// src/pages/Admin/AdminReviewsSection.jsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button/Button';
import { InfoInline, StatusBadge } from './AdminSharedComponents';
import { getStatusLabel } from './adminFormatters';

function AdminReviewsSection({ avaliacoes, onSuspenderAvaliacao, onReativarAvaliacao, acaoEstaEmAndamento, getAcaoKey }) {
  const [termoBusca, setTermoBusca] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('TODOS');

  const formatarNota = (nota) => Number(nota || 0).toFixed(1);

  const renderEstrelas = (nota) => {
    const valor = Math.round(Number(nota || 0));
    return '★'.repeat(valor) + '☆'.repeat(Math.max(0, 5 - valor));
  };

  const normalizarTexto = (valor) =>
    String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const ordenarOpcoes = (opcoes, ordem) =>
    [...opcoes].sort((a, b) => {
      const indiceA = ordem.indexOf(a);
      const indiceB = ordem.indexOf(b);

      if (indiceA === -1 && indiceB === -1) return a.localeCompare(b);
      if (indiceA === -1) return 1;
      if (indiceB === -1) return -1;
      return indiceA - indiceB;
    });

  const statusDisponiveis = useMemo(() => {
    const status = avaliacoes
      .map((avaliacao) => avaliacao.statusAvaliacao)
      .filter(Boolean);

    return ordenarOpcoes([...new Set(status)], ['ATIVO', 'INATIVO', 'SUSPENSA']);
  }, [avaliacoes]);

  const avaliacoesFiltradas = useMemo(() => {
    const termoNormalizado = normalizarTexto(termoBusca);

    return avaliacoes.filter((avaliacao) => {
      const correspondeBusca = !termoNormalizado || [
        avaliacao.usuarioNome,
        avaliacao.academiaNome
      ].some((valor) => normalizarTexto(valor).includes(termoNormalizado));
      const correspondeStatus = statusSelecionado === 'TODOS' || avaliacao.statusAvaliacao === statusSelecionado;

      return correspondeBusca && correspondeStatus;
    });
  }, [avaliacoes, termoBusca, statusSelecionado]);

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">Avaliações cadastradas</h2>

      <div className="admin-actions-row">
        <div className="input-group">
          <label htmlFor="buscaAvaliacoesAdmin" className="input-label">
            Buscar
          </label>
          <input
            id="buscaAvaliacoesAdmin"
            name="buscaAvaliacoesAdmin"
            type="text"
            className="input-field"
            value={termoBusca}
            onChange={(event) => setTermoBusca(event.target.value)}
            placeholder="Usuário ou academia"
          />
        </div>

        <div className="input-group">
          <label htmlFor="statusAvaliacoesAdmin" className="input-label">
            Status
          </label>
          <select
            id="statusAvaliacoesAdmin"
            name="statusAvaliacoesAdmin"
            className="input-field"
            value={statusSelecionado}
            onChange={(event) => setStatusSelecionado(event.target.value)}
          >
            <option value="TODOS">TODOS</option>
            {statusDisponiveis.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {avaliacoes.length === 0 ? (
        <p>Nenhuma avaliação encontrada.</p>
      ) : avaliacoesFiltradas.length === 0 ? (
        <p>Nenhuma avaliação encontrada para os filtros selecionados.</p>
      ) : (
        <div className="admin-list-scroll">
          {avaliacoesFiltradas.map((avaliacao) => {
            const estaAtiva = avaliacao.statusAvaliacao === 'ATIVO';
            const estaSuspensa = avaliacao.statusAvaliacao === 'SUSPENSA';
            const itens = Array.isArray(avaliacao.itens) ? avaliacao.itens : [];
            const suspendendo = acaoEstaEmAndamento(getAcaoKey('avaliacao', avaliacao.id, 'suspender'));
            const reativando = acaoEstaEmAndamento(getAcaoKey('avaliacao', avaliacao.id, 'reativar'));

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
                    <Button type="button" className="button-cancel" onClick={() => onSuspenderAvaliacao(avaliacao.id)} disabled={suspendendo}>
                      {suspendendo ? 'Suspendendo...' : 'Suspender avaliação'}
                    </Button>
                  ) : (
                    <Button type="button" className="button-primary" onClick={() => onReativarAvaliacao(avaliacao.id)} disabled={reativando}>
                      {reativando ? 'Reativando...' : 'Reativar avaliação'}
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
