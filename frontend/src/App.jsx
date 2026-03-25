import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importamos React Router

// Importamos los componentes de las páginas
import Navbar from './components/Navbar'; //Navbar
import HomePage from './pages/HomePage';  // Página principal (catálogo de productos)
import Cart from './components/Cart';  // Página del carrito
import Checkout from './components/Checkout';  // Página de checkout (pago)
import Login from './pages/Login'; //Pagina de login
import Register from './pages/Register'; //Pagina de registro

const App = () => {
  return (
    <Router>  {/* Envolvemos la aplicación con Router para habilitar la navegación */}
      <Navbar />  {/* Este componente siempre será visible en todas las páginas */}
      
      <Routes>  {/* Definimos las rutas de la aplicación */}
        <Route path="/" element={<HomePage />} />  {/* Página principal: muestra productos */}
        <Route path="/cart" element={<Cart />} />  {/* Página del carrito */}
        <Route path="/checkout" element={<Checkout />} />  {/* Página de checkout */}
        <Route path="/login" element={<Login />} />   {/* Pagina de Login */}
        <Route path='register' element={<Register />} />  {/* Pagina de registro */} 
      </Routes>
    </Router>
  );
};

export default App;
