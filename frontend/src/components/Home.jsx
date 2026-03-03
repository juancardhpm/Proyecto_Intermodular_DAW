// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Aquí puedes obtener los productos desde el backend
    setProducts([
      { id: 1, name: "Cosmic Dreams", price: "2.5 ETH", category: "Arte Digital" },
      { id: 2, name: "Cyberpunk City", price: "3.2 ETH", category: "Cyberpunk" }
    ]);
  }, []);

  return (
    <div className="home">
      <h1>Discover Unique NFTs</h1>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;