import { useState } from 'react'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Aqui seria a chamada para a API
      console.log('Enviando link para:', email)
      setMessage('Link de redefinição enviado para seu e-mail!')
    } catch (error) {
      setMessage('Erro ao enviar link de redefinição')
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">ESQUECI A SENHA</h2>
        
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Digite seu e-mail abaixo e enviaremos um link para redefinir sua senha.
        </p>
        
        {message && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '20px', 
            backgroundColor: message.includes('enviado') ? '#d4edda' : '#f8d7da',
            color: message.includes('enviado') ? '#155724' : '#721c24',
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{width: '100%'}}>
            ENVIAR LINK DE REDEFINIÇÃO
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage