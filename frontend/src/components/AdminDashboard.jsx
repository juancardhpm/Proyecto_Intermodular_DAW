import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [tab, setTab] = useState('pedidos');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [screen, setScreen] = useState('desktop');

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
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);

    const token = localStorage.getItem('token');
    const endpoint = tab === 'pedidos' ? '/orders/admin/all' : '/services/admin/all';

    try {
      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGestionarSoporte = async (id, estado) => {
    try {
      const token = localStorage.getItem('token');

      await api.put(`/services/${id}/status`, {
        nuevoEstado: estado,
        respuestaAdmin: textoRespuesta
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Solicitud #${id} actualizada con éxito`);
      setSelectedItem(null);
      setTextoRespuesta('');
      fetchData();
    } catch (err) {
      console.error('Error al procesar la respuesta:', err);
      alert('Error al procesar la respuesta');
    }
  };

  const getStatusStyle = (estado) => {
    const normalized = estado?.toLowerCase();

    if (normalized === 'abierto' || normalized === 'pendiente') {
      return {
        color: '#f87171',
        background: 'rgba(239, 68, 68, 0.14)',
        border: '1px solid rgba(239, 68, 68, 0.35)'
      };
    }

    if (normalized === 'respondido' || normalized === 'procesando') {
      return {
        color: '#60a5fa',
        background: 'rgba(59, 130, 246, 0.14)',
        border: '1px solid rgba(59, 130, 246, 0.35)'
      };
    }

    if (normalized === 'cerrado' || normalized === 'completado') {
      return {
        color: '#34d399',
        background: 'rgba(16, 185, 129, 0.14)',
        border: '1px solid rgba(16, 185, 129, 0.35)'
      };
    }

    return {
      color: '#c084fc',
      background: 'rgba(168, 85, 247, 0.14)',
      border: '1px solid rgba(168, 85, 247, 0.35)'
    };
  };

  const openDetail = (item) => {
    setSelectedItem(item);
    setTextoRespuesta(item.respuesta_admin || '');
  };

  const renderMobileCards = () => (
    <div style={styles.mobileList}>
      {data.map((item) => (
        <article key={item.id} style={styles.mobileCard}>
          <div style={styles.mobileCardTop}>
            <div>
              <p style={styles.mobileId}>#{item.id}</p>
              <h3 style={styles.mobileTitle}>
                {tab === 'pedidos' ? `Usuario ${item.usuario_id}` : item.asunto}
              </h3>
            </div>

            <span style={{ ...styles.badge, ...getStatusStyle(item.estado) }}>
              {item.estado}
            </span>
          </div>

          <p style={styles.mobileDate}>
            {new Date(item.fecha_pedido || item.fecha_creacion).toLocaleDateString('es-ES')}
          </p>

          <button
            style={{
              ...styles.btnVer,
              width: '100%',
              ...(hoveredItem === `mobile-${item.id}` ? styles.btnVerHover : {})
            }}
            onClick={() => openDetail(item)}
            onMouseEnter={() => setHoveredItem(`mobile-${item.id}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            👁️ Ver detalle
          </button>
        </article>
      ))}
    </div>
  );

  return (
    <main
      style={{
        ...styles.container,
        padding: isMobile ? '50px 14px' : isTablet ? '60px 20px' : '70px 40px'
      }}
    >
      <section style={styles.headerSection}>
        <span style={styles.kicker}>Administración</span>

        <h1
          style={{
            ...styles.title,
            fontSize: isMobile ? '2rem' : 'clamp(2.3rem, 5vw, 3.5rem)'
          }}
        >
          PANEL DE CONTROL <span style={styles.accent}>ADMIN</span>
        </h1>

        <p style={styles.subtitle}>
          Gestiona pedidos, solicitudes de soporte y el estado de las incidencias desde un único panel.
        </p>
      </section>

      <div
        style={{
          ...styles.tabContainer,
          flexDirection: isMobile ? 'column' : 'row'
        }}
      >
        <button
          style={{
            ...(tab === 'pedidos' ? styles.activeTab : styles.tab),
            width: isMobile ? '100%' : 'auto'
          }}
          onClick={() => setTab('pedidos')}
        >
          🛒 VER PEDIDOS
        </button>

        <button
          style={{
            ...(tab === 'soporte' ? styles.activeTab : styles.tab),
            width: isMobile ? '100%' : 'auto'
          }}
          onClick={() => setTab('soporte')}
        >
          🛠️ VER SOPORTE
        </button>
      </div>

      <section style={styles.tableCard}>
        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Cargando información...</p>
          </div>
        ) : data.length === 0 ? (
          <div style={styles.emptyBox}>
            <span style={styles.emptyIcon}>📭</span>
            <p style={styles.emptyTitle}>No hay registros disponibles</p>
            <p style={styles.emptyText}>
              Cuando existan {tab === 'pedidos' ? 'pedidos' : 'solicitudes de soporte'}, aparecerán aquí.
            </p>
          </div>
        ) : isMobile ? (
          renderMobileCards()
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerTr}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>{tab === 'pedidos' ? 'ID Usuario' : 'Asunto'}</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>#{item.id}</td>

                    <td style={styles.td}>
                      {tab === 'pedidos' ? `User: ${item.usuario_id}` : item.asunto}
                    </td>

                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...getStatusStyle(item.estado) }}>
                        {item.estado}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {new Date(item.fecha_pedido || item.fecha_creacion).toLocaleDateString('es-ES')}
                    </td>

                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.btnVer,
                          ...(hoveredItem === `ver-${item.id}` ? styles.btnVerHover : {})
                        }}
                        onClick={() => openDetail(item)}
                        onMouseEnter={() => setHoveredItem(`ver-${item.id}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        👁️ Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedItem && (
        <div style={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
          <div
            style={{
              ...styles.modalContent,
              padding: isMobile ? '22px' : '30px',
              maxHeight: isMobile ? '86vh' : '88vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={styles.kicker}>Registro #{selectedItem.id}</span>

            <h3
              style={{
                ...styles.modalTitle,
                fontSize: isMobile ? '1.25rem' : '1.45rem'
              }}
            >
              Detalles del registro
            </h3>

            <div
              style={{
                ...styles.infoGrid,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '10px' : '20px'
              }}
            >
              <p style={styles.infoItem}>
                <strong>Usuario ID:</strong> {selectedItem.usuario_id}
              </p>

              <p style={styles.infoItem}>
                <strong>Fecha:</strong>{' '}
                {new Date(selectedItem.fecha_pedido || selectedItem.fecha_creacion).toLocaleString('es-ES')}
              </p>
            </div>

            {tab === 'soporte' ? (
              <>
                <p style={styles.detailText}>
                  <strong>Asunto:</strong> {selectedItem.asunto}
                </p>

                <div style={styles.msgBox}>
                  <strong style={styles.msgLabel}>Mensaje del cliente</strong>
                  <p style={styles.msgText}>{selectedItem.mensaje}</p>
                </div>

                {selectedItem.respuesta_admin && (
                  <div style={{ ...styles.msgBox, borderLeftColor: '#60a5fa' }}>
                    <strong style={{ ...styles.msgLabel, color: '#60a5fa' }}>
                      Respuesta guardada
                    </strong>
                    <p style={styles.msgText}>{selectedItem.respuesta_admin}</p>
                  </div>
                )}

                <label style={styles.label}>
                  {selectedItem.respuesta_admin ? 'Modificar respuesta' : 'Escribir respuesta'}
                </label>

                <textarea
                  style={styles.textarea}
                  placeholder="Escribe aquí la solución para el cliente..."
                  value={textoRespuesta}
                  onChange={(e) => setTextoRespuesta(e.target.value)}
                />

                <div
                  style={{
                    ...styles.modalActions,
                    flexDirection: isMobile ? 'column' : 'row'
                  }}
                >
                  <button
                    style={{ ...styles.btnAction, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                    onClick={() => handleGestionarSoporte(selectedItem.id, 'respondido')}
                  >
                    {selectedItem.respuesta_admin ? '📩 Actualizar respuesta' : '📩 Enviar respuesta'}
                  </button>

                  <button
                    style={{ ...styles.btnAction, background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    onClick={() => handleGestionarSoporte(selectedItem.id, 'cerrado')}
                  >
                    🔒 Cerrar ticket
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.msgBox}>
                <strong style={styles.msgLabel}>Información del pedido</strong>
                <p style={styles.msgText}>
                  <strong>Total del pedido:</strong> {selectedItem.total}€
                </p>
                <p style={styles.msgText}>
                  <strong>Estado actual:</strong> {selectedItem.estado}
                </p>
              </div>
            )}

            <button
              style={{
                ...styles.btnCerrarModal,
                ...(hoveredItem === 'cerrar' ? styles.btnCerrarModalHover : {})
              }}
              onClick={() => setSelectedItem(null)}
              onMouseEnter={() => setHoveredItem('cerrar')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              VOLVER AL PANEL
            </button>
          </div>
        </div>
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
      'radial-gradient(circle at top left, rgba(239, 68, 68, 0.16), transparent 34%), radial-gradient(circle at top right, rgba(168, 85, 247, 0.18), transparent 32%), linear-gradient(180deg, #08080b 0%, #0b0b0d 48%, #09090b 100%)',
  },

  headerSection: {
    maxWidth: '900px',
    margin: '0 auto 34px',
    textAlign: 'center',
  },

  kicker: {
    display: 'inline-block',
    marginBottom: '12px',
    padding: '7px 14px',
    border: '1px solid rgba(248, 113, 113, 0.45)',
    borderRadius: '999px',
    color: '#fca5a5',
    background: 'rgba(239, 68, 68, 0.08)',
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
    color: '#f87171',
    textShadow: '0 0 24px rgba(239, 68, 68, 0.65)',
  },

  subtitle: {
    margin: 0,
    color: '#a1a1aa',
    fontSize: '1rem',
    lineHeight: 1.7,
  },

  tabContainer: {
    maxWidth: '900px',
    margin: '0 auto 30px',
    display: 'flex',
    justifyContent: 'center',
    gap: '14px',
  },

  tab: {
    minHeight: '46px',
    padding: '0 20px',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '14px',
    fontWeight: 900,
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },

  activeTab: {
    minHeight: '46px',
    padding: '0 20px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #ef4444, #991b1b)',
    color: '#fff',
    border: '1px solid rgba(248, 113, 113, 0.55)',
    fontWeight: 950,
    borderRadius: '14px',
    letterSpacing: '0.8px',
    boxShadow: '0 0 26px rgba(239, 68, 68, 0.28)',
    transition: 'all 0.25s ease',
  },

  tableCard: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '22px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.42)',
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    minWidth: '760px',
    borderCollapse: 'collapse',
  },

  headerTr: {
    borderBottom: '2px solid rgba(248, 113, 113, 0.45)',
    textAlign: 'left',
    color: '#f87171',
  },

  th: {
    padding: '15px',
    fontSize: '0.84rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },

  td: {
    padding: '15px',
    color: '#e4e4e7',
    fontSize: '0.92rem',
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: 950,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },

  btnVer: {
    minHeight: '36px',
    padding: '0 13px',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: 850,
    transition: 'all 0.25s ease',
  },

  btnVerHover: {
    transform: 'translateY(-2px)',
    border: '1px solid rgba(248, 113, 113, 0.45)',
    boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
  },

  mobileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  mobileCard: {
    padding: '18px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.045)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  mobileCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '14px',
    marginBottom: '10px',
  },

  mobileId: {
    margin: '0 0 4px',
    color: '#f87171',
    fontSize: '0.82rem',
    fontWeight: 900,
  },

  mobileTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '1rem',
    lineHeight: 1.35,
  },

  mobileDate: {
    margin: '0 0 16px',
    color: '#71717a',
    fontSize: '0.86rem',
  },

  loadingBox: {
    padding: '38px 20px',
    textAlign: 'center',
  },

  loader: {
    width: '44px',
    height: '44px',
    margin: '0 auto 16px',
    borderRadius: '50%',
    border: '3px solid rgba(239, 68, 68, 0.18)',
    borderTopColor: '#ef4444',
  },

  loadingText: {
    color: '#a1a1aa',
    margin: 0,
  },

  emptyBox: {
    padding: '42px 20px',
    borderRadius: '20px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.035)',
    border: '1px dashed rgba(255,255,255,0.12)',
  },

  emptyIcon: {
    fontSize: '2.4rem',
  },

  emptyTitle: {
    margin: '12px 0 6px',
    color: '#fff',
    fontWeight: 950,
    textTransform: 'uppercase',
  },

  emptyText: {
    margin: 0,
    color: '#71717a',
    fontSize: '0.9rem',
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.86)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(8px)',
    padding: '20px',
  },

  modalContent: {
    width: '100%',
    maxWidth: '640px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), #111116',
    border: '1px solid rgba(248,113,113,0.45)',
    boxShadow: '0 0 45px rgba(239,68,68,0.24)',
  },

  modalTitle: {
    margin: '0 0 20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#fff',
  },

  infoGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '16px 0',
  },

  infoItem: {
    margin: 0,
    color: '#d4d4d8',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },

  detailText: {
    color: '#e4e4e7',
    lineHeight: 1.6,
  },

  msgBox: {
    backgroundColor: 'rgba(3,3,7,0.8)',
    padding: '16px',
    borderRadius: '16px',
    borderLeft: '4px solid #ef4444',
    margin: '15px 0',
  },

  msgLabel: {
    color: '#f87171',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '1px',
  },

  msgText: {
    margin: '8px 0 0',
    color: '#e4e4e7',
    lineHeight: 1.6,
  },

  label: {
    display: 'block',
    marginTop: '20px',
    marginBottom: '10px',
    fontWeight: 900,
    color: '#f87171',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.82rem',
  },

  textarea: {
    width: '100%',
    minHeight: '130px',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(3,3,7,0.85)',
    color: '#fff',
    border: '1px solid rgba(113,113,122,0.55)',
    borderRadius: '14px',
    padding: '14px',
    resize: 'vertical',
    outline: 'none',
  },

  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },

  btnAction: {
    flex: 1,
    minHeight: '46px',
    padding: '0 14px',
    border: 'none',
    borderRadius: '14px',
    color: 'white',
    fontWeight: 950,
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },

  btnCerrarModal: {
    width: '100%',
    minHeight: '46px',
    marginTop: '20px',
    background: 'rgba(255,255,255,0.05)',
    color: '#a1a1aa',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    borderRadius: '14px',
    fontWeight: 950,
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },

  btnCerrarModalHover: {
    color: '#fff',
    border: '1px solid rgba(248,113,113,0.45)',
    boxShadow: '0 0 20px rgba(239,68,68,0.2)',
  },
};

export default AdminDashboard;