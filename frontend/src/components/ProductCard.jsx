import React, { useState } from 'react';
import api from '../api/axios';

const ProductCard = ({ product }) => {
  const [agregado, setAgregado] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const hasStock = product.stock > 0;

  const handleAddToCart = async () => {
    if (!hasStock) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
      try {
        await api.post('/cart/add', {
          user_id: user.id,
          product_id: product.id,
          quantity: 1
        });
        showFeedback();
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Error al añadir al carrito";
        alert(errorMsg);
        console.error("Error al guardar en DB", err);
      }
    } else {
      const cart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const index = cart.findIndex(item => item.product.id === product.id);

      if (index !== -1) {
        if (cart[index].quantity < product.stock) {
          cart[index].quantity += 1;
          showFeedback();
        } else {
          alert(`Límite alcanzado. Solo hay ${product.stock} disponibles.`);
        }
      } else {
        cart.push({ product, quantity: 1 });
        showFeedback();
      }

      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  };

  const showFeedback = () => {
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
        opacity: hasStock ? 1 : 0.72
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setBtnHovered(false);
      }}
    >
      <div
        style={{
          ...styles.neonGlow,
          opacity: hovered ? 1 : 0
        }}
      />

      <div style={styles.imageContainer}>
        <img
          src={product.imagen_url || 'https://via.placeholder.com/400x300'}
          alt={product.nombre}
          style={{
            ...styles.img,
            ...(hovered ? styles.imgHover : {})
          }}
        />

        <div style={styles.imageOverlay} />

        <span
          style={{
            ...styles.floatingStock,
            color: hasStock ? '#34d399' : '#f87171',
            backgroundColor: hasStock
              ? 'rgba(16, 185, 129, 0.14)'
              : 'rgba(239, 68, 68, 0.14)',
            border: hasStock
              ? '1px solid rgba(16, 185, 129, 0.35)'
              : '1px solid rgba(239, 68, 68, 0.35)'
          }}
        >
          {hasStock ? `${product.stock} uds.` : 'Agotado'}
        </span>
      </div>

      <div style={styles.content}>
        <h4
          style={{
            ...styles.productName,
            color: hovered ? '#ffffff' : '#f4f4f5'
          }}
        >
          {product.nombre}
        </h4>

        <p style={styles.description}>
          {product.descripcion}
        </p>

        <div style={styles.infoRow}>
          <p
            style={{
              ...styles.price,
              textShadow: hovered
                ? '0 0 18px rgba(168, 85, 247, 0.7)'
                : 'none'
            }}
          >
            {product.precio}€
          </p>

          <span
            style={{
              ...styles.stockBadge,
              color: hasStock ? '#10b981' : '#ef4444',
              backgroundColor: hasStock
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(239, 68, 68, 0.12)',
              border: hasStock
                ? '1px solid rgba(16, 185, 129, 0.25)'
                : '1px solid rgba(239, 68, 68, 0.25)'
            }}
          >
            {hasStock ? 'Disponible' : 'Sin stock'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!hasStock}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            ...styles.btn,
            background: !hasStock
              ? '#3f3f46'
              : agregado
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #a855f7, #7c3aed)',
            cursor: !hasStock ? 'not-allowed' : 'pointer',
            opacity: !hasStock ? 0.7 : 1,
            transform: btnHovered && hasStock ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: btnHovered && hasStock
              ? '0 0 24px rgba(168, 85, 247, 0.45)'
              : 'none'
          }}
        >
          {!hasStock ? 'AGOTADO' : agregado ? '¡AÑADIDO!' : 'AÑADIR AL CARRITO'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025)), #111116',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '22px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 18px 45px rgba(0, 0, 0, 0.35)',
    transition: 'all 0.35s ease',
    cursor: 'pointer',
  },

  cardHover: {
    transform: 'translateY(-10px) scale(1.015)',
    border: '1px solid rgba(168, 85, 247, 0.55)',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.55), 0 0 35px rgba(168, 85, 247, 0.25)',
  },

  neonGlow: {
    position: 'absolute',
    bottom: '-60px',
    left: '-20%',
    width: '140%',
    height: '160px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35), transparent 65%)',
    transition: 'opacity 0.35s ease',
    pointerEvents: 'none',
    zIndex: 0,
  },

  imageContainer: {
    position: 'relative',
    height: '190px',
    overflow: 'hidden',
    backgroundColor: '#050508',
  },

  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scale(1.01)',
    transition: 'transform 0.45s ease, filter 0.45s ease',
  },

  imgHover: {
    transform: 'scale(1.1)',
    filter: 'contrast(1.08) saturate(1.18)',
  },

  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.75)), radial-gradient(circle at top right, rgba(168,85,247,0.24), transparent 45%)',
    pointerEvents: 'none',
  },

  floatingStock: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    zIndex: 2,
    padding: '6px 11px',
    borderRadius: '999px',
    fontSize: '0.72rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    backdropFilter: 'blur(12px)',
  },

  content: {
    position: 'relative',
    zIndex: 1,
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '235px',
  },

  productName: {
    margin: '0 0 8px',
    fontSize: '1.08rem',
    lineHeight: '1.25',
    fontWeight: '900',
    letterSpacing: '0.3px',
    transition: 'color 0.3s ease',
  },

  description: {
    margin: 0,
    color: '#a1a1aa',
    fontSize: '0.9rem',
    lineHeight: '1.45',
    minHeight: '58px',
    overflow: 'hidden',
  },

  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginTop: 'auto',
    paddingTop: '18px',
  },

  price: {
    margin: 0,
    color: '#c084fc',
    fontSize: '1.45rem',
    fontWeight: '950',
    transition: 'text-shadow 0.3s ease',
  },

  stockBadge: {
    padding: '5px 10px',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },

  btn: {
    width: '100%',
    marginTop: '16px',
    padding: '13px 14px',
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    fontWeight: '950',
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },
};

export default ProductCard;