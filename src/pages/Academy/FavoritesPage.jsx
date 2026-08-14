// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Card from '../../components/Card/Card';
import FavoritoService from '../../services/FavoritoService';

function FavoritesPage() {
  const [academiasFavoritas, setAcademiasFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');

  const usuarioLogado = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const carregarFavoritos = async () => {
      setLoading(true);
      setApiMessage('');

      if (!usuarioLogado) {
        setApiMessage('Faça login para ver suas academias favoritas.');
        setLoading(false);
        return;
      }

      if (usuarioLogado.nivelAcesso !== 'USER') {
        setApiMessage('Apenas usuários comuns possuem lista de favoritos.');
        setLoading(false);
        return;
      }

      try {
        const response = await FavoritoService.findByUsuarioId(usuarioLogado.id);
        setAcademiasFavoritas(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        setApiMessage('Erro ao carregar academias favoritas.');
        setAcademiasFavoritas([]);
      } finally {
        setLoading(false);
      }
    };

    carregarFavoritos();
  }, []);

  const handleFavoriteChange = (academiaId, favoritado) => {
    if (!favoritado) {
      setAcademiasFavoritas((prev) =>
        prev.filter((academia) => academia.id !== academiaId)
      );
    }
  };

  return (
    <div className="home-page">
      <Link to="/" className="back-button">← Voltar para Home</Link>

      <h1>Minhas Academias Favoritas</h1>

      <p>
        Veja aqui as academias que você marcou como favoritas.
      </p>

      {loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
            padding: '30px',
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            borderRadius: '8px'
          }}
        >
          <h2>Carregando favoritos...</h2>
        </div>
      ) : apiMessage ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
            padding: '30px',
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            borderRadius: '8px'
          }}
        >
          <h2>{apiMessage}</h2>
        </div>
      ) : academiasFavoritas.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
            padding: '30px',
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            borderRadius: '8px'
          }}
        >
          <h2>Nenhuma academia favoritada ainda.</h2>
          <p>Volte para a Home e clique na estrela das academias que você gostar.</p>

          <Link to="/" className="link">
            Ver academias
          </Link>
        </div>
      ) : (
        <div className="academies-grid">
          {academiasFavoritas.map((academia) => (
            <Card
              key={academia.id}
              academy={academia}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;