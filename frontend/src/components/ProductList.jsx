import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';  // Importamos ProductCard para mostrar cada producto

const ProductList = () => {
  const [products, setProducts] = useState([]);  // Estado para almacenar los productos

  // useEffect para hacer la solicitud cuando el componente se monta
  useEffect(() => {
    // Hacer la solicitud GET para obtener los productos desde la API
    axios.get('/api/products')  // Esta es la ruta que configuraste en tu backend
      .then(response => {
        setProducts(response.data);  // Actualizar el estado con los productos
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);  // Manejo de errores
      });
  }, []);  // Se ejecuta solo una vez al montar el componente

  return (
    <div>
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>Cargando productos...</p>  // Mensaje mientras se cargan los productos
      )}
    </div>
  );
};

export default ProductList;