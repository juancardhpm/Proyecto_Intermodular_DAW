import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      setUser(userString ? JSON.parse(userString) : null);
    } catch (error) {
      console.error('Error parseando user:', error);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Has cerrado sesión correctamente');
    navigate('/login'); 
  };

  return (
    <nav>
      <ul style={styles.ul}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/catalog">Catálogo</Link></li>
        <li><Link to="/serviceform">Asistencia Técnica</Link></li>

        {/* Panel de Admin */}
        {user && user.rol === 'admin' && (
          <>
            <li>
              <Link to="/admin" style={styles.adminLink}>Gestión Productos</Link>
            </li>
            <li>
              <Link to="/admin/categorias" style={styles.adminLink}>Categorías</Link>
            </li>
            <li>
              <Link to="/admin/pedidos" style={styles.adminLink}>Pedidos/Soporte</Link>
            </li> 
          </>
        )}

        {/* El carrito siempre visible */}
        <li><Link to="/cart">Carrito</Link></li>

        {/* ENLACE A MIS PEDIDOS: Solo visible si el usuario está logueado */}
        {user && (
          <li><Link to="/mis-pedidos">Mis Pedidos</Link></li>
        )}

        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Registro</Link></li>
          </>
        ) : (
          <>
            <li style={{ marginLeft: '20px', color: '#a855f7' }}>
              Hola, <strong>{user.nombre}</strong>
            </li>
            <li>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Cerrar Sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  ul: { display: 'flex', alignItems: 'center', gap: '15px', listStyle: 'none', padding: '15px', backgroundColor: '#111' },
  adminLink: { color: '#ff4d4d', fontWeight: 'bold', textDecoration: 'none' },
  logoutBtn: { cursor: 'pointer', marginLeft: '10px', backgroundColor: '#333', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px' }
};

export default Navbar;