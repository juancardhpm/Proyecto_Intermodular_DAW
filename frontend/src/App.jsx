import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './components/Catalog';
import ServiceForm from './components/ServiceForm';
import AdminDashboard from './components/AdminDashboard'; 
import AdminProducts from './components/AdminProducts';
import AdminCategories from './components/AdminCategories';
import ProtectedRoute from './components/ProtectedRoute';
import UserOrders from './pages/UserOrders'; 

const App = () => {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/catalog' element={<Catalog />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/serviceform' element={<ServiceForm />} />
        <Route path="/mis-pedidos" element={<UserOrders />} />

        {/* Rutas del Administrador - Ajustadas para coincidir con Navbar */}
        <Route path='/admin' element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        } />
        
        <Route path='/admin/categorias' element={
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        } />

        {/* Ambas rutas usan el Dashboard, el cual filtrará por pestañas */}
        <Route path='/admin/pedidos' element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path='/admin/servicios' element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;