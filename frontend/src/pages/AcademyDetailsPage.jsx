import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function AcademyDetailsPage() {
  const { id } = useParams()
  const [academy, setAcademy] = useState(null)

  useEffect(() => {
    // Dados mockados para demonstração
    const mockAcademy = {
      id: parseInt(id),
      name: 'Smart Fit',
      address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      rating: 4.5,
      description: 'A Smart Fit é uma das maiores redes de academias do Brasil, oferecendo equipamentos modernos, ambiente climatizado e uma ampla variedade de modalidades para todos os níveis de condicionamento físico.',
      phone: '(11) 1234-5678',
      email: 'contato@smartfit.com.br',
      website: 'www.smartfit.com.br',
      facilities: [
        'Musculação',
        'Cardio',
        'Professores Formados',
        'Vestiário',
        'Chuveiros',
        'Ar Condicionado',
        'Wi-Fi',
        'Estacionamento'
      ],
      gallery: [
        '/images/academies/smartFit1.jpg',
        '/images/academies/smartFit2.jpg',
        '/images/academies/smartFit3.jpg'
      ],
      reviews: [
        {
          name: 'João Silva',
          rating: 5,
          comment: 'Excelente academia! Equipamentos novos e ambiente muito limpo.'
        },
        {
          name: 'Maria Santos',
          rating: 4,
          comment: 'Boa estrutura, mas às vezes fica muito cheia nos horários de pico.'
        },
        {
          name: 'Pedro Costa',
          rating: 5,
          comment: 'Professores muito atenciosos e preço justo. Recomendo!'
        }
      ]
    }
    setAcademy(mockAcademy)
  }, [id])

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push('★')
    }
    if (hasHalfStar) {
      stars.push('☆')
    }
    return stars.join('')
  }

  if (!academy) {
    return <div className="container">Carregando...</div>
  }

  return (
    <div className="container">
      <div className="academy-header">
        <h1 className="academy-title">{academy.name}</h1>
        <p className="academy-address">{academy.address}</p>
        <div className="rating">
          <span className="stars">{renderStars(academy.rating)}</span>
          <span>({academy.rating})</span>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">SOBRE A ACADEMIA</h2>
        <p>{academy.description}</p>
      </div>

      <div className="section">
        <h2 className="section-title">GALERIA DE FOTOS</h2>
        <div className="gallery">
          {academy.gallery.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${academy.name} - Foto ${index + 1}`}
              className="gallery-image"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/150x100?text=Foto+${index + 1}`
              }}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">INFORMAÇÕES DE CONTATO</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <strong>Telefone:</strong><br />
            {academy.phone}
          </div>
          <div>
            <strong>E-mail:</strong><br />
            {academy.email}
          </div>
          <div>
            <strong>Website:</strong><br />
            {academy.website}
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">FACILIDADES</h2>
        <div className="facilities-list">
          {academy.facilities.map((facility, index) => (
            <div key={index} className="facility-item">
              <span style={{ color: '#fbbf24', marginRight: '10px' }}>✓</span>
              {facility}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">AVALIAÇÕES</h2>
        {academy.reviews.map((review, index) => (
          <div key={index} className="review">
            <div className="review-header">
              <span className="reviewer-name">{review.name}</span>
              <span className="stars">{renderStars(review.rating)}</span>
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AcademyDetailsPage