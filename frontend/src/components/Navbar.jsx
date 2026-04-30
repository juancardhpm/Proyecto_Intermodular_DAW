import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      setUser(userString ? JSON.parse(userString) : null);
    } catch (error) {
      console.error('Error parseando user:', error);
      setUser(null);
    }

    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1050);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Has cerrado sesión correctamente');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getLinkStyle = (key, path) => ({
    ...styles.link,
    ...(hoveredItem === key ? styles.linkHover : {}),
    ...(isActive(path) ? styles.linkActive : {}),
    ...(isMobile ? styles.mobileLink : {})
  });

  const navItems = [
    { key: 'home', label: 'Home', to: '/' },
    { key: 'catalog', label: 'Catálogo', to: '/catalog' },
    { key: 'service', label: 'Asistencia', to: '/serviceform' },
    { key: 'cart', label: 'Carrito', to: '/cart' }
  ];

  const adminItems = [
    { key: 'admin', label: 'Gestión', to: '/admin' },
    { key: 'categories', label: 'Categorías', to: '/admin/categorias' },
    { key: 'orders', label: 'Pedidos', to: '/admin/pedidos' }
  ];

  return (
    <nav
      style={{
        ...styles.navbar,
        ...(isScrolled ? styles.navbarScrolled : {})
      }}
    >
      <div style={styles.navContent}>
        <Link
          to="/"
          style={{
            ...styles.logo,
            ...(hoveredItem === 'logo' ? styles.logoHover : {})
          }}
          onMouseEnter={() => setHoveredItem('logo')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <span style={styles.logoIcon}>🕹️</span>
          <span>JCS</span>
          <span style={styles.logoAccent}>GAMING</span>
          <span>STORE</span>
        </Link>

        <button
          style={{
            ...styles.hamburgerMenu,
            ...(isMobile ? styles.hamburgerVisible : {}),
            ...(isMenuOpen ? styles.hamburgerActive : {})
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú"
        >
          <span
            style={{
              ...styles.hamburgerLine,
              ...(isMenuOpen ? styles.hamburgerLineTop : {})
            }}
          />
          <span
            style={{
              ...styles.hamburgerLine,
              ...(isMenuOpen ? styles.hamburgerLineMiddle : {})
            }}
          />
          <span
            style={{
              ...styles.hamburgerLine,
              ...(isMenuOpen ? styles.hamburgerLineBottom : {})
            }}
          />
        </button>

        <ul
          style={{
            ...styles.navLinks,
            ...(isMobile ? styles.navLinksMobile : {}),
            ...(isMobile && isMenuOpen ? styles.navLinksMobileOpen : {})
          }}
        >
          {navItems.map(item => (
            <li key={item.key} style={styles.navItem}>
              <Link
                to={item.to}
                style={getLinkStyle(item.key, item.to)}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {user && user.rol === 'admin' && (
            <>
              <li style={isMobile ? styles.mobileDivider : styles.desktopDivider}></li>

              {adminItems.map(item => (
                <li key={item.key} style={styles.navItem}>
                  <Link
                    to={item.to}
                    style={{
                      ...getLinkStyle(item.key, item.to),
                      ...styles.adminLink
                    }}
                    onMouseEnter={() => setHoveredItem(item.key)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </>
          )}

          {user && (
            <li style={styles.navItem}>
              <Link
                to="/mis-pedidos"
                style={getLinkStyle('my-orders', '/mis-pedidos')}
                onMouseEnter={() => setHoveredItem('my-orders')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Mis Pedidos
              </Link>
            </li>
          )}

          <li style={isMobile ? styles.mobileDivider : styles.desktopDivider}></li>

          {!user ? (
            <>
              <li style={styles.navItem}>
                <Link
                  to="/login"
                  style={{
                    ...getLinkStyle('login', '/login'),
                    ...styles.loginLink
                  }}
                  onMouseEnter={() => setHoveredItem('login')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  Login
                </Link>
              </li>

              <li style={styles.navItem}>
                <Link
                  to="/register"
                  style={{
                    ...styles.registerBtn,
                    ...(hoveredItem === 'register' ? styles.registerBtnHover : {}),
                    ...(isActive('/register') ? styles.registerBtnActive : {}),
                    ...(isMobile ? styles.mobileLink : {})
                  }}
                  onMouseEnter={() => setHoveredItem('register')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  Registro
                </Link>
              </li>
            </>
          ) : (
            <>
              <li
                style={{
                  ...styles.userGreeting,
                  ...(isMobile ? styles.userGreetingMobile : {})
                }}
              >
                <span style={styles.userDot}></span>
                Hola, <strong>{user.nombre}</strong>
              </li>

              <li style={styles.navItem}>
                <button
                  onClick={handleLogout}
                  style={{
                    ...styles.logoutBtn,
                    ...(hoveredItem === 'logout' ? styles.logoutBtnHover : {}),
                    ...(isMobile ? styles.mobileButton : {})
                  }}
                  onMouseEnter={() => setHoveredItem('logout')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
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
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    padding: '12px 0',
    background:
      'linear-gradient(135deg, rgba(8,8,11,0.96), rgba(20,12,35,0.95)), radial-gradient(circle at top left, rgba(168,85,247,0.28), transparent 35%)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.22)',
    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.35)',
    backdropFilter: 'blur(18px)',
    transition: 'all 0.3s ease',
  },

  navbarScrolled: {
    padding: '8px 0',
    background:
      'linear-gradient(135deg, rgba(5,5,8,0.98), rgba(18,10,30,0.98))',
    boxShadow:
      '0 14px 45px rgba(0, 0, 0, 0.55), 0 0 28px rgba(168, 85, 247, 0.12)',
  },

  navContent: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    padding: '0 30px',
    maxWidth: '1800px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 950,
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '1.6px',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    textShadow: '0 0 18px rgba(168, 85, 247, 0.35)',
  },

  logoHover: {
    transform: 'translateY(-1px)',
    textShadow: '0 0 24px rgba(168, 85, 247, 0.8)',
  },

  logoIcon: {
    fontSize: '1.45rem',
    filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))',
  },

  logoAccent: {
    color: '#c084fc',
  },

  navLinks: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '9px',
  },

  navLinksMobile: {
    position: 'absolute',
    top: '58px',
    left: '16px',
    right: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '10px',
    padding: '16px',
    borderRadius: '20px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)), rgba(15,15,22,0.97)',
    border: '1px solid rgba(168, 85, 247, 0.28)',
    boxShadow:
      '0 24px 70px rgba(0,0,0,0.65), 0 0 35px rgba(168,85,247,0.16)',
    backdropFilter: 'blur(18px)',
    opacity: 0,
    transform: 'translateY(-12px)',
    pointerEvents: 'none',
    transition: 'all 0.25s ease',
  },

  navLinksMobileOpen: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto',
  },

  navItem: {
    display: 'flex',
  },

  link: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40px',
    padding: '0 15px',
    borderRadius: '999px',
    color: '#e4e4e7',
    textDecoration: 'none',
    fontSize: '0.82rem',
    fontWeight: 850,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    background: 'rgba(255,255,255,0.055)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.25s ease',
  },

  linkHover: {
    color: '#fff',
    transform: 'translateY(-2px)',
    background: 'rgba(168, 85, 247, 0.14)',
    border: '1px solid rgba(168, 85, 247, 0.42)',
    boxShadow: '0 0 22px rgba(168, 85, 247, 0.24)',
  },

  linkActive: {
    color: '#fff',
    background: 'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(124,58,237,0.2))',
    border: '1px solid rgba(192, 132, 252, 0.55)',
    boxShadow:
      '0 0 20px rgba(168, 85, 247, 0.32), inset 0 1px 0 rgba(255,255,255,0.12)',
  },

  adminLink: {
    color: '#f5d0fe',
  },

  loginLink: {
    color: '#d4d4d8',
  },

  registerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40px',
    padding: '0 17px',
    borderRadius: '999px',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.82rem',
    fontWeight: 950,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    border: '1px solid rgba(216, 180, 254, 0.35)',
    boxShadow: '0 0 20px rgba(168, 85, 247, 0.25)',
    transition: 'all 0.25s ease',
  },

  registerBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow:
      '0 0 28px rgba(168, 85, 247, 0.55), 0 10px 30px rgba(124, 58, 237, 0.35)',
  },

  registerBtnActive: {
    background: 'linear-gradient(135deg, #c084fc, #8b5cf6)',
  },

  logoutBtn: {
    minHeight: '40px',
    padding: '0 16px',
    borderRadius: '999px',
    border: '1px solid rgba(248, 113, 113, 0.35)',
    color: '#fff',
    background: 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(127,29,29,0.95))',
    fontWeight: 950,
    fontSize: '0.8rem',
    letterSpacing: '0.7px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  logoutBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 24px rgba(239, 68, 68, 0.42)',
  },

  userGreeting: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    minHeight: '40px',
    padding: '0 14px',
    borderRadius: '999px',
    color: '#f5f5f5',
    fontSize: '0.9rem',
    fontWeight: 700,
    background: 'rgba(255,255,255,0.055)',
    border: '1px solid rgba(255,255,255,0.1)',
  },

  userGreetingMobile: {
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },

  userDot: {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 12px rgba(34, 197, 94, 0.8)',
  },

  desktopDivider: {
    width: '1px',
    height: '28px',
    margin: '0 4px',
    background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.55), transparent)',
  },

  mobileDivider: {
    width: '100%',
    height: '1px',
    margin: '4px 0',
    background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.55), transparent)',
  },

  hamburgerMenu: {
    display: 'none',
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    border: '1px solid rgba(168, 85, 247, 0.35)',
    background: 'rgba(255,255,255,0.06)',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '5px',
    transition: 'all 0.25s ease',
  },

  hamburgerVisible: {
    display: 'flex',
  },

  hamburgerActive: {
    background: 'rgba(168, 85, 247, 0.18)',
    boxShadow: '0 0 22px rgba(168, 85, 247, 0.28)',
  },

  hamburgerLine: {
    width: '22px',
    height: '2px',
    borderRadius: '99px',
    backgroundColor: '#fff',
    transition: 'all 0.25s ease',
  },

  hamburgerLineTop: {
    transform: 'translateY(7px) rotate(45deg)',
  },

  hamburgerLineMiddle: {
    opacity: 0,
  },

  hamburgerLineBottom: {
    transform: 'translateY(-7px) rotate(-45deg)',
  },

  mobileLink: {
    width: '100%',
    minHeight: '46px',
    boxSizing: 'border-box',
  },

  mobileButton: {
    width: '100%',
    minHeight: '46px',
  },
};

export default Navbar;