import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios'; //Importo la instancia del Axios

const Login = () => {
    // Estos son los estados para capturar lo que escribe el usuario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Y estos son los estados para el feedback visual
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Primero hacemos la peticicon al Backend enviando los datos
            const response = await api.post('/auth/login', { email, password });
            
            // Y ahora lo que hago es extraer el token y los datos del usuario de la respuesta
            const { token , user } = response.data;
            
            // Y lo que hago es guardar en el almacenamiento local para que la sesion persista.
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user)); //Guardamos el nombre/rol

            // Por cuarto, lo que hago el redirigir al inicio despues de iniciar sesion
            console.log('Login exitoso para:', user.nombre, '!');
            navigate('/');

            // Fuerzo ene ste caso una recarga opciones para que el Navbar detecte el cambio de estadp
            window.location.reload();

        } catch (error) {
            // Si el back da un error, ya sea 401, 404, 0 500, capturo el mensaje del error
            const message = error.response?.data?.message || 'Error al conectar con el servidor';
            setError(message);
        } finally {
            setLoading(false);
        }
    };


    // Renderizo el HTML
    return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>GAMING <span style={styles.accent}>STORE</span></h2>
        <p style={styles.subtitle}>Accede a tu cuenta de jugador</p>

        {/* Banner de error si algo falla */}
        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              style={styles.input}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            style={loading ? {...styles.button, opacity: 0.7} : styles.button}
            disabled={loading}
          >
            {loading ? 'CONECTANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <p style={styles.footerText}>
          ¿Eres nuevo? <Link to="/register" style={styles.link}>Crea una cuenta</Link>
        </p>
      </div>
    </div>
  );
};

// Estilos "Inline" para no depender de archivos CSS externos por ahora de prueba solamente
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0b0b0d', 
    color: '#ffffff'
  },
  card: {
    backgroundColor: '#15151a',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #2d2d35'
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '5px',
    letterSpacing: '1px'
  },
  accent: {
    color: '#a855f7', // Morado potente
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#71717a',
    marginBottom: '30px',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    textAlign: 'left'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.85rem',
    color: '#a1a1aa'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #3f3f46',
    backgroundColor: '#09090b',
    color: '#fff',
    boxSizing: 'border-box',
    fontSize: '1rem',
    outline: 'none'
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#a855f7',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background 0.3s ease'
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.85rem',
    border: '1px solid #ef4444'
  },
  footerText: {
    marginTop: '25px',
    fontSize: '0.9rem',
    color: '#71717a'
  },
  link: {
    color: '#a855f7',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default Login;