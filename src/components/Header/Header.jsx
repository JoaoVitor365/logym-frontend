// src/components/Header/Header.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layouts/_header.css';
import logoSimples from '../../assets/logoSimples.png'; // Importação da imagem

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo e Texto LOGYM */}
        <div className="logo-container">
          <Link to="/" className="logo-wrapper">
            <img src={logoSimples} alt="Logo" className="logo-image" />
            <span className="logo-text">LOGYM</span>
          </Link>
        </div>

        {/* Botão do Menu Hambúrguer (visível apenas em telas pequenas) */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>

        {/* Links da Navegação */}
        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className='nav-link'>Início</Link>
          <Link to="/cadastrar-academia" className="nav-link">Cadastrar Academia</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/cadastrar" className="nav-link">Cadastrar</Link>
        </nav>

      </div>
    </header>
  );
}

export default Header;
