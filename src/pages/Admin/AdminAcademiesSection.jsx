// src/pages/Admin/AdminAcademiesSection.jsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button/Button';
import { InfoInline, StatusBadge } from './AdminSharedComponents';
import { formatarCNPJ, formatarNota, getNomeGerente, getStatusLabel } from './adminFormatters';

function AdminAcademiesSection({ academias, onSuspenderAcademia, onReativarAcademia, acaoEstaEmAndamento, getAcaoKey }) {
  const [termoBusca, setTermoBusca] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('TODOS');

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
    const status = academias
      .map((academia) => academia.statusAcademia)
      .filter(Boolean);

    return ordenarOpcoes([...new Set(status)], ['ATIVO', 'INATIVO', 'SUSPENSA']);
  }, [academias]);

  const academiasFiltradas = useMemo(() => {
    const termoNormalizado = normalizarTexto(termoBusca);

    return academias.filter((academia) => {
      const correspondeBusca = !termoNormalizado || [
        academia.nome,
        academia.cnpj,
        formatarCNPJ(academia.cnpj),
        academia.cidade,
        getNomeGerente(academia)
      ].some((valor) => normalizarTexto(valor).includes(termoNormalizado));
      const correspondeStatus = statusSelecionado === 'TODOS' || academia.statusAcademia === statusSelecionado;

      return correspondeBusca && correspondeStatus;
    });
  }, [academias, termoBusca, statusSelecionado]);

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">Academias cadastradas</h2>

      <div className="admin-actions-row">
        <div className="input-group">
          <label htmlFor="buscaAcademiasAdmin" className="input-label">
            Buscar
          </label>
          <input
            id="buscaAcademiasAdmin"
            name="buscaAcademiasAdmin"
            type="text"
            className="input-field"
            value={termoBusca}
            onChange={(event) => setTermoBusca(event.target.value)}
            placeholder="Nome, CNPJ, cidade ou gerente"
          />
        </div>

        <div className="input-group">
          <label htmlFor="statusAcademiasAdmin" className="input-label">
            Status
          </label>
          <select
            id="statusAcademiasAdmin"
            name="statusAcademiasAdmin"
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

      {academias.length === 0 ? (
        <p>Nenhuma academia encontrada.</p>
      ) : academiasFiltradas.length === 0 ? (
        <p>Nenhuma academia encontrada para os filtros selecionados.</p>
      ) : (
        <div className="admin-list-scroll">
          {academiasFiltradas.map((academia) => {
            const estaAtiva = academia.statusAcademia === 'ATIVO';
            const suspendendo = acaoEstaEmAndamento(getAcaoKey('academia', academia.id, 'suspender'));
            const reativando = acaoEstaEmAndamento(getAcaoKey('academia', academia.id, 'reativar'));

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
                    <Button type="button" className="button-cancel" onClick={() => onSuspenderAcademia(academia.id)} disabled={suspendendo}>
                      {suspendendo ? 'Suspendendo...' : 'Suspender'}
                    </Button>
                  ) : (
                    <Button type="button" className="button-primary" onClick={() => onReativarAcademia(academia.id)} disabled={reativando}>
                      {reativando ? 'Reativando...' : 'Reativar'}
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
