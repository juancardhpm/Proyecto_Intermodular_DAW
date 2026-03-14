// frontend/src/App.jsx
import React from 'react';
import Navbar from './components/Navbar'; 
import Cart from './components/Cart';

const App = () => {
  return (
    <div>
      <Navbar />  {/* Renderizamos el componente Navbar */}
      <h1>Bienvenido a Gaming Store JCS</h1>
      <p>¡Tu tienda online de productos gaming y de escritorio!</p>
      <Cart />  {}
    </div>
  );
};

export default App;