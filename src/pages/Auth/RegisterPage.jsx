// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import '../../styles/pages/_register.css';
import logo from '../../assets/logoFundo.png';

import UsuarioService from '../../services/UsuarioService';

const formatCEP = (value) => {
  const rawValue = value.replace(/\D/g, '').slice(0, 8);
  return rawValue.replace(/^(\d{5})(\d)/, '$1-$2');
};

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [enderecoCep, setEnderecoCep] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isManager, setIsManager] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  const scrollParaTopoFormulario = () => {
    setTimeout(() => {
      const topoFormulario = document.getElementById('register-form-top');

      if (topoFormulario) {
        topoFormulario.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const getFieldErrorClass = (fieldName) => {
    return errors[fieldName] ? 'field-has-error' : '';
  };

  const limparEnderecoCep = () => {
    setEnderecoCep({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  };

  const limparErroCampo = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }

    if (apiMessage) {
      setApiMessage('');
    }
  };

  const buscarEnderecoPorCep = async (cepFormatado) => {
    const cepLimpo = cepFormatado.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      limparEnderecoCep();
      return;
    }

    setBuscandoCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        limparEnderecoCep();

        setErrors((prev) => ({
          ...prev,
          cep: 'CEP não encontrado.'
        }));

        return;
      }

      setEnderecoCep({
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      });

      setErrors((prev) => ({
        ...prev,
        cep: ''
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);

      limparEnderecoCep();

      setErrors((prev) => ({
        ...prev,
        cep: 'Não foi possível buscar o CEP agora.'
      }));
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCepChange = (value) => {
    const cepFormatado = formatCEP(value);
    const cepLimpo = cepFormatado.replace(/\D/g, '');

    setCep(cepFormatado);
    setApiMessage('');

    if (cepLimpo.length < 8) {
      limparEnderecoCep();

      setErrors((prev) => ({
        ...prev,
        cep: ''
      }));

      return;
    }

    buscarEnderecoPorCep(cepFormatado);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'O nome completo é obrigatório.';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'E-mail inválido.';
      isValid = false;
    }

    if (!isManager) {
      if (!cep.trim()) {
        newErrors.cep = 'O CEP é obrigatório para usuário comum.';
        isValid = false;
      } else if (cep.replace(/\D/g, '').length !== 8) {
        newErrors.cep = 'O CEP deve conter 8 dígitos.';
        isValid = false;
      } else if (!enderecoCep.cidade || !enderecoCep.estado) {
        newErrors.cep = 'Informe um CEP válido.';
        isValid = false;
      }
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

  const tratarMensagemErro = (error) => {
    const mensagemErro =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      'Erro ao cadastrar usuário.';

    const texto = String(mensagemErro);

    if (
      texto.includes('e-mail') ||
      texto.includes('email') ||
      texto.includes('username') ||
      texto.includes('Username') ||
      texto.includes('UQ_Usuario_Username')
    ) {
      return 'Já existe uma conta cadastrada com este e-mail.';
    }

    return texto;
  };

  const aplicarErroDoBackendNosCampos = (mensagemTratada) => {
    const texto = String(mensagemTratada);

    if (
      texto.includes('e-mail') ||
      texto.includes('email') ||
      texto.includes('E-mail')
    ) {
      setErrors((prev) => ({
        ...prev,
        email: mensagemTratada
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');

    if (loading) {
      return;
    }

    if (!validateForm()) {
      setApiMessage('Erro: verifique os campos destacados antes de continuar.');
      scrollParaTopoFormulario();
      return;
    }

    setLoading(true);

    const nivelAcesso = isManager ? 'MANAGER' : 'USER';
    const emailNormalizado = email.trim().toLowerCase();

    try {
      const response = await UsuarioService.create(
        name.trim(),
        emailNormalizado,
        password,
        nivelAcesso,
        isManager ? null : cep.replace(/\D/g, '')
      );

      const novoUsuario = response.data;

      if (!novoUsuario || !novoUsuario.id) {
        throw new Error('O cadastro não foi concluído. A resposta do backend não retornou o usuário criado.');
      }

      setApiMessage(`🎉 Usuário ${novoUsuario.nome || name.trim()} cadastrado com sucesso! Redirecionando...`);
      scrollParaTopoFormulario();

      setName('');
      setEmail('');
      setCep('');
      limparEnderecoCep();
      setPassword('');
      setConfirmPassword('');
      setIsManager(false);
      setErrors({});

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);

      const mensagemTratada = tratarMensagemErro(error);

      aplicarErroDoBackendNosCampos(mensagemTratada);
      setApiMessage(`Erro: ${mensagemTratada}`);
      scrollParaTopoFormulario();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container" id="register-form-top">
        <div className="register-header">
          <img src={logo} alt="Logo da LOGYM" className="register-logo" />
          <h1>Cadastre-se</h1>
        </div>

        {apiMessage && (
          <p className={apiMessage.startsWith('Erro') ? 'register-api-error' : 'register-api-success'}>
            {apiMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={getFieldErrorClass('name')}>
            <Input
              label="Nome Completo"
              type="text"
              id="name"
              name="name"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                limparErroCampo('name');
              }}
            />
            <ErrorMessage message={errors.name} />
          </div>

          <div className={getFieldErrorClass('email')}>
            <Input
              label="E-mail"
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                limparErroCampo('email');
              }}
            />
            <ErrorMessage message={errors.email} />
          </div>

          {!isManager && (
            <>
              <div className={getFieldErrorClass('cep')}>
                <Input
                  label={buscandoCep ? 'CEP - buscando endereço...' : 'CEP'}
                  type="text"
                  id="cep"
                  name="cep"
                  placeholder="Digite seu CEP"
                  value={cep}
                  maxLength="9"
                  onChange={(e) => {
                    handleCepChange(e.target.value);
                  }}
                />
                <ErrorMessage message={errors.cep} />
              </div>

              {(enderecoCep.logradouro || enderecoCep.bairro || enderecoCep.cidade || enderecoCep.estado) && (
                <div className="viacep-address-box">
                  <Input
                    label="Endereço"
                    type="text"
                    id="logradouro"
                    name="logradouro"
                    value={enderecoCep.logradouro}
                    placeholder="Endereço"
                    disabled
                  />

                  <Input
                    label="Bairro"
                    type="text"
                    id="bairro"
                    name="bairro"
                    value={enderecoCep.bairro}
                    placeholder="Bairro"
                    disabled
                  />

                  <Input
                    label="Cidade"
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={enderecoCep.cidade}
                    placeholder="Cidade"
                    disabled
                  />

                  <Input
                    label="Estado"
                    type="text"
                    id="estado"
                    name="estado"
                    value={enderecoCep.estado}
                    placeholder="Estado"
                    disabled
                  />
                </div>
              )}
            </>
          )}

          <div className={getFieldErrorClass('password')}>
            <Input
              label="Senha"
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                limparErroCampo('password');
              }}
            />
            <ErrorMessage message={errors.password} />
          </div>

          <div className={getFieldErrorClass('confirmPassword')}>
            <Input
              label="Confirme a Senha"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                limparErroCampo('confirmPassword');
              }}
            />
            <ErrorMessage message={errors.confirmPassword} />
          </div>

          <div className="checkbox-group register-manager-checkbox-group">
            <label className="register-manager-checkbox-label">
              <input
                type="checkbox"
                checked={isManager}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setIsManager(checked);
                  setApiMessage('');

                  if (checked) {
                    setCep('');
                    limparEnderecoCep();
                    setErrors((prev) => ({ ...prev, cep: '' }));
                  }
                }}
                className="register-manager-checkbox-input"
              />
              Sou proprietário/gerente de academia
            </label>
          </div>

          <Button type="submit" className="button-primary" disabled={loading || buscandoCep}>
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