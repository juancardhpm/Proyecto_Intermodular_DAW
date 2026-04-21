import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      setUser(userString ? JSON.parse(userString) : null);
    } catch (error) {
      console.error('Error parseando user:', error);
      setUser(null);
    }
    // Cerramos el menú cada vez que cambiamos de página
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Has cerrado sesión correctamente');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>🕹️ GAMING STORE JCS</Link>

        {/* Botón Hamburguesa */}
        <div style={styles.hamburgerMenu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div style={styles.hamburger}></div>
          <div style={styles.hamburger}></div>
          <div style={styles.hamburger}></div>
        </div>

        {/* Navegación */}
        <ul style={{
          ...styles.navLinks,
          ...(isMenuOpen ? styles.navLinksMobileOpen : {})
        }}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/catalog" style={styles.link}>Catálogo</Link></li>
          <li><Link to="/serviceform" style={styles.link}>Asistencia</Link></li>

          {user && user.rol === 'admin' && (
            <>
              <li><Link to="/admin" style={styles.link}>Gestión Productos</Link></li>
              <li><Link to="/admin/categorias" style={styles.link}>Categorías</Link></li>
              <li><Link to="/admin/pedidos" style={styles.link}>Pedidos/Soporte</Link></li>
            </>
          )}

          <li><Link to="/cart" style={styles.link}>Carrito</Link></li>

          {user && (
            <li><Link to="/mis-pedidos" style={styles.link}>Mis Pedidos</Link></li>
          )}

          {!user ? (
            <>
              <li><Link to="/login" style={styles.link}>Login</Link></li>
              <li><Link to="/register" style={styles.link}>Registro</Link></li>
            </>
          ) : (
            <>
              <li style={styles.userGreeting}>
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
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(145deg, #741667, #320e68)',
    padding: '15px 0',
    position: 'sticky',
    top: '0',
    zIndex: '100',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: '700',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  // Estilo que se aplica cuando el menú está abierto en móvil
  navLinksMobileOpen: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '60px',
    left: '0',
    width: '100%',
    backgroundColor: '#1a1a21',
    padding: '20px 0',
    gap: '15px'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    margin: '0 10px',
    padding: '8px 15px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    transition: '0.3s',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
    marginLeft: '10px'
  },
  userGreeting: {
    color: '#ff8c00',
    fontSize: '1rem',
    marginLeft: '10px'
  },
  hamburgerMenu: {
    display: 'none', // Se oculta por defecto en PC
    flexDirection: 'column',
    gap: '5px',
    cursor: 'pointer',
  },
  hamburger: {
    width: '25px',
    height: '3px',
    backgroundColor: '#fff',
    borderRadius: '5px',
  },
};

export default Navbar;