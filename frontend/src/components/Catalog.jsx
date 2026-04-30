import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [screen, setScreen] = useState('desktop');
  const [hoveredItem, setHoveredItem] = useState(null);

  const [filterNombre, setFilterNombre] = useState('');
  const [filterMin, setFilterMin] = useState('');
  const [filterMax, setFilterMax] = useState('');
  const [filterCat, setFilterCat] = useState('');

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
    api.get('/category')
      .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [filterNombre, filterMin, filterMax, filterCat]);

  const fetchFilteredProducts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filterNombre) params.append('nombre', filterNombre);
      if (filterMin) params.append('minPrecio', filterMin);
      if (filterMax) params.append('maxPrecio', filterMax);
      if (filterCat) params.append('categoria', filterCat);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error filtrando:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterNombre('');
    setFilterMin('');
    setFilterMax('');
    setFilterCat('');
  };

  return (
    <main
      style={{
        ...styles.container,
        padding: isMobile ? '50px 14px' : '70px 20px'
      }}
    >
      <section style={styles.headerSection}>
        <span style={styles.kicker}>Catálogo online</span>

        <h1
          style={{
            ...styles.title,
            fontSize: isMobile ? '2.1rem' : 'clamp(2.4rem, 5vw, 3.6rem)'
          }}
        >
          CATÁLOGO <span style={styles.accent}>GAMING</span>
        </h1>

        <p style={styles.subtitle}>
          Filtra por producto, categoría o rango de precio y encuentra el componente perfecto para tu setup.
        </p>
      </section>

      <section style={styles.filterSection}>
        <div
          style={{
            ...styles.filterBar,
            gridTemplateColumns: isMobile
              ? '1fr'
              : isTablet
                ? '1fr 1fr'
                : '1.3fr 1fr 0.8fr auto'
          }}
        >
          <input
            type="text"
            placeholder="Buscar producto..."
            style={{
              ...styles.input,
              ...(hoveredItem === 'nombre' ? styles.inputFocus : {})
            }}
            value={filterNombre}
            onChange={(e) => setFilterNombre(e.target.value)}
            onFocus={() => setHoveredItem('nombre')}
            onBlur={() => setHoveredItem(null)}
          />

          <select
            style={{
              ...styles.select,
              ...(hoveredItem === 'categoria' ? styles.inputFocus : {})
            }}
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            onFocus={() => setHoveredItem('categoria')}
            onBlur={() => setHoveredItem(null)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <div
            style={{
              ...styles.priceGroup,
              gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr'
            }}
          >
            <input
              type="number"
              placeholder="Min €"
              style={{
                ...styles.inputSmall,
                ...(hoveredItem === 'min' ? styles.inputFocus : {})
              }}
              value={filterMin}
              onChange={(e) => setFilterMin(e.target.value)}
              onFocus={() => setHoveredItem('min')}
              onBlur={() => setHoveredItem(null)}
            />

            <input
              type="number"
              placeholder="Max €"
              style={{
                ...styles.inputSmall,
                ...(hoveredItem === 'max' ? styles.inputFocus : {})
              }}
              value={filterMax}
              onChange={(e) => setFilterMax(e.target.value)}
              onFocus={() => setHoveredItem('max')}
              onBlur={() => setHoveredItem(null)}
            />
          </div>

          <button
            style={{
              ...styles.resetBtn,
              width: isMobile || isTablet ? '100%' : 'auto',
              ...(hoveredItem === 'reset' ? styles.resetBtnHover : {})
            }}
            onClick={clearFilters}
            onMouseEnter={() => setHoveredItem('reset')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            LIMPIAR
          </button>
        </div>
      </section>

      {loading ? (
        <section style={styles.loadingBox}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Buscando en el inventario...</p>
        </section>
      ) : products.length > 0 ? (
        <>
          <div style={styles.resultsHeader}>
            <span style={styles.resultsBadge}>
              {products.length} producto(s) encontrado(s)
            </span>
          </div>

          <section
            style={{
              ...styles.grid,
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(auto-fill, minmax(280px, 1fr))'
            }}
          >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </>
      ) : (
        <section style={styles.emptyBox}>
          <span style={styles.emptyIcon}>🔎</span>
          <h2 style={styles.emptyTitle}>Sin resultados</h2>
          <p style={styles.emptyText}>
            No hay productos que coincidan con tu búsqueda.
          </p>

          <button
            onClick={clearFilters}
            style={{
              ...styles.emptyBtn,
              ...(hoveredItem === 'empty-clear' ? styles.emptyBtnHover : {})
            }}
            onMouseEnter={() => setHoveredItem('empty-clear')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            LIMPIAR FILTROS
          </button>
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
    margin: '0 auto 36px',
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

  filterSection: {
    maxWidth: '1180px',
    margin: '0 auto 34px',
  },

  filterBar: {
    display: 'grid',
    gap: '14px',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '24px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(18,18,24,0.82)',
    border: '1px solid rgba(168, 85, 247, 0.22)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.42)',
  },

  input: {
    width: '100%',
    height: '44px',
    padding: '0 14px',
    boxSizing: 'border-box',
    borderRadius: '14px',
    border: '1px solid rgba(113,113,122,0.55)',
    backgroundColor: 'rgba(3,3,7,0.85)',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.25s ease',
  },

  select: {
    width: '100%',
    height: '44px',
    padding: '0 14px',
    boxSizing: 'border-box',
    borderRadius: '14px',
    border: '1px solid rgba(113,113,122,0.55)',
    backgroundColor: 'rgba(3,3,7,0.85)',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.25s ease',
  },

  inputFocus: {
    border: '1px solid rgba(168, 85, 247, 0.7)',
    boxShadow: '0 0 0 3px rgba(168,85,247,0.14), 0 0 22px rgba(168,85,247,0.18)',
  },

  priceGroup: {
    display: 'grid',
    gap: '8px',
    width: '100%',
  },

  inputSmall: {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    boxSizing: 'border-box',
    borderRadius: '14px',
    border: '1px solid rgba(113,113,122,0.55)',
    backgroundColor: 'rgba(3,3,7,0.85)',
    color: '#fff',
    outline: 'none',
    fontSize: '0.85rem',
    transition: 'all 0.25s ease',
  },

  resetBtn: {
    minHeight: '44px',
    padding: '0 18px',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 950,
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
  },

  resetBtnHover: {
    transform: 'translateY(-2px)',
    border: '1px solid rgba(168,85,247,0.45)',
    boxShadow: '0 0 22px rgba(168,85,247,0.22)',
  },

  resultsHeader: {
    maxWidth: '1200px',
    margin: '0 auto 22px',
    display: 'flex',
    justifyContent: 'center',
  },

  resultsBadge: {
    display: 'inline-flex',
    padding: '8px 14px',
    borderRadius: '999px',
    color: '#34d399',
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.28)',
    fontSize: '0.82rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },

  grid: {
    display: 'grid',
    gap: '25px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  loadingBox: {
    maxWidth: '520px',
    margin: '70px auto 0',
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

  loadingText: {
    margin: 0,
    color: '#a1a1aa',
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
    fontSize: '2.7rem',
  },

  emptyTitle: {
    margin: '14px 0 8px',
    fontSize: '1.6rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  emptyText: {
    margin: '0 auto 24px',
    maxWidth: '420px',
    color: '#a1a1aa',
    lineHeight: 1.6,
  },

  emptyBtn: {
    minHeight: '46px',
    padding: '0 22px',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 950,
    letterSpacing: '0.9px',
    transition: 'all 0.25s ease',
  },

  emptyBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 28px rgba(168,85,247,0.35)',
  },
};

export default Catalog;