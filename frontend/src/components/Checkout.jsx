//Este componente va a simular el proceso de compra y mostrará el resumen del carrito y un botón para finalizar la compra.

import React, { useState } from 'react';  // Solo importa useState una vez
import { useNavigate } from 'react-router-dom';  // Importamos el hook useNavigate para redirigir al usuario después de la compra

const Checkout = ({ cartItems, total }) => {
  const [orderStatus, setOrderStatus] = useState(null); // Para manejar el estado del pedido
  const navigate = useNavigate(); // Hook para redirigir al usuario

  const handleConfirmPurchase = async () => {
    try {
      // Aquí podrías hacer una llamada al backend para crear un pedido real
      // Ejemplo de llamada al backend:
      // const response = await axios.post('/api/orders', { cartItems, total });

      // Simulamos el proceso de compra
      setOrderStatus('Pago completado');  // Simulamos que el pago fue exitoso

      // Redirigimos a la página de confirmación del pedido
      navigate('/order-confirmation');  // Redirigir a la página de confirmación del pedido

    } catch (error) {
      console.error('Error al procesar la compra', error);
      setOrderStatus('Error en el proceso de compra');
    }
  };

  return (
    <div>
      <h2>Resumen del Pedido</h2>
      {cartItems.length > 0 ? (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <span>{item.product.name} - {item.quantity} x {item.product.price}€</span>
              </li>
            ))}
          </ul>
          <h3>Total: {total}€</h3>
          <button onClick={handleConfirmPurchase}>Confirmar Compra</button>
        </div>
      ) : (
        <p>No hay productos en el carrito.</p>
      )}

      {/* Mostrar el estado del pedido */}
      {orderStatus && <p>{orderStatus}</p>}
    </div>
  );
};

export default Checkout;

