import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AdminProducts = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('desktop');
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [hoveredItem, setHoveredItem] = useState(null);

  const [formProducto, setFormProducto] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen_url: '',
    categoria_id: ''
  });

  const isMobile = screen === 'mobile';
  const isTablet = screen === 'tablet';
  const isVerySmall = viewportWidth <= 380;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);

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

  const cargarProductos = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get('/products');
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarCategorias = useCallback(async () => {
    try {
      const res = await api.get('/category');
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setCategorias([]);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, [cargarProductos, cargarCategorias]);

  const handleChange = (e) => {
    setFormProducto({
      ...formProducto,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setFormProducto({
      id: null,
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen_url: '',
      categoria_id: ''
    });

    setEditando(false);
  };

  const seleccionarParaEditar = (producto) => {
    setFormProducto({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      imagen_url: producto.imagen_url || '',
      categoria_id: producto.categoria_id || ''
    });

    setEditando(true);
    setMensaje('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editando) {
        await api.put(`/products/${formProducto.id}`, formProducto, { headers });
        setMensaje('Producto actualizado con éxito');
      } else {
        await api.post('/products', formProducto, { headers });
        setMensaje('Producto creado con éxito');
      }

      limpiarFormulario();
      cargarProductos();
    } catch (error) {
      setMensaje('Error al guardar el producto');
      console.error(error);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const token = localStorage.getItem('token');

      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('Producto eliminado correctamente');
      cargarProductos();
    } catch (error) {
      setMensaje('Error al eliminar el producto.');
      console.error(error);
    }
  };

  const getCategoryName = (id) => {
    const category = categorias.find(cat => String(cat.id) === String(id));
    return category ? category.nombre : 'Sin categoría';
  };

  const renderMobileCards = () => (
    <div style={styles.mobileList}>
      {productos.map((p) => (
        <article
          key={p.id}
          style={{
            ...styles.mobileCard,
            ...(hoveredItem === `product-${p.id}` ? styles.mobileCardHover : {})
          }}
          onMouseEnter={() => setHoveredItem(`product-${p.id}`)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <img
            src={p.imagen_url || 'https://via.placeholder.com/400x260'}
            alt={p.nombre}
            style={styles.mobileProductImg}
          />

          <div style={styles.mobileProductInfo}>
            <div>
              <p style={styles.productId}>ID: {p.id}</p>
              <h3 style={styles.mobileProductTitle}>{p.nombre}</h3>
              <p style={styles.mobileCategory}>{getCategoryName(p.categoria_id)}</p>
            </div>

            <div
              style={{
                ...styles.mobileStats,
                gridTemplateColumns: isVerySmall ? '1fr' : 'repeat(2, minmax(0, 1fr))'
              }}
            >
              <span style={styles.priceBadge}>{p.precio}€</span>
              <span style={styles.stockBadge}>Stock: {p.stock}</span>
            </div>
          </div>

          <div
            style={{
              ...styles.mobileActions,
              flexDirection: isVerySmall ? 'column' : 'row'
            }}
          >
            <button
              style={{
                ...styles.editBtn,
                width: isVerySmall ? '100%' : 'auto'
              }}
              onClick={() => seleccionarParaEditar(p)}
            >
              Editar
            </button>

            <button
              style={{
                ...styles.deleteBtn,
                width: isVerySmall ? '100%' : 'auto'
              }}
              onClick={() => eliminarProducto(p.id)}
            >
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );

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
          GESTIÓN DE <span style={styles.accent}>PRODUCTOS</span>
        </h1>

        <p style={styles.subtitle}>
          Crea, edita y elimina productos del catálogo gaming desde el panel de administración.
        </p>
      </section>

      <section
        style={{
          ...styles.layout,
          gridTemplateColumns: isMobile || isTablet ? '1fr' : '420px 1fr'
        }}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>{editando ? '✏️' : '➕'}</span>

            <div>
              <h2 style={styles.sectionTitle}>
                {editando ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <p style={styles.sectionSubtitle}>
                {editando ? `Producto ID ${formProducto.id}` : 'Añade un nuevo producto al catálogo.'}
              </p>
            </div>
          </div>

          <input
            name="nombre"
            placeholder="Nombre del producto"
            value={formProducto.nombre}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <select
            name="categoria_id"
            value={formProducto.categoria_id}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <div
            style={{
              ...styles.doubleInput,
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'
            }}
          >
            <input
              name="precio"
              type="number"
              step="0.01"
              placeholder="Precio (€)"
              value={formProducto.precio}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={formProducto.stock}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <input
            name="imagen_url"
            placeholder="URL de la imagen"
            value={formProducto.imagen_url}
            onChange={handleChange}
            style={styles.input}
          />

          {formProducto.imagen_url && (
            <div style={styles.previewBox}>
              <img
                src={formProducto.imagen_url}
                alt="Preview"
                style={styles.imgPreview}
              />
            </div>
          )}

          <textarea
            name="descripcion"
            placeholder="Descripción del producto"
            value={formProducto.descripcion}
            onChange={handleChange}
            style={styles.textarea}
          />

          <div
            style={{
              ...styles.buttonGroup,
              flexDirection: isMobile ? 'column' : 'row'
            }}
          >
            <button
              type="submit"
              style={{
                ...styles.addBtn,
                ...(hoveredItem === 'submit' ? styles.actionBtnHover : {})
              }}
              onMouseEnter={() => setHoveredItem('submit')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {editando ? 'ACTUALIZAR PRODUCTO' : 'GUARDAR PRODUCTO'}
            </button>

            {editando && (
              <button
                type="button"
                onClick={limpiarFormulario}
                style={{
                  ...styles.cancelBtn,
                  ...(hoveredItem === 'cancel' ? styles.cancelBtnHover : {})
                }}
                onMouseEnter={() => setHoveredItem('cancel')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                CANCELAR
              </button>
            )}
          </div>

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
        </form>

        <section style={styles.productsPanel}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🧩</span>

            <div>
              <h2 style={styles.sectionTitle}>Productos existentes</h2>
              <p style={styles.sectionSubtitle}>
                Total registrados: {productos.length}
              </p>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.loader}></div>
              <p style={styles.loadingText}>Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={styles.emptyIcon}>📭</span>
              <p style={styles.emptyTitle}>No hay productos registrados</p>
              <p style={styles.emptyText}>
                Cuando añadas un producto, aparecerá en esta lista.
              </p>
            </div>
          ) : isMobile ? (
            renderMobileCards()
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Miniatura</th>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Categoría</th>
                    <th style={styles.th}>Precio</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id} style={styles.tableRow}>
                      <td style={styles.td}>
                        {p.imagen_url ? (
                          <img
                            src={p.imagen_url}
                            alt={p.nombre}
                            style={styles.productImg}
                          />
                        ) : (
                          <span style={styles.noImage}>N/A</span>
                        )}
                      </td>

                      <td style={styles.td}>
                        <strong>{p.nombre}</strong>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>
                          {getCategoryName(p.categoria_id)}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.priceText}>{p.precio}€</span>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.stockText}>{p.stock}</span>
                      </td>

                      <td style={styles.td}>
                        <div style={styles.actionBtns}>
                          <button
                            style={styles.editBtn}
                            onClick={() => seleccionarParaEditar(p)}
                          >
                            Editar
                          </button>

                          <button
                            style={styles.deleteBtn}
                            onClick={() => eliminarProducto(p.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
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

  layout: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'grid',
    gap: '28px',
    alignItems: 'start',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '26px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.42)',
  },

  productsPanel: {
    padding: '26px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(18,18,24,0.68)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.32)',
    minWidth: 0,
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

  doubleInput: {
    display: 'grid',
    gap: '12px',
  },

  input: {
  height: '40px',
  padding: '0 11px',
  borderRadius: '11px',
  border: '1px solid rgba(113,113,122,0.55)',
  backgroundColor: 'rgba(3,3,7,0.85)',
  color: '#fff',
  outline: 'none',
  transition: 'all 0.25s ease',
  fontSize: '0.7rem',
  boxSizing: 'border-box',
},

  textarea: {
    minHeight: '120px',
    padding: '14px',
    borderRadius: '14px',
    border: '1px solid rgba(113,113,122,0.55)',
    backgroundColor: 'rgba(3,3,7,0.85)',
    color: '#fff',
    outline: 'none',
    resize: 'vertical',
    transition: 'all 0.25s ease',
  },

  previewBox: {
    padding: '10px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.035)',
  },

  imgPreview: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '12px',
    display: 'block',
  },

  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '4px',
  },

  addBtn: {
    flex: 1,
    minHeight: '48px',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    color: '#fff',
    padding: '0 16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '14px',
    fontWeight: 950,
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },

  cancelBtn: {
    flex: 1,
    minHeight: '48px',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    padding: '0 16px',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '14px',
    fontWeight: 950,
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },

  actionBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 26px rgba(168,85,247,0.35)',
  },

  cancelBtnHover: {
    transform: 'translateY(-2px)',
    border: '1px solid rgba(248,113,113,0.45)',
    boxShadow: '0 0 20px rgba(239,68,68,0.18)',
  },

  message: {
    margin: '8px 0 0',
    padding: '10px 14px',
    borderRadius: '14px',
    border: '1px solid',
    fontWeight: 850,
    fontSize: '0.9rem',
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    minWidth: '850px',
    borderCollapse: 'collapse',
  },

  tableHeader: {
    borderBottom: '2px solid rgba(248,113,113,0.45)',
    textAlign: 'left',
    color: '#f87171',
  },

  th: {
    padding: '14px',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  tableRow: {
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },

  td: {
    padding: '14px',
    color: '#e4e4e7',
    fontSize: '0.9rem',
  },

  productImg: {
    width: '52px',
    height: '52px',
    objectFit: 'cover',
    borderRadius: '12px',
    border: '1px solid rgba(248,113,113,0.22)',
  },

  noImage: {
    color: '#71717a',
    fontSize: '0.8rem',
  },

  categoryBadge: {
    display: 'inline-flex',
    padding: '5px 9px',
    borderRadius: '999px',
    color: '#c084fc',
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.28)',
    fontSize: '0.76rem',
    fontWeight: 900,
  },

  priceText: {
    color: '#c084fc',
    fontWeight: 950,
  },

  stockText: {
    color: '#34d399',
    fontWeight: 950,
  },

  actionBtns: {
    display: 'flex',
    gap: '8px',
  },

  editBtn: {
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

  mobileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  mobileCard: {
    overflow: 'hidden',
    borderRadius: '22px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.25s ease',
  },

  mobileCardHover: {
    transform: 'translateY(-3px)',
    border: '1px solid rgba(248,113,113,0.38)',
    boxShadow: '0 18px 45px rgba(0,0,0,0.35), 0 0 22px rgba(239,68,68,0.12)',
  },

  mobileProductImg: {
    width: '100%',
    height: '190px',
    objectFit: 'cover',
    display: 'block',
  },

  mobileProductInfo: {
    padding: '16px',
  },

  productId: {
    margin: '0 0 5px',
    color: '#f87171',
    fontSize: '0.78rem',
    fontWeight: 950,
  },

  mobileProductTitle: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#fff',
    lineHeight: 1.35,
  },

  mobileCategory: {
    margin: '8px 0 0',
    color: '#a1a1aa',
    fontSize: '0.86rem',
  },

  mobileStats: {
    display: 'grid',
    gap: '8px',
    marginTop: '14px',
    width: '100%',
  },

  priceBadge: {
    minWidth: 0,
    padding: '7px 10px',
    borderRadius: '999px',
    color: '#c084fc',
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.28)',
    fontSize: '0.82rem',
    fontWeight: 950,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  stockBadge: {
    minWidth: 0,
    padding: '7px 10px',
    borderRadius: '999px',
    color: '#34d399',
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.28)',
    fontSize: '0.82rem',
    fontWeight: 950,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  mobileActions: {
    display: 'flex',
    gap: '10px',
    padding: '0 16px 16px',
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

export default AdminProducts;