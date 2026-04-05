import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios'; 
import { useNavigate } from 'react-router-dom'; 
import Checkout from '../components/Checkout'; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchCartItems = useCallback(async () => {
    try {
      if (user && token) {
        const response = await api.get(`/cart?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data);
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        setCartItems(guestCart);
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // MEJORA 1: Cálculo en tiempo real con useMemo (Adiós al bug del total 0)
  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const p = item.producto || item.product;
      const precio = parseFloat(p?.precio || 0);
      const cantidad = item.cantidad || item.quantity || 0;
      return acc + (precio * cantidad);
    }, 0);
  }, [cartItems]);

  const handleUpdateQuantity = async (item, newQty) => {
    const p = item.producto || item.product;
    if (newQty < 1) return;

    if (newQty > p.stock) {
      alert(`Solo hay ${p.stock} unidades disponibles.`);
      return;
    }

    if (user && token) {
      try {
        await api.put('/cart/update', {
          carrito_id: item.carrito_id,
          producto_id: item.producto_id,
          cantidad: newQty
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCartItems(); 
      } catch (error) {
        alert(error.response?.data?.message || "Error al actualizar");
      }
    } else {
      const updatedCart = cartItems.map(cartItem => {
        // Normalizamos la comparación de IDs
        const cartItemId = cartItem.product?.id || cartItem.producto_id || cartItem.id;
        const targetId = item.product?.id || item.producto_id || item.id;
        
        return cartItemId === targetId 
          ? { ...cartItem, quantity: newQty, cantidad: newQty } 
          : cartItem;
      });
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    }
  };

  const handleRemoveItem = async (item) => {
    if (user && token) {
      try {
        await api.delete('/cart/remove', {
          headers: { Authorization: `Bearer ${token}` },
          data: { carrito_id: item.carrito_id, producto_id: item.producto_id }
        });
        fetchCartItems(); 
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    } else {
      const targetId = item.product?.id || item.producto_id || item.id;
      const updatedCart = cartItems.filter(cartItem => 
        (cartItem.product?.id || cartItem.producto_id || cartItem.id) !== targetId
      );
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    }
  };

  // MEJORA 3: Pantalla de carga limpia
  if (loading) return (
    <div style={{...styles.container, textAlign: 'center'}}>
      <h2 style={{color: '#a855f7'}}>PREPARANDO INVENTARIO...</h2>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛒 TU CARRITO</h2>

      {cartItems.length > 0 ? (
        <div style={styles.cartWrapper}>
          <div style={styles.itemsList}>
            {cartItems.map((item, index) => {
              const p = item.producto || item.product;
              const currentQty = item.cantidad || item.quantity;
              const isMaxStock = currentQty >= p?.stock;
              
              return (
                <div key={index} style={styles.itemCard}>
                  <img 
                    src={p?.imagen_url || 'https://via.placeholder.com/80'} 
                    alt={p?.nombre} 
                    style={styles.itemImg} 
                  />
                  <div style={styles.itemInfo}>
                    <h4>{p?.nombre}</h4>
                    <p style={{ fontSize: '0.8rem', color: isMaxStock ? '#ffb020' : '#71717a' }}>
                      {isMaxStock ? '¡Máximo stock alcanzado!' : `Disponible: ${p?.stock}`}
                    </p>
                    <div style={styles.qtyControls}>
                      <button onClick={() => handleUpdateQuantity(item, currentQty - 1)} style={styles.qtyBtn}>-</button>
                      <span style={styles.qtyLabel}>{currentQty}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item, currentQty + 1)} 
                        style={{ ...styles.qtyBtn, opacity: isMaxStock ? 0.5 : 1, cursor: isMaxStock ? 'not-allowed' : 'pointer' }}
                        disabled={isMaxStock}
                      >+</button>
                    </div>
                  </div>
                  <div style={styles.priceSection}>
                    <p style={styles.itemPrice}>{(parseFloat(p?.precio || 0) * currentQty).toFixed(2)}€</p>
                    <button onClick={() => handleRemoveItem(item)} style={styles.removeBtn}>Eliminar</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.summaryCard}>
            <h3>RESUMEN</h3>
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            <div style={styles.summaryTotal}>
              <span>TOTAL:</span>
              <span style={styles.totalAmount}>{total.toFixed(2)}€</span>
            </div>

            {user ? (
              <div style={styles.checkoutSection}>
                <p style={styles.userBadge}>✅ Sesión activa: {user.nombre}</p>
                <Checkout cartItems={cartItems} total={total} />
              </div>
            ) : (
              <div style={styles.guestSection}>
                <button onClick={() => navigate('/login', { state: { from: '/cart' } })} style={styles.loginBtn}>
                  INICIAR SESIÓN
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.emptyCart}>
          <p>Tu carrito está vacío.</p>
          <button onClick={() => navigate('/catalog')} style={styles.catalogBtn}>VOLVER AL CATÁLOGO</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    color: '#fff',
    fontFamily: 'sans-serif',
    backgroundColor: 'rgba(11, 11, 13, 0.9)', // Fondo con algo de transparencia
  },
  title: {
    borderBottom: '2px solid rgba(168, 85, 247, 0.8)',  // Más suave en lugar de sólido
    paddingBottom: '10px',
    marginBottom: '30px',
    fontWeight: '800',
  },
  cartWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '20px',
    color: '#fff',
    backgroundColor: 'rgba(11, 11, 13, 0.85)', // Fondo translúcido
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 51, 51, 0.8)',  // Fondo translúcido y suave
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid rgba(45, 45, 53, 0.5)',  // Borde suave
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    ':hover': { 
      transform: 'scale(1.05)', 
    }
  },
  itemImg: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '15px',
  },
  itemInfo: {
    flex: 1,
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  qtyBtn: {
    width: '25px',
    height: '25px',
    backgroundColor: '#a855f7',
    color: '#fff',
    border: '1px solid rgba(168, 85, 247, 0.8)', // Fondo translúcido en los botones
    borderRadius: '4px',
    cursor: 'pointer',
  },
  qtyLabel: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  priceSection: {
    textAlign: 'right',
  },
  itemPrice: {
    fontWeight: 'bold',
    color: '#a855f7',
    fontSize: '1.2rem',
    marginBottom: '5px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ff4d4d',
    cursor: 'pointer',
    fontSize: '0.8rem',
    textDecoration: 'underline',
  },
  summaryCard: {
    backgroundColor: 'rgba(34, 34, 34, 0.8)',  // Fondo con algo de transparencia
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid rgba(168, 85, 247, 0.8)', // Borde sutil transparente
    alignSelf: 'start',
    position: 'sticky',
    top: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '15px 0',
    color: '#a1a1aa',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(63, 63, 70, 0.5)', // Borde transparente para el total
    fontWeight: 'bold',
    fontSize: '1.3rem',
  },
  totalAmount: {
    color: '#a855f7',
  },
  checkoutSection: {
    marginTop: '25px',
  },
  userBadge: {
    color: '#10b981',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginBottom: '15px',
    backgroundColor: 'rgba(16, 185, 129, 0.2)', // Fondo con transparencia para el badge
    padding: '8px',
    borderRadius: '5px',
  },
  guestSection: {
    marginTop: '25px',
    textAlign: 'center',
  },
  guestText: {
    fontSize: '0.85rem',
    color: '#71717a',
    marginBottom: '15px',
  },
  loginBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#a855f7',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  emptyCart: {
    textAlign: 'center',
    marginTop: '100px',
  },
  catalogBtn: {
    backgroundColor: 'transparent',
    color: '#a855f7',
    border: '1px solid rgba(168, 85, 247, 0.8)', // Fondo con transparencia y borde morado
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: 'bold',
  },
};

export default Cart;



