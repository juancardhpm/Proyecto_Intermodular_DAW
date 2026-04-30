import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('desktop');
  const [hoveredItem, setHoveredItem] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const API_URL = 'http://localhost:5000';

  const isMobile = screen === 'mobile';
  const isTablet = screen === 'tablet';

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 700) {
        setScreen('mobile');
      } else if (width <= 1050) {
        setScreen('tablet');
      } else {
        setScreen('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/orders/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, token]);

  const getStatusStyle = (estado) => {
    const normalized = estado?.toLowerCase();

    if (normalized === 'entregado' || normalized === 'completado') {
      return {
        color: '#34d399',
        background: 'rgba(16,185,129,0.14)',
        border: '1px solid rgba(16,185,129,0.35)'
      };
    }

    if (normalized === 'cancelado') {
      return {
        color: '#f87171',
        background: 'rgba(239,68,68,0.14)',
        border: '1px solid rgba(239,68,68,0.35)'
      };
    }

    return {
      color: '#fbbf24',
      background: 'rgba(245,158,11,0.14)',
      border: '1px solid rgba(245,158,11,0.35)'
    };
  };

  if (loading) {
    return (
      <main style={styles.container}>
        <section style={styles.loadingBox}>
          <div style={styles.loader}></div>
          <h2 style={styles.loadingTitle}>CARGANDO HISTORIAL...</h2>
          <p style={styles.loadingText}>Estamos recuperando tus pedidos.</p>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        ...styles.container,
        padding: isMobile ? '50px 14px' : '70px 20px'
      }}
    >
      <section style={styles.headerSection}>
        <span style={styles.kicker}>Historial de compras</span>

        <h1
          style={{
            ...styles.title,
            fontSize: isMobile ? '2.1rem' : 'clamp(2.4rem, 5vw, 3.6rem)'
          }}
        >
          MIS <span style={styles.accent}>PEDIDOS</span>
        </h1>

        <p style={styles.subtitle}>
          Consulta tus compras anteriores, revisa el estado de cada pedido y comprueba los productos incluidos.
        </p>
      </section>

      {orders.length === 0 ? (
        <section style={styles.emptyBox}>
          <span style={styles.emptyIcon}>📦</span>

          <h2 style={styles.emptyTitle}>Aún no tienes pedidos</h2>

          <p style={styles.emptyText}>
            Cuando realices una compra, aparecerá aquí con todos sus detalles.
          </p>
        </section>
      ) : (
        <section style={styles.ordersList}>
          {orders.map((order) => {
            const detalles = order.detalles_pedidos || order.OrderDetails || [];

            return (
              <article
                key={order.id}
                style={{
                  ...styles.orderCard,
                  ...(hoveredItem === `order-${order.id}` ? styles.orderCardHover : {})
                }}
                onMouseEnter={() => setHoveredItem(`order-${order.id}`)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  style={{
                    ...styles.orderHeader,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '16px' : '20px'
                  }}
                >
                  <div>
                    <span style={styles.orderId}>PEDIDO #{order.id}</span>

                    <p style={styles.orderDate}>
                      {new Date(order.fecha_pedido).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <div
                    style={{
                      ...styles.orderSummary,
                      alignItems: isMobile ? 'flex-start' : 'flex-end',
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    <span style={{ ...styles.statusBadge, ...getStatusStyle(order.estado) }}>
                      {order.estado?.toUpperCase()}
                    </span>

                    <p style={styles.orderTotal}>
                      {parseFloat(order.total || 0).toFixed(2)}€
                    </p>
                  </div>
                </div>

                <div style={styles.detailsList}>
                  {detalles.length === 0 ? (
                    <div style={styles.noDetailsBox}>
                      No hay detalles disponibles para este pedido.
                    </div>
                  ) : (
                    detalles.map((item, index) => {
                      const productoInfo = item.producto || item.Product || {};
                      const imagenRuta = productoInfo.imagen_url;

                      let urlFinal = '';

                      if (imagenRuta) {
                        urlFinal = imagenRuta.startsWith('http')
                          ? imagenRuta
                          : `${API_URL}${imagenRuta}`;
                      }

                      const lineTotal = parseFloat(item.precio_unitario || 0) * item.cantidad;

                      return (
                        <div
                          key={index}
                          style={{
                            ...styles.productRow,
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'stretch' : 'center',
                            gap: isMobile ? '14px' : '20px'
                          }}
                        >
                          <div style={styles.productInfo}>
                            <div style={styles.imgContainer}>
                              {urlFinal ? (
                                <img
                                  src={urlFinal}
                                  alt={productoInfo.nombre}
                                  style={styles.miniImg}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div style={styles.noImage}>N/A</div>
                              )}
                            </div>

                            <div style={styles.productText}>
                              <p style={styles.prodName}>
                                {productoInfo.nombre || 'Producto no disponible'}
                              </p>

                              <p style={styles.prodMeta}>
                                Cantidad: {item.cantidad}
                              </p>
                            </div>
                          </div>

                          <div
                            style={{
                              ...styles.priceBox,
                              alignSelf: isMobile ? 'flex-end' : 'center'
                            }}
                          >
                            <span style={styles.prodPrice}>
                              {lineTotal.toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
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

  ordersList: {
    maxWidth: '950px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  orderCard: {
    overflow: 'hidden',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.34)',
    transition: 'all 0.3s ease',
  },

  orderCardHover: {
    transform: 'translateY(-4px)',
    border: '1px solid rgba(168,85,247,0.42)',
    boxShadow: '0 26px 75px rgba(0,0,0,0.48), 0 0 28px rgba(168,85,247,0.16)',
  },

  orderHeader: {
    padding: '22px 26px',
    display: 'flex',
    justifyContent: 'space-between',
    background:
      'linear-gradient(145deg, rgba(168,85,247,0.12), rgba(255,255,255,0.03))',
    borderBottom: '1px solid rgba(255,255,255,0.09)',
  },

  orderId: {
    display: 'inline-block',
    color: '#c084fc',
    fontWeight: 950,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  orderDate: {
    margin: '7px 0 0',
    fontSize: '0.86rem',
    color: '#71717a',
  },

  orderSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 11px',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: 950,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    width: 'fit-content',
  },

  orderTotal: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 950,
    color: '#fff',
    textShadow: '0 0 18px rgba(168,85,247,0.35)',
  },

  detailsList: {
    padding: '12px 26px',
  },

  productRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },

  productInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    minWidth: 0,
  },

  imgContainer: {
    width: '58px',
    height: '58px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(168,85,247,0.22)',
    flexShrink: 0,
  },

  miniImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },

  noImage: {
    fontSize: '0.7rem',
    color: '#71717a',
    fontWeight: 900,
  },

  productText: {
    minWidth: 0,
  },

  prodName: {
    margin: 0,
    fontWeight: 950,
    fontSize: '0.96rem',
    color: '#fff',
    lineHeight: 1.35,
  },

  prodMeta: {
    margin: '5px 0 0',
    fontSize: '0.82rem',
    color: '#71717a',
    fontWeight: 800,
  },

  priceBox: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  prodPrice: {
    display: 'inline-flex',
    padding: '7px 11px',
    borderRadius: '999px',
    fontWeight: 950,
    color: '#c084fc',
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.28)',
    whiteSpace: 'nowrap',
  },

  emptyBox: {
    maxWidth: '620px',
    margin: '70px auto 0',
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
  },

  emptyTitle: {
    margin: '14px 0 8px',
    fontSize: '1.6rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  emptyText: {
    margin: '0 auto',
    maxWidth: '420px',
    color: '#a1a1aa',
    lineHeight: 1.6,
  },

  noDetailsBox: {
    padding: '26px 16px',
    textAlign: 'center',
    color: '#71717a',
    fontWeight: 800,
  },

  loadingBox: {
    maxWidth: '520px',
    margin: '90px auto 0',
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

export default UserOrders;