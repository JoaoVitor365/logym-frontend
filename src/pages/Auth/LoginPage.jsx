import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import UsuarioService from '../../services/UsuarioService';

import '../../styles/pages/_login.css';
import logo from '../../assets/logoFundo.png';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  const navigate = useNavigate();

  // Lê parâmetros da URL.
  // Exemplo:
  // /login?redirect=/profile
  // /login?redirect=/esqueci-minha-senha
  const [searchParams] = useSearchParams();
  const redirectDepoisLogin = searchParams.get('redirect');

  // Garante que o redirect seja seguro.
  // Só aceitamos rotas internas que começam com "/".
  // Isso evita redirecionar para sites externos.
  function getRedirectSeguro() {
    if (!redirectDepoisLogin) {
      return '/';
    }

    if (!redirectDepoisLogin.startsWith('/')) {
      return '/';
    }

    return redirectDepoisLogin;
  }

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!username) {
      newErrors.username = 'O e-mail é obrigatório.';
      isValid = false;
    }

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

  const tratarMensagemErroLogin = (error) => {
    const mensagemBackend =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data;

    if (typeof mensagemBackend === 'string') {
      if (
        mensagemBackend.includes('SUSPENSO') ||
        mensagemBackend.toLowerCase().includes('suspensa')
      ) {
        return 'Sua conta foi suspensa pelo administrador. Entre em contato com o suporte.';
      }

      if (
        mensagemBackend.includes('INATIVO') ||
        mensagemBackend.toLowerCase().includes('inativa')
      ) {
        return 'Sua conta está inativa. Entre em contato com o suporte.';
      }

      return mensagemBackend;
    }

    return 'Erro ao fazer login. Verifique suas credenciais.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');

    if (validateForm()) {
      setLoading(true);

      try {
        /*
          Antes de tentar autenticar, verificamos o status da conta.
          Assim conseguimos mostrar uma mensagem clara quando o ADMIN
          suspendeu ou inativou o usuário.
        */
        const statusResponse = await UsuarioService.verificarStatusLogin(username);
        const statusLogin = statusResponse.data;

        if (statusLogin?.podeLogar === false) {
          setApiMessage(
            statusLogin.message || 'Esta conta não pode acessar o sistema.'
          );
          setLoading(false);
          return;
        }

        // Faz login no backend.
        await UsuarioService.login(username, password);

        // Busca os dados reais do usuário autenticado.
        const response = await UsuarioService.me();
        const userData = response.data;

        // Salva o usuário logado no navegador.
        localStorage.setItem('user', JSON.stringify(userData));

        // Atualiza o estado global do usuário logado.
        onLogin(userData);

        // Redireciona para a rota recebida na URL.
        // Exemplo:
        // /login?redirect=/profile
        // Depois do login, vai para /profile.
        navigate(getRedirectSeguro());
      } catch (error) {
        setApiMessage(tratarMensagemErroLogin(error));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="form-card auth-card">
        <aside className="auth-visual-panel" aria-label="Conheça o LOGYM">
          <img src={logo} alt="LOGYM" className="auth-panel-logo" />
          <div className="auth-visual-content">
            <span className="auth-panel-kicker">Seu treino começa aqui</span>
            <h2>Bem-vindo de volta</h2>
            <p>Encontre, compare e acompanhe as academias que combinam com você.</p>
            <ul className="auth-benefits-list">
              <li>Academias próximas</li>
              <li>Compare academias</li>
              <li>Salve suas favoritas</li>
            </ul>
          </div>
        </aside>

        <div className="auth-form-panel login-form-panel">
        <div className="login-header">
          <span className="auth-form-kicker">Acesse o LOGYM</span>
          <h1>Entre na sua conta</h1>
          <p>Use seu e-mail e senha para continuar.</p>
        </div>

        {apiMessage && (
          <p className="login-api-message">
            {apiMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="E-mail"
            type="email"
            id="username"
            name="username"
            placeholder="Digite seu e-mail"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: '' }));
              setApiMessage('');
            }}
            className={errors.username ? 'has-error' : ''}
          />

          <ErrorMessage message={errors.username} />

          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '' }));
              setApiMessage('');
            }}
            className={errors.password ? 'has-error' : ''}
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

          <ErrorMessage message={errors.password} />

          <Button
            type="submit"
            className="button-primary login-submit-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="auth-switch-link">
          Não tem uma conta?{' '}
          <Link to="/cadastrar" className="link">
            Cadastre-se
          </Link>
        </p>

        <p className="auth-forgot-link">
          Esqueceu a senha?{' '}
          <Link to="/esqueci-minha-senha" className="link">
            Esqueci Minha Senha
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
