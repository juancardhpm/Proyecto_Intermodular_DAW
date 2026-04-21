// frontend/src/components/Hero.jsx

import React from 'react';

const Hero = ({ imageUrl }) => {
  return (
    <section style={styles.hero}>
      <img 
        src={imageUrl} 
        alt="Hero Background" 
        style={styles.image} 
      />
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>La mejor tecnología para los jugadores más exigentes</h1>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Asegura que la imagen cubra toda el área sin distorsionarse
    zIndex: '-1', // La imagen debe estar detrás del contenido
  },
  heroContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    padding: '0 20px',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 10px rgba(0, 0, 0, 0.6)',
    lineHeight: '1.5',
    textTransform: 'uppercase',
  },
};

export default Hero;