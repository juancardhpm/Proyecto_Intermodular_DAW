import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Checkout from '../components/Checkout';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('desktop');
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const isMobile = screen === 'mobile';
  const isTablet = screen === 'tablet';

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 640) {
        setScreen('mobile');
      } else if (width <= 1024) {
        setScreen('tablet');
      } else {
        setScreen('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCartItems = useCallback(async () => {
    try {
      if (user && token) {
        const response = await api.get(`/cart?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCartItems(Array.isArray(response.data) ? response.data : []);
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

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const p = item.producto || item.product;
      const precio = parseFloat(p?.precio || 0);
      const cantidad = item.cantidad || item.quantity || 0;

      return acc + precio * cantidad;
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
        alert(error.response?.data?.message || 'Error al actualizar');
      }
    } else {
      const updatedCart = cartItems.map(cartItem => {
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
          data: {
            carrito_id: item.carrito_id,
            producto_id: item.producto_id
          }
        });

        fetchCartItems();
      } catch (error) {
        console.error('Error al eliminar:', error);
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

  if (loading) {
    return (
      <main style={styles.container}>
        <section style={styles.loadingBox}>
          <div style={styles.loader}></div>
          <h2 style={styles.loadingTitle}>PREPARANDO INVENTARIO...</h2>
          <p style={styles.loadingText}>Estamos cargando tu carrito.</p>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <section style={styles.headerSection}>
        <span style={styles.kicker}>Zona de compra</span>

        <h1
          style={{
            ...styles.title,
            fontSize: isMobile ? '2.2rem' : 'clamp(2.3rem, 5vw, 3.6rem)'
          }}
        >
          TU <span style={styles.accent}>CARRITO</span>
        </h1>

        <p style={styles.subtitle}>
          Revisa tus productos, ajusta cantidades y finaliza tu pedido.
        </p>
      </section>

      {cartItems.length > 0 ? (
        <section
          style={{
            ...styles.cartWrapper,
            gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 360px'
          }}
        >
          <div style={styles.itemsList}>
            {cartItems.map((item, index) => {
              const p = item.producto || item.product;
              const currentQty = item.cantidad || item.quantity;
              const isMaxStock = currentQty >= p?.stock;
              const itemTotal = parseFloat(p?.precio || 0) * currentQty;

              return (
                <article
                  key={index}
                  style={{
                    ...styles.itemCard,
                    ...(hoveredItem === `item-${index}` ? styles.itemCardHover : {}),
                    ...(isMobile ? styles.itemCardMobile : {})
                  }}
                  onMouseEnter={() => setHoveredItem(`item-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <img
                    src={p?.imagen_url || 'https://via.placeholder.com/160'}
                    alt={p?.nombre}
                    style={{
                      ...styles.itemImg,
                      ...(isMobile ? styles.itemImgMobile : {})
                    }}
                  />

                  <div
                    style={{
                      ...styles.itemInfo,
                      ...(isMobile ? styles.itemInfoMobile : {})
                    }}
                  >
                    <h4 style={styles.itemName}>{p?.nombre}</h4>

                    <p
                      style={{
                        ...styles.stockText,
                        color: isMaxStock ? '#f59e0b' : '#71717a'
                      }}
                    >
                      {isMaxStock ? 'Máximo stock alcanzado' : `Disponible: ${p?.stock}`}
                    </p>

                    <div
                      style={{
                        ...styles.qtyControls,
                        ...(isMobile ? styles.qtyControlsMobile : {})
                      }}
                    >
                      <button
                        onClick={() => handleUpdateQuantity(item, currentQty - 1)}
                        style={{
                          ...styles.qtyBtn,
                          ...(hoveredItem === `minus-${index}` ? styles.qtyBtnHover : {})
                        }}
                        onMouseEnter={() => setHoveredItem(`minus-${index}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        -
                      </button>

                      <span style={styles.qtyLabel}>{currentQty}</span>

                      <button
                        onClick={() => handleUpdateQuantity(item, currentQty + 1)}
                        disabled={isMaxStock}
                        style={{
                          ...styles.qtyBtn,
                          opacity: isMaxStock ? 0.45 : 1,
                          cursor: isMaxStock ? 'not-allowed' : 'pointer',
                          ...(hoveredItem === `plus-${index}` && !isMaxStock ? styles.qtyBtnHover : {})
                        }}
                        onMouseEnter={() => setHoveredItem(`plus-${index}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      ...styles.priceSection,
                      ...(isMobile ? styles.priceSectionMobile : {})
                    }}
                  >
                    <p style={styles.itemPrice}>{itemTotal.toFixed(2)}€</p>

                    <button
                      onClick={() => handleRemoveItem(item)}
                      style={{
                        ...styles.removeBtn,
                        ...(hoveredItem === `remove-${index}` ? styles.removeBtnHover : {})
                      }}
                      onMouseEnter={() => setHoveredItem(`remove-${index}`)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside
            style={{
              ...styles.summaryCard,
              position: isMobile || isTablet ? 'relative' : 'sticky',
              top: isMobile || isTablet ? 'auto' : '95px'
            }}
          >
            <div style={styles.summaryHeader}>
              <span style={styles.summaryIcon}>🧾</span>
              <div>
                <h3 style={styles.summaryTitle}>Resumen</h3>
                <p style={styles.summarySubtitle}>{cartItems.length} producto(s) en carrito</p>
              </div>
            </div>

            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{total.toFixed(2)}€</span>
            </div>

            <div style={styles.summaryRow}>
              <span>Envío</span>
              <span>Calculado al finalizar</span>
            </div>

            <div style={styles.summaryTotal}>
              <span>TOTAL</span>
              <span style={styles.totalAmount}>{total.toFixed(2)}€</span>
            </div>

            {user ? (
              <div style={styles.checkoutSection}>
                <p style={styles.userBadge}>
                  <span style={styles.userDot}></span>
                  Sesión activa: {user.nombre}
                </p>

                <Checkout cartItems={cartItems} total={total} />
              </div>
            ) : (
              <div style={styles.guestSection}>
                <p style={styles.guestText}>
                  Inicia sesión para finalizar tu compra y guardar tu pedido.
                </p>

                <button
                  onClick={() => navigate('/login', { state: { from: '/cart' } })}
                  style={{
                    ...styles.loginBtn,
                    ...(hoveredItem === 'login' ? styles.loginBtnHover : {})
                  }}
                  onMouseEnter={() => setHoveredItem('login')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  INICIAR SESIÓN
                </button>
              </div>
            )}
          </aside>
        </section>
      ) : (
        <section style={styles.emptyCart}>
          <div style={styles.emptyIcon}>🛒</div>

          <h2 style={styles.emptyTitle}>Tu carrito está vacío</h2>

          <p style={styles.emptyText}>
            Explora el catálogo y añade productos gaming a tu setup.
          </p>

          <button
            onClick={() => navigate('/catalog')}
            style={{
              ...styles.catalogBtn,
              ...(hoveredItem === 'catalog' ? styles.catalogBtnHover : {})
            }}
            onMouseEnter={() => setHoveredItem('catalog')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            VOLVER AL CATÁLOGO
          </button>
        </section>
      )}
    </main>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '70px 20px',
    color: '#fff',
    fontFamily: 'sans-serif',
    background:
      'radial-gradient(circle at top left, rgba(168, 85, 247, 0.22), transparent 35%), radial-gradient(circle at top right, rgba(34, 211, 238, 0.13), transparent 30%), linear-gradient(180deg, #08080b 0%, #0b0b0d 45%, #09090b 100%)',
  },

  headerSection: {
    maxWidth: '850px',
    margin: '0 auto 42px',
    textAlign: 'center',
  },

  kicker: {
    display: 'inline-block',
    marginBottom: '12px',
    padding: '7px 14px',
    border: '1px solid rgba(168, 85, 247, 0.45)',
    borderRadius: '999px',
    color: '#c084fc',
    background: 'rgba(168, 85, 247, 0.08)',
    fontSize: '0.78rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },

  title: {
    margin: '0 0 14px',
    lineHeight: 1.1,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },

  accent: {
    color: '#a855f7',
    textShadow: '0 0 24px rgba(168, 85, 247, 0.7)',
  },

  subtitle: {
    margin: 0,
    color: '#a1a1aa',
    fontSize: '1rem',
    lineHeight: 1.7,
  },

  cartWrapper: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'grid',
    gap: '28px',
    alignItems: 'start',
  },

  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  itemCard: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    padding: '18px',
    borderRadius: '22px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 18px 45px rgba(0,0,0,0.28)',
    transition: 'all 0.3s ease',
  },

  itemCardHover: {
    transform: 'translateY(-4px)',
    border: '1px solid rgba(168, 85, 247, 0.45)',
    boxShadow: '0 24px 65px rgba(0,0,0,0.45), 0 0 28px rgba(168,85,247,0.18)',
  },

  itemCardMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'center',
    padding: '16px',
  },

  itemImg: {
    width: '96px',
    height: '96px',
    objectFit: 'cover',
    borderRadius: '16px',
    border: '1px solid rgba(168,85,247,0.22)',
    boxShadow: '0 0 22px rgba(168,85,247,0.12)',
    flexShrink: 0,
  },

  itemImgMobile: {
    width: '100%',
    height: '190px',
  },

  itemInfo: {
    flex: 1,
    minWidth: 0,
  },

  itemInfoMobile: {
    width: '100%',
  },

  itemName: {
    margin: '0 0 8px',
    color: '#fff',
    fontSize: '1.05rem',
    fontWeight: 950,
    lineHeight: 1.3,
  },

  stockText: {
    margin: 0,
    fontSize: '0.82rem',
    fontWeight: 800,
  },

  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '14px',
  },

  qtyControlsMobile: {
    justifyContent: 'center',
  },

  qtyBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '11px',
    background: 'rgba(168,85,247,0.18)',
    color: '#fff',
    border: '1px solid rgba(168,85,247,0.42)',
    cursor: 'pointer',
    fontWeight: 950,
    fontSize: '1rem',
    transition: 'all 0.25s ease',
  },

  qtyBtnHover: {
    transform: 'translateY(-2px)',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    boxShadow: '0 0 18px rgba(168,85,247,0.35)',
  },

  qtyLabel: {
    minWidth: '36px',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 950,
    color: '#fff',
  },

  priceSection: {
    textAlign: 'right',
    minWidth: '105px',
  },

  priceSectionMobile: {
    minWidth: 'auto',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingTop: '14px',
  },

  itemPrice: {
    margin: '0 0 8px',
    fontWeight: 950,
    color: '#c084fc',
    fontSize: '1.3rem',
    textShadow: '0 0 18px rgba(168,85,247,0.4)',
  },

  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#f87171',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 850,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    transition: 'all 0.25s ease',
  },

  removeBtnHover: {
    color: '#fff',
    textShadow: '0 0 16px rgba(248,113,113,0.7)',
  },

  summaryCard: {
    padding: '26px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(168,85,247,0.16), rgba(255,255,255,0.035)), rgba(18,18,24,0.88)',
    border: '1px solid rgba(168, 85, 247, 0.32)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.45), 0 0 35px rgba(168,85,247,0.18)',
    alignSelf: 'start',
  },

  summaryHeader: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    marginBottom: '22px',
  },

  summaryIcon: {
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    background: 'rgba(168,85,247,0.14)',
    border: '1px solid rgba(168,85,247,0.34)',
    fontSize: '1.35rem',
  },

  summaryTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 950,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  summarySubtitle: {
    margin: '5px 0 0',
    color: '#a1a1aa',
    fontSize: '0.85rem',
  },

  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    margin: '15px 0',
    color: '#a1a1aa',
    fontSize: '0.95rem',
  },

  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginTop: '22px',
    paddingTop: '22px',
    borderTop: '1px solid rgba(255,255,255,0.12)',
    fontWeight: 950,
    fontSize: '1.25rem',
  },

  totalAmount: {
    color: '#c084fc',
    textShadow: '0 0 18px rgba(168,85,247,0.55)',
  },

  checkoutSection: {
    marginTop: '25px',
  },

  userBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#34d399',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginBottom: '16px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    padding: '10px',
    borderRadius: '999px',
    fontWeight: 850,
  },

  userDot: {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 12px rgba(34,197,94,0.8)',
  },

  guestSection: {
    marginTop: '25px',
    textAlign: 'center',
  },

  guestText: {
    margin: '0 0 15px',
    fontSize: '0.9rem',
    color: '#a1a1aa',
    lineHeight: 1.5,
  },

  loginBtn: {
    width: '100%',
    minHeight: '48px',
    padding: '0 18px',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontWeight: 950,
    cursor: 'pointer',
    fontSize: '0.95rem',
    letterSpacing: '0.9px',
    transition: 'all 0.25s ease',
  },

  loginBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 28px rgba(168,85,247,0.52), 0 12px 30px rgba(124,58,237,0.28)',
  },

  emptyCart: {
    maxWidth: '620px',
    margin: '0 auto',
    padding: '44px 24px',
    textAlign: 'center',
    borderRadius: '26px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(168, 85, 247, 0.22)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.42)',
  },

  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '14px',
  },

  emptyTitle: {
    margin: '0 0 10px',
    fontSize: '1.7rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  emptyText: {
    margin: '0 auto 24px',
    maxWidth: '420px',
    color: '#a1a1aa',
    lineHeight: 1.6,
  },

  catalogBtn: {
    minHeight: '48px',
    padding: '0 22px',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: '1px solid rgba(168, 85, 247, 0.45)',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 950,
    letterSpacing: '0.9px',
    transition: 'all 0.25s ease',
  },

  catalogBtnHover: {
    transform: 'translateY(-2px)',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    boxShadow: '0 0 28px rgba(168,85,247,0.35)',
  },

  loadingBox: {
    maxWidth: '520px',
    margin: '80px auto 0',
    padding: '40px 24px',
    textAlign: 'center',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(168,85,247,0.22)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.42)',
  },

  loader: {
    width: '44px',
    height: '44px',
    margin: '0 auto 18px',
    borderRadius: '50%',
    border: '3px solid rgba(168,85,247,0.18)',
    borderTopColor: '#a855f7',
  },

  loadingTitle: {
    margin: '0 0 8px',
    color: '#c084fc',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  loadingText: {
    margin: 0,
    color: '#a1a1aa',
  },
};

export default Cart;