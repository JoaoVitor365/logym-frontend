// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom'; // Importe Link para o "Já tem conta?"

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de validação básica
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log('Dados de Cadastro:', { name, email, password });
    alert(`Cadastro em andamento para: ${email}`);
    // Aqui você fará a chamada para sua API de registro
  };

  return (
    <div className="register-page"> {/* Adiciona a classe da página */}
      <div className="register-form-container"> {/* Contêiner do formulário */}
        <h1>Cadastre-se</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome Completo"
            type="text"
            id="name"
            name="name"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="E-mail"
            type="email"
            id="email"
            name="email"
            placeholder="seu.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            id="password"
            name="password"
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirme a Senha"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
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