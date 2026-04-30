import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AdminCategories = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('desktop');
  const [hoveredItem, setHoveredItem] = useState(null);

  const isMobile = screen === 'mobile';

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

  const cargarCategorias = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get('/category');
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al cargar categorías', error);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const seleccionarParaEditar = (cat) => {
    setEditando(true);
    setIdEditar(cat.id);
    setNombreCategoria(cat.nombre);
    setMensaje('');
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditar(null);
    setNombreCategoria('');
    setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreCategoria.trim()) {
      setMensaje('Introduce un nombre para la categoría.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editando) {
        await api.put(`/category/${idEditar}`, { nombre: nombreCategoria }, { headers });
        setMensaje('Categoría actualizada con éxito');
      } else {
        await api.post('/category', { nombre: nombreCategoria }, { headers });
        setMensaje('Categoría creada con éxito');
      }

      setNombreCategoria('');
      setEditando(false);
      setIdEditar(null);
      cargarCategorias();
    } catch (error) {
      setMensaje('Error al guardar la categoría');
      console.error(error);
    }
  };

  const eliminarCategoria = async (id) => {
    if (!window.confirm('¿Eliminar categoría? Los productos asociados podrían dar error.')) return;

    try {
      const token = localStorage.getItem('token');

      await api.delete(`/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('Categoría eliminada');
      cargarCategorias();
    } catch (error) {
      alert('No se puede eliminar: comprueba si tiene productos asociados.');
      console.error(error);
    }
  };

  return (
    <main
      style={{
        ...styles.container,
        padding: isMobile ? '50px 14px' : '70px 40px'
      }}
    >
      <section style={styles.headerSection}>
        <span style={styles.kicker}>Administración</span>

        <h1
          style={{
            ...styles.title,
            fontSize: isMobile ? '2rem' : 'clamp(2.3rem, 5vw, 3.4rem)'
          }}
        >
          GESTIÓN DE <span style={styles.accent}>CATEGORÍAS</span>
        </h1>

        <p style={styles.subtitle}>
          Crea, edita y elimina las categorías que organizan el catálogo de productos.
        </p>
      </section>

      <section style={styles.panel}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>{editando ? '✏️' : '➕'}</span>

          <div>
            <h2 style={styles.sectionTitle}>
              {editando ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <p style={styles.sectionSubtitle}>
              {editando
                ? `Modificando categoría ID ${idEditar}`
                : 'Añade una nueva sección al catálogo.'}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            ...styles.form,
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <input
            name="nombre"
            placeholder="Nombre de la categoría"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
            required
            style={{
              ...styles.input,
              ...(hoveredItem === 'input' ? styles.inputFocus : {})
            }}
            onFocus={() => setHoveredItem('input')}
            onBlur={() => setHoveredItem(null)}
          />

          <button
            type="submit"
            style={{
              ...(editando ? styles.editBtn : styles.addBtn),
              width: isMobile ? '100%' : 'auto',
              ...(hoveredItem === 'submit' ? styles.actionBtnHover : {})
            }}
            onMouseEnter={() => setHoveredItem('submit')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {editando ? 'ACTUALIZAR' : 'AÑADIR'}
          </button>

          {editando && (
            <button
              type="button"
              onClick={cancelarEdicion}
              style={{
                ...styles.cancelBtn,
                width: isMobile ? '100%' : 'auto',
                ...(hoveredItem === 'cancel' ? styles.cancelBtnHover : {})
              }}
              onMouseEnter={() => setHoveredItem('cancel')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              CANCELAR
            </button>
          )}
        </form>

        {mensaje && (
          <p
            style={{
              ...styles.message,
              color: mensaje.toLowerCase().includes('error') ? '#f87171' : '#34d399',
              borderColor: mensaje.toLowerCase().includes('error')
                ? 'rgba(239,68,68,0.35)'
                : 'rgba(16,185,129,0.35)',
              background: mensaje.toLowerCase().includes('error')
                ? 'rgba(239,68,68,0.12)'
                : 'rgba(16,185,129,0.12)'
            }}
          >
            {mensaje}
          </p>
        )}
      </section>

      <section style={styles.listPanel}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>📁</span>

          <div>
            <h2 style={styles.sectionTitle}>Categorías existentes</h2>
            <p style={styles.sectionSubtitle}>
              Total registradas: {categorias.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Cargando categorías...</p>
          </div>
        ) : categorias.length === 0 ? (
          <div style={styles.emptyBox}>
            <span style={styles.emptyIcon}>📭</span>
            <p style={styles.emptyTitle}>No hay categorías creadas</p>
            <p style={styles.emptyText}>
              Cuando añadas una categoría, aparecerá en esta lista.
            </p>
          </div>
        ) : (
          <ul style={styles.list}>
            {categorias.map((cat) => (
              <li
                key={cat.id}
                style={{
                  ...styles.listItem,
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'stretch' : 'center',
                  ...(hoveredItem === `cat-${cat.id}` ? styles.listItemHover : {})
                }}
                onMouseEnter={() => setHoveredItem(`cat-${cat.id}`)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div style={styles.catInfo}>
                  <span style={styles.catName}>{cat.nombre}</span>
                  <span style={styles.idText}>ID: {cat.id}</span>
                </div>

                <div
                  style={{
                    ...styles.actions,
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  <button
                    onClick={() => seleccionarParaEditar(cat)}
                    style={{
                      ...styles.editBtnSmall,
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarCategoria(cat.id)}
                    style={{
                      ...styles.deleteBtn,
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
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

  panel: {
    maxWidth: '900px',
    margin: '0 auto 28px',
    padding: '26px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.42)',
  },

  listPanel: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '26px',
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
    marginBottom: '22px',
  },

  sectionIcon: {
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.28)',
    fontSize: '1.35rem',
    flexShrink: 0,
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
    gap: '12px',
    marginBottom: '16px',
  },

  input: {
    height: '48px',
    padding: '0 14px',
    borderRadius: '14px',
    border: '1px solid rgba(113,113,122,0.55)',
    backgroundColor: 'rgba(3,3,7,0.85)',
    color: '#fff',
    outline: 'none',
    flex: 1,
    transition: 'all 0.25s ease',
  },

  inputFocus: {
    border: '1px solid rgba(248,113,113,0.65)',
    boxShadow: '0 0 0 3px rgba(239,68,68,0.13), 0 0 22px rgba(239,68,68,0.18)',
  },

  addBtn: {
    minHeight: '48px',
    padding: '0 20px',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    color: '#fff',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '14px',
    fontWeight: 950,
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },

  editBtn: {
    minHeight: '48px',
    padding: '0 20px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '14px',
    fontWeight: 950,
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },

  actionBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 26px rgba(168,85,247,0.35)',
  },

  cancelBtn: {
    minHeight: '48px',
    padding: '0 20px',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '14px',
    fontWeight: 950,
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },

  cancelBtnHover: {
    transform: 'translateY(-2px)',
    border: '1px solid rgba(248,113,113,0.45)',
    boxShadow: '0 0 20px rgba(239,68,68,0.18)',
  },

  message: {
    margin: '16px 0 0',
    padding: '10px 14px',
    borderRadius: '14px',
    border: '1px solid',
    fontWeight: 850,
    fontSize: '0.9rem',
  },

  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '16px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.045)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.25s ease',
  },

  listItemHover: {
    transform: 'translateY(-3px)',
    border: '1px solid rgba(248,113,113,0.38)',
    boxShadow: '0 18px 45px rgba(0,0,0,0.35), 0 0 22px rgba(239,68,68,0.12)',
  },

  catInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },

  catName: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 950,
  },

  idText: {
    color: '#71717a',
    fontSize: '0.82rem',
    fontWeight: 800,
  },

  actions: {
    display: 'flex',
    gap: '8px',
  },

  editBtnSmall: {
    minHeight: '36px',
    padding: '0 13px',
    background: 'rgba(59,130,246,0.14)',
    color: '#60a5fa',
    cursor: 'pointer',
    border: '1px solid rgba(59,130,246,0.35)',
    borderRadius: '999px',
    fontWeight: 900,
  },

  deleteBtn: {
    minHeight: '36px',
    padding: '0 13px',
    background: 'rgba(239,68,68,0.14)',
    color: '#f87171',
    cursor: 'pointer',
    border: '1px solid rgba(239,68,68,0.35)',
    borderRadius: '999px',
    fontWeight: 900,
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
    border: '3px solid rgba(239,68,68,0.18)',
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
};

export default AdminCategories;