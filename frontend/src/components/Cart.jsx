import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Checkout from './Checkout';  // Importamos el componente Checkout

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Para almacenar los productos en el carrito
  const [total, setTotal] = useState(0);  // Para almacenar el total de la compra

  
  // useEffect para obtener los productos del carrito
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/cart');
        setCartItems(response.data.cartItems);
        calculateTotal(response.data.cartItems);
      } catch (error) {
        console.error('Error al obtener los productos del carrito', error);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.quantity * item.product.price;
    });
    setTotal(totalAmount);
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cartItems.length > 0 ? (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <ProductCard product={item.product} />
                <span>{item.quantity} x {item.product.price}€</span>
              </li>
            ))}
          </ul>
          <h3>Total: {total}€</h3>
          {/* Aquí agregamos el componente Checkout */}
          <Checkout cartItems={cartItems} total={total} />
        </div>
      ) : (
        <p>El carrito está vacío.</p>
      )}
    </div>
  );
};

export default Cart;