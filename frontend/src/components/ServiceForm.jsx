import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ServiceForm = () => {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem('token'));
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
      console.error('Error parseando user:', error);
      return null;
    }
  });

  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const isLogged = token && user;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 850);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isLogged) {
      fetchHistorial();
    }
  }, [isLogged]);

  const fetchHistorial = async () => {
    try {
      const res = await api.get(`/services/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHistorial(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al obtener el historial:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!asunto.trim() || !mensaje.trim()) {
      alert('Por favor, rellena todos los campos.');
      return;
    }

    setEnviando(true);

    try {
      await api.post('/services', {
        usuario_id: user.id,
        asunto,
        mensaje
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Solicitud enviada correctamente.');
      setAsunto('');
      setMensaje('');
      fetchHistorial();
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('❌ Error al enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  const getStatusStyle = (estado) => {
    const normalized = estado?.toLowerCase();

    if (normalized === 'abierto') {
      return {
        background: 'rgba(59, 130, 246, 0.14)',
        color: '#60a5fa',
        border: '1px solid rgba(59, 130, 246, 0.35)'
      };
    }

    if (normalized === 'respondido') {
      return {
        background: 'rgba(16, 185, 129, 0.14)',
        color: '#34d399',
        border: '1px solid rgba(16, 185, 129, 0.35)'
      };
    }

    return {
      background: 'rgba(239, 68, 68, 0.14)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.35)'
    };
  };

  if (!isLogged) {
    return (
      <main style={styles.container}>
        <section
          style={{
            ...styles.publicLayout,
            gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr'
          }}
        >
          <div style={styles.infoPanel}>
            <span style={styles.kicker}>Centro de asistencia</span>

            <h1 style={styles.mainTitle}>
              SOPORTE <span style={styles.accent}>JCS GAMING</span>
            </h1>

            <p style={styles.mainText}>
              Este apartado está pensado para ayudarte con incidencias, dudas sobre pedidos,
              productos, asistencia técnica o cualquier consulta relacionada con tu experiencia
              en la tienda.
            </p>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>⚡</span>
                <h3 style={styles.featureTitle}>Incidencias rápidas</h3>
                <p style={styles.featureText}>
                  Comunica problemas con pedidos, stock, pagos o productos.
                </p>
              </div>

              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>🛠️</span>
                <h3 style={styles.featureTitle}>Asistencia técnica</h3>
                <p style={styles.featureText}>
                  Solicita ayuda sobre componentes, periféricos o configuración.
                </p>
              </div>

              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>📦</span>
                <h3 style={styles.featureTitle}>Seguimiento</h3>
                <p style={styles.featureText}>
                  Consulta el estado de tus peticiones anteriores desde tu cuenta.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.loginPanel}>
            <div style={styles.lockIcon}>🔒</div>

            <h2 style={styles.loginTitle}>Acceso requerido</h2>

            <p style={styles.loginText}>
              Para solicitar asistencia debes iniciar sesión.
            </p>

            <p style={styles.loginSubtext}>
              Así podremos vincular tu consulta con tu cuenta, revisar tu historial y responderte
              de forma más precisa.
            </p>

            <div style={styles.actionGroup}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  ...styles.primaryBtn,
                  ...(hoveredItem === 'login' ? styles.primaryBtnHover : {})
                }}
                onMouseEnter={() => setHoveredItem('login')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                INICIAR SESIÓN
              </button>

              <button
                onClick={() => navigate('/register')}
                style={{
                  ...styles.secondaryBtn,
                  ...(hoveredItem === 'register' ? styles.secondaryBtnHover : {})
                }}
                onMouseEnter={() => setHoveredItem('register')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                CREAR CUENTA
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <section style={styles.headerSection}>
        <span style={styles.kicker}>Panel de soporte</span>

        <h1 style={styles.mainTitle}>
          SOLICITUD DE <span style={styles.accent}>ASISTENCIA</span>
        </h1>

        <p style={styles.mainText}>
          Cuéntanos qué necesitas y nuestro equipo revisará tu petición. Puedes usar este apartado
          para incidencias con pedidos, dudas técnicas, productos defectuosos o consultas generales.
        </p>
      </section>

      <section
        style={{
          ...styles.privateLayout,
          gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr'
        }}
      >
        <div style={styles.formSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🎧</span>
            <div>
              <h2 style={styles.sectionTitle}>¿En qué podemos ayudarte?</h2>
              <p style={styles.sectionSubtitle}>
                Describe tu consulta con el máximo detalle posible.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Asunto</label>
              <input
                type="text"
                placeholder="Ej: Problema con mi pedido"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                style={{
                  ...styles.input,
                  ...(hoveredItem === 'asunto' ? styles.inputFocus : {})
                }}
                onFocus={() => setHoveredItem('asunto')}
                onBlur={() => setHoveredItem(null)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mensaje</label>
              <textarea
                placeholder="Describe detalladamente tu problema..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                style={{
                  ...styles.textarea,
                  ...(hoveredItem === 'mensaje' ? styles.inputFocus : {})
                }}
                onFocus={() => setHoveredItem('mensaje')}
                onBlur={() => setHoveredItem(null)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              style={{
                ...styles.primaryBtn,
                width: '100%',
                opacity: enviando ? 0.7 : 1,
                cursor: enviando ? 'not-allowed' : 'pointer',
                ...(hoveredItem === 'submit' && !enviando ? styles.primaryBtnHover : {})
              }}
              onMouseEnter={() => setHoveredItem('submit')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {enviando ? 'PROCESANDO...' : 'ENVIAR SOLICITUD'}
            </button>
          </form>
        </div>

        <div style={styles.historySection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>📡</span>
            <div>
              <h2 style={styles.sectionTitle}>Mis peticiones</h2>
              <p style={styles.sectionSubtitle}>
                Revisa el estado de tus solicitudes anteriores.
              </p>
            </div>
          </div>

          {historial.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={styles.emptyIcon}>🗂️</span>
              <p style={styles.emptyMsg}>Aún no has realizado ninguna consulta.</p>
              <p style={styles.emptySubMsg}>
                Cuando envíes una solicitud, aparecerá aquí.
              </p>
            </div>
          ) : (
            <div style={styles.ticketList}>
              {historial.map((item) => (
                <article key={item.id} style={styles.ticketCard}>
                  <div style={styles.ticketTop}>
                    <div>
                      <h3 style={styles.ticketTitle}>{item.asunto}</h3>
                      <p style={styles.ticketDate}>
                        {new Date(item.fecha_creacion).toLocaleDateString('es-ES')}
                      </p>
                    </div>

                    <span
                      style={{
                        ...styles.badge,
                        ...getStatusStyle(item.estado)
                      }}
                    >
                      {item.estado?.toUpperCase()}
                    </span>
                  </div>

                  <p style={styles.ticketPreview}>
                    {item.mensaje}
                  </p>

                  <div style={styles.ticketFooter}>
                    {item.respuesta_admin ? (
                      <button
                        onClick={() => setSelectedRequest(item)}
                        style={{
                          ...styles.readBtn,
                          ...(hoveredItem === `leer-${item.id}` ? styles.readBtnHover : {})
                        }}
                        onMouseEnter={() => setHoveredItem(`leer-${item.id}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        📖 Leer respuesta
                      </button>
                    ) : (
                      <span style={styles.waitingText}>Esperando respuesta...</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedRequest && (
        <div style={styles.modalOverlay} onClick={() => setSelectedRequest(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span style={styles.kicker}>Ticket #{selectedRequest.id}</span>

            <h3 style={styles.modalTitle}>{selectedRequest.asunto}</h3>

            <div style={styles.msgBoxCliente}>
              <strong style={styles.msgLabel}>Tu mensaje</strong>
              <p style={styles.msgText}>{selectedRequest.mensaje}</p>
            </div>

            <div style={styles.msgBoxAdmin}>
              <strong style={styles.msgLabelAdmin}>Respuesta del soporte</strong>
              <p style={styles.msgText}>{selectedRequest.respuesta_admin}</p>
            </div>

            <button
              style={{
                ...styles.closeBtn,
                ...(hoveredItem === 'close' ? styles.closeBtnHover : {})
              }}
              onClick={() => setSelectedRequest(null)}
              onMouseEnter={() => setHoveredItem('close')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              CERRAR VENTANA
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
    padding: '70px 20px',
    color: '#fff',
    fontFamily: 'sans-serif',
    background:
      'radial-gradient(circle at top left, rgba(168, 85, 247, 0.22), transparent 35%), radial-gradient(circle at top right, rgba(34, 211, 238, 0.13), transparent 30%), linear-gradient(180deg, #08080b 0%, #0b0b0d 45%, #09090b 100%)',
  },

  publicLayout: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'grid',
    gap: '32px',
    alignItems: 'center',
  },

  privateLayout: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'grid',
    gap: '32px',
    alignItems: 'start',
  },

  headerSection: {
    maxWidth: '850px',
    margin: '0 auto 42px',
    textAlign: 'center',
  },

  infoPanel: {
    padding: '34px',
    borderRadius: '26px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.72)',
    border: '1px solid rgba(168, 85, 247, 0.18)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.42)',
  },

  loginPanel: {
    padding: '34px',
    borderRadius: '26px',
    background:
      'linear-gradient(145deg, rgba(168,85,247,0.16), rgba(255,255,255,0.035)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(168, 85, 247, 0.32)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.45), 0 0 35px rgba(168,85,247,0.18)',
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

  mainTitle: {
    margin: '0 0 16px',
    fontSize: 'clamp(2.1rem, 5vw, 3.5rem)',
    lineHeight: 1.1,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },

  accent: {
    color: '#a855f7',
    textShadow: '0 0 24px rgba(168, 85, 247, 0.7)',
  },

  mainText: {
    margin: 0,
    color: '#a1a1aa',
    fontSize: '1rem',
    lineHeight: 1.7,
  },

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginTop: '28px',
  },

  featureCard: {
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.045)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  featureIcon: {
    fontSize: '1.6rem',
  },

  featureTitle: {
    margin: '12px 0 8px',
    fontSize: '1rem',
    color: '#fff',
  },

  featureText: {
    margin: 0,
    color: '#a1a1aa',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },

  lockIcon: {
    width: '74px',
    height: '74px',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '22px',
    fontSize: '2rem',
    background: 'rgba(168, 85, 247, 0.14)',
    border: '1px solid rgba(168, 85, 247, 0.34)',
    boxShadow: '0 0 24px rgba(168, 85, 247, 0.28)',
  },

  loginTitle: {
    margin: '0 0 10px',
    fontSize: '1.6rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  loginText: {
    margin: '0 0 10px',
    color: '#fff',
    fontSize: '1.05rem',
    fontWeight: 900,
  },

  loginSubtext: {
    margin: '0 auto 24px',
    maxWidth: '390px',
    color: '#a1a1aa',
    lineHeight: 1.6,
  },

  actionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  formSection: {
    padding: '28px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(168, 85, 247, 0.22)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.42)',
  },

  historySection: {
    padding: '28px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(18,18,24,0.68)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.32)',
  },

  sectionHeader: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    marginBottom: '24px',
  },

  sectionIcon: {
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    background: 'rgba(168, 85, 247, 0.12)',
    border: '1px solid rgba(168, 85, 247, 0.28)',
    fontSize: '1.35rem',
  },

  sectionTitle: {
    margin: 0,
    fontSize: '1.25rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  sectionSubtitle: {
    margin: '5px 0 0',
    color: '#a1a1aa',
    fontSize: '0.9rem',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '0.82rem',
    color: '#d4d4d8',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  input: {
    height: '48px',
    padding: '0 14px',
    backgroundColor: 'rgba(3,3,7,0.85)',
    border: '1px solid rgba(113, 113, 122, 0.55)',
    borderRadius: '14px',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.25s ease',
  },

  textarea: {
    padding: '14px',
    backgroundColor: 'rgba(3,3,7,0.85)',
    border: '1px solid rgba(113, 113, 122, 0.55)',
    borderRadius: '14px',
    color: '#fff',
    minHeight: '145px',
    resize: 'vertical',
    outline: 'none',
    transition: 'all 0.25s ease',
  },

  inputFocus: {
    border: '1px solid rgba(168, 85, 247, 0.7)',
    boxShadow: '0 0 0 3px rgba(168,85,247,0.14), 0 0 22px rgba(168,85,247,0.18)',
  },

  primaryBtn: {
    minHeight: '48px',
    padding: '0 20px',
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    fontWeight: 950,
    letterSpacing: '0.9px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  primaryBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 28px rgba(168,85,247,0.52), 0 12px 30px rgba(124,58,237,0.28)',
  },

  secondaryBtn: {
    minHeight: '48px',
    padding: '0 20px',
    borderRadius: '14px',
    color: '#fff',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    fontWeight: 950,
    letterSpacing: '0.9px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  secondaryBtnHover: {
    transform: 'translateY(-2px)',
    border: '1px solid rgba(168,85,247,0.45)',
    boxShadow: '0 0 22px rgba(168,85,247,0.22)',
  },

  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    maxHeight: '560px',
    overflowY: 'auto',
    paddingRight: '4px',
  },

  ticketCard: {
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.045)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  ticketTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '14px',
    alignItems: 'flex-start',
  },

  ticketTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '1rem',
  },

  ticketDate: {
    margin: '6px 0 0',
    color: '#71717a',
    fontSize: '0.82rem',
  },

  ticketPreview: {
    margin: '14px 0',
    color: '#a1a1aa',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    maxHeight: '42px',
    overflow: 'hidden',
  },

  ticketFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  badge: {
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '0.68rem',
    fontWeight: 950,
    whiteSpace: 'nowrap',
  },

  readBtn: {
    padding: '9px 13px',
    borderRadius: '999px',
    border: '1px solid rgba(16,185,129,0.35)',
    color: '#34d399',
    background: 'rgba(16,185,129,0.1)',
    fontWeight: 900,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  readBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 20px rgba(16,185,129,0.25)',
  },

  waitingText: {
    color: '#71717a',
    fontSize: '0.82rem',
    fontWeight: 800,
  },

  emptyBox: {
    padding: '38px 20px',
    borderRadius: '18px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.035)',
    border: '1px dashed rgba(255,255,255,0.12)',
  },

  emptyIcon: {
    fontSize: '2rem',
  },

  emptyMsg: {
    margin: '12px 0 6px',
    color: '#fff',
    fontWeight: 900,
  },

  emptySubMsg: {
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
    maxWidth: '560px',
    padding: '30px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), #111116',
    border: '1px solid rgba(168,85,247,0.45)',
    boxShadow: '0 0 45px rgba(168,85,247,0.24)',
  },

  modalTitle: {
    margin: '0 0 20px',
    fontSize: '1.35rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  msgBoxCliente: {
    backgroundColor: 'rgba(3,3,7,0.8)',
    padding: '16px',
    borderRadius: '16px',
    borderLeft: '4px solid #a855f7',
    margin: '15px 0',
  },

  msgBoxAdmin: {
    backgroundColor: 'rgba(3,3,7,0.8)',
    padding: '16px',
    borderRadius: '16px',
    borderLeft: '4px solid #10b981',
    margin: '15px 0',
  },

  msgLabel: {
    color: '#c084fc',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '1px',
  },

  msgLabelAdmin: {
    color: '#34d399',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '1px',
  },

  msgText: {
    margin: '8px 0 0',
    color: '#e4e4e7',
    lineHeight: 1.6,
  },

  closeBtn: {
    width: '100%',
    minHeight: '46px',
    marginTop: '14px',
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    background: 'linear-gradient(135deg, #3f3f46, #18181b)',
    fontWeight: 950,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  closeBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 22px rgba(168,85,247,0.22)',
  },
};

export default ServiceForm;