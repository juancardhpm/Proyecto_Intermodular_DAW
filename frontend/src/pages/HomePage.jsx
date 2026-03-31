// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
// Importamos tu instancia configurada de axios para que use la URL base correcta
import api from '../api/axios'; 

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos la instancia 'api' y la ruta correcta que definimos en el backend
    api.get('/products') 
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener productos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>CATÁLOGO DE <span style={styles.accent}>PRODUCTOS</span></h1>
        <p style={styles.subtitle}>Equípate con la mejor tecnología gaming</p>
      </header>
      
      {loading ? (
        <p style={styles.message}>Cargando arsenal...</p>
      ) : products.length > 0 ? (
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p style={styles.message}>No hay productos disponibles en este momento.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#0b0b0d', // Fondo oscuro como el login
    minHeight: '100vh',
    color: 'white'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '2.5rem',
    letterSpacing: '2px',
    marginBottom: '10px'
  },
  accent: {
    color: '#a855f7', // El morado que estamos usando
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#71717a',
    fontSize: '1.1rem'
  },
  grid: {
    display: 'grid',
    // Esto hace que las tarjetas sean responsivas automáticamente
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  message: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#71717a',
    marginTop: '50px'
  }
};

export default HomePage;