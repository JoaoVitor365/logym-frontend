// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom'; // Importe Link para o "Já tem conta?"
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // 1. Validação do Nome
    if (!name.trim()) { // .trim() remove espaços em branco no início e no fim
      newErrors.name = 'O nome completo é obrigatório.';
      isValid = false;
    }

    // 2. Validação do E-mail
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) { // Regex para verificar formato de e-mail
      newErrors.email = 'E-mail inválido.';
      isValid = false;
    }

    // 3. Validação da Senha
    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
      isValid = false;
    }

    // 4. Validação da Confirmação de Senha
    if (!confirmPassword) {
      newErrors.confirmPassword = 'A confirmação de senha é obrigatória.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
      isValid = false;
    }

    setErrors(newErrors); // Atualiza o estado de erros
    return isValid; // Retorna true se tudo estiver OK, false caso contrário
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Impede o recarregamento da página padrão do navegador

    if (validateForm()) { // Se a validação for bem-sucedida...
      console.log('Cadastro do usuário:', { name, email, password });
      alert(`Cadastro em andamento para: ${email}`);
      // Lógica de envio para a API aqui
    } else {
      console.log('Erros de validação:', errors);
    }
  };

  return (
  <div className="register-page">
    <div className="register-form-container">
      <h1>Cadastre-se</h1>
      {/* Adicione noValidate para desativar a validação nativa do navegador */}
      <form onSubmit={handleSubmit} noValidate>

        {/* Campo Nome */}
        <Input
          label="Nome Completo"
          type="text"
          id="name"
          name="name"
          placeholder="Digite seu nome completo"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors(prev => ({ ...prev, name: '' })); // Limpa o erro ao digitar
          }}
          // Adiciona a classe 'has-error' se houver erro
          className={errors.name ? 'has-error' : ''}
        />
        <ErrorMessage message={errors.name} /> {/* Exibe a mensagem de erro */}

        {/* Campo E-mail */}
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

        {/* Campo Senha */}
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

        {/* Campo Confirmação de Senha */}
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