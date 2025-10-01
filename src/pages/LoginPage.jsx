// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 1. IMPORTAMOS O useNavigate
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import '../styles/pages/_login.css';
import logo from '../assets/logoFundo.png'; 

// 👈 2. O componente agora recebe a função onLogin de App.jsx
function LoginPage({ onLogin }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // 👈 3. Inicializamos o useNavigate

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validação de E-mail (MANTIDO)
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido.';
      isValid = false;
    }

    // Validação de Senha (MANTIDO)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login: Validação OK. Iniciando simulação de login.');
      
      // 4. CHAMAMOS O HANDLER GLOBAL (onLogin)
      // Isso muda o estado 'isLoggedIn' para true em App.jsx
      onLogin(); 
      
      // 5. REDIRECIONAMOS O USUÁRIO
      // Leva o usuário de volta para a HomePage, onde o Header mudará
      navigate('/'); 

    } else {
      console.log('Erros de validação:', errors);
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

          <Button type="submit" className="button-primary" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
            Entrar
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