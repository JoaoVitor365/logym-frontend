// src/pages/Admin/AdminDashboard.jsx
import React from 'react';

function AdminDashboard({ totais, onMudarSecao }) {
  return (
    <>
      <section className="admin-dashboard-highlights" aria-label="Principais indicadores">
        <DestaqueCard titulo="Usuários" numero={totais.usuarios} detalhe={`${totais.usuariosAtivos} ativos`} />
        <DestaqueCard titulo="Academias" numero={totais.academias} detalhe={`${totais.academiasAtivas} ativas`} />
        <DestaqueCard titulo="Avaliações" numero={totais.avaliacoes} detalhe={`${totais.avaliacoesAtivas} ativas`} />
        <DestaqueCard titulo="Gerentes" numero={totais.gerentes} detalhe={`${totais.gerentes} completos`} />
      </section>

      <section className="admin-section admin-dashboard-details">
        <div className="admin-section__heading">
          <div>
            <span className="admin-section__eyebrow">Visão detalhada</span>
            <h2 className="admin-section__title">Resumo do sistema</h2>
          </div>
          <p className="admin-section__description">Acompanhe os principais dados administrativos do LOGYM separados por área.</p>
        </div>

        <div className="admin-dashboard-groups">
          <ResumoGrupo
            titulo="Usuários"
            descricao="Resumo das contas cadastradas no sistema."
            cards={[
              { numero: totais.usuarios, texto: 'Total de usuários' },
              { numero: totais.usuariosAtivos, texto: 'Usuários ativos' },
              { numero: totais.usuariosInativos, texto: 'Usuários inativos' },
              { numero: totais.usuariosSuspensos, texto: 'Usuários suspensos' }
            ]}
          />

          <ResumoGrupo
            titulo="Academias"
            descricao="Situação das academias cadastradas na plataforma."
            cards={[
              { numero: totais.academias, texto: 'Total de academias' },
              { numero: totais.academiasAtivas, texto: 'Academias ativas' },
              { numero: totais.academiasInativas, texto: 'Academias inativas' },
              { numero: totais.academiasSuspensas, texto: 'Academias suspensas' }
            ]}
          />

          <ResumoGrupo
            titulo="Avaliações"
            descricao="Controle das avaliações feitas pelos usuários."
            cards={[
              { numero: totais.avaliacoes, texto: 'Total de avaliações' },
              { numero: totais.avaliacoesAtivas, texto: 'Avaliações ativas' },
              { numero: totais.avaliacoesInativas, texto: 'Avaliações inativas' },
              { numero: totais.avaliacoesSuspensas, texto: 'Avaliações suspensas' }
            ]}
          />

          <ResumoGrupo
            titulo="Administração"
            descricao="Contas administrativas e gerenciais do sistema."
            cards={[
              { numero: totais.admins, texto: 'Administradores' },
              { numero: totais.managers, texto: 'Contas gerente' },
              { numero: totais.gerentes, texto: 'Gerentes completos' },
              { numero: totais.users, texto: 'Usuários comuns' }
            ]}
          />
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section__heading">
          <div>
            <span className="admin-section__eyebrow">Atalhos</span>
            <h2 className="admin-section__title">Ações rápidas</h2>
          </div>
        </div>

        <div className="admin-quick-actions">
          <button type="button" className="admin-quick-action" onClick={() => onMudarSecao('usuarios')}>
            <span>Gerenciar usuários</span><span aria-hidden="true">→</span>
          </button>

          <button type="button" className="admin-quick-action" onClick={() => onMudarSecao('gerentes')}>
            <span>Ver gerentes</span><span aria-hidden="true">→</span>
          </button>

          <button type="button" className="admin-quick-action" onClick={() => onMudarSecao('academias')}>
            <span>Gerenciar academias</span><span aria-hidden="true">→</span>
          </button>

          <button type="button" className="admin-quick-action" onClick={() => onMudarSecao('avaliacoes')}>
            <span>Gerenciar avaliações</span><span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </>
  );
}

function DestaqueCard({ titulo, numero, detalhe }) {
  return (
    <div className="admin-highlight-card">
      <span>{titulo}</span>
      <strong>{numero}</strong>
      <small>{detalhe}</small>
    </div>
  );
}

function ResumoGrupo({ titulo, descricao, cards }) {
  return (
    <div className="admin-dashboard-group">
      <div className="admin-dashboard-group__header">
        <h3 className="admin-dashboard-group__title">{titulo}</h3>
        <p className="admin-dashboard-group__description">{descricao}</p>
      </div>

      <div className="admin-dashboard-group__cards">
        {cards.map((card) => (
          <ResumoCard
            key={`${titulo}-${card.texto}`}
            numero={card.numero}
            texto={card.texto}
          />
        ))}
      </div>
    </div>
  );
}

function ResumoCard({ numero, texto }) {
  return (
    <div className="admin-summary-card">
      <strong>{numero}</strong>
      <span>{texto}</span>
    </div>
  );
}

export default AdminDashboard;
