// src/components/Header/Header.jsx - Cabeçalho com autenticação
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layouts/_header.css';
import logoSimples from '../../assets/logoSimples.png';

function Header() {
  // Estado para controlar a abertura/fechamento do menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth(); // Hook de autenticação
  const navigate = useNavigate();

  // Função para alternar o estado do menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para fazer logout
  const handleLogout = () => {
    logout();
    navigate('/');
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
        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className='nav-link' onClick={toggleMenu}>Início</Link>
          
          {/* Mostrar links diferentes baseado na autenticação */}
          {isAuthenticated ? (
            // Usuário logado
            <>
              <Link to="/cadastrar-academia" className="nav-link" onClick={toggleMenu}>Cadastrar Academia</Link>
              <span className="user-info">Olá, {user?.name}</span>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Sair
              </button>
            </>
          ) : (
            // Usuário não logado
            <>
              <Link to="/login" className="nav-link" onClick={toggleMenu}>Login</Link>
              <Link to="/cadastrar" className="nav-link" onClick={toggleMenu}>Cadastrar</Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Header;
