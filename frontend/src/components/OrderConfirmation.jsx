

import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state; // Puedes pasar detalles del pedido a través del estado al redirigir

  return (
    <div>
      <h2>Gracias por tu compra</h2>
      <p>Tu pedido ha sido procesado con éxito.</p>
      <p>Número de pedido: {orderDetails?.orderId || '12345'}</p>
      <p>Total: {orderDetails?.total || '100.00'}€</p>
      <p>¡Nos pondremos en contacto contigo pronto para el envío!</p>
    </div>
  );
};

export default OrderConfirmation;