// frontend/src/components/Hero.jsx

import React, { useState } from 'react';

const Hero = ({ videoUrl }) => {
  const [isMuted, setIsMuted] = useState(false); // Estado para manejar el mute
  const videoId = getYouTubeId(videoUrl);

  const toggleMute = () => {
    setIsMuted(!isMuted); // Cambiar el estado de mute
  };

  return (
    <section style={styles.hero}>
      {videoId && (
        <div style={styles.videoWrapper}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={styles.video}
          />
        </div>
      )}

      {/* Ícono de audio en la esquina inferior derecha, por encima del video */}
      <button onClick={toggleMute} style={styles.audioButton}>
        {isMuted ? (
          <span role="img" aria-label="Mute">🔇</span> // Ícono de mute
        ) : (
          <span role="img" aria-label="Unmute">🔊</span> // Ícono de sonido
        )}
      </button>

      <div style={styles.overlay}></div>

      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>
          La mejor tecnología para los jugadores más exigentes
        </h1>
      </div>
    </section>
  );
};

const getYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const styles = {
  hero: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoWrapper: {
    position: 'absolute', // El video estará por detrás del contenido
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0, // El video debe estar detrás del contenido
  },
  video: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120%', // Aumentamos el tamaño para hacer el video más grande
    height: '120%', // Aumentamos el tamaño para que cubra más pantalla
    transform: 'translate(-50%, -50%)', // Aseguramos que se mantenga centrado
    border: 'none',
    pointerEvents: 'none', // El video no debe interferir con clics
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1, // El overlay estará encima del video
  },
  heroContent: {
    position: 'relative',
    zIndex: 2, // El contenido debe estar por encima del video
    textAlign: 'center',
    color: '#fff',
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
  audioButton: {
    position: 'absolute',
    bottom: '15px', // Ubicado en la esquina inferior derecha
    right: '15px',  // Alineado a la derecha del video
    background: 'transparent',
    border: 'none',
    color: '#d1d5db', // Gris claro
    fontSize: '1.5rem', // Tamaño grande pero discreto
    cursor: 'pointer',
    zIndex: 3, // Aseguramos que el botón esté por encima del video
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo translúcido para mayor visibilidad
  },
};

export default Hero;