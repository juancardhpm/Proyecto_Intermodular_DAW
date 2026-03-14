import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';  // Importamos el componente ProductCard para mostrar los productos en el carrito

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);  // Para almacenar los productos en el carrito
  const [total, setTotal] = useState(0);  // Para almacenar el total de la compra

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/cart');  // Asegúrate de que esta ruta esté bien configurada en el backend
        setCartItems(response.data.cartItems);
        calculateTotal(response.data.cartItems);  // Calculamos el total cuando obtenemos los productos
      } catch (error) {
        console.error('Error al obtener los productos del carrito', error);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.quantity * item.product.price;  // Producto * cantidad
    });
    setTotal(totalAmount);  // Actualizamos el estado del total
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cartItems.length > 0 ? (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                {/* Usamos ProductCard para mostrar los productos del carrito */}
                <ProductCard product={item.product} />  {/* Pasamos el producto como prop */}
                <span>{item.quantity} x {item.product.price}€</span>
              </li>
            ))}
          </ul>
          <h3>Total: {total}€</h3>
        </div>
      ) : (
        <p>El carrito está vacío.</p>
      )}
    </div>
  );
};

export default Cart;