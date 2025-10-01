// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import '../styles/pages/_forgotPassword.css'; // Importa o CSS para esta página
import logo from '../assets/logoFundo.png'; // Importa a sua logo

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    // Regex simples para validação de e-mail
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores
    setMessage(''); // Limpa mensagens anteriores

    if (!email) {
      setError('O campo e-mail é obrigatório.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    // Simula o envio de uma solicitação de redefinição de senha
    console.log('Solicitação de redefinição de senha para:', email);
    setMessage('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
    setEmail(''); // Limpa o campo de e-mail após o envio
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-form-container">
        <div className="forgot-password-header">
          <img src={logo} alt="Logo da LOGYM" className="forgot-password-logo" />
          <h1>Esqueceu a Senha?</h1>
        </div>

        <p className="forgot-password-intro">
          Por favor, digite seu e-mail abaixo para receber um link de redefinição de senha.
        </p>

        {message && <div className="success-message">{message}</div>}
        {error && <ErrorMessage message={error} />}

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
              setError(''); // Limpa o erro ao digitar
            }}
            className={error ? 'has-error' : ''}
          />
          
          <Button type="submit" className="button-primary">
            Enviar Link de Redefinição
          </Button>
        </form>

        <p className="back-to-login">
          Lembrou da senha? <Link to="/login" className="link">Fazer Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
