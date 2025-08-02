// src/components/Footer/Footer.jsx
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear(); // Pega o ano atual dinamicamente

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} LOGYM. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;