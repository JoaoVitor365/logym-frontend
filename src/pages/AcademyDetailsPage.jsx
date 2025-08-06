// src/pages/AcademyDetailsPage.jsx - Página de detalhes da academia com dados do backend
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { academyAPI } from '../services/api';

function AcademyDetailsPage() {
  const { id } = useParams(); // Pega o ID da academia da URL
  const [academy, setAcademy] = useState(null); // Estado para armazenar os detalhes da academia
  const [loading, setLoading] = useState(true); // Estado para carregamento
  const [error, setError] = useState(''); // Estado para erros

  // Carregar dados da academia do backend
  useEffect(() => {
    const loadAcademy = async () => {
      try {
        setLoading(true);
        const response = await academyAPI.getById(id);
        
        if (response.success) {
          setAcademy(response.data);
        } else {
          setError('Academia não encontrada');
        }
      } catch (error) {
        console.error('Erro ao carregar academia:', error);
        setError('Erro ao carregar detalhes da academia');
      } finally {
        setLoading(false);
      }
    };

    loadAcademy();
  }, [id]); // Dependência no ID para recarregar se o ID da URL mudar

  if (loading) {
    return (
      <div className="academy-details-page" style={{textAlign: 'center', padding: 'var(--spacing-xxl)'}}>
        <p>Carregando detalhes da academia...</p>
      </div>
    );
  }

  if (error || !academy) {
    return (
      <div className="academy-details-page" style={{textAlign: 'center', padding: 'var(--spacing-xxl)'}}>
        <p>{error || 'Academia não encontrada.'}</p>
        <Link to="/" className="back-button">Voltar para a Busca</Link>
      </div>
    );
  }

  return (
    <div className="academy-details-page">
      <Link to="/" className="back-button">← Voltar para a Busca</Link>

      <div className="academy-details-header">
        <h1>{academy.name}</h1>
        <p>{academy.address}, {academy.city} - {academy.state}</p>
        {academy.rating && <p>Avaliação: {academy.rating} ⭐</p>}
      </div>

      <div className="academy-details-section">
        <h2>Sobre a Academia</h2>
        <p>{academy.description || 'Descrição não disponível.'}</p>
      </div>

      {academy.image_url && (
        <div className="academy-details-section">
          <h2>Foto da Academia</h2>
          <div className="academy-details-gallery">
            <img src={academy.image_url} alt={academy.name} />
          </div>
        </div>
      )}

      <div className="academy-details-section academy-details-info">
        <h2>Informações de Contato</h2>
        <ul>
          {academy.phone && <li><strong>Telefone:</strong> {academy.phone}</li>}
          {academy.email && <li><strong>E-mail:</strong> <a href={`mailto:${academy.email}`}>{academy.email}</a></li>}
          <li><strong>Endereço:</strong> {academy.address}, {academy.city} - {academy.state}</li>
        </ul>
      </div>

      {/* Avaliações serão implementadas em versão futura */}
    </div>
  );
}

export default AcademyDetailsPage;