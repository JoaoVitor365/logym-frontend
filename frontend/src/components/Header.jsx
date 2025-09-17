import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          LOGYM
        </Link>
        <nav className="header-buttons">
          <Link to="/perfil" className="user-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4"/>
              <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/>
            </svg>
          </Link>
          <Link to="/cadastrar-academia" className="btn-header">
            CADASTRAR ACADEMIA
          </Link>
          <Link to="/login" className="btn-header">
            LOGIN
          </Link>
          <Link to="/cadastrar" className="btn-header">
            CADASTRAR
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header