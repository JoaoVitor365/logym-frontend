// src/pages/LoginPage.jsx - Página de login com integração ao backend
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import '../styles/pages/_login.css';
import logo from '../assets/logoFundo.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // Hook para gerenciar autenticação
  const navigate = useNavigate(); // Hook para navegação

  // Validação do formulário
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validação de E-mail
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido.';
      isValid = false;
    }

    // Validação de Senha
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

  // Submissão do formulário com integração ao backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Fazer login via API
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        // Salvar dados do usuário no contexto
        login(response.user, response.token);
        
        // Redirecionar para página inicial
        navigate('/');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Tratar erros da API
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Erro ao fazer login. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="form-card">
        {/* Novo cabeçalho com logo e nome */}
        <div className="login-header">
          <img src={logo} alt="Logo da LOGYM" className="login-logo" />
          <h1>LOGYM</h1>
        </div>
        <form onSubmit={handleSubmit} noValidate>
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

          {/* Mostrar erro geral se houver */}
          <ErrorMessage message={errors.general} />
          
          <Button 
            type="submit" 
            className="button-primary" 
            style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
            disabled={loading}
          >
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
 