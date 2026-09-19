// src/pages/ProfilePage.jsx
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UsuarioService from '../../services/UsuarioService';
import '../../styles/pages/_profile.css';

const formatCEP = (value) => {
  const rawValue = String(value || '').replace(/\D/g, '').slice(0, 8);
  return rawValue.replace(/^(\d{5})(\d)/, '$1-$2');
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/;

function ProfilePage({ onUserUpdated }) {
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    id: '',
    nome: '',
    username: '',
    password: '',
    nivelAcesso: '',
    cep: '',
    numero: '',
    complemento: ''
  });

  const [enderecoCep, setEnderecoCep] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const [preview, setPreview] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [cepError, setCepError] = useState('');
  const [numeroError, setNumeroError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInactivateConfirm, setShowInactivateConfirm] = useState(false);
  const cepAtualRef = useRef('');
  const enderecoInicialRef = useRef({ cep: '', numero: '' });

  const limparEnderecoCep = useCallback(() => {
    setEnderecoCep({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }, []);

  const buscarEnderecoPorCep = useCallback(async (cepFormatado) => {
    const cepLimpo = String(cepFormatado || '').replace(/\D/g, '');

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
        setCepError('CEP não encontrado.');
        return;
      }

      setEnderecoCep({
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      });

      setCepError('');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);

      if (cepAtualRef.current !== cepLimpo) {
        return;
      }

      limparEnderecoCep();
      setCepError('Não foi possível buscar o CEP agora.');
    } finally {
      if (cepAtualRef.current === cepLimpo) {
        setBuscandoCep(false);
      }
    }
  }, [limparEnderecoCep]);

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      const parsedUser = JSON.parse(userData);
      const cepFormatado = formatCEP(parsedUser.cep || '');
      const numeroAtual = parsedUser.numero ?? '';

      setUser({
        id: parsedUser.id,
        nome: parsedUser.nome,
        username: parsedUser.username,
        nivelAcesso: parsedUser.nivelAcesso,
        cep: cepFormatado,
        numero: String(numeroAtual),
        complemento: parsedUser.complemento ?? '',
        password: ''
      });

      cepAtualRef.current = cepFormatado.replace(/\D/g, '');
      enderecoInicialRef.current = {
        cep: cepFormatado.replace(/\D/g, ''),
        numero: String(numeroAtual)
      };

      if (parsedUser.nivelAcesso === 'USER' && cepFormatado.replace(/\D/g, '').length === 8) {
        buscarEnderecoPorCep(cepFormatado);
      }

      UsuarioService.getFoto(parsedUser.id)
        .then(response => {
          if (response.status === 204 || !response.data || response.data.size === 0) {
            setFotoUrl(null);
            return;
          }

          const url = URL.createObjectURL(response.data);
          setFotoUrl(url);
        })
        .catch(() => {
          setFotoUrl(null);
        });
    }
  }, [buscarEnderecoPorCep]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setApiMessage('');

    if (name === 'password') {
      setPasswordError('');
    }

    if (name === 'cep') {
      const cepFormatado = formatCEP(value);
      const cepLimpo = cepFormatado.replace(/\D/g, '');

      cepAtualRef.current = cepLimpo;
      limparEnderecoCep();
      setCepError('');

      setUser(prev => ({
        ...prev,
        cep: cepFormatado
      }));

      if (cepLimpo.length < 8) {
        setBuscandoCep(false);
        return;
      }

      buscarEnderecoPorCep(cepFormatado);
      return;
    }

    if (name === 'numero') {
      setUser(prev => ({
        ...prev,
        numero: value.replace(/\D/g, '')
      }));
      return;
    }

    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const montarDadosAtualizados = (incluirEnderecoCompleto = false) => {
    const dadosAtualizados = {
      nome: user.nome
    };

    if (user.nivelAcesso === 'USER') {
      const cepLimpo = user.cep.replace(/\D/g, '');
      const numeroNormalizado = String(user.numero || '').trim();
      const complementoNormalizado = String(user.complemento || '').trim();

      if (cepLimpo) {
        dadosAtualizados.cep = cepLimpo;
      }

      if (numeroNormalizado) {
        dadosAtualizados.numero = numeroNormalizado;
      }

      if (complementoNormalizado) {
        dadosAtualizados.complemento = complementoNormalizado;
      }

      if (incluirEnderecoCompleto) {
        dadosAtualizados.endereco = enderecoCep.logradouro;
        dadosAtualizados.bairro = enderecoCep.bairro || undefined;
        dadosAtualizados.cidade = enderecoCep.cidade;
        dadosAtualizados.estado = enderecoCep.estado;
      }
    }

    return dadosAtualizados;
  };

  const abrirSeletorFoto = () => {
    if (uploadingPhoto || loading) return;

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setApiMessage('Erro: selecione apenas arquivos de imagem.');
      return;
    }

    setUploadingPhoto(true);
    setApiMessage('');

    try {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);

      const dadosAtualizados = montarDadosAtualizados();

      const response = await UsuarioService.editar(
        user.id,
        dadosAtualizados,
        selectedFile
      );

      const updatedUser = response.data;

      const usuarioParaSalvar = {
        ...updatedUser,
        cep: updatedUser.cep ?? dadosAtualizados.cep ?? '',
        numero: updatedUser.numero ?? dadosAtualizados.numero ?? user.numero ?? '',
        complemento: updatedUser.complemento ?? dadosAtualizados.complemento ?? user.complemento ?? ''
      };

      localStorage.setItem('user', JSON.stringify(usuarioParaSalvar));
      onUserUpdated(usuarioParaSalvar);

      setUser(prev => ({
        ...prev,
        nome: usuarioParaSalvar.nome,
        username: usuarioParaSalvar.username,
        nivelAcesso: usuarioParaSalvar.nivelAcesso,
        cep: formatCEP(usuarioParaSalvar.cep || ''),
        numero: String(usuarioParaSalvar.numero ?? ''),
        complemento: usuarioParaSalvar.complemento ?? ''
      }));

      setFotoUrl(previewUrl);
      setPreview(null);

      window.dispatchEvent(new Event('profilePhotoUpdated'));

      setApiMessage('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      setPreview(null);
      setApiMessage('Erro ao atualizar foto de perfil.');
    } finally {
      setUploadingPhoto(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiMessage('');

    const scrollToFeedback = () => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    };

    if (user.nivelAcesso === 'USER') {
      const cepLimpo = user.cep.replace(/\D/g, '');
      const numeroNormalizado = String(user.numero || '').trim();

      if (cepLimpo.length !== 8) {
        setCepError('O CEP deve conter 8 dígitos.');
        setApiMessage('Erro: verifique o CEP antes de continuar.');
        scrollToFeedback();
        return;
      }

      if (!enderecoCep.logradouro || !enderecoCep.cidade || !enderecoCep.estado) {
        setCepError('Informe um CEP válido.');
        setApiMessage('Erro: verifique o CEP antes de continuar.');
        scrollToFeedback();
        return;
      }

      if (!/^\d+$/.test(numeroNormalizado)) {
        setNumeroError('O número deve conter apenas dígitos não negativos.');
        setApiMessage('Erro: verifique o número antes de continuar.');
        scrollToFeedback();
        return;
      }

      setNumeroError('');
    }

    if (user.password && !PASSWORD_REGEX.test(user.password)) {
      setPasswordError('A nova senha deve ter entre 8 e 64 caracteres, incluindo letra maiúscula, letra minúscula, número e caractere especial.');
      setApiMessage('Erro: verifique os requisitos da nova senha antes de continuar.');
      scrollToFeedback();
      return;
    }

    setLoading(true);

    try {
      const cepNumeroAlterados =
        user.cep.replace(/\D/g, '') !== enderecoInicialRef.current.cep ||
        String(user.numero || '').trim() !== enderecoInicialRef.current.numero;
      const dadosAtualizados = montarDadosAtualizados(cepNumeroAlterados);

      const response = await UsuarioService.editar(
        user.id,
        dadosAtualizados,
        null
      );

      if (user.password && user.password.trim() !== '') {
        await UsuarioService.alterarSenha(user.id, user.password);
      }

      const updatedUser = response.data;

      const usuarioParaSalvar = {
        ...updatedUser,
        cep: updatedUser.cep ?? dadosAtualizados.cep ?? '',
        numero: updatedUser.numero ?? dadosAtualizados.numero ?? user.numero ?? '',
        complemento: updatedUser.complemento ?? dadosAtualizados.complemento ?? user.complemento ?? ''
      };

      localStorage.setItem('user', JSON.stringify(usuarioParaSalvar));
      onUserUpdated(usuarioParaSalvar);

      setUser(prev => ({
        ...prev,
        nome: usuarioParaSalvar.nome,
        username: usuarioParaSalvar.username,
        nivelAcesso: usuarioParaSalvar.nivelAcesso,
        cep: formatCEP(usuarioParaSalvar.cep || ''),
        numero: String(usuarioParaSalvar.numero ?? ''),
        complemento: usuarioParaSalvar.complemento ?? '',
        password: ''
      }));
      setIsPasswordEditing(false);
      setPasswordError('');
      setShowPassword(false);

      enderecoInicialRef.current = {
        cep: String(usuarioParaSalvar.cep || '').replace(/\D/g, ''),
        numero: String(usuarioParaSalvar.numero ?? '')
      };
      cepAtualRef.current = enderecoInicialRef.current.cep;

      if (usuarioParaSalvar.nivelAcesso === 'USER') {
        buscarEnderecoPorCep(formatCEP(usuarioParaSalvar.cep || ''));
      }

      setApiMessage('Informações atualizadas com sucesso!');
      scrollToFeedback();

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setApiMessage('Erro ao atualizar informações.');
      scrollToFeedback();
    } finally {
      setLoading(false);
    }
  };

  const handleInactivateAccount = async () => {
    setApiMessage('');
    setLoading(true);

    try {
      await UsuarioService.inativar(user.id);

      localStorage.removeItem('user');
      setApiMessage('Conta inativada com sucesso! Redirecionando...');

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch {
      setApiMessage('Erro ao inativar conta.');
    } finally {
      setLoading(false);
      setShowInactivateConfirm(false);
    }
  };

  return (
    <div className="profile-page-container">
      <Link to="/" className="back-button">← Voltar para Home</Link>

      <header className="profile-page-header">
        <span className="profile-eyebrow">Minha conta</span>
        <h1>Meu perfil</h1>
        <p className="subtitle">Gerencie seus dados pessoais, endereço e segurança da conta.</p>
      </header>

      {apiMessage && (
        <p className={apiMessage.startsWith('Erro') ? 'profile-api-message profile-api-error' : 'profile-api-message profile-api-success'}>
          {apiMessage}
        </p>
      )}

      <div className="profile-photo-container">
        <div className="profile-photo-wrapper">
          {preview || fotoUrl ? (
            <img
              src={preview || fotoUrl}
              alt="Foto de perfil"
              className="profile-photo"
            />
          ) : (
            <div className="profile-photo-placeholder" aria-label="Foto de perfil padrão">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}

          <button
            type="button"
            className="profile-photo-edit-button"
            onClick={abrirSeletorFoto}
            disabled={uploadingPhoto}
            title={fotoUrl ? 'Trocar foto de perfil' : 'Adicionar foto de perfil'}
            aria-label={fotoUrl ? 'Trocar foto de perfil' : 'Adicionar foto de perfil'}
          >
            {uploadingPhoto ? (
              <span className="profile-photo-loading">...</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="profile-photo-hidden-input"
            onChange={handleProfilePhotoChange}
          />
        </div>

        <p className="profile-photo-help">
          Clique no ícone para {fotoUrl ? 'trocar' : 'adicionar'} sua foto.
        </p>
        <div className="profile-user-summary">
          <strong>{user.nome || 'Seu nome'}</strong>
          <span>{user.username || 'seuemail@exemplo.com'}</span>
          <p>Atualize sua foto e informações quando precisar.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <section className="profile-section" aria-labelledby="personal-data-title">
          <h2 id="personal-data-title">Dados pessoais</h2>
          <div className="profile-fields-grid profile-personal-grid">
            <div className="profile-field">
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={user.nome || ''}
          onChange={handleChange}
          required
        />
            </div>
            <div className="profile-field">
        <label htmlFor="username">E-mail</label>
        <input
          type="email"
          id="username"
          name="username"
          value={user.username || ''}
          disabled
        />
            </div>
          </div>
        </section>

        {user.nivelAcesso === 'USER' && (
          <section className="profile-section" aria-labelledby="address-title">
            <h2 id="address-title">Endereço</h2>
            <div className="profile-fields-grid profile-address-inputs">
              <div className="profile-field">
            <label htmlFor="cep" className={cepError ? 'profile-label-error' : ''}>
              {buscandoCep ? 'CEP - buscando endereço...' : 'CEP'}
            </label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={user.cep || ''}
              onChange={handleChange}
              maxLength="9"
              placeholder="Digite seu CEP"
              required
              className={cepError ? 'profile-input-error' : ''}
            />

            {cepError && (
              <p className="error-message profile-cep-error-message">
                {cepError}
              </p>
            )}
              </div>
              <div className="profile-field">
            <label htmlFor="numero" className={numeroError ? 'profile-label-error' : ''}>Número</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={user.numero || ''}
              onChange={(event) => {
                handleChange(event);
                setNumeroError('');
              }}
              inputMode="numeric"
              placeholder="Digite o número"
              className={numeroError ? 'profile-input-error' : ''}
            />

            {numeroError && (
              <p className="error-message profile-cep-error-message">
                {numeroError}
              </p>
            )}
              </div>
              <div className="profile-field profile-field-full">
            <label htmlFor="complemento">Complemento</label>
            <input
              type="text"
              id="complemento"
              name="complemento"
              value={user.complemento || ''}
              onChange={handleChange}
              placeholder="Opcional"
            />
              </div>
            </div>

            {(enderecoCep.logradouro || enderecoCep.bairro || enderecoCep.cidade || enderecoCep.estado) && (
              <div className="profile-viacep-box">
                <h3>Endereço encontrado</h3>

                <div className="profile-address-grid">
                  <div className="profile-address-field profile-address-large">
                    <label>Endereço</label>
                    <input
                      type="text"
                      value={enderecoCep.logradouro}
                      disabled
                    />
                  </div>

                  <div className="profile-address-field">
                    <label>Bairro</label>
                    <input
                      type="text"
                      value={enderecoCep.bairro}
                      disabled
                    />
                  </div>

                  <div className="profile-address-field">
                    <label>Cidade</label>
                    <input
                      type="text"
                      value={enderecoCep.cidade}
                      disabled
                    />
                  </div>

                  <div className="profile-address-field profile-address-small">
                    <label>Estado</label>
                    <input
                      type="text"
                      value={enderecoCep.estado}
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        <section className="profile-section profile-password-section" aria-labelledby="password-title">
          <div className="profile-section-heading">
            <h2 id="password-title">Segurança</h2>
            <p>Altere sua senha apenas quando necessário.</p>
          </div>
          <div className="profile-field">
            <label htmlFor="password">Nova senha</label>
            <div className="profile-password-row">
              <div className="profile-password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={user.password || ''}
                  onChange={handleChange}
                  disabled={!isPasswordEditing}
                  placeholder="Deixe em branco para não alterar"
                  autoComplete="new-password"
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby="password-requirements password-error"
                  className={passwordError ? 'profile-input-error' : ''}
                />
                <button
                  type="button"
                  className="profile-password-visibility-button"
                  onClick={() => setShowPassword(current => !current)}
                  disabled={!isPasswordEditing}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18" /><path d="M10.6 5.1A11.3 11.3 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.1 3.8" /><path d="M6.2 6.2A18.6 18.6 0 0 0 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
                  )}
                </button>
              </div>
              <div className="profile-password-actions">
                {isPasswordEditing ? (
                  <button
                    type="button"
                    className="profile-password-cancel-button"
                    onClick={() => {
                      setUser(prev => ({ ...prev, password: '' }));
                      setPasswordError('');
                      setIsPasswordEditing(false);
                      setShowPassword(false);
                    }}
                  >
                    Cancelar alteração
                  </button>
                ) : (
                  <button type="button" className="edit-button" onClick={() => setIsPasswordEditing(true)}>
                    Alterar senha
                  </button>
                )}
              </div>
            </div>
            {passwordError && <p id="password-error" className="error-message profile-password-error-message">{passwordError}</p>}
            <p id="password-requirements" className="profile-password-requirements">
              Senha com no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.
            </p>
          </div>
        </section>
        <div className="profile-save-actions">
          <button type="submit" className="save-button" disabled={loading || buscandoCep}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>

      <section className="profile-danger-zone" aria-label="Ações da conta">
        <div>
          <h2>Gerenciamento da conta</h2>
          <p>Inativar sua conta impedirá o uso normal até a reativação conforme as regras existentes.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowInactivateConfirm(true)}
          className="cancel-button"
        >
          Inativar conta
        </button>
      </section>

      {showInactivateConfirm && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <h3>Confirmar Inativação</h3>
            <p>Tem certeza que deseja inativar sua conta?</p>

            <div className="profile-modal-actions">
              <button
                type="button"
                onClick={handleInactivateAccount}
                disabled={loading}
                className="profile-modal-confirm-button"
              >
                {loading ? 'Inativando...' : 'Sim, Inativar'}
              </button>

              <button
                type="button"
                onClick={() => setShowInactivateConfirm(false)}
                className="profile-modal-cancel-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
