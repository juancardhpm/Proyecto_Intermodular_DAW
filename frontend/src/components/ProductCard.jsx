// frontend/src/components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>{product.price}€</span>
      <button>Add to Cart</button> {/* Aquí puedes añadir la funcionalidad para agregar al carrito */}
    </div>
  );
};

export default ProductCard;