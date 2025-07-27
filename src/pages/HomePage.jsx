// src/pages/HomePage.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import Card from '../components/Card/Card'; // <-- Importe o componente Card

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando academias por:', searchTerm);
    alert(`Buscando academias por: "${searchTerm}"`);
  };

  // Dados de academias de exemplo (substitua por dados reais da API depois)
  const sampleAcademies = [
    {
      id: '1',
      name: 'Academia Fitness Total',
      address: 'Rua da Malhação, 100',
      city: 'São Paulo',
      state: 'SP',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-f02b93f780b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: '2',
      name: 'CrossFit Extreme',
      address: 'Av. Esportiva, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1534438747731-a8315124b8d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: '3',
      name: 'Yoga Zen Studio',
      address: 'Praça da Paz, 789',
      city: 'Belo Horizonte',
      state: 'MG',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1544367327-c104e7600860?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: '4',
      name: 'Academia Power Up',
      address: 'Rua Força, 321',
      city: 'Curitiba',
      state: 'PR',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1594914101186-b08ea0e84b7a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];

  return (
    <div className="home-page">
      <h1>LoGYM - Encontre sua Academia!</h1>
      <p>
        Descubra as melhores academias perto de você.
        Use a barra de busca para encontrar por nome, local ou especialidade.
      </p>

      <form onSubmit={handleSearch} className="search-section">
        <Input
          type="text"
          id="search"
          name="search"
          placeholder="Ex: Academia Fitness, Natação, São Paulo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Button type="submit" className="button-primary">
          Buscar
        </Button>
      </form>

      <div className="academies-grid"> {/* Nova div para a grade de academias */}
        {sampleAcademies.map(academy => (
          <Card key={academy.id} academy={academy} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;