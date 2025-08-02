// src/components/Header/Header.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layouts/_header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo Centralizado */}
        <div className="logo-container">          
          <Link to="/" className="nav-link logo-text">LOGYM</Link>
        </div>

        {/* Botão do Menu Hambúrguer (visível apenas em telas pequenas) */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>

        {/* Links da Navegação */}
        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/cadastrar-academia" className="nav-link">Cadastrar Academia</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/cadastrar" className="nav-link">Cadastrar</Link>
        </nav>

      </div>
    </header>
  );
}

export default Header;