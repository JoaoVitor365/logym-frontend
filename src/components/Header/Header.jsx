// src/components/Header/Header.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layouts/_header.css';
import logoSimples from '../../assets/logoSimples.png'; // Importação da imagem

function Header() {
  // Estado para controlar a abertura/fechamento do menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para alternar o estado do menu
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
        {/* A classe 'open' é adicionada aqui para que o CSS possa animar o ícone */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          {/* As três barras do ícone do hambúrguer */}
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>

        {/* Links da Navegação */}
        {/* A classe 'open' é aplicada aqui para exibir o menu de navegação */}
        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/cadastrar-academia" className="nav-link" onClick={toggleMenu}>
            Cadastrar Academia
          </Link>
          <Link to="/login" className="nav-link" onClick={toggleMenu}>
            Login
          </Link>
          <Link to="/cadastrar" className="nav-link" onClick={toggleMenu}>
            Cadastrar
          </Link>
        </nav>

      </div>
    </header>
  );
}

export default Header;
