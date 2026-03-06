// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importante para que no recargue la página

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2026 Gaming Store JCS. Todos los derechos reservados.</p>
        <div className="footer-links">
          {/* Usamos Link en lugar de <a> para que la navegación sea instantánea */}
          <Link to="/about">Sobre nosotros</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/privacy-policy">Política de privacidad</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;