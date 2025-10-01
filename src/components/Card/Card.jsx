// src/components/Card/Card.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para linkar para os detalhes da academia
import Button from '../Button/Button'; // Para o botão "Ver Detalhes"

function Card({ academy }) {
  // academy é um objeto com informações da academia, exemplo:
  // {
  //   id: '1',
  //   name: 'Academia Fitness Pro',
  //   address: 'Rua das Flores, 123 - Centro',
  //   city: 'São Paulo',
  //   state: 'SP',
  //   rating: 4.5,
  //   imageUrl: 'https://via.placeholder.com/300x200?text=Academia'
  // }

  return (
    <div className="card">
      <img src={academy.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem'} alt={academy.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{academy.name}</h3>
        <p className="card-address">{academy.address}, {academy.city} - {academy.state}</p>
        {academy.rating && (
          <p className="card-rating">Avaliação: {academy.rating} ⭐</p>
        )}
        <Link to={`/academia/${academy.id}`} className="card-details-link">
          <Button className="button-primary button-small">
            Ver Detalhes
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Card;