import { useState } from 'react'
import { mockAPI } from '../config/api'

function AcademyProfilePage() {
  const [academyData, setAcademyData] = useState({
    name: 'Smart Fit Centro',
    cnpj: '12.345.678/0001-90',
    email: 'contato@smartfit.com.br',
    phone: '(11) 1234-5678',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    description: 'Academia moderna com equipamentos de última geração e professores qualificados.',
    facilities: ['Musculação', 'Cardio', 'Professores Formados', 'Ar Condicionado']
  })
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  const facilitiesOptions = [
    'Musculação', 'Aulas Coletivas', 'Piscina', 'Estacionamento',
    'Cardio', 'Professores Formados', 'Vestiário', 'Chuveiros',
    'Ar Condicionado', 'Wi-Fi', 'Loja de Suplementos', 'Nutricionista'
  ]

  const handleFacilityChange = (facility) => {
    setAcademyData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const handleSave = async () => {
    try {
      // Simulação de salvamento
      setMessage('Perfil da academia atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      setMessage('Erro ao atualizar perfil da academia')
    }
  }

  return (
    <div className="container">
      <div className="form-container" style={{maxWidth: '700px'}}>
        <h2 className="form-title">PERFIL DA ACADEMIA</h2>
        
        {message && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '20px', 
            backgroundColor: message.includes('sucesso') ? '#d4edda' : '#f8d7da',
            color: message.includes('sucesso') ? '#155724' : '#721c24',
            borderRadius: '5px'
          }}>
            {message}
          </div>
        )}

        <div className="profile-section">
          <div className="form-group">
            <label className="form-label">Nome da Academia</label>
            <input
              type="text"
              className="form-input"
              value={academyData.name}
              onChange={(e) => setAcademyData({...academyData, name: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">CNPJ</label>
            <input
              type="text"
              className="form-input"
              value={academyData.cnpj}
              disabled
              style={{backgroundColor: '#f5f5f5'}}
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail de Contato</label>
            <input
              type="email"
              className="form-input"
              value={academyData.email}
              onChange={(e) => setAcademyData({...academyData, email: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input
              type="tel"
              className="form-input"
              value={academyData.phone}
              onChange={(e) => setAcademyData({...academyData, phone: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Endereço</label>
            <input
              type="text"
              className="form-input"
              value={academyData.address}
              onChange={(e) => setAcademyData({...academyData, address: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-textarea"
              value={academyData.description}
              onChange={(e) => setAcademyData({...academyData, description: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Facilidades Oferecidas</label>
            <div className="checkbox-group">
              {facilitiesOptions.map(facility => (
                <div key={facility} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={facility}
                    checked={academyData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                    disabled={!isEditing}
                  />
                  <label htmlFor={facility}>{facility}</label>
                </div>
              ))}
            </div>
          </div>

          <div style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
            {!isEditing ? (
              <button 
                className="btn-primary" 
                onClick={() => setIsEditing(true)}
                style={{width: '100%'}}
              >
                EDITAR PERFIL
              </button>
            ) : (
              <>
                <button 
                  className="btn-primary" 
                  onClick={handleSave}
                  style={{flex: 1}}
                >
                  SALVAR
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => setIsEditing(false)}
                  style={{flex: 1}}
                >
                  CANCELAR
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AcademyProfilePage