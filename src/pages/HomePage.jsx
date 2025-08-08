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
      name: 'Smart Fit',
      address: 'Av. Vinte e Seis de Março, 701 - Centro',
      city: 'Barueri',
      state: 'SP',
      rating: 4.8,
      imageUrl: '/images/smartFit.jpeg'
    },
    {
      id: '2',
      name: 'Blue Fit',
      address: 'Av. Trindade, - 344 Bethaville I',
      city: 'Barueri',
      state: 'SP',
      rating: 4.9,
      imageUrl: '/images/blueFit.jpeg'
    },
    {
      id: '3',
      name: 'Bio Ritmo',
      address: 'Av. Piracema, 669 - Tamboré',
      city: 'Barueri',
      state: 'SP',
      rating: 4.7,
      imageUrl: '/images/bioRitmo.jpeg'
    },
    {
      id: '4',
      name: 'Gaviões',
      address: 'Av. Juruá, 253 - Alphaville',
      city: 'Barueri',
      state: 'SP',
      rating: 4.6,
      imageUrl: '/images/gavioes.jpeg'
    }
  ];

  return (
    <div className="home-page">
      <h1>LOGYM - Encontre sua Academia!</h1>
      <p>
        Descubra as melhores academias perto de você.
        Use a barra de busca para encontrar por nome, local ou especialidade.
      </p>

      <form onSubmit={handleSearch} className="search-section">
        <Input
          type="text"
          id="search"
          name="search"
          placeholder="Ex: Academia Fitness, Musculação, São Paulo"
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