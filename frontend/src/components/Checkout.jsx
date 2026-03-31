import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cartItems, total }) => {
  const [metodoPago, setMetodoPago] = useState('Tarjeta');
  const [direccion, setDireccion] = useState('');
  const [cargando, setCargando] = useState(false);
  
  // Estado para capturar los datos específicos del pago
  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: '', caducidad: '', cvv: '',
    correoPaypal: '', passPaypal: '',
    numeroCuenta: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setDatosPago({ ...datosPago, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!direccion.trim()) {
      alert("⚠️ Por favor, introduce una dirección de envío.");
      return;
    }

    setCargando(true);

    try {
      const pedidoData = {
        usuario_id: user.id,
        total: total,
        direccion_envio: direccion,
        metodo_pago: metodoPago,
        detalles_pago: datosPago, // Enviamos los campos extra
        items: cartItems.map(item => ({
          producto_id: item.producto?.id || item.product?.id || item.producto_id,
          cantidad: item.cantidad || item.quantity,
          precio_unitario: item.producto?.precio || item.product?.precio
        }))
      };

      const response = await api.post('/orders/checkout', pedidoData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('🎉 ' + response.data.message);
      localStorage.removeItem('guestCart');
      navigate('/'); 
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('❌ ' + (error.response?.data?.message || 'Error al procesar el pedido'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.subtitle}>FINALIZAR COMPRA</h3>
      
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Dirección de Envío:</label>
        <input 
          type="text" placeholder="Calle, Número, Ciudad, CP" style={styles.input}
          value={direccion} onChange={(e) => setDireccion(e.target.value)}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Método de Pago:</label>
        <select style={styles.select} value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
          <option value="Tarjeta">💳 Tarjeta de Crédito</option>
          <option value="PayPal">🅿️ PayPal</option>
          <option value="Transferencia">🏦 Transferencia Bancaria</option>
        </select>
      </div>

      {/* SECCIÓN DINÁMICA DE PAGO */}
      <div style={styles.paymentDetails}>
        {metodoPago === 'Tarjeta' && (
          <>
            <input type="text" name="numeroTarjeta" placeholder="Número de Tarjeta" style={styles.input} onChange={handleInputChange} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" name="caducidad" placeholder="MM/AA" style={styles.input} onChange={handleInputChange} />
              <input type="text" name="cvv" placeholder="CVV" style={styles.input} onChange={handleInputChange} />
            </div>
          </>
        )}
        {metodoPago === 'PayPal' && (
          <>
            <input type="email" name="correoPaypal" placeholder="Correo de PayPal" style={styles.input} onChange={handleInputChange} />
            <input type="password" name="passPaypal" placeholder="Contraseña" style={styles.input} onChange={handleInputChange} />
          </>
        )}
        {metodoPago === 'Transferencia' && (
          <input type="text" name="numeroCuenta" placeholder="Número de cuenta (IBAN)" style={styles.input} onChange={handleInputChange} />
        )}
      </div>

      <button onClick={handlePayment} disabled={cargando} style={{...styles.payBtn, opacity: cargando ? 0.7 : 1}}>
        {cargando ? 'PROCESANDO...' : `CONFIRMAR Y PAGAR (${total.toFixed(2)}€)`}
      </button>
    </div>
  );
};

const styles = {
  container: { marginTop: '20px', padding: '20px', backgroundColor: '#1a1a21', borderRadius: '12px', border: '1px solid #2d2d35' },
  subtitle: { fontSize: '1rem', color: '#a855f7', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' },
  fieldGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.85rem', color: '#a1a1aa' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #2d2d35', backgroundColor: '#000', color: '#fff', fontSize: '0.9rem', width: '100%', marginBottom: '10px' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #a855f7', backgroundColor: '#000', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' },
  paymentDetails: { padding: '15px', backgroundColor: '#15151a', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid #a855f7' },
  payBtn: { width: '100%', padding: '16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }
};

export default Checkout;