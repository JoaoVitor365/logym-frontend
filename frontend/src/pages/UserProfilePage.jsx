import { useState } from 'react'
import { mockAPI } from '../config/api'

function UserProfilePage() {
  const [userData, setUserData] = useState({
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    try {
      // Simulação de salvamento
      setMessage('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      setMessage('Erro ao atualizar perfil')
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">MEU PERFIL</h2>
        
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
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-input"
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              value={userData.email}
              disabled
              style={{backgroundColor: '#f5f5f5'}}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input
              type="tel"
              className="form-input"
              value={userData.phone}
              onChange={(e) => setUserData({...userData, phone: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data de Nascimento</label>
            <input
              type="date"
              className="form-input"
              value={userData.birthDate}
              onChange={(e) => setUserData({...userData, birthDate: e.target.value})}
              disabled={!isEditing}
            />
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

export default UserProfilePage