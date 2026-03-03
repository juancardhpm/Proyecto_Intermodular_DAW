// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={`path_to_images/${product.name}.jpg`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>Price: {product.price}</p>
      <Link to={`/product/${product.id}`}>View Details</Link>
    </div>
  );
}

export default ProductCard;