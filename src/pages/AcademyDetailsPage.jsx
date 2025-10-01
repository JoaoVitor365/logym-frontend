// src/pages/AcademyDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, href } from 'react-router-dom';
// Importamos o novo componente!
import AcademyReviews from '../components/Academy/AcademyReviews'; 

function AcademyDetailsPage() {
  const { id } = useParams(); // Pega o ID da academia da URL
  const [academy, setAcademy] = useState(null); // Estado para armazenar os detalhes da academia
  const [loading, setLoading] = useState(true); // Estado para simular carregamento

  // Dados de academias de exemplo (mantenha em sync com os da HomePage)
  const sampleAcademies = [
    {
      id: '1',
      name: 'Smart Fit',
      address: 'Av. Vinte e Seis de Março, 701 - Centro',
      city: 'Barueri',
      state: 'SP',
      zipCode: ' 06401050',
      phone: '(11) 99807-9600',
      description: 'Na Smart Fit, unidade no centro de Barueri, a estrutura é de se impressionar! Contamos com a ajuda de professores formados, para te guiar em cada treino*, cadeira de massagem para relaxar. Precisa ir em alguma reunião após o treino? Contamos com ducha aquecida. Nosso equipamento é totalmente novo e moderno, além do peso livre, para sempre propor a melhor experiência. *: Vide o plano',
      rating: 4.8,
      facilities: ['Cardio', 'Cadeira de Massagem', 'Sala de Ginástica', 'Peso Livre', 'Musculação', 'Ducha Aquecida', 'Ar Condicionado', 'Professores Formados'],
      gallery: [
        '/images/academies/smartFit1.jpg',
        '/images/academies/smartFit2.jpg',
        '/images/academies/smartFit3.jpg'
      ],
      reviews: [
        { id: 'r1', author: 'Ana Silva', rating: 5, comment: 'Melhor academia da região! Equipamentos novos e aulas excelentes.' },
        { id: 'r2', author: 'Carlos Mendes', rating: 4, comment: 'Bom atendimento, mas poderia ter mais opções de horários.' }
      ]
    },
    {
      id: '2',
      name: 'BlueFit',
      address: 'Av. Trindade, 344  Bethaville I',
      city: ', Barueri',
      state: 'SP',
      zipCode: '06404-326',
      contact: 'O contato deve ser feito através do site da BlueFit: www.bluefit.com.br/atendimento.',
      description: 'A academia BlueFit, localizada no Bethaville, próximo ao Ginásio José Correa, é a academia feita para você! A estrutura conta com um estacionamento, além do ambiente ser climatizado, ter a Arena Fitness, Arena de Lutas e vestiários. A BlueFit espera por você!',
      rating: 4.9,
      facilities: ['Ambiente Climatizado', 'Arena Fitness', 'Arena de Lutas', 'Armário Rotativo', 'Espaço B-Cross', 'Estacionamento', 'Vestiários'],
      gallery: [
        '/images/academies/blueFit1.jpg',
        '/images/academies/blueFit2.jpg',
        '/images/academies/blueFit3.jpg'
      ],
      reviews: [
        { id: 'r3', author: 'Fernanda Lima', rating: 5, comment: 'Academia com uma estrutura excelente! Sempre muito limpa e organizada!' }
      ]
    },
    {
      id: '3',
      name: 'Bio Ritmo',
      address: 'Av. Piracema, 669 - Tamboré',
      city: 'Barueri',
      state: 'SP',
      zipCode: ' 06460-030',
      phone: '(11) 99857-0402',
      contact: 'Se preferir, entre em contato pelo site: www.bioritmosupport.zendesk.com/hc/pt-br/requests/new',
      description: 'Aqui na BioRitmo do Shopping Tamboré, você só tem a ganhar! Aqui contamos com equipamentos sofisticados e de última geração, aulas de ginástica, programas para emagrecimento e avaliações de bioimpedância.',
      rating: 4.7,
      facilities: ['Equipamentos sofisticados e de última geração', 'Aulas de Torq, Burn, Race e Ginástica', 'Programas de emagrecimento e hipertrofia', 'Avaliação de Biompedância'],
      gallery: [      
        '/images/academies/bioRitmo2.jpg',
        '/images/academies/bioRitmo1.jpg',
        '/images/academies/bioRitmo3.jpg',
      ],
      reviews: []
    },
    {
      id: '4',
      name: 'Gaviões',
      address: 'Av. Juruá, 253 - Alphaville',
      city: 'Barueri',
      state: 'SP',
      zipCode: '06455-010',
      phone: '(11) 94074-7584',
      email: 'sac@academiagavioes.com.br',
      contact: 'Também pode entrar em contato pelo site: www.academiagavioes.com.br/contato',
      description: 'Treine na Gaviões para encontrar o esporte que combina com você! Temos musculação, artes marciais, danças, sala de bike para cardio, aulas de pilates e aeróbicas. E o melhor de tudo! Somos uma academia 24 horas, a qualquer hora do dia, você treinando!',
      rating: 4,
      facilities: ['Musculação', 'Artes Marciais', 'Danças', 'Sala de Bike', 'Rooftop com Máquinas', 'Pilates', 'Aulas Aeróbicas'],
      gallery: [
        '/images/academies/gavioes1.jpg',
        '/images/academies/gavioes2.jpg',
        '/images/academies/gavioes3.jpg',
      ],
      reviews: [
        { id: 'r4', author: 'Pedro Costa', rating: 4, comment: 'Boa estrutura, porém deveria ser climatizado.' }
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
          <li><strong>Outras formas de contato:</strong> {academy.contact}</li>
        </ul>
        <h2>Facilidades</h2>
        <ul>
          {academy.facilities.map((facility, index) => (
            <li key={index}>{facility}</li>
          ))}
        </ul>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* NOVO COMPONENTE DE REVIEWS: O código foi extraído e modularizado */}
      <AcademyReviews reviews={academy.reviews} /> 
      {/* ------------------------------------------------------------- */}

      {/* Futuramente, você pode adicionar um mapa aqui */}
    </div>
  );
}

export default AcademyDetailsPage;