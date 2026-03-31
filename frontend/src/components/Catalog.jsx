import React, { useState, useEffect } from 'react';
import api from '../api/axios'; 
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Estados para los filtros
  const [filterNombre, setFilterNombre] = useState('');
  const [filterMin, setFilterMin] = useState('');
  const [filterMax, setFilterMax] = useState('');
  const [filterCat, setFilterCat] = useState('');

  // 1. Cargar categorías al inicio para el select
  useEffect(() => {
    api.get('/category').then(res => setCategories(res.data)).catch(err => console.log(err));
  }, []);

  // 2. Cargar productos (se dispara cada vez que cambian los filtros)
  useEffect(() => {
    fetchFilteredProducts();
  }, [filterNombre, filterMin, filterMax, filterCat]);

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      // Construimos los Query Params
      const params = new URLSearchParams();
      if (filterNombre) params.append('nombre', filterNombre);
      if (filterMin) params.append('minPrecio', filterMin);
      if (filterMax) params.append('maxPrecio', filterMax);
      if (filterCat) params.append('categoria', filterCat);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error filtrando:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>CATÁLOGO <span style={styles.accent}>GAMING</span></h2>
      
      {/* --- PANEL DE FILTROS --- */}
      <div style={styles.filterBar}>
        <input 
          type="text" placeholder="Buscar producto..." style={styles.input}
          value={filterNombre} onChange={(e) => setFilterNombre(e.target.value)}
        />

        <select 
          style={styles.select} 
          value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>

        <div style={styles.priceGroup}>
          <input 
            type="number" placeholder="Min €" style={styles.inputSmall}
            value={filterMin} onChange={(e) => setFilterMin(e.target.value)}
          />
          <input 
            type="number" placeholder="Max €" style={styles.inputSmall}
            value={filterMax} onChange={(e) => setFilterMax(e.target.value)}
          />
        </div>

        <button style={styles.resetBtn} onClick={() => {
          setFilterNombre(''); setFilterMin(''); setFilterMax(''); setFilterCat('');
        }}>LIMPIAR</button>
      </div>

      {loading ? (
        <p style={styles.text}>Buscando en el inventario...</p>
      ) : products.length > 0 ? (
        <div style={styles.grid}>
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div style={styles.text}>
          <p>No hay productos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#0b0b0d', minHeight: '100vh', color: 'white' },
  title: { textAlign: 'center', fontSize: '2.2rem', marginBottom: '30px' },
  accent: { color: '#a855f7', fontWeight: 'bold' },
  
  // Estilos de la barra de filtros
  filterBar: { 
    display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', 
    marginBottom: '40px', padding: '20px', backgroundColor: '#1a1a21', borderRadius: '12px' 
  },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #3f3f46', backgroundColor: '#000', color: '#fff', width: '250px' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #3f3f46', backgroundColor: '#000', color: '#fff' },
  priceGroup: { display: 'flex', gap: '5px' },
  inputSmall: { padding: '10px', borderRadius: '6px', border: '1px solid #3f3f46', backgroundColor: '#000', color: '#fff', width: '80px' },
  resetBtn: { padding: '10px 15px', backgroundColor: '#3f3f46', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },

  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px', maxWidth: '1200px', margin: '0 auto'
  },
  text: { textAlign: 'center', color: '#71717a', marginTop: '40px' }
};

export default Catalog;