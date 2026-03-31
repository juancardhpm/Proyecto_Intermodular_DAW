import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/axios'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            
            // 1. Guardamos sesión en el navegador
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Login exitoso para:', user.nombre);

            // --- 🚀 MIGRACIÓN DE CARRITO: De LocalStorage a Base de Datos ---
            const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
            
            if (guestCart.length > 0) {
                console.log('Sincronizando carrito de invitado...');
                try {
                    // Recorremos el carrito temporal y enviamos los datos al backend
                    // Usamos los nombres exactos de tu CartController: user_id y product_id
                    for (const item of guestCart) {
                        await api.post('/cart', { 
                            user_id: user.id,
                            product_id: item.product.id, 
                            quantity: item.quantity 
                        });
                    }
                    // Una vez sincronizado con la DB, limpiamos el almacenamiento local
                    localStorage.removeItem('guestCart');
                } catch (migrationError) {
                    console.error('Error al migrar el carrito:', migrationError);
                }
            }
            // ---------------------------------------------------------------

            // 2. Redirección inteligente
            const destino = location.state?.from || '/';
            navigate(destino);

            // Forzamos recarga para que el Navbar detecte al nuevo usuario y su carrito
            window.location.reload();

        } catch (error) {
            const message = error.response?.data?.message || 'Error al conectar con el servidor';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>GAMING <span style={styles.accent}>STORE</span></h2>
                <p style={styles.subtitle}>Accede a tu cuenta de jugador</p>

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

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0b0d', color: '#ffffff' },
    card: { backgroundColor: '#15151a', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.7)', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid #2d2d35' },
    title: { fontSize: '2.2rem', marginBottom: '5px', letterSpacing: '1px' },
    accent: { color: '#a855f7', fontWeight: 'bold' },
    subtitle: { color: '#71717a', marginBottom: '30px', fontSize: '0.9rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { textAlign: 'left' },
    label: { display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#a1a1aa' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', boxSizing: 'border-box', fontSize: '1rem', outline: 'none' },
    button: { padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#a855f7', color: '#fff', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '15px', transition: 'background 0.3s ease' },
    errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', border: '1px solid #ef4444' },
    footerText: { marginTop: '25px', fontSize: '0.9rem', color: '#71717a' },
    link: { color: '#a855f7', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;