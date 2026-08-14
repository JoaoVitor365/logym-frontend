// src/components/Academy/AcademyReviews.jsx
import React from 'react';

function AcademyReviews({ reviews, currentUser, onRemoveReview, onEditReview }) {
  const formatarData = (data) => {
    if (!data) return '';

    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarNota = (nota) => Number(nota || 0).toFixed(1);

  const renderEstrelas = (nota) => {
    const valor = Math.round(Number(nota || 0));
    return '★'.repeat(valor) + '☆'.repeat(Math.max(0, 5 - valor));
  };

  const avaliacoesAtivas = Array.isArray(reviews)
    ? reviews.filter((review) => review.statusAvaliacao === 'ATIVO' || !review.statusAvaliacao)
    : [];

  const avaliacoesSuspensasDoUsuario = Array.isArray(reviews)
    ? reviews.filter((review) => (
      review.statusAvaliacao === 'SUSPENSA' &&
      currentUser?.id &&
      Number(currentUser.id) === Number(review.usuarioId)
    ))
    : [];

  const avaliacoesVisiveis = [
    ...avaliacoesSuspensasDoUsuario,
    ...avaliacoesAtivas
  ];

  if (!avaliacoesVisiveis || avaliacoesVisiveis.length === 0) {
    return (
      <div className="academy-details-section academy-details-reviews">
        <h2>Avaliações</h2>
        <p>Esta academia ainda não possui avaliações.</p>
      </div>
    );
  }

  return (
    <div className="academy-details-section academy-details-reviews">
      <h2>Avaliações ({avaliacoesAtivas.length})</h2>

      {avaliacoesVisiveis.map((review) => {
        const avaliacaoDoUsuarioLogado =
          currentUser?.id && Number(currentUser.id) === Number(review.usuarioId);

        const suspensa = review.statusAvaliacao === 'SUSPENSA';
        const itens = Array.isArray(review.itens) ? review.itens : [];

        return (
          <div key={review.id} className="review">
            <p>
              <span className="review-author">
                <strong>{review.usuarioNome}</strong>
              </span>

              {!suspensa && (
                <span className="review-rating">
                  {renderEstrelas(review.nota)} ({formatarNota(review.nota)})
                </span>
              )}
            </p>

            {review.dataCadastro && (
              <p className="review-date">
                Avaliado em {formatarData(review.dataCadastro)}
              </p>
            )}

            {suspensa ? (
              <div className="review-suspended-warning">
                Sua avaliação foi suspensa pela administração. Ela não aparece para outros usuários e não conta na média da academia.
              </div>
            ) : (
              <div className="review-items-list">
                {itens.length === 0 ? (
                  <p>Detalhes dos critérios não disponíveis.</p>
                ) : (
                  itens.map((item) => (
                    <div key={item.itemId} className="review-item-row">
                      <span>{item.itemNome}</span>
                      <strong className="review-item-stars">
                        {renderEstrelas(item.nota)} <span>({formatarNota(item.nota)})</span>
                      </strong>
                    </div>
                  ))
                )}
              </div>
            )}

            {avaliacaoDoUsuarioLogado && !suspensa && (
              <div className="review-actions">
                <button
                  type="button"
                  className="edit-review-button"
                  onClick={() => onEditReview(review)}
                >
                  Editar avaliação
                </button>

                <button
                  type="button"
                  className="remove-review-button"
                  onClick={() => onRemoveReview(review.id)}
                >
                  Remover avaliação
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AcademyReviews;
