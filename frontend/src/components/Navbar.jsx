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
    setIsMenuOpen(false); // Cerrar el menú cuando cambiamos de página
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
        <Link to="/" style={styles.logo}>🕹️ GAMING STORE</Link>

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
              <li><Link to="/admin" style={styles.link}>Gestión</Link></li>
              <li><Link to="/admin/categorias" style={styles.link}>Categorías</Link></li>
              <li><Link to="/admin/pedidos" style={styles.link}>Pedidos</Link></li>
            </>
          )}

          <li><Link to="/cart" style={styles.link}>Carrito</Link></li>

          {user && <li><Link to="/mis-pedidos" style={styles.link}>Mis Pedidos</Link></li>}

          {!user ? (
            <>
              <li><Link to="/login" style={styles.link}>Login</Link></li>
              <li><Link to="/register" style={styles.link}>Registro</Link></li>
            </>
          ) : (
            <>
              <li style={styles.userGreeting}>Hola, <strong>{user.nombre}</strong></li>
              <li><button onClick={handleLogout} style={styles.logoutBtn}>Cerrar Sesión</button></li>
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
    padding: '10px 0',
    position: 'sticky',
    top: '0',
    zIndex: '100',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease-in-out',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between', // Mantenemos el espacio entre elementos
    alignItems: 'center',
    padding: '0 30px', // Ajusté el padding para un mejor uso del espacio
    maxWidth: '1800px', // Reduje el max-width para aprovechar más el espacio
    margin: '0 auto',
    width: '100%',
  },
  logo: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: '700',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontFamily: "'Roboto', sans-serif",
    marginLeft: '0',  // El logo se alinea a la izquierda
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: '0',
    padding: '0',
    gap: '10px', // Reducí el espacio entre los enlaces
  },
  navLinksMobileOpen: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '60px',
    left: '0',
    width: '100%',
    backgroundColor: '#1a1a21',
    padding: '20px 0',
    gap: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    margin: '0 10px', // Ajusté el margen entre los enlaces
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '25px',
    transition: '0.3s',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
    marginLeft: '15px',
    transition: '0.3s',
  },
  userGreeting: {
    color: '#ff8c00',
    fontSize: '1rem',
    marginLeft: '15px',
    fontWeight: 'bold',
  },
  hamburgerMenu: {
    display: 'none',  // Se oculta por defecto en pantallas grandes
    flexDirection: 'column',
    gap: '5px',
    cursor: 'pointer',
  },
  hamburger: {
    width: '30px',
    height: '3px',
    backgroundColor: '#fff',
    borderRadius: '5px',
  },

  '@media (max-width: 768px)': {  // Hacemos que el menú sea responsive
    navContent: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    navLinks: {
      flexDirection: 'column',
      width: '100%',
      gap: '15px',
      display: 'none', // El menú está oculto por defecto
    },
    hamburgerMenu: {
      display: 'flex',  // El menú hamburguesa se muestra en pantallas pequeñas
    },
    logo: {
      marginBottom: '15px',
    },
    navLinksMobileOpen: {
      display: 'flex', // Cuando el menú se abre, se muestra
    },
  },
};

export default Navbar;