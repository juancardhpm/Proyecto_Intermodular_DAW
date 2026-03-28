
//Creamos el componente de navegación que se mostrará en todas las páginas de la aplicación. 
// Este componente incluirá enlaces a las diferentes secciones del sitio, como el catálogo de productos, el carrito de compras y la página de inicio.

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Escucha cambios en la URL para refrescar el componente
  
  // Usamos un estado para que React "sepa" que debe repintar cuando el user cambia
  const [user, setUser] = useState(null);

  // Cada vez que la ubicación (URL) cambie, actualizamos el estado del user
  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      setUser(userString ? JSON.parse(userString) : null);
    } catch (error) {
      console.error('Error parseando user:', error);
      setUser(null);
    }
  }, [location]); // <--- Esta es la clave: se ejecuta al navegar

  // Funcion para cerrar la sesion del user
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // Limpiamos el estado inmediatamente
    alert('Has cerrado sesion correctamente');
    navigate('/login'); 
  };

  return (
    <nav>
      <ul>
        {/* Enlaces fijos que siempre se ven */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/catalog">Catálogo</Link></li>

        {/* Si el user es ADMIN, mostramos el Panel de Gestion */}
        {user && user.rol === 'admin' && (
          <>
            <li>
              <Link to="/admin" style={{ color: '#ff4d4d', fontWeight: 'bold' }}>
                Gestión Productos
              </Link>
            </li>
            <li>
              <Link to="/admin/categorias" style={{ color: '#ff4d4d', fontWeight: 'bold' }}>
                Gestión Categorías
              </Link>
            </li>
          </>
        )}

        {/* Solo muestro el carrito si hay alguien logueado */}
        {user && <li><Link to="/cart">Carrito</Link></li>}

        {/* Logica de Login / Registro */}
        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Registro</Link></li>
          </>
        ) : (
          <>
            <li style={{ marginLeft: '20px', color: 'gray' }}>
              Hola, <strong>{user.nombre}</strong> ({user.rol})
            </li>
            <li>
              <button onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                Cerrar Sesion
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;