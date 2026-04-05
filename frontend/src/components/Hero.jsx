// frontend/src/components/Hero.jsx
import React from 'react';

const Hero = ({ videoUrl }) => {
  return (
    <section style={styles.hero}>
      <iframe
        width="100%"
        height="100%"
        src={videoUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={styles.video}
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
  video: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: '-1',
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