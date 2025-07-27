// src/components/Footer/Footer.jsx
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear(); // Pega o ano atual dinamicamente

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} LoGYM. Todos os direitos reservados.</p>
        <nav className="footer-nav">
          <a href="#" className="footer-link">Privacidade</a>
          <a href="#" className="footer-link">Termos de Uso</a>
          <a href="#" className="footer-link">Contato</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;