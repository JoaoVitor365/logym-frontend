import { useState } from 'react'
import axios from 'axios'
import API_BASE_URL, { mockAPI } from '../config/api'

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('As senhas não coincidem')
      return
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username: formData.fullName,
        email: formData.email,
        password: formData.password
      })
      setMessage('Usuário cadastrado com sucesso!')
    } catch (error) {
      // Fallback para mock API se backend não estiver disponível
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        const mockResponse = await mockAPI.auth.register(formData)
        setMessage(mockResponse.data)
      } else {
        setMessage(error.response?.data || 'Erro no cadastro')
      }
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">CADASTRAR USUÁRIO</h2>
        
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
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-input"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
            <label className="form-label">Confirme a Senha</label>
            <input
              type="password"
              className="form-input"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{width: '100%'}}>
            CADASTRAR
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage