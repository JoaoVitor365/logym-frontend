import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL, { mockAPI } from '../config/api'

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData)
      setMessage('Login realizado com sucesso!')
    } catch (error) {
      // Fallback para mock API se backend não estiver disponível
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        const mockResponse = await mockAPI.auth.login(formData)
        setMessage(mockResponse.data)
      } else {
        setMessage(error.response?.data || 'Erro no login')
      }
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">LOGIN</h2>
        
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
          
          <button type="submit" className="btn-primary" style={{width: '100%'}}>
            ENTRAR
          </button>
        </form>
        
        <Link to="/esqueci-senha" className="form-link">
          Esqueci a Senha?
        </Link>
      </div>
    </div>
  )
}

export default LoginPage