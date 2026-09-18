// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Card from '../../components/Card/Card';
import FavoritoService from '../../services/FavoritoService';

function FavoritesPage() {
  const [academiasFavoritas, setAcademiasFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    const carregarFavoritos = async () => {
      setLoading(true);
      setApiMessage('');
      const usuarioLogado = JSON.parse(localStorage.getItem('user'));

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
    <div className="favorites-page">
      <Link to="/" className="back-button">← Voltar para Home</Link>

      <header className="favorites-header">
        <span className="favorites-eyebrow">Minha seleção</span>
        <h1>Minhas academias favoritas</h1>
        <p>Acompanhe as academias que você salvou para consultar depois.</p>

        {!loading && !apiMessage && academiasFavoritas.length > 0 && (
          <span className="favorites-count">
            ★ {academiasFavoritas.length} {academiasFavoritas.length === 1 ? 'academia salva' : 'academias salvas'}
          </span>
        )}
      </header>

      {loading ? (
        <div className="favorites-feedback-card" role="status">
          <h2>Carregando favoritos...</h2>
        </div>
      ) : apiMessage ? (
        <div className="favorites-feedback-card">
          <h2>{apiMessage}</h2>
        </div>
      ) : academiasFavoritas.length === 0 ? (
        <div className="favorites-empty-state">
          <span aria-hidden="true">★</span>
          <h2>Sua lista de favoritos está vazia</h2>
          <p>Salve as academias que mais chamarem sua atenção para encontrá-las rapidamente depois.</p>

          <Link to="/" className="favorites-explore-link">
            Explorar academias
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {academiasFavoritas.map((academia) => (
            <Card
              key={academia.id}
              academy={academia}
              onFavoriteChange={handleFavoriteChange}
              variant="favorite-card"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
