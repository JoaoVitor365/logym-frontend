// src/pages/AcademyDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Importe useParams e Link
// Importe outros componentes se necessário, como um componente de mapa futuro

function AcademyDetailsPage() {
  const { id } = useParams(); // Pega o ID da academia da URL
  const [academy, setAcademy] = useState(null); // Estado para armazenar os detalhes da academia
  const [loading, setLoading] = useState(true); // Estado para simular carregamento

  // Dados de academias de exemplo (mantenha em sync com os da HomePage)
  const sampleAcademies = [
    {
      id: '1',
      name: 'Academia Fitness Total',
      address: 'Rua da Malhação, 100',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      phone: '(11) 98765-4321',
      email: 'contato@fitnesstotal.com',
      description: 'A Academia Fitness Total oferece equipamentos de última geração, aulas variadas como spinning, zumba e musculação personalizada. Nossos instrutores são altamente qualificados para te ajudar a atingir seus objetivos.',
      rating: 4.8,
      facilities: ['Musculação', 'Aulas Coletivas', 'Personal Trainer', 'Estacionamento'],
      gallery: [
        'https://images.unsplash.com/photo-1571019613454-f02b93f780b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1599058917212-dbf8682a987a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1526506118085-60db85eaa5e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      reviews: [
        { id: 'r1', author: 'Ana Silva', rating: 5, comment: 'Melhor academia da região! Equipamentos novos e aulas excelentes.' },
        { id: 'r2', author: 'Carlos Mendes', rating: 4, comment: 'Bom atendimento, mas poderia ter mais opções de horários.' }
      ]
    },
    {
      id: '2',
      name: 'CrossFit Extreme',
      address: 'Av. Esportiva, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20000-000',
      phone: '(21) 91234-5678',
      email: 'contato@crossfitextreme.com',
      description: 'Box de CrossFit com coaches certificados e uma comunidade engajada. Treinos de alta intensidade para todos os níveis.',
      rating: 4.9,
      facilities: ['CrossFit', 'Personal Trainer', 'Vestiários'],
      gallery: [
        'https://images.unsplash.com/photo-1534438747731-a8315124b8d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1534438870341-2a6234e405d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      reviews: [
        { id: 'r3', author: 'Fernanda Lima', rating: 5, comment: 'Melhor box de CrossFit que já frequentei! Coaches atenciosos.' }
      ]
    },
    {
      id: '3',
      name: 'Yoga Zen Studio',
      address: 'Praça da Paz, 789',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30000-000',
      phone: '(31) 99876-5432',
      email: 'contato@yogazen.com',
      description: 'Espaço dedicado à prática de Yoga e Meditação. Aulas para iniciantes e avançados em um ambiente tranquilo e acolhedor.',
      rating: 4.7,
      facilities: ['Yoga', 'Meditação', 'Aulas Online'],
      gallery: [
        'https://images.unsplash.com/photo-1544367327-c104e7600860?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1552519500-ee228941785f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      reviews: []
    },
    {
      id: '4',
      name: 'Academia Power Up',
      address: 'Rua Força, 321',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '80000-000',
      phone: '(41) 91234-5678',
      email: 'contato@powerup.com',
      description: 'Treinamento funcional e musculação com foco em resultados. Contamos com os melhores equipamentos e professores.',
      rating: 4.6,
      facilities: ['Treinamento Funcional', 'Musculação', 'Nutricionista'],
      gallery: [
        'https://images.unsplash.com/photo-1594914101186-b08ea0e84b7a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      reviews: [
        { id: 'r4', author: 'Pedro Costa', rating: 4, comment: 'Boa estrutura, mas o estacionamento é pequeno.' }
      ]
    },
{
      id: '4',
      name: 'Academia Power Up',
      address: 'Rua Força, 321',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '80000-000',
      phone: '(41) 91234-5678',
      email: 'contato@powerup.com',
      description: 'Treinamento funcional e musculação com foco em resultados. Contamos com os melhores equipamentos e professores.',
      rating: 4.6,
      facilities: ['Treinamento Funcional', 'Musculação', 'Nutricionista'],
      gallery: [
        'https://images.unsplash.com/photo-1594914101186-b08ea0e84b7a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      reviews: [
        { id: 'r4', author: 'Pedro Costa', rating: 4, comment: 'Boa estrutura, mas o estacionamento é pequeno.' }
      ]
    }
  ];

  // Simula o carregamento de dados da API
  useEffect(() => {
    setLoading(true);
    const foundAcademy = sampleAcademies.find(ac => ac.id === id);
    setTimeout(() => { // Simula um atraso de rede
      setAcademy(foundAcademy);
      setLoading(false);
    }, 500);
  }, [id]); // Dependência no ID para recarregar se o ID da URL mudar

  if (loading) {
    return (
      <div className="academy-details-page" style={{textAlign: 'center', padding: 'var(--spacing-xxl)'}}>
        <p>Carregando detalhes da academia...</p>
      </div>
    );
  }

  if (!academy) {
    return (
      <div className="academy-details-page" style={{textAlign: 'center', padding: 'var(--spacing-xxl)'}}>
        <p>Academia não encontrada.</p>
        <Link to="/" className="back-button">Voltar para a Busca</Link>
      </div>
    );
  }

  return (
    <div className="academy-details-page">
      <Link to="/" className="back-button">← Voltar para a Busca</Link> {/* Botão de voltar */}

      <div className="academy-details-header">
        <h1>{academy.name}</h1>
        <p>{academy.address}, {academy.city} - {academy.state}</p>
        {academy.rating && <p>Avaliação: {academy.rating} ⭐</p>}
      </div>

      <div className="academy-details-section">
        <h2>Sobre a Academia</h2>
        <p>{academy.description}</p>
      </div>

      {academy.gallery && academy.gallery.length > 0 && (
        <div className="academy-details-section">
          <h2>Galeria de Fotos</h2>
          <div className="academy-details-gallery">
            {academy.gallery.map((img, index) => (
              <img key={index} src={img} alt={`Foto ${index + 1} de ${academy.name}`} />
            ))}
          </div>
        </div>
      )}

      <div className="academy-details-section academy-details-info">
        <h2>Informações de Contato</h2>
        <ul>
          <li><strong>Telefone:</strong> {academy.phone}</li>
          <li><strong>E-mail:</strong> <a href={`mailto:${academy.email}`}>{academy.email}</a></li>
          <li><strong>CEP:</strong> {academy.zipCode}</li>
        </ul>
        <h2>Facilidades</h2>
        <ul>
          {academy.facilities.map((facility, index) => (
            <li key={index}>{facility}</li>
          ))}
        </ul>
      </div>

      {academy.reviews && academy.reviews.length > 0 && (
        <div className="academy-details-section academy-details-reviews">
          <h2>Avaliações ({academy.reviews.length})</h2>
          {academy.reviews.map(review => (
            <div key={review.id} className="review">
              <p>
                <span className="review-author">{review.author}</span>
                <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
              </p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Futuramente, você pode adicionar um mapa aqui */}
    </div>
  );
}

export default AcademyDetailsPage;