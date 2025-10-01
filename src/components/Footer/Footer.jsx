// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layouts/_footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Links de navegação do rodapé */}
        
        
        {/* Parágrafo de copyright */}
        <p className="footer-text">&copy; {currentYear} LOGYM. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
