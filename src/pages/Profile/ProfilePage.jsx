// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UsuarioService from '../../services/UsuarioService';
import '../../styles/pages/_profile.css';

const formatCEP = (value) => {
  const rawValue = String(value || '').replace(/\D/g, '').slice(0, 8);
  return rawValue.replace(/^(\d{5})(\d)/, '$1-$2');
};

function ProfilePage() {
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    id: '',
    nome: '',
    username: '',
    password: '',
    nivelAcesso: '',
    cep: ''
  });

  const [enderecoCep, setEnderecoCep] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const [preview, setPreview] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [cepError, setCepError] = useState('');
  const [showInactivateConfirm, setShowInactivateConfirm] = useState(false);

  const limparEnderecoCep = () => {
    setEnderecoCep({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  };

  const buscarEnderecoPorCep = async (cepFormatado) => {
    const cepLimpo = String(cepFormatado || '').replace(/\D/g, '');

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
      limparEnderecoCep();
      setCepError('Não foi possível buscar o CEP agora.');
    } finally {
      setBuscandoCep(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      const parsedUser = JSON.parse(userData);
      const cepFormatado = formatCEP(parsedUser.cep || '');

      setUser({
        id: parsedUser.id,
        nome: parsedUser.nome,
        username: parsedUser.username,
        nivelAcesso: parsedUser.nivelAcesso,
        cep: cepFormatado,
        password: ''
      });

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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setApiMessage('');

    if (name === 'cep') {
      const cepFormatado = formatCEP(value);
      const cepLimpo = cepFormatado.replace(/\D/g, '');

      setUser(prev => ({
        ...prev,
        cep: cepFormatado
      }));

      if (cepLimpo.length < 8) {
        limparEnderecoCep();
        setCepError('');
        return;
      }

      buscarEnderecoPorCep(cepFormatado);
      return;
    }

    setUser(prev => ({
      ...prev,
      [name]: value
    }));
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

      const dadosAtualizados = {
        nome: user.nome
      };

      if (user.nivelAcesso === 'USER') {
        dadosAtualizados.cep = user.cep.replace(/\D/g, '');
      }

      const response = await UsuarioService.editar(
        user.id,
        dadosAtualizados,
        selectedFile
      );

      const updatedUser = response.data;

      const usuarioParaSalvar = {
        ...updatedUser,
        cep: updatedUser.cep || dadosAtualizados.cep || ''
      };

      localStorage.setItem('user', JSON.stringify(usuarioParaSalvar));

      setUser(prev => ({
        ...prev,
        nome: usuarioParaSalvar.nome,
        username: usuarioParaSalvar.username,
        nivelAcesso: usuarioParaSalvar.nivelAcesso,
        cep: formatCEP(usuarioParaSalvar.cep || '')
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

    if (user.nivelAcesso === 'USER') {
      const cepLimpo = user.cep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) {
        setCepError('O CEP deve conter 8 dígitos.');
        setApiMessage('Erro: verifique o CEP antes de continuar.');
        return;
      }

      if (!enderecoCep.cidade || !enderecoCep.estado) {
        setCepError('Informe um CEP válido.');
        setApiMessage('Erro: verifique o CEP antes de continuar.');
        return;
      }
    }

    setLoading(true);

    try {
      const dadosAtualizados = {
        nome: user.nome
      };

      if (user.nivelAcesso === 'USER') {
        dadosAtualizados.cep = user.cep.replace(/\D/g, '');
      }

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
        cep: updatedUser.cep || dadosAtualizados.cep || ''
      };

      localStorage.setItem('user', JSON.stringify(usuarioParaSalvar));

      setUser(prev => ({
        ...prev,
        nome: usuarioParaSalvar.nome,
        username: usuarioParaSalvar.username,
        nivelAcesso: usuarioParaSalvar.nivelAcesso,
        cep: formatCEP(usuarioParaSalvar.cep || ''),
        password: ''
      }));

      if (usuarioParaSalvar.nivelAcesso === 'USER') {
        buscarEnderecoPorCep(formatCEP(usuarioParaSalvar.cep || ''));
      }

      setApiMessage('Informações atualizadas com sucesso!');
      setIsEditing(false);

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setApiMessage('Erro ao atualizar informações.');
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

    } catch (error) {
      setApiMessage('Erro ao inativar conta.');
    } finally {
      setLoading(false);
      setShowInactivateConfirm(false);
    }
  };

  return (
    <div className="profile-page-container">
      <Link to="/" className="back-button">← Voltar para Home</Link>

      <h1>Meu Perfil</h1>
      <p className="subtitle">Altere suas informações pessoais.</p>

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
      </div>

      <form onSubmit={handleSubmit} className="profile-form">

        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={user.nome || ''}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />

        <label htmlFor="username">E-mail</label>
        <input
          type="email"
          id="username"
          name="username"
          value={user.username || ''}
          disabled
        />

        {user.nivelAcesso === 'USER' && (
          <>
            <label htmlFor="cep" className={cepError ? 'profile-label-error' : ''}>
              {buscandoCep ? 'CEP - buscando endereço...' : 'CEP'}
            </label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={user.cep || ''}
              onChange={handleChange}
              disabled={!isEditing}
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
          </>
        )}

        {isEditing && (
          <>
            <label htmlFor="password">Nova Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password || ''}
              onChange={handleChange}
              placeholder="Deixe em branco para não alterar"
            />
          </>
        )}

        {isEditing && (
          <div className="button-group">
            <button type="submit" className="save-button" disabled={loading || buscandoCep}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        )}
      </form>

      <div className="button-group profile-main-actions">
        {!isEditing ? (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              Editar Informações
            </button>

            <button
              type="button"
              onClick={() => setShowInactivateConfirm(true)}
              className="cancel-button"
            >
              Inativar Conta
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setPreview(null);
            }}
            className="cancel-button"
          >
            Cancelar
          </button>
        )}
      </div>

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