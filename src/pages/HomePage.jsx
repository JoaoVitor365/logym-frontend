// src/pages/HomePage.jsx - Página inicial com busca de academias do backend
import React, { useState, useEffect } from 'react';
import { academyAPI } from '../services/api';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import Card from '../components/Card/Card';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar academias ao montar o componente
  useEffect(() => {
    loadAcademies();
  }, []);

  // Função para carregar todas as academias
  const loadAcademies = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.getAll();
      
      if (response.success) {
        setAcademies(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar academias:', error);
      setError('Erro ao carregar academias');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar academias
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      loadAcademies();
      return;
    }

    try {
      setLoading(true);
      const response = await academyAPI.search(searchTerm);
      
      if (response.success) {
        setAcademies(response.data);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setError('Erro ao buscar academias');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Mostrar erro se houver */}
      {error && <p className="error-message">{error}</p>}
      
      {/* Mostrar loading */}
      {loading && <p>Carregando academias...</p>}
      
      {/* Grade de academias */}
      <div className="academies-grid">
        {!loading && academies.length === 0 && (
          <p>Nenhuma academia encontrada.</p>
        )}
        
        {academies.map(academy => (
          <Card 
            key={academy.id} 
            academy={{
              ...academy,
              imageUrl: academy.image_url // Mapear campo do banco para o componente
            }} 
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;