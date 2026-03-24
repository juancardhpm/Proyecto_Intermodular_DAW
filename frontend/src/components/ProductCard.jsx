// frontend/src/components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      {/* Mostrar la imagen del producto */}
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>{product.price}€</span>
      <button>Añadir al carrito</button>
    </div>
  );
};

export default ProductCard;
