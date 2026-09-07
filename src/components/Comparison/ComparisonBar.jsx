import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../../contexts/useComparison';

function ComparisonBar() {
  const navigate = useNavigate();
  const {
    academiasSelecionadas,
    podeComparar,
    removerAcademia,
    limparComparacao
  } = useComparison();

  if (!podeComparar || academiasSelecionadas.length === 0) {
    return null;
  }

  const podeAbrirComparacao = academiasSelecionadas.length >= 2;

  return (
    <>
      <div className="comparison-bar-spacer" aria-hidden="true" />
      <aside className="comparison-bar" aria-label="Academias selecionadas para comparação">
        <div className="comparison-bar-content">
          <div className="comparison-bar-selection">
            <strong>Comparação ({academiasSelecionadas.length}/3)</strong>
            <div className="comparison-bar-items">
              {academiasSelecionadas.map((academia) => (
                <span className="comparison-bar-item" key={academia.id}>
                  {academia.nome}
                  <button
                    type="button"
                    onClick={() => removerAcademia(academia.id)}
                    aria-label={`Remover ${academia.nome} da comparação`}
                    title="Remover da comparação"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="comparison-bar-actions">
            <button type="button" className="comparison-bar-clear" onClick={limparComparacao}>
              Limpar
            </button>
            <button
              type="button"
              className="comparison-bar-submit"
              onClick={() => navigate('/comparar-academias')}
              disabled={!podeAbrirComparacao}
            >
              Comparar agora
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default ComparisonBar;
