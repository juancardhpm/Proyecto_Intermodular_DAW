import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla el estado del menú hamburguesa

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
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>🕹️ GAMING JCS</Link>

        {/* Menú hamburguesa */}
        <div style={styles.hamburgerMenu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div style={styles.hamburger}></div>
          <div style={styles.hamburger}></div>
          <div style={styles.hamburger}></div>
        </div>

        {/* Menú de navegación */}
        <ul style={isMenuOpen ? { ...styles.navLinks, display: 'flex' } : styles.navLinks}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/catalog" style={styles.link}>Catálogo</Link></li>
          <li><Link to="/serviceform" style={styles.link}>Asistencia</Link></li>

          {/* Panel de Admin */}
          {user && user.rol === 'admin' && (
            <>
              <li><Link to="/admin" style={styles.link}>Gestión Productos</Link></li>
              <li><Link to="/admin/categorias" style={styles.link}>Categorías</Link></li>
              <li><Link to="/admin/pedidos" style={styles.link}>Pedidos/Soporte</Link></li>
            </>
          )}

          {/* Carrito */}
          <li><Link to="/cart" style={styles.link}>Carrito</Link></li>

          {/* Mis Pedidos */}
          {user && (
            <li><Link to="/mis-pedidos" style={styles.link}>Mis Pedidos</Link></li>
          )}

          {/* Login / Logout */}
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
    background: 'linear-gradient(145deg, #741667, #320e68)', // Gradiente morado oscuro con tonos suaves
    padding: '15px 0',
    position: 'sticky',
    top: '0',
    zIndex: '100',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
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
    fontSize: '1.8rem',
    fontWeight: '700',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    transition: 'all 0.3s ease',
  },
  navLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    margin: '0 20px',
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo translúcido claro
    borderRadius: '4px',
    fontWeight: '500',
    transition: 'background-color 0.3s, color 0.3s',
  },
  linkHover: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
  },
  adminLink: {
    color: '#ff4d4d',
    fontWeight: 'bold',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  adminLinkHover: {
    color: '#ff8c00',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.3s',
  },
  logoutBtnHover: {
    backgroundColor: '#f5a623',
  },
  userGreeting: {
    color: '#ff8c00',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  // Estilos para el botón de menú hamburguesa
  hamburgerMenu: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '25px',
    width: '30px',
    cursor: 'pointer',
  },
  hamburger: {
    width: '30px',
    height: '3px',
    backgroundColor: '#fff',
    borderRadius: '5px',
  },
  // Hacemos que el botón hamburguesa y el menú se muestren en pantallas pequeñas
  '@media screen and (max-width: px)': {
    navLinks: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '60px',
      left: '0',
      width: '100%',
      backgroundColor: '#1a1a21', // Fondo oscuro para el menú desplegable
      padding: '20px 0',
      textAlign: 'center',
      zIndex: '99',
      display: 'none', // Inicialmente oculto
    },
    hamburgerMenu: {
      display: 'flex',
    },
    navLinks: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '60px',
      left: '0',
      width: '100%',
      backgroundColor: '#1a1a21', // Fondo oscuro para el menú desplegable
      padding: '20px 0',
      textAlign: 'center',
      zIndex: '99',
    },
  },
};

export default Navbar;