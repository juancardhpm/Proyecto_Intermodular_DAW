import React, { useState } from 'react';
import api from '../api/axios';

const ProductCard = ({ product }) => {
  const [agregado, setAgregado] = useState(false);

  // Verificamos la disponibilidad del producto
  const hasStock = product.stock > 0;

  const handleAddToCart = async () => {
    // Si no hay stock, salimos de la función por seguridad
    if (!hasStock) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
      try {
        await api.post('/cart/add', {
          user_id: user.id,      // ID del usuario logueado
          product_id: product.id, // ID del producto
          quantity: 1
        });
        showFeedback();
      } catch (err) {
        // Mostramos el error específico del backend (como "Stock insuficiente")
        const errorMsg = err.response?.data?.message || "Error al añadir al carrito";
        alert(errorMsg);
        console.error("Error al guardar en DB", err);
      }
    } else {
      const cart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const index = cart.findIndex(item => item.product.id === product.id);
      
      if (index !== -1) {
        // Validación de stock para invitados (LocalStorage)
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
    <div style={styles.card}>
      <img src={product.imagen_url || 'https://via.placeholder.com/200'} alt={product.nombre} style={styles.img} />
      <h4 style={styles.productName}>{product.nombre}</h4>
      <p style={styles.description}>{product.descripcion}</p>
      <p style={styles.price}>{product.precio}€</p>
      
      {/* SECCIÓN DE STOCK: Muestra unidades o mensaje de agotado */}
      <div style={styles.stockInfo}>
        <span style={{ 
          ...styles.stockBadge, 
          color: hasStock ? '#10b981' : '#ef4444',
          backgroundColor: hasStock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
        }}>
          {hasStock ? `Stock: ${product.stock}` : 'SIN STOCK'}
        </span>
      </div>

      <button 
        onClick={handleAddToCart} 
        disabled={!hasStock} // Desactiva el botón si no hay stock
        style={{
          ...styles.btn, 
          backgroundColor: !hasStock ? '#3f3f46' : (agregado ? '#10b981' : '#a855f7'),
          cursor: !hasStock ? 'not-allowed' : 'pointer',
          opacity: !hasStock ? 0.7 : 1
        }}
      >
        {!hasStock ? 'AGOTADO' : (agregado ? '¡AÑADIDO!' : 'AÑADIR')}
      </button>
    </div>
  );
};

const styles = {
  card: { 
    background: 'rgba(255, 255, 255, 0.1)',  // Fondo blanco con transparencia
    padding: '15px', 
    borderRadius: '12px', 
    border: '1px solid rgba(255, 255, 255, 0.3)',  // Borde con transparencia para darle un look limpio
    color: '#fff', 
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',  // Sombra para darle profundidad
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    ':hover': { transform: 'scale(1.05)' }  // Efecto hover para dar un toque dinámico
  },
  img: { 
    width: '100%', 
    height: '140px', 
    objectFit: 'cover', 
    borderRadius: '8px', 
    marginBottom: '10px',
    transition: 'transform 0.3s ease',
    ':hover': { transform: 'scale(1.1)' }  // Efecto hover en la imagen para hacerlo más interactivo
  },
  productName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: '0.9rem',
    color: '#aaa',
  },
  price: { 
    color: '#a855f7',  // Manteniendo el tono morado
    fontWeight: 'bold', 
    fontSize: '1.2rem' 
  },
  stockInfo: { 
    margin: '5px 0', 
  },
  stockBadge: { 
    fontSize: '0.75rem', 
    padding: '4px 10px', 
    borderRadius: '15px', 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
  },
  btn: { 
    width: '100%', 
    padding: '10px', 
    border: 'none', 
    borderRadius: '6px', 
    color: '#fff', 
    fontWeight: 'bold', 
    transition: '0.3s' 
  },
};

export default ProductCard;