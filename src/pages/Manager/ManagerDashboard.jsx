import React, { useMemo } from 'react';
import Button from '../../components/Button/Button';

function ManagerDashboard({
  academias,
  academiasCarregadas,
  onCadastrarAcademia,
  onVerAcademias,
  onGerenciarAcademia
}) {
  const totais = useMemo(() => {
    const listaAcademias = Array.isArray(academias) ? academias : [];

    return {
      total: listaAcademias.length,
      ativas: listaAcademias.filter((academia) => academia.statusAcademia === 'ATIVO').length,
      inativas: listaAcademias.filter((academia) => academia.statusAcademia === 'INATIVO').length,
      suspensas: listaAcademias.filter((academia) => academia.statusAcademia === 'SUSPENSA').length,
      academiasAtencao: listaAcademias
        .filter((academia) => academia.statusAcademia === 'INATIVO' || academia.statusAcademia === 'SUSPENSA')
        .slice(0, 5)
    };
  }, [academias]);

  if (!academiasCarregadas) {
    return null;
  }

  const cards = [
    { label: 'Total', value: totais.total, detalhe: 'Academias cadastradas' },
    { label: 'Ativas', value: totais.ativas, detalhe: 'Em operação', classe: 'manager-dashboard-card--active' },
    { label: 'Inativas', value: totais.inativas, detalhe: 'Academias inativas', classe: 'manager-dashboard-card--inactive' },
    { label: 'Suspensas', value: totais.suspensas, detalhe: 'Academias suspensas', classe: 'manager-dashboard-card--suspended' }
  ];
  const resumoStatus = [
    { label: 'Ativas', quantidade: totais.ativas, classe: 'manager-dashboard-progress--active' },
    { label: 'Inativas', quantidade: totais.inativas, classe: 'manager-dashboard-progress--inactive' },
    { label: 'Suspensas', quantidade: totais.suspensas, classe: 'manager-dashboard-progress--suspended' }
  ];
  const calcularPercentual = (quantidade) => (
    totais.total === 0 ? 0 : Math.round((quantidade / totais.total) * 100)
  );

  return (
    <section className="manager-dashboard manager-section-shell">
      <header className="manager-dashboard__header">
        <span className="manager-eyebrow">Painel do gerente</span>
        <h1 className="manager-dashboard__title">Dashboard</h1>
        <p className="manager-dashboard__description">
          Acompanhe o resumo das suas academias cadastradas.
        </p>
      </header>

      <section className="manager-dashboard-box">
        <div className="manager-dashboard-box__header">
          <span className="manager-eyebrow">Visão geral</span>
          <h2>Visão geral</h2>
        </div>

        <div className="manager-dashboard-box__body">

      <div className="manager-dashboard__cards">
        {cards.map((card) => (
          <div key={card.label} className={`manager-dashboard-card ${card.classe || ''}`}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.detalhe}</small>
          </div>
        ))}
      </div>

      <section className="manager-dashboard-section">
        <span className="manager-eyebrow">Distribuição</span>
        <h2>Resumo das suas academias</h2>

        <div className="manager-dashboard-progress-list">
          {resumoStatus.map((item) => {
            const percentual = calcularPercentual(item.quantidade);

            return (
              <div key={item.label} className="manager-dashboard-progress-item">
                <div className="manager-dashboard-progress-item__header">
                  <strong>{item.label}</strong>
                  <span>{item.quantidade} academia(s)</span>
                  <span>{percentual}%</span>
                </div>

                <div
                  className="manager-dashboard-progress-track"
                  role="progressbar"
                  aria-label={`Academias ${item.label.toLowerCase()}`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={percentual}
                >
                  <span
                    className={`manager-dashboard-progress-fill ${item.classe}`}
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="manager-dashboard-section">
        <span className="manager-eyebrow">Atalhos</span>
        <h2>Ações rápidas</h2>

        <div className="manager-dashboard-actions">
          <div className="manager-dashboard-action-card">
            <h3>Cadastrar nova academia</h3>
            <p>Adicione uma nova unidade à sua conta.</p>
            <Button className="manager-dashboard-action-button" onClick={onCadastrarAcademia}>
              + Cadastrar nova academia
            </Button>
          </div>

          <div className="manager-dashboard-action-card">
            <h3>Ver minhas academias</h3>
            <p>Gerencie e edite suas unidades cadastradas.</p>
            <Button className="manager-dashboard-action-button" onClick={onVerAcademias}>
              Ver minhas academias
            </Button>
          </div>
        </div>
      </section>

      <section className="manager-dashboard-section manager-dashboard-section--last">
        <span className="manager-eyebrow">Atenção</span>
        <h2>Academias que precisam de atenção</h2>

        {totais.academiasAtencao.length === 0 ? (
          <p className="manager-dashboard-positive-message">
            Todas as suas academias estão ativas no momento.
          </p>
        ) : (
          <>
            <div className="manager-dashboard-attention-list">
              {totais.academiasAtencao.map((academia) => {
                const localizacao = [academia.cidade, academia.estado].filter(Boolean).join(' - ');

                return (
                  <div key={academia.id} className="manager-dashboard-attention-item">
                    <div>
                      <strong>{academia.nome}</strong>
                      {localizacao && <span>{localizacao}</span>}
                    </div>

                    <div className="manager-dashboard-attention-item__actions">
                      <span className={`manager-status-badge ${academia.statusAcademia === 'SUSPENSA' ? 'manager-status-suspended' : 'manager-status-inactive'}`}>
                        {academia.statusAcademia}
                      </span>
                      <Button className="manager-dashboard-manage-button" onClick={() => onGerenciarAcademia(academia.id)}>
                        Gerenciar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {(totais.inativas + totais.suspensas) > totais.academiasAtencao.length && (
              <Button className="manager-dashboard-view-all-button" onClick={onVerAcademias}>
                Ver todas em Minhas Academias
              </Button>
            )}
          </>
        )}
      </section>
        </div>
      </section>
    </section>
  );
}

export default ManagerDashboard;
