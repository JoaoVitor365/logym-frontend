// src/components/Card/Card.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import FavoritoService from '../../services/FavoritoService';

function Card({ academy, onFavoriteChange, categoriasAtivas }) {
  const [favoritado, setFavoritado] = useState(false);
  const [loadingFavorito, setLoadingFavorito] = useState(false);

  const usuarioLogado = JSON.parse(localStorage.getItem('user'));
  const podeFavoritar = usuarioLogado?.nivelAcesso === 'USER';

  useEffect(() => {
    const verificarFavorito = async () => {
      if (!podeFavoritar || !academy?.id) {
        setFavoritado(false);
        return;
      }

      try {
        const response = await FavoritoService.isFavorito(usuarioLogado.id, academy.id);
        setFavoritado(response.data.favoritado);
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        setFavoritado(false);
      }
    };

    verificarFavorito();
  }, [academy?.id, podeFavoritar, usuarioLogado?.id]);

  const montarEndereco = () => {
    const linha1 = [
      academy.endereco,
      academy.numero ? `nº ${academy.numero}` : null
    ].filter(Boolean).join(', ');

    const linha2 = [
      academy.bairro,
      academy.cidade,
      academy.estado
    ].filter(Boolean).join(' - ');

    if (linha1 && linha2) {
      return `${linha1}, ${linha2}`;
    }

    return linha1 || linha2 || 'Endereço não informado';
  };

  const getNota = () => {
    if (academy.nota === null || academy.nota === undefined) {
      return null;
    }

    return Number(academy.nota).toFixed(1);
  };

  const getCategoriasExibidas = () => {
    const categoriaIds = Array.isArray(academy.categoriaIds)
      ? academy.categoriaIds.map((categoriaId) => Number(categoriaId)).filter(Number.isFinite)
      : [];

    if (categoriaIds.length > 0 && Array.isArray(categoriasAtivas)) {
      return categoriasAtivas
        .filter((categoria) => categoriaIds.includes(Number(categoria.id)))
        .map((categoria) => categoria.nome)
        .filter(Boolean)
        .join(', ');
    }

    return academy.categorias || '';
  };

  const categoriasExibidas = getCategoriasExibidas();

  const handleToggleFavorito = async () => {
    if (!usuarioLogado) {
      alert('Faça login para favoritar academias.');
      return;
    }

    if (usuarioLogado.nivelAcesso !== 'USER') {
      alert('Apenas usuários comuns podem favoritar academias.');
      return;
    }

    setLoadingFavorito(true);

    try {
      const response = await FavoritoService.toggle(usuarioLogado.id, academy.id);
      const novoStatus = response.data.favoritado;

      setFavoritado(novoStatus);

      if (onFavoriteChange) {
        onFavoriteChange(academy.id, novoStatus);
      }
    } catch (error) {
      console.error('Erro ao favoritar academia:', error);
      alert('Erro ao atualizar favorito.');
    } finally {
      setLoadingFavorito(false);
    }
  };

  return (
    <div className="card">
      <div className="card-image-placeholder">
        <span>{academy.nome?.charAt(0)?.toUpperCase() || 'A'}</span>
      </div>

      <div className="card-content">
        <div className="card-title-row">
          <h3 className="card-title">{academy.nome}</h3>

          {podeFavoritar && (
            <button
              type="button"
              className={`favorite-button ${favoritado ? 'active' : ''}`}
              onClick={handleToggleFavorito}
              disabled={loadingFavorito}
              title={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              {favoritado ? '★' : '☆'}
            </button>
          )}
        </div>

        <p className="card-address">
          {montarEndereco()}
        </p>

        <p className="card-rating">
          {getNota() ? (
            <>Avaliação: {getNota()} ⭐</>
          ) : (
            <>Sem avaliações</>
          )}
        </p>

        {categoriasExibidas && (
          <p className="card-categories">
            {categoriasExibidas}
          </p>
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

