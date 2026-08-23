import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import RecuperarSenhaService from '../../services/RecuperarSenhaService';

import '../../styles/pages/_forgotPassword.css';
import logo from '../../assets/logoFundo.png';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [erros, setErros] = useState({});

  const exibirMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
  };

  const limparFeedback = () => {
    setMensagem({ texto: '', tipo: '' });
  };

  const obterMensagemErro = (error, fallback) => {
    const dados = error.response?.data;
    const mensagemBackend = dados?.message || dados?.error || dados;

    if (typeof mensagemBackend === 'string' && mensagemBackend.trim()) {
      return mensagemBackend;
    }

    if (!error.response) {
      return 'Não foi possível concluir a solicitação. Verifique sua conexão e tente novamente.';
    }

    return fallback;
  };

  const validarEmail = () => {
    const emailNormalizado = email.trim();

    if (!emailNormalizado) {
      setErros({ email: 'O campo e-mail é obrigatório.' });
      return null;
    }

    if (!EMAIL_REGEX.test(emailNormalizado)) {
      setErros({ email: 'Por favor, insira um e-mail válido.' });
      return null;
    }

    return emailNormalizado;
  };

  const solicitarCodigo = async (event) => {
    event.preventDefault();
    const emailNormalizado = validarEmail();

    if (!emailNormalizado || loadingAction) {
      return;
    }

    setErros({});
    limparFeedback();
    setLoadingAction('solicitar');

    try {
      await RecuperarSenhaService.solicitarCodigo(emailNormalizado);
      setEmail(emailNormalizado);
      setEtapa(2);
      exibirMensagem('Código enviado. Verifique seu e-mail.', 'sucesso');
    } catch (error) {
      exibirMensagem(
        obterMensagemErro(error, 'Não foi possível enviar o código. Tente novamente.'),
        'erro'
      );
    } finally {
      setLoadingAction('');
    }
  };

  const validarCodigo = async (event) => {
    event.preventDefault();

    if (codigo.length !== 6) {
      setErros({ codigo: 'Informe o código de 6 dígitos.' });
      return;
    }

    if (loadingAction) {
      return;
    }

    setErros({});
    limparFeedback();
    setLoadingAction('validar');

    try {
      const response = await RecuperarSenhaService.validarCodigo(email, codigo);

      if (response.data?.valido === true) {
        setEtapa(3);
        return;
      }

      exibirMensagem('Código inválido ou expirado.', 'erro');
    } catch (error) {
      exibirMensagem(
        obterMensagemErro(error, 'Código inválido ou expirado.'),
        'erro'
      );
    } finally {
      setLoadingAction('');
    }
  };

  const reenviarCodigo = async () => {
    if (loadingAction) {
      return;
    }

    setErros({});
    limparFeedback();
    setLoadingAction('reenviar');

    try {
      await RecuperarSenhaService.solicitarCodigo(email);
      setCodigo('');
      exibirMensagem('Um novo código foi enviado. Verifique seu e-mail.', 'sucesso');
    } catch (error) {
      exibirMensagem(
        obterMensagemErro(error, 'Não foi possível reenviar o código. Tente novamente.'),
        'erro'
      );
    } finally {
      setLoadingAction('');
    }
  };

  const redefinirSenha = async (event) => {
    event.preventDefault();
    const novosErros = {};

    if (!PASSWORD_REGEX.test(novaSenha)) {
      novosErros.novaSenha = 'A senha não atende aos requisitos informados.';
    }

    if (novaSenha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem.';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    if (loadingAction) {
      return;
    }

    setErros({});
    limparFeedback();
    setLoadingAction('redefinir');

    try {
      await RecuperarSenhaService.redefinirSenha(email, codigo, novaSenha);
      navigate('/login', { replace: true });
    } catch (error) {
      exibirMensagem(
        obterMensagemErro(error, 'Não foi possível redefinir a senha. Tente novamente.'),
        'erro'
      );
    } finally {
      setLoadingAction('');
    }
  };

  const voltarParaAlterarEmail = () => {
    if (loadingAction) {
      return;
    }

    setEtapa(1);
    setCodigo('');
    setErros({});
    limparFeedback();
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-form-container">
        <div className="forgot-password-header">
          <img src={logo} alt="Logo da LOGYM" className="forgot-password-logo" />
          <h1>Recuperação de senha</h1>
        </div>

        <p className="forgot-password-step">Etapa {etapa} de 3</p>

        {mensagem.texto && (
          <p className={`forgot-password-message ${mensagem.tipo}`} role={mensagem.tipo === 'erro' ? 'alert' : 'status'}>
            {mensagem.texto}
          </p>
        )}

        {etapa === 1 && (
          <>
            <p className="forgot-password-intro">
              Informe seu e-mail para receber um código de recuperação.
            </p>

            <form onSubmit={solicitarCodigo} noValidate>
              <div className={`input-group ${erros.email ? 'has-error' : ''}`}>
                <label htmlFor="email" className="input-label">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErros((atual) => ({ ...atual, email: '' }));
                    limparFeedback();
                  }}
                  className="input-field"
                  autoComplete="email"
                  disabled={Boolean(loadingAction)}
                  aria-invalid={Boolean(erros.email)}
                />
              </div>
              <ErrorMessage message={erros.email} />

              <button type="submit" className="button button-primary" disabled={Boolean(loadingAction)}>
                {loadingAction === 'solicitar' ? 'Enviando código...' : 'Enviar código'}
              </button>
            </form>
          </>
        )}

        {etapa === 2 && (
          <>
            <p className="forgot-password-intro">
              Enviamos um código para <strong>{email}</strong>.
            </p>

            <form onSubmit={validarCodigo} noValidate>
              <div className={`input-group ${erros.codigo ? 'has-error' : ''}`}>
                <label htmlFor="codigo" className="input-label">Código de 6 dígitos</label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  placeholder="000000"
                  value={codigo}
                  onChange={(event) => {
                    setCodigo(event.target.value.replace(/\D/g, '').slice(0, 6));
                    setErros((atual) => ({ ...atual, codigo: '' }));
                    limparFeedback();
                  }}
                  className="input-field forgot-password-code-input"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  disabled={Boolean(loadingAction)}
                  aria-invalid={Boolean(erros.codigo)}
                />
              </div>
              <ErrorMessage message={erros.codigo} />

              <button type="submit" className="button button-primary" disabled={Boolean(loadingAction)}>
                {loadingAction === 'validar' ? 'Validando código...' : 'Validar código'}
              </button>
            </form>

            <div className="forgot-password-secondary-actions">
              <button type="button" className="forgot-password-text-button" onClick={reenviarCodigo} disabled={Boolean(loadingAction)}>
                {loadingAction === 'reenviar' ? 'Reenviando código...' : 'Reenviar código'}
              </button>
              <button type="button" className="forgot-password-text-button" onClick={voltarParaAlterarEmail} disabled={Boolean(loadingAction)}>
                Alterar e-mail
              </button>
            </div>
          </>
        )}

        {etapa === 3 && (
          <>
            <p className="forgot-password-intro">
              Crie uma nova senha para sua conta.
            </p>

            <form onSubmit={redefinirSenha} noValidate>
              <div className={`input-group forgot-password-password-group ${erros.novaSenha ? 'has-error' : ''}`}>
                <label htmlFor="novaSenha" className="input-label">Nova senha</label>
                <div className="forgot-password-password-wrapper">
                  <input
                    type={mostrarNovaSenha ? 'text' : 'password'}
                    id="novaSenha"
                    name="novaSenha"
                    placeholder="Digite sua nova senha"
                    value={novaSenha}
                    onChange={(event) => {
                      setNovaSenha(event.target.value);
                      setErros((atual) => ({ ...atual, novaSenha: '' }));
                      limparFeedback();
                    }}
                    className="input-field"
                    autoComplete="new-password"
                    disabled={Boolean(loadingAction)}
                    aria-invalid={Boolean(erros.novaSenha)}
                  />
                  <button
                    type="button"
                    className="forgot-password-visibility-button"
                    onClick={() => setMostrarNovaSenha((atual) => !atual)}
                    disabled={Boolean(loadingAction)}
                    aria-label={mostrarNovaSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarNovaSenha ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 5.1A11.3 11.3 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.1 3.8" />
                        <path d="M6.2 6.2A18.6 18.6 0 0 0 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" />
                        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <ErrorMessage message={erros.novaSenha} />

              <div className={`input-group forgot-password-password-group ${erros.confirmarSenha ? 'has-error' : ''}`}>
                <label htmlFor="confirmarSenha" className="input-label">Confirmar nova senha</label>
                <div className="forgot-password-password-wrapper">
                  <input
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    id="confirmarSenha"
                    name="confirmarSenha"
                    placeholder="Confirme sua nova senha"
                    value={confirmarSenha}
                    onChange={(event) => {
                      setConfirmarSenha(event.target.value);
                      setErros((atual) => ({ ...atual, confirmarSenha: '' }));
                      limparFeedback();
                    }}
                    className="input-field"
                    autoComplete="new-password"
                    disabled={Boolean(loadingAction)}
                    aria-invalid={Boolean(erros.confirmarSenha)}
                  />
                  <button
                    type="button"
                    className="forgot-password-visibility-button"
                    onClick={() => setMostrarConfirmarSenha((atual) => !atual)}
                    disabled={Boolean(loadingAction)}
                    aria-label={mostrarConfirmarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarConfirmarSenha ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 5.1A11.3 11.3 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.1 3.8" />
                        <path d="M6.2 6.2A18.6 18.6 0 0 0 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" />
                        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <ErrorMessage message={erros.confirmarSenha} />

              <p className="forgot-password-requirements">
                A senha deve ter entre 8 e 64 caracteres, incluindo letra maiúscula, letra minúscula, número e caractere especial.
              </p>

              <button type="submit" className="button button-primary" disabled={Boolean(loadingAction)}>
                {loadingAction === 'redefinir' ? 'Redefinindo senha...' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}

        <p className="back-to-login">
          Lembrou da senha? <Link to="/login" className="link">Fazer Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
