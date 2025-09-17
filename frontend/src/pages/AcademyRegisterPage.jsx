import { useState } from 'react'

function AcademyRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    description: '',
    facilities: []
  })
  const [message, setMessage] = useState('')

  const facilitiesOptions = [
    'Musculação',
    'Aulas Coletivas',
    'Piscina',
    'Estacionamento',
    'Cardio',
    'Professores Formados',
    'Vestiário',
    'Chuveiros',
    'Ar Condicionado',
    'Wi-Fi',
    'Loja de Suplementos',
    'Nutricionista'
  ]

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Aqui seria a chamada para a API
      console.log('Dados da academia:', formData)
      setMessage('Academia cadastrada com sucesso!')
    } catch (error) {
      setMessage('Erro ao cadastrar academia')
    }
  }

  return (
    <div className="container">
      <div className="form-container" style={{maxWidth: '700px'}}>
        <h2 className="form-title">CADASTRAR ACADEMIA</h2>
        
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
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome da Academia</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">CNPJ</label>
            <input
              type="text"
              className="form-input"
              value={formData.cnpj}
              onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">E-mail de Contato</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Endereço Completo</label>
            <input
              type="text"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Descrição da Academia</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva sua academia, diferenciais, horários de funcionamento..."
              required
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
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                  />
                  <label htmlFor={facility}>{facility}</label>
                </div>
              ))}
            </div>
          </div>
          
          <button type="submit" className="btn-primary" style={{width: '100%'}}>
            CADASTRAR ACADEMIA
          </button>
        </form>
      </div>
    </div>
  )
}

export default AcademyRegisterPage