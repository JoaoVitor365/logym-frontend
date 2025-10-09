import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import ApiService from '../services/api';
import '../styles/pages/_login.css';
import logo from '../assets/logoFundo.png'; 

function LoginPage({ onLogin }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('usuario'); // 'usuario' ou 'academia'
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [showReactivateOption, setShowReactivateOption] = useState(false);
  const [inactiveUser, setInactiveUser] = useState(null);
  const navigate = useNavigate();

  const handleReactivateAccount = async () => {
    setLoading(true);
    try {
      await ApiService.reactivateUser(inactiveUser.id);
      setApiMessage('Conta reativada com sucesso! Fazendo login...');
      
      // Fazer login automático após reativação
      const updatedUser = { ...inactiveUser, statusUsuario: 'ATIVO' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onLogin(updatedUser);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setApiMessage(`Erro ao reativar conta: ${error.message}`);
    } finally {
      setLoading(false);
      setShowReactivateOption(false);
    }
  };

  const handleCancelReactivation = () => {
    setShowReactivateOption(false);
    setInactiveUser(null);
    setApiMessage('');
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'O e-mail é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        let loginData;
        
        if (userType === 'usuario') {
          loginData = await ApiService.loginUser(email, password);
          localStorage.setItem('user', JSON.stringify(loginData));
        } else {
          loginData = await ApiService.loginAcademia(email, password);
          localStorage.setItem('academia', JSON.stringify(loginData));
        }
        
        onLogin(loginData);
        navigate('/');
      } catch (error) {
        if (error.message === 'Conta inativada. Entre em contato com o suporte.') {
          // Buscar o usuário inativo para oferecer reativação
          try {
            const users = await ApiService.request('/usuario');
            const user = users.find(u => u.email === email && u.senha === password);
            if (user) {
              setInactiveUser(user);
              setShowReactivateOption(true);
              setApiMessage('Sua conta está inativa. Deseja reativá-la?');
            }
          } catch (searchError) {
            setApiMessage(`Erro: ${error.message}`);
          }
        } else {
          setApiMessage(`Erro: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="form-card">
        <div className="login-header">
          <img src={logo} alt="Logo da LOGYM" className="login-logo" />
          <h1>LOGYM</h1>
        </div>
        
        {apiMessage && (
          <div style={{ marginBottom: '15px' }}>
            <p className={showReactivateOption ? 'info-message' : 'error-message'} style={{
              padding: '10px', 
              borderRadius: '5px',
              backgroundColor: showReactivateOption ? '#d1ecf1' : '#f8d7da', 
              color: showReactivateOption ? '#0c5460' : '#721c24',
              marginBottom: showReactivateOption ? '10px' : '0'
            }}>
              {apiMessage}
            </p>
            
            {showReactivateOption && (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Button 
                  type="button" 
                  onClick={handleReactivateAccount}
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#28a745', 
                    color: 'white',
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  {loading ? 'Reativando...' : 'Sim, Reativar'}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleCancelReactivation}
                  style={{ 
                    backgroundColor: '#6c757d', 
                    color: 'white',
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Tipo de Login:</label>
            <div style={{display: 'flex', gap: '15px'}}>
              <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <input 
                  type="radio" 
                  value="usuario" 
                  checked={userType === 'usuario'} 
                  onChange={(e) => setUserType(e.target.value)}
                  style={{marginRight: '5px'}}
                />
                Usuário
              </label>
              <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <input 
                  type="radio" 
                  value="academia" 
                  checked={userType === 'academia'} 
                  onChange={(e) => setUserType(e.target.value)}
                  style={{marginRight: '5px'}}
                />
                Academia
              </label>
            </div>
          </div>
          
          <Input
            label="E-mail"
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: '' }));
            }}
            className={errors.email ? 'has-error' : ''}
          />
          <ErrorMessage message={errors.email} />

          <Input
            label="Senha"
            type="password"
            id="password"
            name="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: '' }));
            }}
            className={errors.password ? 'has-error' : ''}
          />
          <ErrorMessage message={errors.password} />

          <Button type="submit" className="button-primary" disabled={loading || showReactivateOption} style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p>
          Não tem uma conta? <Link to="/cadastrar" className="link">Cadastre-se</Link>
        </p>
        <p>
          Esqueceu a senha? <Link to='/esqueci-minha-senha' className='link'>Esqueci Minha Senha</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;