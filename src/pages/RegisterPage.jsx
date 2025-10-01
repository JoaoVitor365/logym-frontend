// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import '../styles/pages/_register.css';
import logo from '../assets/logoFundo.png';

// URL base da sua API em Java/Spring Boot
const BASE_API_URL = 'http://localhost:8080'; 

function RegisterPage() {
    const navigate = useNavigate();
    
    // Estados do Formulário e Validação (JÁ EXISTENTES)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    // NOVOS ESTADOS PARA CONTROLE DA API
    const [loading, setLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState(''); // Mensagem de sucesso/erro da API

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpa mensagens anteriores
        setApiMessage('');

        if (validateForm()) {
            setLoading(true);

            // DTO/JSON que seu Controller @PostMapping espera
            const userData = {
                nome: name,      
                email: email,    
                senha: password, 
            };

            try {
                // ----------------------------------------------------
                // CONEXÃO REAL COM O BACKEND
                // ----------------------------------------------------
                const response = await fetch(`${BASE_API_URL}/api/v1/usuario`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (!response.ok) {
                    // Seu Controller retorna JSONs detalhados em caso de erro
                    const errorData = await response.json(); 
                    // Tenta usar a mensagem do Backend (message) ou usa uma default
                    throw new Error(errorData.message || 'Erro ao cadastrar. Verifique os dados.');
                }

                // Sucesso (Status 201 CREATED)
                const novoUsuario = await response.json();
                
                setApiMessage(`🎉 Usuário ${novoUsuario.nome} cadastrado com sucesso! Redirecionando...`);
                
                // Limpa campos (opcional, pois vamos redirecionar)
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                
                // Redireciona para o Login após um breve atraso (para o usuário ver a mensagem)
                setTimeout(() => {
                    navigate('/login'); 
                }, 1500);


            } catch (error) {
                console.error('Falha no Cadastro:', error);
                setApiMessage(`Erro: ${error.message || 'Não foi possível conectar ao servidor.'}`);
            } finally {
                setLoading(false);
            }
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

                {/* Mensagem de Feedback da API */}
                {apiMessage && (
                    <p 
                        className={apiMessage.startsWith('Erro') ? 'error-message' : 'success-message'}
                        style={{
                            padding: '10px', 
                            borderRadius: '5px',
                            // Estilos básicos para demonstrar a diferença visualmente:
                            backgroundColor: apiMessage.startsWith('Erro') ? '#f8d7da' : '#d4edda', 
                            color: apiMessage.startsWith('Erro') ? '#721c24' : '#155724'
                        }}
                    >
                        {apiMessage}
                    </p>
                )}

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

                    <Button type="submit" className="button-primary" disabled={loading}>
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