
//Creamos el componente de navegación que se mostrará en todas las páginas de la aplicación. 
// Este componente incluirá enlaces a las diferentes secciones del sitio, como el catálogo de productos, el carrito de compras y la página de inicio.

import React from 'react';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/catalog">Catálogo</a></li>
        <li><a href="/cart">Carrito</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;