// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2026 Gaming Store JCS. Todos los derechos reservados.</p>
        <div className="footer-links">
          <Link to="/about">Sobre nosotros</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/privacy-policy">Política de privacidad</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;