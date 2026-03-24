//Crea la página principal que muestra todos los productos

// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';  // Importamos el componente Cart
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]); //Usamos el hook `useState` para crear una variable de estado `products`,  que almacenará la lista de productos que obtendremos del backend.

  useEffect(() => { //Realiza una solicitud HTTP usando Axios para obtener los productos desde el endpoint `/api/products` de nuestro backend.
    axios.get('/api/products') // Endpoint para obtener los productos
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Catálogo de Productos</h1>
      
       {/* Mostrar los productos, o un mensaje si no hay productos */}
      {products.length > 0 ? (
        <div>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />  // Usamos el componente ProductCard para mostrar cada producto
          ))}
        </div>
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default HomePage;