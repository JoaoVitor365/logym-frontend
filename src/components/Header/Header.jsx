// src/components/Header/Header.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layouts/_header.css';
import logoSimples from '../../assets/logoSimples.png';

// 1. O componente agora recebe 'isLoggedIn' e 'onLogout' como props
function Header({ isLoggedIn, onLogout }) { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // REMOVIDO: O estado 'isLoggedIn' e a função 'handleLogout' foram movidos para App.jsx

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Novo handler que chama o 'onLogout' que veio do App.jsx
  const handleLogoutClick = () => {
    onLogout(); // Chama a função que muda o estado no App.jsx
    toggleMenu(); // Fecha o menu
    // O alert foi movido para o App.jsx, mas você pode adicionar um aqui se quiser
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo e Texto LOGYM (Nenhuma alteração aqui) */}
        <div className="logo-container">
          <Link to="/" className="logo-wrapper">
            <img src={logoSimples} alt="Logo" className="logo-image" />
            <span className="logo-text">LOGYM</span>
          </Link>
        </div>

        {/* Botão do Menu Hambúrguer (sem alterações) */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>

        {/* Links da Navegação */}
        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          
          {/* Link Fixo */}
          <Link to="/cadastrar-academia" className="nav-link" onClick={toggleMenu}>
            Cadastrar Academia
          </Link>
          
          {/* LÓGICA CONDICIONAL DE NAVEGAÇÃO USANDO A PROP */}
          {isLoggedIn ? (
            // Exibir quando o usuário está logado
            <>
              <Link to="/profile" className="nav-link profile-link" onClick={toggleMenu}>
                Meu Perfil
              </Link>
              
              <Link to="/" className="nav-link profile-link" onClick={handleLogoutClick}>
                Sair
              </Link>
            </>
          ) : (
            // Exibir quando o usuário está deslogado
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