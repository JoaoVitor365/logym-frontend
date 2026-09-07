// src/components/Card/Card.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Toast from '../Toast/Toast';
import FavoritoService from '../../services/FavoritoService';
import { useComparison } from '../../contexts/useComparison';
import { getFotoPrincipalUrl } from '../../utils/academyPhoto';

function Card({ academy, onFavoriteChange, categoriasAtivas, distanciaKm }) {
  const [favoritado, setFavoritado] = useState(false);
  const [loadingFavorito, setLoadingFavorito] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    variant: 'success'
  });

  const usuarioLogado = JSON.parse(localStorage.getItem('user'));
  const podeFavoritar = usuarioLogado?.nivelAcesso === 'USER';
  const {
    adicionarAcademia,
    removerAcademia,
    isAcademiaSelecionada,
    podeComparar
  } = useComparison();
  const comparacaoSelecionada = isAcademiaSelecionada(academy?.id);
  const fotoPrincipalUrl = getFotoPrincipalUrl(academy?.fotoPrincipal);

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

  const getDistancia = () => {
    if (distanciaKm === null || distanciaKm === undefined) {
      return null;
    }

    const distancia = Number(distanciaKm);

    if (!Number.isFinite(distancia) || distancia < 0) {
      return null;
    }

    return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(distancia)} km de você`;
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
      setToast({
        open: true,
        message: 'Faça login para favoritar academias.',
        variant: 'warning'
      });
      return;
    }

    if (usuarioLogado.nivelAcesso !== 'USER') {
      setToast({
        open: true,
        message: 'Apenas usuários comuns podem favoritar academias.',
        variant: 'warning'
      });
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
      setToast({
        open: true,
        message: 'Erro ao atualizar favorito.',
        variant: 'error'
      });
    } finally {
      setLoadingFavorito(false);
    }
  };

  const handleToggleComparacao = () => {
    if (comparacaoSelecionada) {
      removerAcademia(academy.id);
      return;
    }

    adicionarAcademia(academy);
  };

  return (
    <div className="card">
      {fotoPrincipalUrl ? (
        <img
          src={fotoPrincipalUrl}
          alt={`Foto da academia ${academy.nome}`}
          className="card-principal-image"
        />
      ) : (
        <div className="card-image-placeholder">
          <span>{academy.nome?.charAt(0)?.toUpperCase() || 'A'}</span>
        </div>
      )}

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

        {getDistancia() && (
          <p className="card-distance">
            {getDistancia()}
          </p>
        )}

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

        <div className="card-actions">
          <Link to={`/academia/${academy.id}`} className="card-details-link">
            <Button className="button-primary button-small">
              Ver Detalhes
            </Button>
          </Link>

          {podeComparar && (
            <button
              type="button"
              className={`card-comparison-button ${comparacaoSelecionada ? 'card-comparison-button-selected' : ''}`}
              onClick={handleToggleComparacao}
            >
              {comparacaoSelecionada ? 'Remover da comparação' : 'Comparar'}
            </button>
          )}
        </div>
      </div>

      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}

export default Card;

