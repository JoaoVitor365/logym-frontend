// src/components/Academy/AcademyReviews.jsx
import React from 'react';
import PropTypes from 'prop-types'; // Boa prática para definir os tipos das props

function AcademyReviews({ reviews }) {
    // Se não houver avaliações, não renderiza nada
    if (!reviews || reviews.length === 0) {
        return (
            <div className="academy-details-section academy-details-reviews">
                <p>Esta academia ainda não possui avaliações.</p>
            </div>
        );
    }

    return (
        <div className="academy-details-section academy-details-reviews">
            <h2>Avaliações ({reviews.length})</h2>
            
            {reviews.map(review => (
                <div key={review.id} className="review">
                    <p>
                        {/* Autor e Avaliação em uma linha */}
                        <span className="review-author"><strong>{review.author}</strong></span>
                        <span className="review-rating" style={{ marginLeft: '10px' }}>
                            {'⭐'.repeat(review.rating)}
                        </span>
                    </p>
                    <p>{review.comment}</p>
                </div>
            ))}
            
            {/* Futuramente, você adicionaria aqui o formulário de envio de nova avaliação */}
            
        </div>
    );
}

// Define os tipos esperados das props
AcademyReviews.propTypes = {
    reviews: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
            rating: PropTypes.number.isRequired,
            comment: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default AcademyReviews;