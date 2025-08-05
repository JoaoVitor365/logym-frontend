 // src/pages/LoginPage.jsx
 import React, { useState } from 'react';
 import Input from '../components/Input/Input';
 import Button from '../components/Button/Button';
 import { Link } from 'react-router-dom';
 import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
 import '../styles/pages/_login.css';
 import logo from '../assets/logoFundo.png'; // Importe a sua logo aqui (ajuste o caminho se necessário)

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
    e.preventDefault();
    if (validateForm()) {
      console.log('Login:', { email, password });
      // Aqui você faria a lógica de login real
      alert(`Tentando logar com: ${email}`);
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
 