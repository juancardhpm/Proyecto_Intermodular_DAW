// frontend/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          &copy; {new Date().getFullYear()} Gaming Store. Todos los derechos reservados.
        </p>
        <div style={styles.socialIcons}>
          <a href="https://facebook.com" style={styles.icon} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://twitter.com" style={styles.icon} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://instagram.com" style={styles.icon} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#0b0b0d',
    color: '#fff',
    padding: '20px 0',
    textAlign: 'center',
    marginTop: '40px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  text: {
    marginBottom: '10px',
    fontSize: '1rem',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  icon: {
    color: '#a855f7',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
};

export default Footer;