// src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams(); // Usamos useParams para obtener el id del producto desde la URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Aquí puedes hacer una solicitud al backend para obtener los detalles del producto
    setProduct({ id, name: "Cosmic Dreams", price: "2.5 ETH", description: "A stunning digital piece" });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

export default ProductDetail;