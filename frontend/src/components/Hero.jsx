// frontend/src/components/Hero.jsx

import React from 'react';

const Hero = ({ videoUrl }) => {
  const videoId = getYouTubeId(videoUrl);

  return (
    <section style={styles.hero}>
      {videoId && (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={styles.video}
        />
      )}

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
  video: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100vw',
    height: '56.25vw',
    minHeight: '100vh',
    minWidth: '177.77vh',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    zIndex: 0,
    pointerEvents: 'none',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
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
};

export default Hero;