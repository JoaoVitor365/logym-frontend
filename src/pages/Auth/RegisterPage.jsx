// src/pages/RegisterPage.jsx
import React, { useRef, useState } from 'react';
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
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [enderecoCep, setEnderecoCep] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isManager, setIsManager] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const cepAtualRef = useRef('');

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

      if (cepAtualRef.current !== cepLimpo) {
        return;
      }

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

      if (cepAtualRef.current !== cepLimpo) {
        return;
      }

      limparEnderecoCep();

      setErrors((prev) => ({
        ...prev,
        cep: 'Não foi possível buscar o CEP agora.'
      }));
    } finally {
      if (cepAtualRef.current === cepLimpo) {
        setBuscandoCep(false);
      }
    }
  };

  const handleCepChange = (value) => {
    const cepFormatado = formatCEP(value);
    const cepLimpo = cepFormatado.replace(/\D/g, '');

    setCep(cepFormatado);
    cepAtualRef.current = cepLimpo;
    setApiMessage('');
    limparEnderecoCep();

    if (cepLimpo.length < 8) {
      setBuscandoCep(false);
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
      } else if (!enderecoCep.logradouro || !enderecoCep.cidade || !enderecoCep.estado) {
        newErrors.cep = 'Informe um CEP válido.';
        isValid = false;
      }

      if (enderecoCep.logradouro && enderecoCep.cidade && enderecoCep.estado) {
        if (!numero.trim()) {
          newErrors.numero = 'O número é obrigatório para o endereço.';
          isValid = false;
        } else if (!/^\d+$/.test(numero.trim())) {
          newErrors.numero = 'O número deve conter apenas dígitos não negativos.';
          isValid = false;
        }
      }
    }

    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
      newErrors.password = 'Senha com no mÃ­nimo 8 caracteres, com letra maiÃºscula, minÃºscula, nÃºmero e caractere especial.';
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
      const dadosEndereco = isManager ? {} : {
        cep: cep.replace(/\D/g, ''),
        numero: numero.trim(),
        complemento: complemento.trim() || undefined,
        endereco: enderecoCep.logradouro,
        bairro: enderecoCep.bairro || undefined,
        cidade: enderecoCep.cidade,
        estado: enderecoCep.estado
      };

      const response = await UsuarioService.create(
        name.trim(),
        emailNormalizado,
        password,
        nivelAcesso,
        dadosEndereco
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
      setNumero('');
      setComplemento('');
      cepAtualRef.current = '';
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
      <div className="register-form-container auth-card auth-register-card" id="register-form-top">
        <aside className="auth-visual-panel" aria-label="Conheça o LOGYM">
          <img src={logo} alt="LOGYM" className="auth-panel-logo" />
          <div className="auth-visual-content">
            <span className="auth-panel-kicker">Movimento que conecta</span>
            <h2>Faça parte do LOGYM</h2>
            <p>Crie sua conta e encontre a academia ideal para você.</p>
            <ul className="auth-benefits-list">
              <li>Academias próximas</li>
              <li>Compare academias</li>
              <li>Salve suas favoritas</li>
            </ul>
          </div>
        </aside>

        <div className="auth-form-panel register-form-panel">
        <div className="register-header">
          <span className="auth-form-kicker">Comece agora</span>
          <h1>Crie sua conta</h1>
          <p>Preencha seus dados para acessar todas as opções do LOGYM.</p>
        </div>

        {apiMessage && (
          <p className={apiMessage.startsWith('Erro') ? 'register-api-error' : 'register-api-success'}>
            {apiMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`register-field register-field-full ${getFieldErrorClass('name')}`}>
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

          <div className={`register-field ${getFieldErrorClass('email')}`}>
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
              <div className={`register-field ${getFieldErrorClass('cep')}`}>
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

                  <div className={getFieldErrorClass('numero')}>
                    <Input
                      label="Número"
                      type="text"
                      id="numero"
                      name="numero"
                      value={numero}
                      placeholder="Digite o número"
                      inputMode="numeric"
                      onChange={(e) => {
                        setNumero(e.target.value.replace(/\D/g, ''));
                        limparErroCampo('numero');
                      }}
                    />
                    <ErrorMessage message={errors.numero} />
                  </div>

                  <Input
                    label="Complemento"
                    type="text"
                    id="complemento"
                    name="complemento"
                    value={complemento}
                    placeholder="Opcional"
                    onChange={(e) => {
                      setComplemento(e.target.value);
                      setApiMessage('');
                    }}
                  />
                </div>
              )}
            </>
          )}

          <div className={`register-field register-password-field ${getFieldErrorClass('password')}`}>
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                limparErroCampo('password');
              }}
              endAdornment={
                <button
                  type="button"
                  className="password-visibility-button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18" /><path d="M10.6 5.1A11.3 11.3 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.1 3.8" /><path d="M6.2 6.2A18.6 18.6 0 0 0 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
                  )}
                </button>
              }
            />
            <p className="register-password-requirements">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 10v6" />
                <path d="M12 7h.01" />
              </svg>
              <span>A senha deve ter no mínimo 8 caracteres e incluir letra maiúscula, letra minúscula, número e caractere especial.</span>
            </p>
            <ErrorMessage message={errors.password} />
          </div>

          <div className={`register-field register-password-field ${getFieldErrorClass('confirmPassword')}`}>
            <Input
              label="Confirme a Senha"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                limparErroCampo('confirmPassword');
              }}
              endAdornment={
                <button
                  type="button"
                  className="password-visibility-button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18" /><path d="M10.6 5.1A11.3 11.3 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.1 3.8" /><path d="M6.2 6.2A18.6 18.6 0 0 0 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
                  )}
                </button>
              }
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
                    setNumero('');
                    setComplemento('');
                    cepAtualRef.current = '';
                    limparEnderecoCep();
                    setErrors((prev) => ({ ...prev, cep: '', numero: '' }));
                  }
                }}
                className="register-manager-checkbox-input"
              />
              <span>
                <strong>Sou proprietário/gerente de academia</strong>
                <small>Quero cadastrar e administrar academias no LOGYM.</small>
              </span>
            </label>
          </div>

          <Button type="submit" className="button-primary" disabled={loading || buscandoCep}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <p className="auth-switch-link">
          Já tem uma conta? <Link to="/login" className="link">Faça Login</Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
