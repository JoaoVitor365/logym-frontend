// src/pages/Admin/AdminDashboard.jsx
import React from 'react';

function AdminDashboard({ totais, onMudarSecao }) {
  return (
    <>
      <section className="admin-section">
        <h2 className="admin-section__title">Resumo do sistema</h2>

        <p className="admin-section__description">
          Acompanhe os principais dados administrativos do LOGYM separados por área.
        </p>

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
        <h2 className="admin-section__title">Ações rápidas</h2>

        <div className="admin-quick-actions">
          <button type="button" className="admin-quick-action" onClick={() => onMudarSecao('usuarios')}>
            Gerenciar usuários
          </button>

          <button type="button" className="admin-quick-action" onClick={() => onMudarSecao('gerentes')}>
            Ver gerentes
          </button>

          <button type="button" className="admin-quick-action" onClick={() => onMudarSecao('academias')}>
            Gerenciar academias
          </button>

          <button type="button" className="admin-quick-action" onClick={() => onMudarSecao('avaliacoes')}>
            Gerenciar avaliações
          </button>
        </div>
      </section>
    </>
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
