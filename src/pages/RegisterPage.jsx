// src/pages/RegisterPage.jsx - Página de cadastro com integração ao backend
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import '../styles/pages/_register.css';
import logo from '../assets/logoFundo.png';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // Hook para gerenciar autenticação
  const navigate = useNavigate(); // Hook para navegação

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'O nome completo é obrigatório.';
      isValid = false;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'A confirmação de senha é obrigatória.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
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
      // Fazer cadastro via API
      const response = await authAPI.register({ name, email, password });
      
      if (response.success) {
        // Fazer login automático após cadastro
        login(response.user, response.token);
        
        // Redirecionar para página inicial
        navigate('/');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Tratar erros da API
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Erro ao fazer cadastro. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        {/* Cabeçalho com a logo e o nome da marca */}
        <div className="register-header">
          <img src={logo} alt="Logo da LOGYM" className="register-logo" />
          <h1>Cadastre-se</h1>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Nome Completo"
            type="text"
            id="name"
            name="name"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: '' }));
            }}
            className={errors.name ? 'has-error' : ''}
          />
          <ErrorMessage message={errors.name} />

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

          <Input
            label="Confirme a Senha"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }}
            className={errors.confirmPassword ? 'has-error' : ''}
          />
          <ErrorMessage message={errors.confirmPassword} />

          {/* Mostrar erro geral se houver */}
          <ErrorMessage message={errors.general} />
          
          <Button 
            type="submit" 
            className="button-primary"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
        <p>
          Já tem uma conta? <Link to="/login" className="link">Faça Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
