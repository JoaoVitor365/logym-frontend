// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault(); // Já estava aqui, mas é crucial para evitar o comportamento padrão do form
    if (validateForm()) {
      console.log('Login:', { email, password });
      alert(`Tentando logar com: ${email}`);
    } else {
      console.log('Erros de validação:', errors);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} noValidate> {/* Adicione noValidate aqui! */}
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
            // REMOVA AQUI -> required
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
            // REMOVA AQUI -> required
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
      </div>
    </div>
  );
}

export default LoginPage;