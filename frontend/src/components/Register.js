import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirigir al login tras el registro

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviamos los datos al endpoint de tu backend
      const response = await axios.post('/api/auth/register', {
        email,
        password
      });

      setMensaje("¡Registro con éxito! Redirigiendo...");
      
      // Esperamos 2 segundos y mandamos al usuario al login
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Únete a la Squad 🎮</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-glow">Crear cuenta</button>
        </form>
        {mensaje && <p className="auth-message">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Register;