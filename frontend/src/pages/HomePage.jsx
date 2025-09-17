import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { mockAPI } from '../config/api'

function HomePage() {
  const [academies, setAcademies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Carregando dados das academias
    mockAPI.academies.getAll()
      .then(response => setAcademies(response.data))
      .catch(error => console.error('Erro ao carregar academias:', error))
  }, [])

  const handleSearch = () => {
    console.log('Buscando por:', searchTerm)
    if (searchTerm.trim()) {
      mockAPI.academies.getAll()
        .then(response => {
          const filtered = response.data.filter(academy => 
            academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            academy.address.toLowerCase().includes(searchTerm.toLowerCase())
          )
          setAcademies(filtered)
        })
    } else {
      mockAPI.academies.getAll()
        .then(response => setAcademies(response.data))
    }
  }

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

  return (
    <div className="container">
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar academias por nome ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            BUSCAR
          </button>
        </div>
      </div>

      <div className="academy-grid">
        {academies.map(academy => (
          <div key={academy.id} className="academy-card">
            <img
              src={academy.image}
              alt={academy.name}
              className="academy-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Academia'
              }}
            />
            <div className="academy-info">
              <h3 className="academy-name">{academy.name}</h3>
              <p className="academy-address">{academy.address}</p>
              <div className="rating">
                <span className="stars">{renderStars(academy.rating)}</span>
                <span>({academy.rating})</span>
              </div>
              <Link to={`/academia/${academy.id}`} className="btn-primary">
                Ver Detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage