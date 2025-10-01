// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { Link, useNavigate } from 'react-router-dom'; // 👈 1. Importamos o useNavigate
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import '../styles/pages/_register.css'; // Importe o CSS para a página
import logo from '../assets/logoFundo.png'; // Importe a logo aqui

function RegisterPage() {
  const navigate = useNavigate(); // 👈 2. Inicializamos o useNavigate
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

// ... (validateForm mantido sem alterações) ...
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Cadastro do usuário:', { name, email, password });
      
      // Simulação de sucesso no cadastro:
      alert('Cadastro realizado com sucesso! Redirecionando para o Login.');
      
      // 👈 3. Redireciona para a página de login
      navigate('/login'); 
      
    } else {
      console.log('Erros de validação:', errors);
    }
  };

  return (
// ... (restante do JSX sem alterações) ...
    <div className="register-page">
      <div className="register-form-container">
        {/* Cabeçalho com a logo e o nome da marca */}
        <div className="register-header">
          <img src={logo} alt="Logo da LOGYM" className="register-logo" />
          <h1>Cadastre-se</h1>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          {/* ... Campos de Input ... */}
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

          <Button type="submit" className="button-primary">
            Cadastrar
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