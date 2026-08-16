// src/components/Header/Header.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UsuarioService from '../../services/UsuarioService';
import '../../styles/layouts/_header.css';
import logoSimples from '../../assets/logoSimples.png';

function Header({ isLoggedIn, currentUser, onLogout }) {
  const [fotoUrl, setFotoUrl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let objectUrlAtual = null;

    const carregarFoto = async () => {
      if (!isLoggedIn || !currentUser?.id) {
        setFotoUrl(null);
        return;
      }

      try {
        const response = await UsuarioService.getFoto(currentUser.id);

        if (response.status === 204 || !response.data || response.data.size === 0) {
          setFotoUrl(null);
          return;
        }

        const novaUrl = URL.createObjectURL(response.data);
        objectUrlAtual = novaUrl;
        setFotoUrl(novaUrl);
      } catch {
        setFotoUrl(null);
      }
    };

    carregarFoto();

    window.addEventListener('profilePhotoUpdated', carregarFoto);

    return () => {
      window.removeEventListener('profilePhotoUpdated', carregarFoto);

      if (objectUrlAtual) {
        URL.revokeObjectURL(objectUrlAtual);
      }
    };
  }, [isLoggedIn, currentUser?.id]);

  const getPrimeiroNome = () => {
    if (!currentUser?.nome) {
      return '';
    }

    return currentUser.nome.split(' ')[0];
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = () => {
    onLogout();
    toggleMenu();
  };

  return (
    <header className="header">
      <div className="header-container">

        <div className="logo-container">
          <Link to="/" className="logo-wrapper">
            <img src={logoSimples} alt="Logo" className="logo-image" />
            <span className="logo-text">LOGYM</span>
          </Link>
        </div>

        <button
          type="button"
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
        >
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>

          {isLoggedIn ? (
            <>
              <div className="header-user-info">
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt="Foto de perfil"
                    className="header-user-photo"
                  />
                ) : (
                  <div className="header-user-placeholder">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}

                <span className="header-user-name">
                  {getPrimeiroNome()}
                </span>
              </div>

              <Link to="/profile" className="nav-link profile-link" onClick={toggleMenu}>
                Meu Perfil
              </Link>

              {currentUser?.nivelAcesso === 'MANAGER' && (
                <Link to="/painel-gerente" className="nav-link header-panel-link" onClick={toggleMenu}>
                  Painel Gerente
                </Link>
              )}

              {currentUser?.nivelAcesso === 'ADMIN' && (
                <Link to="/painel-admin" className="nav-link header-panel-link" onClick={toggleMenu}>
                  Painel Admin
                </Link>
              )}

              {currentUser?.nivelAcesso === 'USER' && (
                <Link to="/favoritos" className="nav-link header-favorites-link" onClick={toggleMenu}>
                  Favoritos
                </Link>
              )}

              <Link to="/" className="nav-link profile-link header-logout-link" onClick={handleLogoutClick}>
                Sair
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/cadastrar" className="nav-link primary-button" onClick={toggleMenu}>
                Cadastrar
              </Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Header;
