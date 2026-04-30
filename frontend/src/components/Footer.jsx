// frontend/src/components/Footer.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const year = new Date().getFullYear();

  const getFooterLinkStyle = (key) => ({
    ...styles.footerLink,
    ...(hoveredItem === key ? styles.footerLinkHover : {})
  });

  const getSocialStyle = (key) => ({
    ...styles.socialIcon,
    ...(hoveredItem === key ? styles.socialIconHover : {})
  });

  return (
    <footer style={styles.footer}>
      <div style={styles.topGlow}></div>

      <div style={styles.container}>
        <div style={styles.footerGrid}>
          {/* Marca */}
          <div style={styles.brandBlock}>
            <Link
              to="/"
              style={{
                ...styles.logo,
                ...(hoveredItem === 'logo' ? styles.logoHover : {})
              }}
              onMouseEnter={() => setHoveredItem('logo')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span style={styles.logoIcon}>🕹️</span>
              <span>JCS</span>
              <span style={styles.logoAccent}>GAMING</span>
              <span>STORE</span>
            </Link>

            <p style={styles.brandText}>
              Tecnología gaming, periféricos y componentes para jugadores que buscan rendimiento,
              diseño y una experiencia superior.
            </p>

            <div style={styles.statusBox}>
              <span style={styles.statusDot}></span>
              <span>Inventario online disponible</span>
            </div>
          </div>

          {/* Navegación */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Navegación</h4>

            <Link
              to="/"
              style={getFooterLinkStyle('home')}
              onMouseEnter={() => setHoveredItem('home')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Home
            </Link>

            <Link
              to="/catalog"
              style={getFooterLinkStyle('catalog')}
              onMouseEnter={() => setHoveredItem('catalog')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Catálogo
            </Link>

            <Link
              to="/serviceform"
              style={getFooterLinkStyle('support')}
              onMouseEnter={() => setHoveredItem('support')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Asistencia
            </Link>

            <Link
              to="/cart"
              style={getFooterLinkStyle('cart')}
              onMouseEnter={() => setHoveredItem('cart')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Carrito
            </Link>
          </div>

          {/* Soporte */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Soporte</h4>

            <span style={styles.infoText}>Atención personalizada</span>
            <span style={styles.infoText}>Productos gaming seleccionados</span>
            <span style={styles.infoText}>Gestión de pedidos online</span>
            <span style={styles.infoText}>Asistencia técnica</span>
          </div>

          {/* Redes */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Comunidad</h4>

            <div style={styles.socialIcons}>
              <a
                href="https://facebook.com"
                style={getSocialStyle('facebook')}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredItem('facebook')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={styles.socialIconInner}>
                  <FacebookIcon />
                  <span>Facebook</span>
                </span>
              </a>

              <a
                href="https://x.com"
                style={getSocialStyle('x')}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredItem('x')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={styles.socialIconInner}>
                  <XIcon />
                  <span>X</span>
                </span>
              </a>

              <a
                href="https://instagram.com"
                style={getSocialStyle('instagram')}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredItem('instagram')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={styles.socialIconInner}>
                  <InstagramIcon />
                  <span>Instagram</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p style={styles.copyText}>
            &copy; {year} JCS Gaming Store. Todos los derechos reservados.
          </p>

          <div style={styles.bottomLinks}>
            <span style={styles.bottomItem}>Gaming</span>
            <span style={styles.separator}>/</span>
            <span style={styles.bottomItem}>Hardware</span>
            <span style={styles.separator}>/</span>
            <span style={styles.bottomItem}>Setup</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={styles.svgIcon}
  >
    <path d="M22 12.07C22 6.477 17.523 2 12 2S2 6.477 2 12.07c0 5.02 3.657 9.186 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.524 1.492-3.918 3.777-3.918 1.095 0 2.24.198 2.24.198v2.479H15.19c-1.242 0-1.63.776-1.63 1.572v1.894h2.773l-.443 2.9H13.56V22c4.78-.744 8.44-4.91 8.44-9.93z" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={styles.svgIcon}
  >
    <path d="M18.244 2H21l-6.55 7.49L22.5 22h-6.31l-4.94-6.47L5.6 22H2.84l7-8L1.5 2h6.47l4.47 5.9L18.244 2zm-1.107 18h1.53L7.135 3.896H5.49L17.137 20z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={styles.svgIcon}
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8z" />
  </svg>
);

const styles = {
  footer: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: '70px',
    padding: '60px 20px 24px',
    color: '#fff',
    background:
      'radial-gradient(circle at top left, rgba(168, 85, 247, 0.22), transparent 32%), radial-gradient(circle at top right, rgba(34, 211, 238, 0.12), transparent 28%), linear-gradient(180deg, #09090b 0%, #050508 100%)',
    borderTop: '1px solid rgba(168, 85, 247, 0.25)',
    boxShadow: '0 -18px 60px rgba(0, 0, 0, 0.45)',
  },

  topGlow: {
    position: 'absolute',
    top: '-90px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70%',
    height: '160px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.32), transparent 65%)',
    pointerEvents: 'none',
  },

  container: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1240px',
    margin: '0 auto',
  },

  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 1.4fr) repeat(3, minmax(180px, 1fr))',
    gap: '34px',
    alignItems: 'flex-start',
  },

  brandBlock: {
    padding: '22px',
    borderRadius: '22px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.65)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 18px 45px rgba(0,0,0,0.28)',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '7px',
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 950,
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '1.6px',
    transition: 'all 0.3s ease',
    textShadow: '0 0 18px rgba(168, 85, 247, 0.35)',
  },

  logoHover: {
    transform: 'translateY(-2px)',
    textShadow: '0 0 26px rgba(168, 85, 247, 0.85)',
  },

  logoIcon: {
    fontSize: '1.45rem',
    filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))',
  },

  logoAccent: {
    color: '#c084fc',
  },

  brandText: {
    margin: '16px 0 18px',
    color: '#a1a1aa',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },

  statusBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#34d399',
    fontSize: '0.78rem',
    fontWeight: 850,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },

  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 12px rgba(34, 197, 94, 0.8)',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '11px',
  },

  columnTitle: {
    margin: '0 0 8px',
    color: '#fff',
    fontSize: '0.92rem',
    fontWeight: 950,
    textTransform: 'uppercase',
    letterSpacing: '1.4px',
  },

  footerLink: {
    color: '#a1a1aa',
    textDecoration: 'none',
    fontSize: '0.92rem',
    fontWeight: 700,
    transition: 'all 0.25s ease',
  },

  footerLinkHover: {
    color: '#c084fc',
    transform: 'translateX(5px)',
    textShadow: '0 0 16px rgba(168, 85, 247, 0.55)',
  },

  infoText: {
    color: '#a1a1aa',
    fontSize: '0.92rem',
    lineHeight: 1.45,
  },

  socialIcons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '11px',
  },

  socialIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
    minHeight: '38px',
    padding: '0 14px',
    borderRadius: '999px',
    color: '#e4e4e7',
    background: 'rgba(255,255,255,0.055)',
    border: '1px solid rgba(255,255,255,0.08)',
    textDecoration: 'none',
    fontSize: '0.86rem',
    fontWeight: 850,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    transition: 'all 0.25s ease',
  },

  socialIconHover: {
    color: '#fff',
    transform: 'translateY(-2px)',
    background: 'rgba(168, 85, 247, 0.14)',
    border: '1px solid rgba(168, 85, 247, 0.42)',
    boxShadow: '0 0 22px rgba(168, 85, 247, 0.24)',
  },

  socialIconInner: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
  },

  svgIcon: {
    display: 'block',
    flexShrink: 0,
  },

  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginTop: '42px',
    paddingTop: '22px',
    borderTop: '1px solid rgba(255,255,255,0.09)',
    flexWrap: 'wrap',
  },

  copyText: {
    margin: 0,
    color: '#71717a',
    fontSize: '0.88rem',
  },

  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#71717a',
    fontSize: '0.82rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  bottomItem: {
    color: '#a1a1aa',
  },

  separator: {
    color: '#a855f7',
  },
};

export default Footer;