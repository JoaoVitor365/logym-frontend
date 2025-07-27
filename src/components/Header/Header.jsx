// src/components/Header/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importa o componente Link

function Header() {
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link">LoGYM</Link> {/* Link para a Home */}
          </li>
          <li>
            <Link to="/cadastrar-academia" className="nav-link">Cadastrar Academia</Link>
          </li>
          <li>
            <Link to="/login" className="nav-link">Login</Link>
          </li>
          <li>
            <Link to="/cadastrar" className="nav-link">Cadastrar</Link>
          </li>
          {/* Exemplo de link para detalhes de uma academia (você pode remover este depois) */}
          <li>
            <Link to="/academia/exemplo-id" className="nav-link">Academia Exemplo</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;