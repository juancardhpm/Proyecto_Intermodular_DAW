//Crea la página principal que muestra todos los productos

// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';  // Importamos el componente Cart
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products') // Endpoint para obtener los productos
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Catálogo de Productos</h1>
      
      {/* Renderizamos el componente del carrito */}
      <Cart />  {/* Aquí renderizamos el carrito */}
      
      <div>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;