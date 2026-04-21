// frontend/src/components/Hero.jsx

import React from 'react';

const Hero = ({ videoUrl }) => {
  return (
    <section style={styles.hero}>
      {videoUrl && (
        // Usamos el ID del video de YouTube extraído dinámicamente
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(videoUrl)}`} 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
          style={styles.video}
        ></iframe>
      )}

      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>La mejor tecnología para los jugadores más exigentes</h1>
      </div>
    </section>
  );
};

// Función para extraer el ID del video de YouTube
const getYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null; // Retorna el ID del video
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
    objectFit: 'cover', // Asegura que el video cubra toda el área sin distorsionarse
    zIndex: '-1', // El video debe estar detrás del contenido
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